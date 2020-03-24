const Airline = require('../models/airline');

module.exports = {
  autocomplete: (req, res, next) => {
    const regularExp = req.body.regularExp;
    Airline.find({"name" : { $regex: regularExp, $options: 'i' }})
     .limit(50)
     .exec((err, docs) => {
       if (err) return res.status(400).json(err);
       return res.status(200).json(docs);
      });
  },
  find: (req, res, next) => {
    const inputValue = req.body.inputValue;
    Airline.find({"name": inputValue})
     .exec((err, docs) => {
       if (err) return res.status(400).json(err);
       return res.status(200).json(docs);
      });
  }
};
