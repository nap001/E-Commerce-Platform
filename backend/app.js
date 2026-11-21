const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const env = require('./config/env');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const app = express();

app.disable('x-powered-by');
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(
  cors({
    origin: env.CLIENT_URL ? env.CLIENT_URL.split(',').map((o) => o.trim()) : true,
  })
);
app.use(express.json({ limit: '100kb' }));

// Throttle credential endpoints to slow down brute-force attempts
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: Number(process.env.AUTH_RATE_LIMIT) || 50,
  standardHeaders: true,
  legacyHeaders: false,
  message: { msg: 'Too many attempts, please try again later' },
});

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));
app.use('/api/auth', authLimiter, require('./routes/auth'));
app.use('/api/items', require('./routes/items'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/user', require('./routes/User'));

app.use(notFound);
app.use(errorHandler);

module.exports = app;
