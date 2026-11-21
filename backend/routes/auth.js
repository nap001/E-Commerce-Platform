const express = require('express');
const { registerUser, loginUser, getMe } = require('../controllers/authController');
const authenticate = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', authenticate, getMe);

module.exports = router;
