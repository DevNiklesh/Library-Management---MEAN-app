const mongoose = require("mongoose");
const USER = require("./user-schema");
const { Schema } = mongoose;

const bookSchema = new Schema ({
    bookName: {
        type: String,
        required: true
    },
    authors: {
        type: Array,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        default: 0
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    addedBy: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: [true, "Book must be added by a user"]
    },
    coverImgUrl: {
        type: String,
        default: null
    },
    language: {
        type: String,
        default: null
    },
    year: {
        type: String,
        default: null
    },
    country: {
        type: String,
        default: null
    },
    category: {
        type: String,
        default: null
    }
});

const BookModel = mongoose.model("Book", bookSchema);

module.exports = BookModel;
