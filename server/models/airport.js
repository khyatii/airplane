const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const airportSchema = new Schema({
    name: { type: String, index: true },
    //longitude first
    //latittude second
    location: [Number],
    continent: String,
    country: String,
});

const Airport = mongoose.model('Airport', airportSchema);
module.exports = Airport;
