const errorHandler = (err, req, res, next) => {
    let error = { ...err };
    error.message = err.message;

    // Logging to console for dev
    console.error(err);

    // Mongoose bad ObjectId
    if (err.name === 'CastError') {
        const message = 'Resource not found';
        error = { message };
    }

    // Mongoose duplicate key
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];
        const message = `Duplicate ${field} entered. This ${field} already exists.`;
        error = { message };
    }

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        const message = Object.values(err.errors).map(val => val.message);
        error = { message };
    }

    res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || 'Server Error'
    });
};

module.exports = errorHandler;