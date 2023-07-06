const mongoose = require("mongoose");

const vendorDashboardSchema = new mongoose.Schema({
    eventDate: String,

    occasion: String,

    city: String,

    customerName: String,

    customerEmail: String,

    customerNumber: Number,

    accepted: Boolean,

    paymentStatus: Boolean,

    userID: String,

    vendorID: String,

    price: Number,

    packageTaken: String,

    billDate: String
});

const VendorDashboard = mongoose.model("VendorDashboard", vendorDashboardSchema);

module.exports = VendorDashboard;