const mongoose = require("mongoose");

const userDashboardSchema = new mongoose.Schema({
    eventDate: String,

    occasion: String,

    city: String,

    vendorName: String,

    vendorService: String,

    requestStatus: String,

    paymentStatus: Boolean,

    vendorID: String,

    userID: String,

    price: Number,

    packageTaken: String,

    billDate: String,

    ///////////////////////////////////////////////////////////

    venueID: String,

    budget: String,

    guestNumber: String,

    venueName: String,

    venueSpace: String,

    spaceID: String,

});

const UserDashboard = mongoose.model("UserDashboard", userDashboardSchema);

module.exports = UserDashboard;