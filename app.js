const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");
const connectToDatabase = require("./databaseConnection.js");
const Vendor = require("./models/vendor.js");
const VendorDashboard = require("./models/vendorDashboard.js");
const UserDashboard = require("./models/userDashboard.js");
const VenueDashboard = require("./models/venueDashboard.js");
const User = require("./models/user.js");
const Rating = require("./models/rating.js");
const Venue = require("./models/venue.js");
const Space = require("./models/space.js");
const Help = require("./models/help.js");
const Blog = require("./models/blog.js");
const session = require('express-session');
const cookieParser = require("cookie-parser")
const { randomUUID } = require("crypto");

const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());

app.use(
    session({
        key: 'user_id',
        secret: "FFSD_PROJECT",
        resave: false,
        saveUninitialized: false,
        cookie: {
            expires: 600000,
        },
    })
);

app.use((req, res, next) => {
    if (!req.session.user && req.cookies.user_id) {
        res.clearCookie("user_id")
    }
    next();
});

const sessionCheck = async (req, res, next) => {

    if (req.session.user && req.cookies.user_id) {

        try {
            var check = await User.findOne({ _id: req.session.user._id });
        } catch (err) {
            console.log(err);
        }

        if (check !== null) {
            next();
        }
        else {
            res.redirect('/login');
        }
    } else {
        res.redirect('/login');
    }
};

var adminsessionCheck = async (req, res, next) => {
    if (req.session.user && req.cookies.user_id) {
        var check = await User.findOne({ _id: req.session.user._id });
        if (check.isAdmin) {
            next();
        }
        else {
            res.redirect('/login');
        }
    } else {
        res.redirect('/login');
    }
}

var basicsession = async (req, res, next) => {

    if (req.session.user && req.cookies.user_id) {
        res.redirect('/')
    }
    else {
        next()
    }
};

const vendorSessionCheck = async (req, res, next) => {
    if (req.session.user && req.cookies.user_id) {

        try {
            var check = await Vendor.findOne({ _id: req.session.user._id });
        } catch (err) {
            console.log(err);
        }

        if (check !== null) {
            next();
        }
        else {
            res.redirect('/vendors/login');
        }
    } else {
        res.redirect('/vendors/login');
    }
};

const venueSessionCheck = async (req, res, next) => {
    if (req.session.user && req.cookies.user_id) {

        try {
            var check = await Venue.findOne({ _id: req.session.user._id });
        } catch (err) {
            console.log(err);
        }

        if (check !== null) {
            next();
        }
        else {
            res.redirect('/venue-login');
        }
    } else {
        res.redirect('/venue-login');
    }
};

const bcrypt = require("bcrypt");
const { log } = require("console");
const saltRounds = 10

connectToDatabase();

// Forgot Password

app.get("/user/forgot", (req, res) => {
    res.render("forgotPasswordPageUser")
})
app.post("/user/forgot", async (req, res) => {
    try {

        try {
            var check = await User.findOne({ email: req.body.email })
        } catch (err) {
            console.log(err);
        }

        // console.log(check.email)
        if (!check) {
            alert("email not found")
            res.redirect('/login')
        }

        bcrypt.genSalt(saltRounds, function (err, salt) {
            bcrypt.hash(req.body.password, salt, async function (err, hash) {

                try {
                    await User.updateOne({ email: req.body.email }, { password: hash })
                } catch (err) {
                    console.log(err);
                }

                console.log("changed")
                res.redirect('/login')
            });
        });



    } catch (error) {
        console.log("error")
    }
})

app.get("/vendors/forgot", (req, res) => {
    res.render("forgotPasswordVendor")
})

app.post("/vendors/forgot", async (req, res) => {
    try {
        try {
            var check = await Vendor.findOne({ ownerMail: req.body.email })
        } catch (err) {
            console.log(err);
        }

        if (!check) {
            alert("email not found")
            res.redirect('/vendors/login')
        }

        bcrypt.genSalt(saltRounds, function (err, salt) {
            bcrypt.hash(req.body.password, salt, async function (err, hash) {

                try {
                    await Vendor.updateOne({ ownerMail: req.body.email }, { password: hash })
                } catch (err) {
                    console.log(err);
                }

                console.log("changed")
                res.redirect('/vendors/login')
            });
        });

    } catch (error) {
        console.log(error)
    }
})

app.get("/venue/forgot", (req, res) => {
    res.render("forgotPasswordVenue")
})

app.post("/venue/forgot", async (req, res) => {
    try {

        try {
            var check = await Venue.findOne({ owner_email: req.body.email })
        } catch (err) {
            console.log(err);
        }

        if (!check) {
            alert("email not found")
            res.redirect('/venue-login')
        }

        bcrypt.genSalt(saltRounds, function (err, salt) {
            bcrypt.hash(req.body.password, salt, async function (err, hash) {

                try {
                    await Venue.updateOne({ owner_email: req.body.email }, { owner_password: hash })
                } catch (err) {
                    console.log(err);
                }

                console.log("changed")
                res.redirect('/venue-login')
            });
        });



    } catch (error) {
        console.log("error")
    }
})

// Logout
app.get("/logout", function (req, res) {
    if (req.session.user && req.cookies.user_id) {
        res.clearCookie("user_id")
        res.redirect('/')
    }
    else {
        res.redirect('/')
    }
});


// Homepage
app.get("/", function (req, res) {

    if (req.session.user) {
        res.render("homepage", { currentUser: req.session.user, UserID: req.session.user._id });
    } else {
        res.render("homepage", { currentUser: req.session.user });
    }

});


// Login and SignUp
app.get("/login", basicsession, function (req, res) {
    res.render("loginPage");
});

app.post("/login", async function (req, res) {

    try {

        try {
            var check = await User.findOne({ email: req.body.email.toLowerCase() });
        } catch (err) {
            console.log(err);
        }

        if (!check) {
            res.redirect('/login');
        }

        bcrypt.compare(req.body.password, check.password, function (err, result) {
            if (err) {
                console.log(err);
            }
            if (!result) {
                res.redirect('/login');
            }
            else {
                req.session.user = check;
                req.session.authorized = true;
                res.redirect('/');
            }

        });

    }
    catch {
        console.log("Error !!");
    }

});

