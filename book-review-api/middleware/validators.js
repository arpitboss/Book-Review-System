const { body, param, query, validationResult } = require('express-validator');

// Validating request and returning errors if any
exports.validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array()
        });
    }
    next();
};

// User validators
exports.registerValidator = [
    body('name')
        .trim()
        .not()
        .isEmpty()
        .withMessage('Name is required')
        .isLength({ max: 50 })
        .withMessage('Name cannot be more than 50 characters'),
    body('email')
        .trim()
        .normalizeEmail()
        .isEmail()
        .withMessage('Please enter a valid email'),
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long')
];

exports.loginValidator = [
    body('email')
        .trim()
        .normalizeEmail()
        .isEmail()
        .withMessage('Please enter a valid email'),
    body('password')
        .not()
        .isEmpty()
        .withMessage('Password is required')
];

// Book validators
exports.bookValidator = [
    body('title')
        .trim()
        .not()
        .isEmpty()
        .withMessage('Title is required')
        .isLength({ max: 200 })
        .withMessage('Title cannot be more than 200 characters'),
    body('author')
        .trim()
        .not()
        .isEmpty()
        .withMessage('Author is required')
        .isLength({ max: 100 })
        .withMessage('Author name cannot be more than 100 characters'),
    body('genre')
        .trim()
        .not()
        .isEmpty()
        .withMessage('Genre is required'),
    body('description')
        .trim()
        .not()
        .isEmpty()
        .withMessage('Description is required'),
    body('publishedYear')
        .optional()
        .isInt({ min: 1000, max: new Date().getFullYear() })
        .withMessage(`Year must be between 1000 and ${new Date().getFullYear()}`)
];

// Pagination validators
exports.paginationValidator = [
    query('page')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Page must be a positive integer'),
    query('limit')
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage('Limit must be between 1 and 100')
];