const mongoose = require('mongoose')

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },

    author: {
        type: String,
        required: true
    },

    imageLink: {
        type: String,
        required: true
    },


    content: {
        type: String,
        required:true

    }
});

const Blog = mongoose.model('blog', blogSchema);

module.exports = Blog;