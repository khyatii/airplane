const Airport = require('../models/airport');

module.exports = {
  // customize: (req, res, next) => {
  //     const docs =      [
  //       //here airports.txt
  //
  //     ];
  //
  //   docs.forEach((continents) => {
  //     const airport = {
  //       continent: continents.Name,
  //     };
  //     continents.Countries.forEach((countries) => {
  //       airport.country = countries.Name;
  //       countries.Cities.forEach((cities) => {
  //         cities.Airports.forEach((airports) => {
  //             airport.name = airports.Name + ', [' + airports.Id + ']';
  //             var name = [];
  //             var bracket = true;
  //             for(var i=0; i<airports.Location.length; i++){
  //               if(bracket) {
  //                 name.push(airports.Location[i]);
  //                 if(airports.Location[i] === ','){
  //                   bracket = false;
  //                 }
  //               }
  //             }
  //             var longitude = parseFloat(name.toString().replace(/,/g , ''));
  //             var name1 = [];
  //             var bracket1 = false;
  //             for(var y=0; y<airports.Location.length; y++){
  //               if(bracket1) {
  //                 name1.push(airports.Location[y]);
  //               } else {
  //                 if(airports.Location[y] === ','){
  //                   bracket1 = true;
  //                 }
  //               }
  //             }
  //             var latitude = parseFloat(name1.toString().replace(/,/g , ''));
  //             airport.location = [latitude, longitude];
  //             let newAirport = new Airport(airport);
  //             newAirport.save((err) => {
  //               if (err) return res.status(400).json(err);
  //               console.log(newAirport);
  //             });
  //         });
  //       });
  //     });
  //   });
  // },
};
