const Airport = require('../models/airport');

module.exports = {
  autocomplete: (req, res, next) => {
    const regularExp = req.body.regularExp;
    Airport.find({"name" : { $regex: regularExp, $options: 'i' }})
     .limit(50)
     .exec((err, docs) => {
       if (err) return res.status(400).json(err);
       return res.status(200).json(docs);
      });
  },
  find: (req, res, next) => {
    const inputValue = req.body.inputValue;
    Airport.find({"name": inputValue})
     .exec((err, docs) => {
       if (err) return res.status(400).json(err);
       return res.status(200).json(docs);
      });
  }
};
