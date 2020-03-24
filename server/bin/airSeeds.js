const config = require('../config/config');
const mongoose = require('mongoose');
mongoose.connect(config.db);
const DBWorldAirports = require('../models/db-airports');


const World = [
  {
      "Countries": [
          {
              "CurrencyId": "AFN",
              "Regions": [],
              "Cities": [
                  {
                      "SingleAirportCity": true,
                      "Airports": [
                          {
                              "CityId": "BINA",
                              "CountryId": "AF",
                              "Location": "67.823611, 34.804167",
                              "Id": "BIN",
                              "Name": "Bamiyan"
                          }
                      ],
                      "CountryId": "AF",
                      "Location": "67.823611, 34.804167",
                      "IataCode": "BIN",
                      "Id": "BINA",
                      "Name": "Bamiyan"
                  },
                  {
                      "SingleAirportCity": true,
                      "Airports": [
                          {
                              "CityId": "BSTA",
                              "CountryId": "AF",
                              "Location": "64.366667, 31.55",
                              "Id": "BST",
                              "Name": "Bost"
                          }
                      ],
                      "CountryId": "AF",
                      "Location": "64.366667, 31.55",
                      "IataCode": "BST",
                      "Id": "BSTA",
                      "Name": "Bost"
                  },
              ]
          }
      ]
    }
];

DBWorldAirports.create(World, (err, sol) => {
  console.log(World);
  if (err) {
    console.log(err);
    throw err;
  }
  console.log('eo');

  sol.forEach((e) => {
  });
  mongoose.connection.close();
});
