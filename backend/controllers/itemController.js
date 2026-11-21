const Item = require('../models/Items');
const User = require('../models/User');
const HttpError = require('../utils/HttpError');

// Only these fields can be set by clients (prevents mass assignment of `user`, `reviews`, ...)
const EDITABLE_FIELDS = ['name', 'image', 'description', 'category', 'price', 'quantity'];

const SORTS = {
  newest: { createdAt: -1, _id: -1 },
  'price-asc': { price: 1, _id: 1 },
  'price-desc': { price: -1, _id: 1 },
  name: { name: 1, _id: 1 },
};

const asString = (value) => (typeof value === 'string' ? value : '');
const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const pickEditable = (body) =>
  EDITABLE_FIELDS.reduce((acc, key) => {
    if (body[key] !== undefined) acc[key] = body[key];
    return acc;
  }, {});

// List responses omit the review bodies but keep the aggregate rating
const toSummary = (doc) => {
  const obj = doc.toJSON();
  delete obj.reviews;
  return obj;
};

const loadItem = async (id) => {
  const item = await Item.findById(id);
  if (!item) throw new HttpError(404, 'Item not found');
  return item;
};

// Owner or admin only
const assertCanModify = async (item, userId) => {
  if (item.user.equals(userId)) return;
  const user = await User.findById(userId);
  if (!user?.isAdmin) throw new HttpError(403, 'You can only modify your own items');
};

exports.listItems = async (req, res) => {
  const search = asString(req.query.search).trim();
  const category = asString(req.query.category).trim();
  const sort = SORTS[req.query.sort] || SORTS.newest;
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 12, 1), 48);

  const filter = {};
  if (category) filter.category = category;
  if (req.query.inStock === 'true') filter.quantity = { $gt: 0 };
  if (search) {
    const regex = new RegExp(escapeRegex(search), 'i');
    filter.$or = [{ name: regex }, { description: regex }];
  }

  const [total, docs] = await Promise.all([
    Item.countDocuments(filter),
    Item.find(filter)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit),
  ]);

  res.json({
    items: docs.map(toSummary),
    total,
    page,
    pages: Math.max(Math.ceil(total / limit), 1),
  });
};

exports.getCategories = async (req, res) => {
  const categories = await Item.distinct('category');
  res.json(categories.filter(Boolean).sort((a, b) => a.localeCompare(b)));
};

exports.getMyItems = async (req, res) => {
  const items = await Item.find({ user: req.user.id }).sort({ createdAt: -1, _id: -1 });
  res.json(items.map(toSummary));
};

exports.getItem = async (req, res) => {
  const item = await loadItem(req.params.id);
  res.json(item);
};

exports.createItem = async (req, res) => {
  const item = await Item.create({ ...pickEditable(req.body), user: req.user.id });
  res.status(201).json(item);
};

exports.updateItem = async (req, res) => {
  const item = await loadItem(req.params.id);
  await assertCanModify(item, req.user.id);

  item.set(pickEditable(req.body));
  await item.save();
  res.json(item);
};

exports.deleteItem = async (req, res) => {
  const item = await loadItem(req.params.id);
  await assertCanModify(item, req.user.id);

  await item.deleteOne();
  res.json({ msg: 'Item deleted' });
};

exports.addReview = async (req, res) => {
  const rating = Number(req.body.rating);
  const comment = asString(req.body.comment).trim();

  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    throw new HttpError(400, 'Rating must be a whole number between 1 and 5');
  }
  if (!comment) throw new HttpError(400, 'Comment is required');

  const [user, item] = await Promise.all([User.findById(req.user.id), loadItem(req.params.id)]);
  if (!user) throw new HttpError(401, 'User no longer exists');
  if (item.user.equals(user._id)) throw new HttpError(403, 'You cannot review your own item');
  if (item.reviews.some((r) => r.user && r.user.equals(user._id))) {
    throw new HttpError(409, 'You have already reviewed this item');
  }

  item.reviews.push({ user: user._id, author: user.name, rating, comment });
  await item.save();

  res.status(201).json(item);
};
