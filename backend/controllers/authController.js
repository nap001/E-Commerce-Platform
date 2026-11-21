const jwt = require('jsonwebtoken');
const User = require('../models/User');
const env = require('../config/env');
const HttpError = require('../utils/HttpError');

const EMAIL_RE = /^\S+@\S+\.\S+$/;

const signToken = (user) => jwt.sign({ id: user._id }, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN });

const asString = (value) => (typeof value === 'string' ? value : '');

exports.registerUser = async (req, res) => {
  const name = asString(req.body.name).trim();
  const email = asString(req.body.email).trim().toLowerCase();
  const password = asString(req.body.password);

  if (!name) throw new HttpError(400, 'Name is required');
  if (!EMAIL_RE.test(email)) throw new HttpError(400, 'Please provide a valid email address');
  if (password.length < 6) throw new HttpError(400, 'Password must be at least 6 characters');

  if (await User.exists({ email })) throw new HttpError(400, 'User already exists');

  const user = await User.create({ name, email, password });
  res.status(201).json({ token: signToken(user), user: user.toPublic() });
};

exports.loginUser = async (req, res) => {
  const email = asString(req.body.email).trim().toLowerCase();
  const password = asString(req.body.password);

  const user = await User.findOne({ email }).select('+password');
  // One generic message so attackers cannot tell which half was wrong
  if (!user || !(await user.matchPassword(password))) {
    throw new HttpError(400, 'Invalid email or password');
  }

  res.json({ token: signToken(user), user: user.toPublic() });
};

// Returns the currently authenticated user (used to restore the session on reload)
exports.getMe = async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) throw new HttpError(401, 'User no longer exists');
  res.json({ user: user.toPublic() });
};
