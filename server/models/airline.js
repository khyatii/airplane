const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const airlineSchema = new Schema({
    name: { type: String, index: true },
    country: String,
    iata: String,
    icao: String,
});

const Airline = mongoose.model('Airline', airlineSchema);
module.exports = Airline;
