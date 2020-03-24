const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const DBWorldAirportSchema = new Schema({
  "Continents": [
    {
      Countries: [
        {
          CurrencyId : String,
          LanguageId: String,
          Regions: [
              {
                CountryId: String,
                Id: String,
                Name: String,
              }
          ],
          Cities: [
            {
              SingleAirportCity: Boolean,
              Airports: [
                {
                  CityId: String,
                  CountryId: String,
                  RegionId: String,
                  "Location": String, // here comes the coordinates about the aiport
                  Id: String,
                  Name: String,
                }
              ],
              CountryId: String,
              RegionId: String,
              "Location": String, // here comes the coordinates about the city in which the aiport is situated
              IataCode: String,
              Id: String,
              Name: String,
            }
          ],
          Id: String,
          Name: String,      //country name
      }
    ],
    Id: String,
    Name: String,  // continent name
    }
  ]
});


const DBWorldAirports = mongoose.model('DBWorldAirports', DBWorldAirportSchema);
module.exports = DBWorldAirports;
