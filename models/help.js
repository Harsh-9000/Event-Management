const mongoose = require('mongoose');

const helpSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    }
});

const Help = mongoose.model('Help', helpSchema);

module.exports = Help;