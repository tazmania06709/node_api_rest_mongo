const mongoose = require('mongoose');
const { type } = require('os');

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    genre: {
        type: String,
        required: true
    },
    publication_date: {
        type: String,
        require: true
    }
    // description: {
    //     type: String,
    //     required: true
    // },
    // price: {
    //     type: Number,
    //     required: true
    // },
    // quantity: {
    //     type: Number,
    //     required: true
    // },
    // imageUrl: {
    //     type: String,
    //     required: true
    // }
});

module.exports = mongoose.model('Book', bookSchema);