app.get("/signup", basicsession, function (req, res) {
    res.render("signupPage");
});

app.post("/signup", function (req, res) {

    const userPassword = req.body.password;

    bcrypt.genSalt(saltRounds, function (err, salt) {
        bcrypt.hash(userPassword, salt, function (err, hash) {

            var data = {
                name: req.body.name,
                email: req.body.email.toLowerCase(),
                password: hash
            };

            User.insertMany([data]);
            res.redirect("/login");

        });
    });

});

// Vendor Login
app.get("/vendors/login", basicsession, function (req, res) {
    res.render("vendorLoginPage");
});

app.post("/vendors/login", async function (req, res) {
    try {
        let check;
        try {
            check = await Vendor.findOne({ ownerMail: req.body.email.toLowerCase() });
        } catch (err) {
            console.log(err);
        }

        if (!check) {
            res.redirect('/vendors/login');
        }

        bcrypt.compare(req.body.password, check.password, function (err, result) {
            if (err) {
                console.log(err);
            }
            if (!result) {
                res.redirect('/vendors/login');
            }
            else {
                req.session.user = check;
                req.session.authorized = true;
                res.redirect('/vendor-dashboard/' + req.session.user._id);
            }

        });
    }
    catch (err) {
        console.log(err);
    }

});

// Venue Login
app.get("/venue-login", basicsession, function (req, res) {
    res.render("venueLoginPage");
});

app.post("/venue-login", async function (req, res) {

    try {
        let check;

        try {
            check = await Venue.findOne({ owner_email: req.body.email.toLowerCase() });
        } catch (err) {
            console.log(err);
        }

        if (!check) {
            res.redirect('/venue-login');
        }

        bcrypt.compare(req.body.password, check.owner_password, function (err, result) {
            if (err) {

                console.log(err);
            }
            if (!result) {
                res.redirect('/venue-login');
            }
            else {
                req.session.user = check;
                req.session.authorized = true;
                res.redirect('/venue-dashboard/' + req.session.user._id);
            }

        });
    }
    catch (err) {
        console.log(err);
    }
});
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Admin Dashboard
app.get("/admin-dashboard/:adminId", adminsessionCheck, function (req, res) {
    const UserID = req.params.adminId;
    res.render("admindashboardpage", { UserID: UserID });

});

app.get("/admin-dashboard/:adminId/users", adminsessionCheck, async function (req, res) {
    const UserID = req.params.adminId;

    const users = await User.find({});
    res.render("user", { UserID: UserID, user: users });

});

app.get("/admin-dashboard/:adminId/vendor", adminsessionCheck, async function (req, res) {
    const UserID = req.params.adminId;

    const vendors = await Vendor.find();


    res.render("vendor", { UserID: UserID, vendor: vendors });

});

app.get("/admin-dashboard/:adminId/venue", adminsessionCheck, async function (req, res) {
    const UserID = req.params.adminId;


    const venues = await Venue.find({});

    res.render("venue", { UserID: UserID, venue: venues });

});

app.get("/vendor/:delete", async (req, res) => {
    var id = req.params.delete;
    // console.log(id);
    await Vendor.deleteOne({ _id: id })

    res.redirect("/admin-dashboard/" + req.session.user._id + "vendor")
})

app.get("/venue/:delete", async (req, res) => {
    var id = req.params.delete;
    // console.log(id);
    await Venue.deleteOne({ _id: id })

    res.redirect("/admin-dashboard/" + req.session.user._id + "/venue")
})

app.get("/user/:delete", async (req, res) => {
    var id = req.params.delete;
    // console.log(id);
    await User.deleteOne({ _id: id })

    res.redirect("/admin-dashboard/" + req.session.user._id + "/users")
})

app.get("/help/:adminId/admin", async (req, res) => {
    const UserID = req.params.adminId;
    const helps = await Help.find({})
    res.render("helpadmin", { UserID: UserID, help: helps })
})

//Blog entry
app.get("/admin-dashboard/:adminId/blog", (req, res) => {
    const UserID = req.params.adminId;
    res.render('blog', { UserID: UserID });
})

app.post("/blog-entry", async (req, res) => {
    var data = {
        title: req.body.title,
        author: req.body.author,
        imageLink: req.body.imageLink,
        content: req.body.content
    }
    // console.log(data);
    await Blog.insertMany([data]);
    res.redirect('/admin-dashboard/' + req.session.user._id + '/blog')
})

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// User Dashboard
app.get("/user-dashboard/:userId", sessionCheck, function (req, res) {

    const UserID = req.params.userId;
    res.render("userDashboardPage", { UserID: UserID });

});

app.get("/user-dashboard/:userId/active-events", sessionCheck, async function (req, res) {

    const UserID = req.params.userId;

    let events;

    try {
        events = await UserDashboard.find({});
    } catch (err) {
        console.log(err);
    }

    res.render("userDashboardEventsPage", { UserID: UserID, events: events });

});

app.get("/user-dashboard/:userId/vendor-enquiries", sessionCheck, async function (req, res) {

    const UserID = req.params.userId;

    let enquiries
    try {
        enquiries = await UserDashboard.find({ userID: UserID });
    } catch (err) {
        console.log(err);
    }

    res.render("userDashboardVendorPage", { UserID: UserID, enquiries: enquiries });

});

app.get("/user-dashboard/:userId/venue-enquiries/:enquirieId/pay", sessionCheck, async function (req, res) {
    const EnquirieID = req.params.enquirieId;
    const UserID = req.params.userId;

    let event;
    let venue;
    let user;

    try {
        event = await UserDashboard.findById(EnquirieID);
    } catch (err) {
        console.log(err);
    }

    try {
        user = await VenueDashboard.findOne({ userID: UserID, spaceID: event.spaceID });
    } catch (err) {
        console.log(err);
    }

    try {
        venue = await Venue.findById(event.venueID);
    } catch (err) {
        console.log(err);
    }

    res.render("userDashboardVenueBillPage", { VenueID: venue._id, event: event, venue: venue, user: user });

});

