const Airline = require('../models/airline');

module.exports = {
  // customize: (req, res, next) => {
  //   const activeAirlines = [
  //     //airlines text goes here
  //
  //   ];
  //     activeAirlines.forEach((airlines) => {
  //       if(airlines.Y === "Y") {
  //         const airline = {
  //           name: airlines.Unknown,
  //           country: airlines["\\N"],
  //           iata: airlines["-"],
  //           icao: airlines["N/A"],
  //         };
  //         let newAirline = new Airline(airline);
  //         newAirline.save((err) => {
  //           if (err) return res.status(400).json(err);
  //           // console.log(newAirline.name);
  //         });
  //       }
  //
  //
  //
  //     });
  // }
};
