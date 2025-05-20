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
const {
    bookValidator,
    paginationValidator,
    validate
} = require('../middleware/validators');
const { protect } = require('../middleware/auth');

// Book routes
router.route('/')
    .get(paginationValidator, validate, getBooks)
    .post(protect, bookValidator, validate, createBook);

router.route('/:id')
    .get(getBook)
    .put(protect, bookValidator, validate, updateBook)
    .delete(protect, deleteBook);

// Search route
router.get('/search', paginationValidator, validate, searchBooks);

module.exports = router;