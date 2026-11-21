const express = require('express');
const items = require('../controllers/itemController');
const authenticate = require('../middleware/authMiddleware');
const validateObjectId = require('../middleware/validateObjectId');

const router = express.Router();

// Public
router.get('/', items.listItems);
router.get('/categories', items.getCategories);

// Authenticated (static paths must be declared before `/:id`)
router.get('/myitems', authenticate, items.getMyItems);
router.post('/', authenticate, items.createItem);

router.get('/:id', validateObjectId(), items.getItem);
router.put('/:id', authenticate, validateObjectId(), items.updateItem);
router.delete('/:id', authenticate, validateObjectId(), items.deleteItem);
router.post('/:id/reviews', authenticate, validateObjectId(), items.addReview);

module.exports = router;
