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