const Item = require('../models/Items');
const Order = require('../models/Order');
const HttpError = require('../utils/HttpError');

const ADDRESS_FIELDS = ['fullName', 'address', 'city', 'postalCode', 'country'];

const parseShippingAddress = (raw) => {
  const address = {};
  for (const field of ADDRESS_FIELDS) {
    const value = typeof raw?.[field] === 'string' ? raw[field].trim() : '';
    if (!value) throw new HttpError(400, `Shipping address: ${field} is required`);
    address[field] = value;
  }
  return address;
};

// Merge duplicate lines and validate quantities
const parseLines = (rawItems) => {
  if (!Array.isArray(rawItems) || rawItems.length === 0) {
    throw new HttpError(400, 'Your cart is empty');
  }
  const lines = new Map();
  for (const { id, quantity } of rawItems) {
    const qty = Number(quantity);
    if (typeof id !== 'string' || !Number.isInteger(qty) || qty < 1) {
      throw new HttpError(400, 'Invalid cart item');
    }
    lines.set(id, (lines.get(id) || 0) + qty);
  }
  return lines;
};

const restock = (reserved) =>
  Promise.all(reserved.map(({ item, quantity }) => Item.updateOne({ _id: item }, { $inc: { quantity } })));

exports.createOrder = async (req, res) => {
  const shippingAddress = parseShippingAddress(req.body.shippingAddress);
  const lines = parseLines(req.body.items);

  // Reserve stock one product at a time with an atomic conditional decrement so two
  // buyers can never purchase the same last unit. Undo everything if any line fails.
  const reserved = [];
  const orderItems = [];

  try {
    for (const [id, quantity] of lines) {
      const existing = await Item.findById(id);
      if (!existing) throw new HttpError(404, 'An item in your cart no longer exists');
      if (existing.user.equals(req.user.id)) {
        throw new HttpError(400, `You cannot buy your own item ("${existing.name}")`);
      }

      const updated = await Item.findOneAndUpdate(
        { _id: id, quantity: { $gte: quantity } },
        { $inc: { quantity: -quantity } },
        { new: true }
      );
      if (!updated) {
        throw new HttpError(409, `Not enough stock for "${existing.name}" (${existing.quantity} left)`);
      }

      reserved.push({ item: updated._id, quantity });
      orderItems.push({
        item: updated._id,
        seller: updated.user,
        name: updated.name,
        image: updated.image,
        price: updated.price,
        quantity,
      });
    }

    const totalPrice =
      Math.round(orderItems.reduce((sum, line) => sum + line.price * line.quantity, 0) * 100) / 100;

    const order = await Order.create({
      user: req.user.id,
      items: orderItems,
      shippingAddress,
      totalPrice,
    });

    res.status(201).json(order);
  } catch (err) {
    await restock(reserved);
    throw err;
  }
};

exports.getMyOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
  res.json(orders);
};

exports.getOrder = async (req, res) => {
  const order = await Order.findOne({ _id: req.params.id, user: req.user.id });
  if (!order) throw new HttpError(404, 'Order not found');
  res.json(order);
};

exports.cancelOrder = async (req, res) => {
  const order = await Order.findOne({ _id: req.params.id, user: req.user.id });
  if (!order) throw new HttpError(404, 'Order not found');
  if (order.status !== 'processing') {
    throw new HttpError(400, `Only orders that are still processing can be cancelled (current: ${order.status})`);
  }

  // Flip the status atomically first so a double click cannot restock twice
  const cancelled = await Order.findOneAndUpdate(
    { _id: order._id, status: 'processing' },
    { status: 'cancelled' },
    { new: true }
  );
  if (!cancelled) throw new HttpError(409, 'Order status has changed, please refresh');

  await restock(order.items.map((line) => ({ item: line.item, quantity: line.quantity })));
  res.json(cancelled);
};