app.get("/user-dashboard/:userId/venue-enquiries/:enquirieId/payment-confirm", sessionCheck, async function (req, res) {
    //If payment done then copy to Active Events and set Paymemt Status to Done in both User and Vendor Dashboard
    const EnquirieID = req.params.enquirieId;
    const UserID = req.params.userId;

    let event;
    try {
        event = await UserDashboard.findById(EnquirieID);
    } catch (err) {
        console.log(err);
    }

    try {
        await VenueDashboard.updateOne({ userID: event.userID, venueID: event.venueID, eventDate: event.eventDate, occasion: event.occasion, budget: event.budget, guestNumber: event.guestQuantity, venueSpace: event.space }, {
            paymentStatus: true
        });
    } catch (err) {
        console.log(err);
    }

    try {
        await UserDashboard.updateOne({ _id: EnquirieID }, {
            paymentStatus: true
        });
    } catch (err) {
        console.log(err);
    }

    res.redirect("/user-dashboard/" + UserID + "/active-events")
});

app.get("/user-dashboard/:userId/vendor-enquiries/:enquirieId/pay", sessionCheck, async function (req, res) {
    const EnquirieID = req.params.enquirieId;
    const UserID = req.params.userId;

    let event;
    let vendor;
    let user;

    try {
        event = await UserDashboard.findById(EnquirieID);
    } catch (err) {
        console.log(err);
    }

    try {
        user = await VendorDashboard.findOne({ userID: UserID, spaceID: event.spaceID });
    } catch (err) {
        console.log(err);
    }

    try {
        vendor = await Vendor.findById(event.vendorID);
    } catch (err) {
        console.log(err);
    }
    res.render("userDashboardVendorBillPage", { VendorID: vendor._id, user: user, event: event, vendor: vendor });

});

app.get("/user-dashboard/:userId/vendor-enquiries/:enquirieId/payment-confirm", sessionCheck, async function (req, res) {
    //If payment done then copy to Active Events and set Paymemt Status to Done in both User and Vendor Dashboard
    const EnquirieID = req.params.enquirieId;
    const UserID = req.params.userId;

    let event;
    try {
        event = await UserDashboard.findById(EnquirieID);
    } catch (err) {
        console.log(err);
    }

    try {
        await VendorDashboard.updateOne({ userID: event.userID, vendorID: event.vendorID, eventDate: event.eventDate, occasion: event.occasion }, {
            paymentStatus: true
        });
    } catch (err) {
        console.log(err);
    }

    try {
        await UserDashboard.updateOne({ _id: EnquirieID }, {
            paymentStatus: true
        });
    } catch (err) {
        console.log(err);
    }

    res.redirect("/user-dashboard/" + UserID + "/active-events")
});

app.get("/user-dashboard/:userId/venue-enquiries", sessionCheck, async function (req, res) {

    const UserID = req.params.userId;

    let enquiries
    try {
        enquiries = await UserDashboard.find({ userID: UserID });
    } catch (err) {
        console.log(err);
    }

    res.render("userDashboardVenuePage", { UserID: UserID, enquiries: enquiries });

});

app.get("/user-dashboard/:userId/help", sessionCheck, function (req, res) {
    const UserID = req.params.userId;
    res.render('helpuser', { UserID: UserID })
});

app.post("/user-dashboard/:userId/help", async (req, res) => {
    const UserID = req.params.userId;
    var data = {
        email: req.body.email,
        message: req.body.message
    }
    await Help.insertMany([data]);
    // user dashboard m wapas kdo
    res.redirect('/user-dashboard/' + UserID + '/help')
});

app.get("/user-dashboard/:userId/settings", sessionCheck, async function (req, res) {

    const UserID = req.params.userId;

    let user;
    try {
        user = await User.findById(UserID);
    } catch (err) {
        console.log(err);
    }

    res.render("userDashboardSettings", { UserID: UserID, User: user });

});

app.get("/user-dashboard/:userId/settings/edit", sessionCheck, async function (req, res) {

    const UserID = req.params.userId;

    let user;
    try {
        user = await User.findById(UserID);
    } catch (err) {
        console.log(err);
    }

    res.render("userDashboardEditSettings", { UserID: UserID, User: user });

});

app.post("/user-dashboard/:userId/settings/edit", sessionCheck, async function (req, res) {

    const UserID = req.params.userId;


    try {
        await User.updateOne({ _id: UserID }, {
            name: req.body.name,
            email: req.body.email,
            number: req.body.number
        });
    } catch (err) {
        console.log(err);
    }

    res.redirect("/user-dashboard/" + UserID + "/settings")

});


// Venue Dashboard
app.get("/venue-dashboard/:venueId", venueSessionCheck, async function (req, res) {
    const VenueID = req.params.venueId;

    let active;
    let enquirie;
    let number;
    let number_2;

    try {
        number = await Venue.findOne({ _id: VenueID });
    } catch (err) {
        console.log(err);
    }

    number = number.space.length;
    console.log(number);

    try {
        active = await VenueDashboard.findOne({ accepted: true, venueID: VenueID });
    } catch (err) {
        console.log(err);
    }

    try {
        number_2 = await VenueDashboard.find({ accepted: true, venueID: VenueID });
    } catch (err) {
        console.log(err);
    }

    number_2 = number_2.length;

    try {
        enquirie = await VenueDashboard.findOne({ accepted: false });
    } catch (err) {
        console.log(err);
    }


    res.render("venueDashboardPage", { VenueID: VenueID, active: active, enquirie: enquirie, number: number, number_2: number_2 });
});

app.get("/venue-dashboard/:venueId/active-events", venueSessionCheck, async function (req, res) {
    const VenueID = req.params.venueId;

    let enquiries;
    try {
        enquiries = await VenueDashboard.find({ venueID: VenueID });
    } catch (err) {
        console.log(err);
    }

    res.render("venueDashboardEventsPage", { VenueID: VenueID, enquiries: enquiries });
});

