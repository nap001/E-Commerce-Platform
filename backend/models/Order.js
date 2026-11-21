const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema(
  {
    item: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    // Snapshot of the product at purchase time so history survives later edits/deletes
    name: { type: String, required: true },
    image: String,
    price: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 1 },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    items: { type: [orderItemSchema], validate: [(v) => v.length > 0, 'Order must contain items'] },
    shippingAddress: {
      fullName: { type: String, required: true, trim: true },
      address: { type: String, required: true, trim: true },
      city: { type: String, required: true, trim: true },
      postalCode: { type: String, required: true, trim: true },
      country: { type: String, required: true, trim: true },
    },
    paymentMethod: { type: String, enum: ['cash_on_delivery'], default: 'cash_on_delivery' },
    totalPrice: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ['processing', 'shipped', 'delivered', 'cancelled'],
      default: 'processing',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
