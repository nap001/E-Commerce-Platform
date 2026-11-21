const express = require('express');
const orders = require('../controllers/orderController');
const authenticate = require('../middleware/authMiddleware');
const validateObjectId = require('../middleware/validateObjectId');

const router = express.Router();

router.use(authenticate);

router.post('/', orders.createOrder);
router.get('/', orders.getMyOrders);
router.get('/:id', validateObjectId(), orders.getOrder);
router.patch('/:id/cancel', validateObjectId(), orders.cancelOrder);

module.exports = router;