app.get("/venue-dashboard/:venueId/customers", venueSessionCheck, async function (req, res) {

    // Display Customer Enquiries

    const VenueID = req.params.venueId;

    let enquiries;
    try {
        enquiries = await VenueDashboard.find({ venueID: VenueID });
    } catch (err) {
        console.log(err);
    }

    res.render("venueDashboardCustomerPage", { VenueID: VenueID, enquiries: enquiries });
});

app.get("/venue-dashboard/:venueId/customers/:enquirieId/decline", venueSessionCheck, async function (req, res) {

    const VenueID = req.params.venueId;
    const EnquirieID = req.params.enquirieId;

    let event;
    try {
        event = await VenueDashboard.findById(EnquirieID);
    } catch (err) {
        console.log(err);
    }

    try {
        await UserDashboard.updateOne({ userID: event.userID, venueID: event.venueID, eventDate: event.eventDate, occasion: event.occasion, budget: event.budget, guestNumber: event.guestQuantity, venueSpace: event.space }, {
            requestStatus: "Declined"
        });
    } catch (err) {
        console.log(err);
    }

    try {
        await VenueDashboard.findByIdAndDelete(EnquirieID);
    } catch (err) {
        console.log(err);
    }

    res.redirect("/venue-dashboard/" + VenueID + "/customers");

});

app.get("/venue-dashboard/:venueId/customers/:enquirieId/accept", venueSessionCheck, async function (req, res) {
    const EnquirieID = req.params.enquirieId;

    let event;
    let venue;
    try {
        event = await VenueDashboard.findById(EnquirieID);
    } catch (err) {
        console.log(err);
    }

    try {
        venue = await Venue.findById(event.venueID);
    } catch (err) {
        console.log(err);
    }

    const currentDate = new Date().toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    });

    try {
        await UserDashboard.updateOne({ userID: event.userID, venueID: event.venueID, eventDate: event.eventDate, occasion: event.occasion, budget: event.budget, guestNumber: event.guestQuantity, venueSpace: event.space }, {
            billDate: currentDate
        });
    } catch (err) {
        console.log(err);
    }

    try {
        await VenueDashboard.updateOne({ _id: EnquirieID }, {
            billDate: currentDate
        });
    } catch (err) {
        console.log(err);
    }

    res.render("venueDashboardBillPage", { VenueID: venue._id, event: event, venue: venue, currentDate: currentDate });

});

app.post("/venue-dashboard/:venueId/customers/:enquirieId/accept", venueSessionCheck, async function (req, res) {
    // Move Enquirie from Customer to Active Events in Vendor Dashboard and Set Request Status as Accepted in User Dashboard

    const price = req.body.price;
    const package = req.body.package;

    const EnquirieID = req.params.enquirieId;

    let event;
    try {
        event = await VenueDashboard.findById(EnquirieID);
    } catch (err) {
        console.log(err);
    }

    try {
        await UserDashboard.updateOne({ userID: event.userID, venueID: event.venueID, eventDate: event.eventDate, occasion: event.occasion }, {
            packageTaken: package,
            price: price,
            requestStatus: "Accepted"
        });

    } catch (err) {
        console.log(err);
    }

    try {
        await VenueDashboard.updateOne({ _id: EnquirieID }, {
            packageTaken: package,
            price: price,
            accepted: true
        });

    } catch (err) {
        console.log(err);
    }

    res.redirect("/venue-dashboard/" + event.venueID + "/active-events");
});

app.get("/venue-dashboard/:venueId/spaces", venueSessionCheck, async function (req, res) {
    const VenueID = req.params.venueId;

    let venue;

    try {
        venue = await Venue.findById(VenueID);
    } catch (err) {
        console.log(err);
    }

    const spacesIds = venue.space;

    const spaces = [];

    for (const id of spacesIds) {
        try {
            const space = await Space.findOne({ id: id });
            spaces.push(space);
        } catch (err) {
            console.log(err);
        }
    }

    res.render("venueDashboardSpacesPage", { VenueID: VenueID, spaces: spaces });
});

app.get("/venue-dashboard/:venueId/spaces/add", venueSessionCheck, async function (req, res) {
    const VenueID = req.params.venueId;

    res.render("venueDashboardSpaceForm", { VenueID: VenueID, editing: false });
});

app.post("/venue-dashboard/:venueId/spaces/add", venueSessionCheck, async function (req, res) {

    let {
        space_type,
        veg_price,
        non_veg_price,
        image,
        no_of_rooms,
        capacity,
        room_price,
        about,
        facility_available,
    } = req.body;

    image = image.split(",");
    facility_available = facility_available.split(",");
    let id = randomUUID().slice(0, 6);

    const VenueID = req.params.venueId;

    let venue;
    try {
        venue = await Venue.findOne({ _id: VenueID });
    } catch (err) {
        console.log(err);
    }


    let newSpace = new Space({
        id: id,
        space_type,
        veg_price,
        non_veg_price,
        images: image,
        no_of_rooms,
        capacity,
        about,
        room_price,
        facility_available,
        venue_name: venue.venue_name,
        venue_address: venue.venue_address,
        owner_number: venue.owner_number
    });

    try {
        await newSpace.save();
    } catch (err) {
        console.log(err);
    }

    venue.space.push(id);

    try {
        await venue.save();
    } catch (err) {
        console.log(err);
    }

    res.redirect("/venue-dashboard/" + VenueID + "/spaces");

});

app.get("/venue-dashboard/:venueId/spaces/:spaceId/edit", venueSessionCheck, async function (req, res) {
    const VenueID = req.params.venueId;

    const spaceId = req.params.spaceId;

    let space;

    try {
        space = await Space.findOne({ id: spaceId });
    } catch (err) {
        console.log(err);
    }

    if (!space) {
        return res.redirect("/venue-dashboard/" + VenueID + "/spaces");
    }

    res.render("venueDashboardSpaceForm", { VenueID: VenueID, editing: true, space: space });
});

