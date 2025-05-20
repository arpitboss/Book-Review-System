const express = require('express');
const router = express.Router();
const { updateReview, deleteReview } = require('../controllers/reviewController');
const { reviewValidator, validate } = require('../middleware/validators');
const { protect } = require('../middleware/auth');

router.route('/:id')
    .put(protect, reviewValidator, validate, updateReview)
    .delete(protect, deleteReview);

module.exports = router;