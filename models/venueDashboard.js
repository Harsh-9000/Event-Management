const mongoose = require("mongoose");

const venueDashboardSchema = new mongoose.Schema({
    eventDate: String,

    occasion: String,

    city: String,

    customerName: String,

    customerEmail: String,

    customerNumber: Number,

    accepted: Boolean,

    paymentStatus: Boolean,

    userID: String,

    venueID: String,

    spaceID: String,

    price: Number,

    packageTaken: String,

    billDate: String,

    budget: String,

    guestQuantity: String,

    space: String

});

const VenueDashboard = mongoose.model("VenueDashboard", venueDashboardSchema);

module.exports = VenueDashboard;