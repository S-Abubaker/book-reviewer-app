const mongoose = require('mongoose')

const reviewSchema = new mongoose.Schema({
    bookTitle: {
        type: String,
        required: true,
        trim: true,
    },
    bookAuthor: {
        type: String,
        required: true,
    },
    reviewBody: {
        type: String,
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

const ReviewSchema = mongoose.model('Review', reviewSchema)

module.exports =  ReviewSchema