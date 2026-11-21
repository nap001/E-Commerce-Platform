const jwt = require('jsonwebtoken');
const env = require('../config/env');

const authenticate = (req, res, next) => {
  const authHeader = req.header('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET);
    req.user = { id: decoded.id };
    next();
  } catch (err) {
    const msg = err.name === 'TokenExpiredError' ? 'Session expired, please log in again' : 'Token is not valid';
    res.status(401).json({ msg });
  }
};

module.exports = authenticate;
