const Claim = require("../models/claim");
const User = require('../models/user');
const getCompensation = require('../utilities/get-compensation');
const spliceMime = require('../utilities/mime-type-splice');
const nodemailer = require('nodemailer');
const transporter = require('../config/mailconfig');
const clientUrl = require('../config/url').clientUrl;

module.exports = {

  new: (req, res, next) => {
    let money = getCompensation(req.body);
    let data = {
      companyMoney: money * 0.25,
      userMoney: money * 0.75,
      username: req.user._id,
      claimType: req.body.claimType,
      airline: req.body.airline,
      airports: req.body.airports,
    };

    let newClaim = new Claim(data);

    newClaim.save((err) => {
      if (err) return res.status(400).json(err);
      else return res.status(200).json(newClaim);
    });
  },
  calculate: (req, res, next) => {
    let money = getCompensation(req.body);
    let data = {
      companyMoney: money * 0.25,
      userMoney: money * 0.75,
      claimType: req.body.claimType,
      airline: req.body.airline,
      airports: req.body.airports,
    };
    return res.status(200).json(data);
  },
  userList: (req, res, next) => {
    Claim.find({
      username: req.user._id
    })
      .populate('username')
      .populate('airports')
      .exec((err, docs) => {
        if (err) return res.status(400).json(err);
        else {
          return res.status(200).json(docs);
        }
      });
  },
  companyClaim: (req, res, next) => {
    let mime = spliceMime(req.file.mimetype);
    Claim.update({
      _id: req.body.id
    }, {
        $set: {
          companyClaim: {
            originalName: req.file.originalname,
            secureUrl: req.file.secure_url,
            mimeType: mime
          }
        }
      },
      (err, docs) => {
        if (err) return res.status(400).json(err);
        return res.status(200).json(docs);
      });
  },
  reservationOrTicket: (req, res, next) => {
    let mime = spliceMime(req.file.mimetype);
    Claim.update({
      _id: req.body.id
    }, {
        $set: {
          flightTicketOrReservation: {
            originalName: req.file.originalname,
            secureUrl: req.file.secure_url,
            mimeType: mime
          }
        }
      },
      (err, docs) => {
        if (err) return res.status(400).json(err);
        return res.status(200).json(docs);
      });
  },
  boardingPass: (req, res, next) => {
    let mime = spliceMime(req.file.mimetype);
    Claim.update({
      _id: req.body.id
    }, {
        $set: {
          boardingPass: {
            originalName: req.file.originalname,
            secureUrl: req.file.secure_url,
            mimeType: mime
          }
        }
      },
      (err, docs) => {
        if (err) return res.status(400).json(err);
        return res.status(200).json(docs);
      });
  },
  update: (req, res, next) => {
    Claim.update({
      _id: req.body.id
    }, {
        $set: {
          incidentAirport: req.body.incidentAirport,
          year: req.body.year,
          description: req.body.description
        }
      }, (err, docs) => {
        if (err) return res.status(400).json(err);
        else {

          Claim.find({ _id: req.body.id })
            .populate('username')
            .populate('airline')
            .exec(function (err, result) {
              if (err) return res.status(400).json(err);
              else {
                //Completed Claim
                if (result[0].idFront && result[0].address && result[0].incidentAirport && result[0].year && (result[0].flightTicketOrReservation || result[0].boardingPass)) {
                  if (result[0].username.address.address && result[0].username.address.postalCode && result[0].username.address.city && result[0].username.address.country) {
                    return res.status(200).json(docs);
                  }
                } else {
                  //Pending Claim
                  var collaboratorMoney;
                  if (result[0].collaborator.money !== undefined) collaboratorMoney = result[0].collaborator.money;
                  else collaboratorMoney = 0

                  const sum = result[0].userMoney + collaboratorMoney + result[0].companyMoney;
                  const subject = 'COMPLETE YOUR ' + sum + '€ CLAIM AT FLYANDCLAIM.COM';
                  const html = `<div class="container" style="font-family: Montserrat;color: #727c8f;font-size: 17px;">
                                <div class="row" style="margin-top:1em;width: calc(50% + 150px); margin: auto">
                                <div class="col-lg-2 col-sm-1 col-xs-1"></div>
                                  <div class="col-lg-8 col-sm-10 col-xs-10" style="">
                                    <center><a href="https://www.flyandclaim.com"><img src="cid:abcdse@gm.com" style="width: 90px;margin-top:1em;;"></a></center>
                                    <hr style="margin-top:1em;border: 0.4px solid #727c8f;">
                                    <div>
                                      <p>Hello ${result[0].username.firstName},</p>
                                      <p style="line-height: 1.2">
                                      You have initiated your claim for a ${result[0].claimType} on our website.
                                      So that we can start processing your ${sum}€ compensation in Fly & Claim,
                                      we need you to complete the corresponding form. Do it by clicking below:</p><br>
                                      <center><a href= ${clientUrl}/claim><button style="background-color: #0052CC;font-family: Montserrat;color: white;cursor: pointer;font-weight: 700;margin: 0 2% 0 0;height: auto;border-radius: 4px;border: none;font-size: 17.5px; padding: 7px 15px;">
                                      Complete Claim</button></a></center>
                      
                                      <p style="margin-top: 1em;">We remain at your disposal.<br>Thank you,</p>
                                      <p>The Fly&Claim Team</p>
                                    </div>
                                    <hr style="margin-top:1em;border: 0.4px solid #727c8f;">
                                    <center style="margin-top:2em; line-height: 1.2;font-size:13px">
                                    <p style="margin:0"><span style="display:inline-flex;padding-right:140px;"><a style="text-decoration: none;color: #727c8f" href="https://www.flyandclaim.com/contact">Contact</a></span>
                                    <span><a style="text-decoration: none;color: #727c8f" href="https://www.flyandclaim.com/privacy">Privacy Policy</a></span></p>
                                    <p>Copyright &copy; FLYANDCLAIM SLU 2018</p>
                                    <p>This message was sent by Fly&Claim</p>
                                      <a href="https://www.flyandclaim.com"><img src="cid:abcdse@gm.com" style="width: 50px;"></a>
                                    </center>
                                  </div>
                                  <div class="col-lg-2 col-sm-1 col-xs-1"></div>
                                </div>
                              </div>`
                  nodemailer.createTestAccount((err, account) => {
                    var mailOptions = {
                      from: '"Fly&Claim " <rxzone@gmail.com>',
                      to: result[0].username.email,
                      subject: subject,
                      attachments: [{
                        filename: 'fly.png',
                        path: clientUrl + '/assets/web-icons/fly.png',
                        cid: 'abcdse@gm.com' //same cid value as in the html img src
                      }],
                      html: html
                    };
                    transporter.sendMail(mailOptions, function (err, information) {
                      if (err) return res.status(404).json(err);
                      else {
                        return res.status(200).json(docs);
                      }
                    })
                  });
                }
              }
            });
        }
      });
  },
  findById: (req, res, next) => {
    Claim.findById(req.body.id)
      .populate('username')
      .populate('airports')
      .exec(
        (err, docs) => {
          if (err) return res.status(400).json(err);
          return res.status(200).json(docs);
        });
  },
};