app.post("/venue-dashboard/:venueId/spaces/:spaceId/edit", venueSessionCheck, async function (req, res) {
    const VenueID = req.params.venueId;

    let {
        spaceId,
        space_type,
        veg_price,
        non_veg_price,
        image,
        no_of_rooms,
        capacity,
        room_price,
        about,
        facility_available,
    } = req.body;

    image = image.split(",");
    facility_available = facility_available.split(",");

    let space;
    try {
        space = await Space.findOne({ id: spaceId })
    } catch (err) {
        console.log(err);
    }

    console.log(image);

    space.space_type = space_type;
    space.veg_price = veg_price;
    space.non_veg_price = non_veg_price;
    space.images = image;
    space.no_of_rooms = no_of_rooms;
    space.capacity = capacity;
    space.room_price = room_price;
    space.about = about;
    space.facility_available = facility_available;

    try {
        await space.save();
    } catch (err) {
        console.log(err);
    }

    res.redirect("/venue-dashboard/" + VenueID + "/spaces");

});

app.get("/venue-dashboard/:venueId/spaces/:spaceId/delete", venueSessionCheck, async function (req, res) {
    const VenueID = req.params.venueId;
    const spaceId = req.params.spaceId;

    let venue;
    try {
        venue = await Venue.findOne({ _id: VenueID });
    } catch (err) {
        console.log(err);
    }

    let spaces = venue.space;

    // Find the index of the "spaceId" element in the array spaces
    const index = spaces.indexOf(spaceId);

    // If the element exists in the array, remove it
    if (index !== -1) {
        spaces.splice(index, 1);
    }

    venue.space = spaces;

    try {
        await venue.save();
    } catch (err) {
        console.log(err);
    }


    try {
        const deletedSpace = await Space.findOneAndRemove({ id: spaceId });
        console.log(`Deleted space with ID ${deletedSpace.id}`);
    } catch (err) {
        console.log(err);
    }

    res.redirect("/venue-dashboard/" + VenueID + "/spaces");
});

app.get("/venue-dashboard/:venueId/help", venueSessionCheck, function (req, res) {
    const VenueID = req.params.venueId;
    res.render('helpvenue', { VenueID: VenueID });
});

app.post("/venue-dashboard/:venueId/help", async (req, res) => {
    const VenueID = req.params.venueId;
    var data = {
        email: req.body.email,
        message: req.body.message
    }
    await Help.insertMany([data]);
    // venue dashboard m wapas kdo
    res.redirect("/venue-dashboard/" + VenueID + "/help")
});

app.get("/venue-dashboard/:venueId/settings", venueSessionCheck, async function (req, res) {

    const VenueID = req.params.venueId;

    let venue;
    try {
        venue = await Venue.findById(VenueID);
    } catch (err) {
        console.log(err);
    }

    res.render("venueDashboardSettings", { VenueID: VenueID, Venue: venue });
});

app.get("/venue-dashboard/:venueId/settings/edit", venueSessionCheck, async function (req, res) {

    const VenueID = req.params.venueId;

    let venue;
    try {
        venue = await Venue.findById(VenueID);
    } catch (err) {
        console.log(err);
    }

    res.render("venueDashboardEditSettings", { VenueID: VenueID, Venue: venue });
});

app.post("/venue-dashboard/:venueId/settings/edit", venueSessionCheck, async function (req, res) {

    const VenueID = req.params.venueId;

    try {
        await Venue.updateOne({ _id: VenueID }, {
            owner_name: req.body.name,
            owner_email: req.body.email,
            owner_number: req.body.number
        });
    } catch (err) {
        console.log(err);
    }


    res.redirect("/venue-dashboard/" + VenueID + "/settings");

});

// Vendor Dashboard
app.get("/vendor-dashboard/:vendorId", vendorSessionCheck, async function (req, res) {
    const VendorID = req.params.vendorId;

    let active;
    let enquirie;

    try {
        active = await VendorDashboard.findOne({ accepted: true, vendorID: VendorID });
    } catch (err) {
        console.log(err);
    }

    try {
        enquirie = await VendorDashboard.findOne({ accepted: false, vendorID: VendorID });
    } catch (err) {
        console.log(err);
    }

    res.render("vendorDashboardPage", { VendorID: VendorID, active: active, enquirie: enquirie, currentUser: req.session.user });
});

app.get("/vendor-dashboard/:vendorId/active-events", vendorSessionCheck, async function (req, res) {

    const VendorID = req.params.vendorId;

    let enquiries;
    try {
        enquiries = await VendorDashboard.find({ vendorID: VendorID });
    } catch (err) {
        console.log(err);
    }

    res.render("vendorDashboardEventsPage", { VendorID: VendorID, enquiries: enquiries });
});

app.get("/vendor-dashboard/:vendorId/customers", vendorSessionCheck, async function (req, res) {
    // Display Customer Enquiries

    const VendorID = req.params.vendorId;

    let enquiries;
    try {
        enquiries = await VendorDashboard.find({ vendorID: VendorID });
    } catch (err) {
        console.log(err);
    }

    res.render("vendorDashboardCustomerPage", { VendorID: VendorID, enquiries: enquiries });

});

app.get("/vendor-dashboard/:vendorId/customers/:enquirieId/decline", vendorSessionCheck, async function (req, res) {
    // Delete Enquirie from Vendor Dashboard and Set Request Status as Declined in User Dashboard

    const VendorID = req.params.vendorId;
    const EnquirieID = req.params.enquirieId;

    let event;
    try {
        event = await VendorDashboard.findById(EnquirieID);
    } catch (err) {
        console.log(err);
    }

    try {
        await UserDashboard.updateOne({ userID: event.userID, vendorID: event.vendorID, eventDate: event.eventDate, occasion: event.occasion }, {
            requestStatus: "Declined"
        });
    } catch (err) {
        console.log(err);
    }

    try {
        await VendorDashboard.findByIdAndDelete(EnquirieID);
    } catch (err) {
        console.log(err);
    }

    res.redirect("/vendor-dashboard/" + VendorID + "/customers");

});

