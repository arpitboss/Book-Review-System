const Book = require('../models/Book');
const Review = require('../models/Review');
const { getPagination } = require('../utils/paginationHelper');

/**
 * @desc    Create a new book
 * @route   POST /api/books
 * @access  Private
 */
exports.createBook = async (req, res) => {
    try {
        // Adding user to req.body
        req.body.createdBy = req.user.id;

        const book = await Book.create(req.body);

        res.status(201).json({
            success: true,
            data: book
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

/**
 * @desc    Get all books with pagination and filters
 * @route   GET /api/books
 * @access  Public
 */
exports.getBooks = async (req, res) => {
    try {
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const startIndex = (page - 1) * limit;

        // Building query
        let query = {};

        // Filtering by author
        if (req.query.author) {
            query.author = { $regex: req.query.author, $options: 'i' };
        }

        // Filtering by genre
        if (req.query.genre) {
            query.genre = { $regex: req.query.genre, $options: 'i' };
        }

        // Executing query with pagination
        const books = await Book.find(query)
            .skip(startIndex)
            .limit(limit)
            .sort({ createdAt: -1 });

        // Getting total count
        const total = await Book.countDocuments(query);

        // Pagination object
        const pagination = getPagination(
            req,
            total,
            limit,
            page,
            '/api/books'
        );

        res.status(200).json({
            success: true,
            pagination,
            count: books.length,
            data: books
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

/**
 * @desc    Get single book by ID with reviews
 * @route   GET /api/books/:id
 * @access  Public
 */
exports.getBook = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);

        if (!book) {
            return res.status(404).json({
                success: false,
                message: 'Book not found'
            });
        }

        // Getting average rating
        const reviewStats = await Review.aggregate([
            {
                $match: { book: book._id }
            },
            {
                $group: {
                    _id: '$book',
                    averageRating: { $avg: '$rating' },
                    reviewCount: { $sum: 1 }
                }
            }
        ]);

        // Getting reviews with pagination
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const startIndex = (page - 1) * limit;

        const reviews = await Review.find({ book: book._id })
            .populate({
                path: 'user',
                select: 'name'
            })
            .skip(startIndex)
            .limit(limit)
            .sort({ createdAt: -1 });

        // Getting total reviews count
        const totalReviews = await Review.countDocuments({ book: book._id });

        // Creating pagination object
        const pagination = getPagination(
            req,
            totalReviews,
            limit,
            page,
            `/api/books/${book._id}`
        );

        // Extracting rating data
        const ratingData = reviewStats.length > 0 ? {
            averageRating: Math.round(reviewStats[0].averageRating * 10) / 10,
            reviewCount: reviewStats[0].reviewCount
        } : {
            averageRating: 0,
            reviewCount: 0
        };

        res.status(200).json({
            success: true,
            data: {
                ...book._doc,
                rating: ratingData,
                reviews: {
                    pagination,
                    count: reviews.length,
                    data: reviews
                }
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

/**
 * @desc    Update book
 * @route   PUT /api/books/:id
 * @access  Private
 */
exports.updateBook = async (req, res) => {
    try {
        let book = await Book.findById(req.params.id);

        if (!book) {
            return res.status(404).json({
                success: false,
                message: 'Book not found'
            });
        }

        // Making sure user is the book creator
        if (book.createdBy.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this book'
            });
        }

        book = await Book.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true,
            data: book
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

/**
 * @desc    Delete book
 * @route   DELETE /api/books/:id
 * @access  Private
 */
exports.deleteBook = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);

        if (!book) {
            return res.status(404).json({
                success: false,
                message: 'Book not found'
            });
        }

        // Making sure user is the book creator
        if (book.createdBy.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to delete this book'
            });
        }

        // Using pre middleware to delete associated reviews
        await book.remove();

        res.status(200).json({
            success: true,
            message: 'Book deleted successfully'
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

/**
 * @desc    Search books by title or author
 * @route   GET /api/books/search
 * @access  Public
 */
exports.searchBooks = async (req, res) => {
    try {
        const { q } = req.query;

        if (!q) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a search query'
            });
        }

        // Pagination
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const startIndex = (page - 1) * limit;

        // Searching using regex
        const books = await Book.find({
            $or: [
                { title: { $regex: q, $options: 'i' } },
                { author: { $regex: q, $options: 'i' } }
            ]
        })
            .skip(startIndex)
            .limit(limit)
            .sort({ createdAt: -1 });

        // Getting total count
        const total = await Book.countDocuments({
            $or: [
                { title: { $regex: q, $options: 'i' } },
                { author: { $regex: q, $options: 'i' } }
            ]
        });

        // Pagination object
        const pagination = getPagination(
            req,
            total,
            limit,
            page,
            '/api/books/search'
        );

        res.status(200).json({
            success: true,
            pagination,
            count: books.length,
            data: books
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};