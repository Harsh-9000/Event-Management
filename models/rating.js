const mongoose = require('mongoose')

const ratingSchema = new mongoose.Schema({
    vendorId: String,

    rating: {
        type: Number,
        min: 1,
        max: 5,
    },
});

const Ratings = mongoose.model('Ratings', ratingSchema);

module.exports = Ratings;