app.get("/vendor-dashboard/:vendorId/customers/:enquirieId/accept", vendorSessionCheck, async function (req, res) {
    const EnquirieID = req.params.enquirieId;

    let event;
    let vendor;
    try {
        event = await VendorDashboard.findById(EnquirieID);
    } catch (err) {
        console.log(err);
    }

    try {
        vendor = await Vendor.findById(event.vendorID);
    } catch (err) {
        console.log(err);
    }

    const currentDate = new Date().toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    });

    try {
        await UserDashboard.updateOne({ userID: event.userID, vendorID: event.vendorID, eventDate: event.eventDate, occasion: event.occasion }, {
            billDate: currentDate
        });
    } catch (err) {
        console.log(err);
    }

    try {
        await VendorDashboard.updateOne({ _id: EnquirieID }, {
            billDate: currentDate
        });
    } catch (err) {
        console.log(err);
    }

    res.render("vendorDashboardBillPage", { VendorID: vendor._id, event: event, vendor: vendor, currentDate: currentDate });

});

app.post("/vendor-dashboard/:vendorId/customers/:enquirieId/accept", vendorSessionCheck, async function (req, res) {
    // Move Enquirie from Customer to Active Events in Vendor Dashboard and Set Request Status as Accepted in User Dashboard

    const price = req.body.price;
    const package = req.body.package;

    const EnquirieID = req.params.enquirieId;

    let event;
    try {
        event = await VendorDashboard.findById(EnquirieID);
    } catch (err) {
        console.log(err);
    }

    try {
        await UserDashboard.updateOne({ userID: event.userID, vendorID: event.vendorID, eventDate: event.eventDate, occasion: event.occasion }, {
            packageTaken: package,
            price: price,
            requestStatus: "Accepted"
        });

    } catch (err) {
        console.log(err);
    }

    try {
        await VendorDashboard.updateOne({ _id: EnquirieID }, {
            packageTaken: package,
            price: price,
            accepted: true
        });

    } catch (err) {
        console.log(err);
    }

    res.redirect("/vendor-dashboard/" + event.vendorID + "/active-events");
});

app.get("/vendor-dashboard/:vendorId/details", vendorSessionCheck, async function (req, res) {

    const VendorID = req.params.vendorId;

    let vendor;
    try {
        vendor = await Vendor.findById(VendorID);
    } catch (err) {
        console.log(err);
    }

    res.render("vendorDashboardDetailsPage", { VendorID: VendorID, vendor: vendor });
});

app.get("/vendor-dashboard/:vendorId/details/edit", vendorSessionCheck, async function (req, res) {

    const VendorID = req.params.vendorId;

    let vendor;
    try {
        vendor = await Vendor.findById(VendorID);
    } catch (err) {
        console.log(err);
    }

    res.render("vendorDashboardDetailsEditPage", { VendorID: VendorID, vendor: vendor });

});

app.post("/vendor-dashboard/:vendorId/details/edit", vendorSessionCheck, async function (req, res) {

    const VendorID = req.params.vendorId;

    const services = req.body.services.split(',');
    const images = req.body.images.split(',');
    const packages = req.body.packages.split(',');
    const packageInfo = req.body.packagesInfo.split(',');
    const price = req.body.price.split(',');
    for (var i = 0; i < price.length; i++) {
        price[i] = Number(price[i]);
    }

    try {
        await Vendor.updateOne({ _id: VendorID }, {
            title: req.body.title,
            images: images,
            address: req.body.address,
            about: req.body.about,
            services: services,
            price: price,
            packages: packages,
            packagesInfo: packageInfo,
            bookingPolicy: req.body.bookingPolicy,
            cancellationPolicy: req.body.cancellationPolicy,
            service: req.body.service,
            cit: req.body.city
        });

    } catch (err) {
        console.log(err);
    }

    res.redirect("/vendor-dashboard/" + VendorID + "/details")

});

app.get("/vendor-dashboard/:vendorId/help", vendorSessionCheck, function (req, res) {
    const VendorID = req.params.vendorId;
    res.render('helpvendor', { VendorID: VendorID })
});

app.post("/vendor-dashboard/:vendorId/help", async (req, res) => {
    const VendorID = req.params.vendorId;
    var data = {
        email: req.body.email,
        message: req.body.message
    }
    await Help.insertMany([data]);
    // vendor dashboard m wapas kdo
    res.redirect("/vendor-dashboard/" + VendorID + "/help")
});

app.get("/vendor-dashboard/:vendorId/settings", vendorSessionCheck, async function (req, res) {
    const VendorID = req.params.vendorId;

    let vendor;
    try {
        vendor = await Vendor.findById(VendorID);
    } catch (err) {
        console.log(err);
    }

    res.render("vendorDashboardSettings", { VendorID: VendorID, Vendor: vendor });
});

app.get("/vendor-dashboard/:vendorId/settings/edit", vendorSessionCheck, async function (req, res) {
    const VendorID = req.params.vendorId;

    let vendor;
    try {
        vendor = await Vendor.findById(VendorID);
    } catch (err) {
        console.log(err);
    }

    res.render("vendorDashboardEditSettings", { VendorID: VendorID, Vendor: vendor });
});

app.post("/vendor-dashboard/:vendorId/settings/edit", vendorSessionCheck, async function (req, res) {

    const VendorID = req.params.vendorId;

    
    try {
        await Vendor.updateOne({ _id: VendorID }, {
            ownerName: req.body.name,
            ownerMail: req.body.email,
            ownerNumber: req.body.number
        });

    } catch (err) {
        console.log(err);
    }

    res.redirect("/vendor-dashboard/" + VendorID + "/settings");

});


// About Us
app.get("/about-us", function (req, res) {

    if (req.session.user) {
        res.render("aboutUsPage", { currentUser: req.session.user, UserID: req.session.user._id });
    } else {
        res.render("aboutUsPage", { currentUser: req.session.user });
    }

});


