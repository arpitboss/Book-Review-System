const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
    rating: {
        type: Number,
        required: [true, 'Please add a rating'],
        min: 1,
        max: 5
    },
    title: {
        type: String,
        trim: true,
        maxlength: [100, 'Title cannot be more than 100 characters']
    },
    comment: {
        type: String,
        required: [true, 'Please add a comment'],
        trim: true,
        maxlength: [1000, 'Comment cannot be more than 1000 characters']
    },
    book: {
        type: mongoose.Schema.ObjectId,
        ref: 'Book',
        required: true
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Preventing user from submitting more than one review per book
ReviewSchema.index({ book: 1, user: 1 }, { unique: true });

// Static method to get average rating
ReviewSchema.statics.getAverageRating = async function (bookId) {
    const obj = await this.aggregate([
        {
            $match: { book: bookId }
        },
        {
            $group: {
                _id: '$book',
                averageRating: { $avg: '$rating' }
            }
        }
    ]);

    try {
        await this.model('Book').findByIdAndUpdate(bookId, {
            averageRating: obj.length > 0 ? Math.round(obj[0].averageRating * 10) / 10 : 0
        });
    } catch (err) {
        console.error(err);
    }
};

// Calling getAverageRating after save
ReviewSchema.post('save', function () {
    this.constructor.getAverageRating(this.book);
});

// Calling getAverageRating after remove
ReviewSchema.post('remove', function () {
    this.constructor.getAverageRating(this.book);
});

module.exports = mongoose.model('Review', ReviewSchema);