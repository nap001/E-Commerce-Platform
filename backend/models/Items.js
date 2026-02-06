const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  name: String,
  image: String,
  description: String,
  category: String,
  price: Number,
  quantity: Number,
  reviews: [
    {
      author: String,
      rating: Number,
      comment: String,
    },
  ],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // make sure you have a User model
    required: true,
  },
});

module.exports = mongoose.model('Item', itemSchema);