// Register Venue or Vendor
app.get("/register-interest", function (req, res) {

    if (req.session.user) {
        res.render("listingPage", { currentUser: req.session.user, UserID: req.session.user._id });
    } else {
        res.render("listingPage", { currentUser: req.session.user });
    }

});

app.get("/vendors/list-vendor", function (req, res) {

    if (req.session.user) {
        res.render("vendorRegister", { currentUser: req.session.user, UserID: req.session.user._id });
    } else {
        res.render("vendorRegister", { currentUser: req.session.user });
    }

});

app.post("/vendors/list-vendor", function (req, res) {

    const vendorPassword = req.body.ownerPassword;

    bcrypt.genSalt(saltRounds, function (err, salt) {
        bcrypt.hash(vendorPassword, salt, function (err, hash) {

            var data = {

                title: req.body.businessName,

                address: req.body.businessAddress,

                service: req.body.vendorService,

                ownerName: req.body.ownerName,

                ownerNumber: req.body.ownerNumber,

                ownerMail: req.body.ownerMail.toLowerCase(),

                city: req.body.city,

                password: hash
            };

            Vendor.insertMany([data]);
            res.redirect("/vendors/vendor-package");

        });
    });

});

app.get("/vendors/vendor-package", function (req, res) {

    if (req.session.user) {
        res.render("vendorPackagesPage", { currentUser: req.session.user, UserID: req.session.user._id });
    } else {
        res.render("vendorPackagesPage", { currentUser: req.session.user });
    }

});

app.get("/list-your-venue", function (req, res) {

    if (req.session.user) {
        res.render("venueRegister", { currentUser: req.session.user, UserID: req.session.user._id });
    } else {
        res.render("venueRegister", { currentUser: req.session.user });
    }

});

app.post("/list-your-venue", function (req, res) {

    const venuePassword = req.body.ownerPassword;

    bcrypt.genSalt(saltRounds, function (err, salt) {
        bcrypt.hash(venuePassword, salt, function (err, hash) {

            var data = {

                venue_name: req.body.venueName,

                venue_address: req.body.venueAddress,

                venue_city: req.body.venueCity,

                owner_name: req.body.ownerName,

                owner_number: req.body.ownerNumber,

                owner_email: req.body.ownerMail.toLowerCase(),

                owner_password: hash
            };

            Venue.insertMany([data]);

            res.redirect("/venue-package");

        });
    });
});

app.get("/venue-package", function (req, res) {

    if (req.session.user) {
        res.render("venuePackagesPage", { currentUser: req.session.user, UserID: req.session.user._id });
    } else {
        res.render("venuePackagesPage", { currentUser: req.session.user });
    }

});

app.get("/payment-confirm", function (req, res) {

    if (req.session.user) {
        res.render("paymentPage", { currentUser: req.session.user, UserID: req.session.user._id });
    } else {
        res.render("paymentPage", { currentUser: req.session.user });
    }

});

app.get("/vendors/:vendorService/list/:vendorId", async function (req, res) {
    const vendorService = req.params.vendorService;
    const requestedVendorId = req.params.vendorId;

    let item;
    try {
        item = await Vendor.findById(requestedVendorId);
    } catch (err) {
        console.log(err);
    }

    if (req.session.user) {
        res.render("vendorPage", { service: vendorService, vendor: item, currentUser: req.session.user, UserID: req.session.user._id });
    } else {
        res.render("vendorPage", { service: vendorService, vendor: item, currentUser: req.session.user });
    }

});

app.post("/vendors/:vendorService/list/:vendorId", sessionCheck, async function (req, res) {
    // Save This Data in the rating database
    var data = {
        rating: req.body.rating,
        vendorId: req.params.vendorId
    };

    Rating.insertMany([data]);

    // Find all ratings with Vendor ID = :vendorId

    let allRatings;
    try {
        allRatings = await Rating.find({ vendorId: req.params.vendorId });
    } catch (err) {
        console.log(err);
    }

    // Calculate tha ratings and Update in Vendors Database
    let newRating = 0;
    for (let i = 0; i < allRatings.length; i++) {
        newRating = newRating + allRatings[i].rating;
    }

    newRating = newRating / allRatings.length;

    let dispRating = Number(newRating.toFixed(1));

    try {
        await Vendor.updateOne({ _id: req.params.vendorId }, { rating: dispRating })

    } catch (err) {
        console.log(err);
    }

    // Redirect to /vendors/:vendorService/list/:vendorId

    res.redirect("/vendors/" + req.params.vendorService + "/list/" + req.params.vendorId)
});

app.get("/vendors", function (req, res) {

    if (req.session.user) {
        res.render("vendorSelectionPage", { currentUser: req.session.user, UserID: req.session.user._id });
    } else {
        res.render("vendorSelectionPage", { currentUser: req.session.user });
    }

});

app.get("/venues", async function (req, res) {

    let spaces;
    try {
        spaces = await Space.find({});
    } catch (err) {
        console.log(err);
    }

    if (req.session.user) {
        res.render("displayPage", { spaces: spaces, currentUser: req.session.user, UserID: req.session.user._id });
    } else {
        res.render("displayPage", { spaces: spaces, currentUser: req.session.user });
    }

});

app.post("/venues", async function (req, res) {
    var query = {}

    if (req.body.budget) {
        var budgetArr = req.body.budget.split(',');
        query = {
            veg_price: { $gte: budgetArr[0], $lte: budgetArr[1] }
        }
    }

    if (req.body.rating) {
        var ratingArr = req.body.rating.split(',');
        query.rating = { $gte: ratingArr[0], $lte: ratingArr[1] }
    }

    if (req.body.food) {
        if (req.body.food === "Veg") {
            query.veg_price = { $exists: true }
        }
        else if (req.body.food === "Non-Veg") {
            query.non_veg_price = { $exists: true }
        }
    }

    let venues;
    try {
        venues = await Space.find(query);
    } catch (err) {
        console.log(err);
    }

    if (req.session.user) {
        res.render("displayPage", { spaces: venues, currentUser: req.session.user, UserID: req.session.user._id });
    } else {
        res.render("displayPage", { spaces: venues, currentUser: req.session.user });
    }

});

