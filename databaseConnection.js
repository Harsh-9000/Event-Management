const mongoose = require('mongoose');

mongoose.set('strictQuery', false);

const url = "mongodb://127.0.0.1:27017/Database";

const connectToDatabase = () => {
    mongoose.connect(url).then(() => {
        console.log("Connected Successfully !!!");
    }).catch(err => console.error(err));
}

module.exports = connectToDatabase;