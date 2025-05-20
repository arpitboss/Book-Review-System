const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a title'],
        trim: true,
        maxlength: [200, 'Title cannot be more than 200 characters']
    },
    author: {
        type: String,
        required: [true, 'Please add an author'],
        trim: true,
        maxlength: [100, 'Author name cannot be more than 100 characters']
    },
    genre: {
        type: String,
        required: [true, 'Please add a genre'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Please add a description'],
        trim: true
    },
    isbn: {
        type: String,
        trim: true,
        unique: true,
        sparse: true // Allow null or undefined values to be unique
    },
    publishedYear: {
        type: Number,
        min: [1000, 'Year must be valid'],
        max: [new Date().getFullYear(), 'Year cannot be in the future']
    },
    publisher: {
        type: String,
        trim: true
    },
    createdBy: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Creating index for search functionality
BookSchema.index({ title: 'text', author: 'text' });

// Virtual for reviews
BookSchema.virtual('reviews', {
    ref: 'Review',
    localField: '_id',
    foreignField: 'book',
    justOne: false
});

// Cascade delete reviews when a book is deleted
BookSchema.pre('remove', async function (next) {
    await this.model('Review').deleteMany({ book: this._id });
    next();
});

module.exports = mongoose.model('Book', BookSchema);