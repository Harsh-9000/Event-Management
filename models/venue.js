const mongoose = require('mongoose');

const venueSchema = new mongoose.Schema({
  venue_name: String,

  venue_address: String,

  venue_city: String,

  owner_name: String,

  owner_number: Number,

  owner_email: {
    type: String,
    unique: true
  },

  owner_password: String,

  space: [String],

  isVenue: {
    type: Boolean,
    default: true
  }

});

const Venue = mongoose.model('Venue', venueSchema);

module.exports = Venue;