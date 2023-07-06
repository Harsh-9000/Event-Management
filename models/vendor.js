const mongoose = require("mongoose");

const vendorSchema = new mongoose.Schema({
    title: String,

    images: [{
        type: String
    }],

    address: String,

    rating: {
        type: Number,
        min: 1,
        max: 5,
    },

    about: String,

    services: [{
        type: String
    }],

    price: [{
        type: Number
    }],

    packages: [{
        type: String
    }],

    packagesInfo: [{
        type: String
    }],

    bookingPolicy: String,

    cancellationPolicy: String,

    service: String,

    ownerName: String,

    ownerNumber: Number,

    ownerMail: {
        type: String,
        unique: true
    },

    city: String,

    password: String,

    isVendor: {
        type: Boolean,
        default: true
    }

});

const Vendor = mongoose.model("Vendor", vendorSchema);

module.exports = Vendor;