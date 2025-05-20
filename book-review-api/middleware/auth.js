const jwt = require('jsonwebtoken');
const User = require('../models/User');

// This middleware checks if the user is authenticated by verifying the JWT token
exports.protect = async (req, res, next) => {
    let token;

    // Checking for authorization header with Bearer token
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        // Setting token from Bearer token in header
        token = req.headers.authorization.split(' ')[1];
    }

    // Making sure that token exists
    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized to access this route'
        });
    }

    try {
        // Verifying token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attaching user to request
        req.user = await User.findById(decoded.id);

        // If user not found (e.g., deleted after token was issued)
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'User no longer exists'
            });
        }

        next();
    } catch (err) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized to access this route'
        });
    }
};