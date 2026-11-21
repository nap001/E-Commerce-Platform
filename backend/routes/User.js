const express = require('express');
const User = require('../models/User');
const validateObjectId = require('../middleware/validateObjectId');
const HttpError = require('../utils/HttpError');

const router = express.Router();

// Public profile: deliberately exposes only non-sensitive fields (no email / admin flag)
router.get('/:id', validateObjectId(), async (req, res) => {
  const user = await User.findById(req.params.id).select('name createdAt');
  if (!user) throw new HttpError(404, 'User not found');
  res.json({ id: user._id, name: user.name, createdAt: user.createdAt });
});

module.exports = router;
