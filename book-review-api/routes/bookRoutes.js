const express = require('express');
const router = express.Router();
const {
    createBook,
    getBooks,
    getBook,
    updateBook,
    deleteBook,
    searchBooks
} = require('../controllers/bookController');
const { addReview } = require('../controllers/reviewController');
const {
    bookValidator,
    reviewValidator,
    paginationValidator,
    validate
} = require('../middleware/validators');
const { protect } = require('../middleware/auth');

// Search route
router.get('/search', paginationValidator, validate, searchBooks);

// Book routes
router.route('/')
    .get(paginationValidator, validate, getBooks)
    .post(protect, bookValidator, validate, createBook);

router.route('/:id')
    .get(getBook)
    .put(protect, bookValidator, validate, updateBook)
    .delete(protect, deleteBook);

// Book review routes
router.post('/:id/reviews', protect, reviewValidator, validate, addReview);

module.exports = router;