app.get("/venues/:spaceId", async function (req, res) {

    let spaceID = req.params.spaceId;
    let space;
    try {
        space = await Space.findOne({ id: spaceID });
    } catch (err) {
        console.log(err);
    }

    if (req.session.user) {
        res.render("venuePage", { space: space, currentUser: req.session.user, UserID: req.session.user._id });
    } else {
        res.render("venuePage", { space: space, currentUser: req.session.user });
    }

});

app.get("/venues/:spaceId/getquote", sessionCheck, function (req, res) {

    if (req.session.user) {
        res.render("venueQuote", { currentUser: req.session.user, UserID: req.session.user._id });
    } else {
        res.render("venueQuote", { currentUser: req.session.user });
    }

});

app.post("/venues/:spaceId/getquote", async function (req, res) {

    const SpaceId = req.params.spaceId;

    let space;
    try {
        space = await Space.findOne({ id: SpaceId });
    } catch (err) {
        console.log(err);
    }

    console.log(space);

    let venue;
    try {
        venue = await Venue.findOne({ venue_name: space.venue_name, venue_address: space.venue_address });
    } catch (err) {
        console.log(err);
    }

    console.log(venue);
    var dataUser = {
        venueSpace: space.space_type,

        eventDate: req.body.eventDate,

        occasion: req.body.eventType,

        budget: req.body.budget,

        guestNumber: req.body.guestQuantity,

        city: req.body.eventCity,

        requestStatus: "Pending",

        paymentStatus: false,

        venueID: venue._id,

        spaceID: SpaceId,

        userID: req.session.user,

        venueName: venue.venue_name
    };

    var dataVenue = {

        eventDate: req.body.eventDate,

        occasion: req.body.eventType,

        city: req.body.eventCity,

        customerName: req.body.name,

        customerEmail: req.body.mail,

        customerNumber: req.body.number,

        accepted: false,

        paymentStatus: false,

        userID: req.session.user,

        venueID: venue._id,

        spaceID: SpaceId,

        budget: req.body.budget,

        guestQuantity: req.body.guestQuantity,

        space: space.space_type

    };

    VenueDashboard.insertMany([dataVenue]);
    UserDashboard.insertMany([dataUser]);

    res.redirect("/");
});

app.get("/vendors/:vendorService/list", async function (req, res) {
    let parameter = req.params.vendorService;
    const vendorService = _.startCase(parameter);

    let vendors;
    try {
        vendors = await Vendor.find({ service: vendorService });
    } catch (err) {
        console.log(err);
    }

    if (req.session.user) {
        res.render("vendorDisplayPage", { service: vendorService, vendors: vendors, currentUser: req.session.user, UserID: req.session.user._id });
    } else {
        res.render("vendorDisplayPage", { service: vendorService, vendors: vendors, currentUser: req.session.user });
    }

});

app.post("/vendors/:vendorService/list", async function (req, res) {
    let parameter = req.params.vendorService;
    const vendorService = _.startCase(parameter);
    var query = {}

    if (req.body.budget) {
        var budgetArr = req.body.budget.split(',');
        query = {
            'price.0': { $gte: budgetArr[0], $lte: budgetArr[1] }
        }
    }

    if (req.body.city) {
        query.city = req.body.city;
    }

    if (req.body.rating) {
        var ratingArr = req.body.rating.split(',');
        query.rating = { $gte: ratingArr[0], $lte: ratingArr[1] }
    }

    query.service = vendorService;

    let vendors;
    try {
        vendors = await Vendor.find(query);
    } catch (err) {
        console.log(err);
    }

    if (req.session.user) {
        res.render("vendorDisplayPage", { service: vendorService, vendors: vendors, currentUser: req.session.user, UserID: req.session.user._id });
    } else {
        res.render("vendorDisplayPage", { service: vendorService, vendors: vendors, currentUser: req.session.user });
    }

});

app.get("/vendors/:vendorService/list/:vendorId/getquote", sessionCheck, async function (req, res) {

    const requestedVendorId = req.params.vendorId;

    let item;
    try {
        item = await Vendor.findById(requestedVendorId);
    } catch (err) {
        console.log(err);
    }

    if (req.session.user) {
        res.render("vendorQuote", { currentUser: req.session.user, UserID: req.session.user._id, vendor: item });
    } else {
        res.render("vendorQuote", { currentUser: req.session.user });
    }

});

app.post("/vendors/:vendorService/list/:vendorId/getquote", async function (req, res) {
    // Event Info going in Vendor and User Dashboard

    const VendorId = req.params.vendorId;

    let item;
    try {
        item = await Vendor.findById(VendorId);
    } catch (err) {
        console.log(err);
    }

    var dataUser = {
        eventDate: req.body.eventDate,

        occasion: req.body.eventType,

        city: req.body.eventCity,

        vendorService: item.service,

        vendorName: item.title,

        requestStatus: "Pending",

        paymentStatus: false,

        vendorID: VendorId,

        userID: req.session.user
    };

    var dataVendor = {

        eventDate: req.body.eventDate,

        occasion: req.body.eventType,

        city: req.body.eventCity,

        customerName: req.body.name,

        customerEmail: req.body.mail,

        customerNumber: req.body.number,

        accepted: false,

        paymentStatus: false,

        userID: req.session.user,

        vendorID: VendorId
    };

    VendorDashboard.insertMany([dataVendor]);
    UserDashboard.insertMany([dataUser]);

    res.redirect("/");
});

// Blogs
app.get("/blogs", async function (req, res) {
    var blogsArr = await Blog.find({});
    res.render("blogPage", { blogs: blogsArr });
});

app.get("/blogs/:blogId", async function (req, res) {
    var blogId = req.params.blogId;
    var blog = await Blog.findById(blogId);

    res.render("blogContentPage", { blog: blog });
});

app.listen(3000, function () {
    console.log("Server started on port 3000");
});