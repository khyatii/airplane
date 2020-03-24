const User = require('../models/user');
const Claim = require("../models/claim");

module.exports = {
  checkPromoCode: (req, res, next) => {
    User.find({
      promoCode: req.body.promoCode
    }, (err, user) => {
      if (err) return res.status(400).json(err);
      else{
        if(user.length === 0) return res.status(400).json({message: "invalid promoCode"});
        else User.findOne({
            _id: req.body.userId
          }, (err, docs) => {
            if (err) return res.status(400).json(err);
            else{
              if(docs.usedPromoBefore) return res.status(400).json({message: "promoCode is only valid for the first claim"});
              else if(docs.promoCode === req.body.promoCode) return res.status(400).json({message: "you cannot user your own promoCode"});
              else User.update({
                    _id: req.body.userId
                  }, {
                    $set: {
                      usedPromoBefore: true
                    }
                  },
                  (err, docs) => {
                    if (err) return res.status(400).json(err);
                    else Claim.update({
                        _id: req.body.claim._id
                      }, {
                        $set: {
                          companyMoney: req.body.claim.companyMoney - 20,
                          userMoney: req.body.claim.userMoney + 10,
                          collaborator: {
                            money: 10,
                            promoCode: user[0]._id
                          }
                        }
                      }, (err, docs) => {
                          if (err) return res.status(400).json(err);
                          else return res.status(200).json({message: "you just won 10€"});
                        });
                  });
            }
          });
      }
    });
  },
  listUser: (req, res, next) => {
    let promosArray = [];
    Claim.find({
      collaborator: {
        money: 10,
        promoCode: req.user._id
      }
    })
    .populate('username')
    .exec(
    (err, docs) => {
      if (err) return res.status(400).json(err);
      else docs.forEach(e => {
        let promos = {
          status: e.status,
        };
        promosArray.push(promos);
      });
      return res.status(200).json(promosArray);
    });
  },
};
