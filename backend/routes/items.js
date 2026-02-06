const express = require('express');
const router = express.Router();
const Item = require('../models/Items');
const authenticate = require('../middleware/authMiddleware'); // 🔐 import middleware
const User = require('../models/User');
// Public routes
router.get('/', async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/myitems', authenticate, async (req, res) => {
  try {
  console.log('User ID:', req.user?.id);

    const items = await Item.find({ user: req.user.id });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ error: 'Item not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});


router.post('/:id/reviews', authenticate, async (req, res) => {
  const { rating, comment } = req.body;
  const { id } = req.params;

  try {
    // ✅ Get the user's name from their ID
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const author = user.name; // use name instead of ID

    // ✅ Find the item and add the review
    const item = await Item.findById(id);
    if (!item) return res.status(404).json({ error: 'Item not found' });

    item.reviews.push({ author, rating, comment });
    await item.save();

    res.status(201).json({ message: 'Review added successfully', item });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add review' });
  }
});



// Use the middleware on the route
router.post('/', authenticate, async (req, res) => {
  try {
    const newItem = new Item({
      ...req.body,
      user: req.user.id, // track who added the item
    });

    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (err) {
    res.status(400).json({ error: 'Invalid item data', details: err.message });
  }
});
module.exports = router;
