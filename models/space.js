const mongoose = require('mongoose');

const spaceSchema = new mongoose.Schema({
  id: {
    type: String,
    unique: true
  },

  space_type: {
    type: String
  },

  veg_price: Number,

  non_veg_price: Number,

  images: [{
    type: String
  }],

  no_of_rooms: Number,

  capacity: String,

  room_price: Number,

  about: String,

  facility_available: [{ type: String }],

  venue_name: String,

  venue_address: String,

  owner_number: Number
});

const Space = mongoose.model('Space', spaceSchema);

module.exports = Space;