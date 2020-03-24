const passport = require('passport');
const bcrypt = require('bcrypt');
const async = require('async');
const crypto = require('crypto');
const getDiscount = require('../utilities/get-discount');
const spliceMime = require('../utilities/mime-type-splice');
const User = require('../models/user');
const nodemailer = require('nodemailer');
const transporter = require('../config/mailconfig');
const clientUrl = require('../config/url').clientUrl;

module.exports = {
  //remember withCredentials
  isAuthenticated: (req, res, next) => {
    if (req.isAuthenticated()) next();
    else return res.status(401).json({ message: 'Unauthorized, please log in' });
  },
  session24H: (req, res, next) => {
    let sessionTime = 8640 - (Math.abs(new Date() - req.session.cookie._expires) / (1000 * 60 * 60));
    if (sessionTime < 3) next();//solo para dni para cuenta bancaria siempre poner contraseña
    else if (req.isAuthenticated()) return res.status(408).json({ message: 'Please submit password to continue' });
    return res.status(401).json({ message: 'Unauthorized' });
  },
  session1M: (req, res, next) => {
    let sessionTime = 8340 - Math.abs(new Date() - req.session.cookie._expires) / (1000 * 60 * 60);
    if (sessionTime < 720) next();//solo para dni para cuenta bancaria siempre poner contraseña
    else if (req.isAuthenticated()) return res.status(408).json({ message: 'Please submit password to continue' });
    return res.status(401).json({ message: 'Unauthorized' });
  },
  signup: (req, res, next) => {
    const {
      firstName,
      email,
      password
    } = req.body;
    async.waterfall([
      function (done) {
        crypto.randomBytes(48, function (err, buf) {
          var token = buf.toString('hex');
          done(err, token);
        });
      },
      function (token, done) {
        User.findOne({
          email
        }, '_id', (err, foundUser) => {
          if (foundUser) return res.status(400).json({ message: 'This e-mail already exists' });
          else {
            getDiscount(User)
              .then(promoCode => {
                const salt = bcrypt.genSaltSync(10);
                const hashPass = bcrypt.hashSync(password, salt);

                const newUser = new User({
                  firstName,
                  email,
                  promoCode,
                  password: hashPass,
                  verifyUserToken: token
                });

                newUser.save((err) => {
                  if (err) return res.status(400).json({ message: 'Something went wrong' });
                  req.login(newUser, (err) => {
                    if (err) return res.status(500).json({
                      message: 'Something went wrong'
                    });
                    done(err, token, newUser);
                    return res.status(200).json(newUser);
                  });
                });
              });
          }
        });
      },
      function (token, newUser, done) {
        nodemailer.createTestAccount((err, account) => {
          var mailOptions = {
            from: '"Fly&Claim " <rxzone@gmail.com>',
            to: req.body.email,
            subject: ' Welcome to FLYANDCLAIM!',
            attachments: [{
              filename: 'fly.png',
              path: clientUrl + '/assets/web-icons/fly.png',
              cid: 'abcdse@gm.com' //same cid value as in the html img src
            }],
            html: `<div class="container" style="font-family: Montserrat;color: #727c8f;font-size: 17px;">
              <div class="row" style="margin-top:1em;width: calc(50% + 150px); margin: auto">
              <div class="col-lg-2 col-sm-1 col-xs-1"></div>
                <div class="col-lg-8 col-sm-10 col-xs-10" style="">
                  <center><a href="https://www.flyandclaim.com"><img src="cid:abcdse@gm.com" style="width: 90px;margin-top:1em;"></a></center>
                  <hr style="margin-top:1em;border: 0.4px solid #727c8f;">
                  <div>
                    <p>Hello ${newUser.firstName},</p>
                     <p>Thank you for registering at FLYANDCLAIM.COM!<br>
                     Confirm your email (${req.body.email}) by clicking below:</p><br>
                     <center><a href= ${clientUrl}/confirmLogin?link=${token}>
                     <button style="background-color: #0052CC;font-family: Montserrat;color: white;cursor: pointer;font-weight: 600;margin: 0 2% 0 0;height: auto;border-radius: 4px;border: none;font-size: 17.5px; padding: 7px 15px;">
                     Confirm my email</button></a></center>
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
          };
          transporter.sendMail(mailOptions, function (err, information) {
            if (err) {
            }
            res.status(200).send({ message: "success" })
          })
        });


        nodemailer.createTestAccount((err, account) => {
          var mailOptions = {
            from: '"Fly&Claim " <rxzone@gmail.com>',
            to: req.body.email,
            subject: 'Calculate compensation',
            attachments: [{
              filename: 'fly.png',
              path: clientUrl + '/assets/web-icons/fly.png',
              cid: 'abcdse@gm.com' //same cid value as in the html img src
            }],
            html: `<div class="container" style="font-family: Montserrat;color: #727c8f;font-size: 17px;">
            <div class="row" style="margin-top:1em;width: calc(50% + 150px); margin: auto">
               <div class="col-lg-2 col-sm-1 col-xs-1"></div>
                  <div class="col-lg-8 col-sm-10 col-xs-10" style="">
                    <center><a href="https://www.flyandclaim.com"><img src="cid:abcdse@gm.com" style="width: 90px;margin-top:1em;"></a></center>
                    <hr style="margin-top:1em;border: 0.4px solid #727c8f;">
                    <div>
                      <p>Hello ${newUser.firstName},</p>
                      <p>Thank you for registering in Fly & Claim! It will cost you a minute to claim your flight, it's very easy!</p><br>
                      <center><a href= ${clientUrl}/claim>
                      <button style="background-color: #0052CC;font-family: Montserrat;color: white;cursor: pointer;font-weight: 600;margin: 0 2% 0 0;height: auto;border-radius: 4px;border: none;font-size: 17.5px; padding: 7px 15px;">
                      CALCULATE COMPENSATION</button></a></center>
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
          };
          transporter.sendMail(mailOptions, function (err, information) {
            if (err) {
            }
            res.status(200).send({ message: "success" })
          })
        });

      }

    ])
  },

  forgotPassword: (req, res, next) => {

    async.waterfall([
      function (done) {
        crypto.randomBytes(48, function (err, buf) {
          var token = buf.toString('hex');
          done(err, token);
        });
      },
      function (token, done) {
        User.findOne({ email: req.body.email }, function (err, user) {
          if (!user) {
            req.flash('error', 'No account with that email address exists.');
            return res.status(404).json({ message: 'Not Found' });

          }
          if (user.length == 0) {
            return res.status(404).json({ message: 'Not Found' });
          }

          user.resetPasswordToken = token;
          user.resetPasswordExpires = Date.now() + 1800000; // 30 min

          user.save(function (err) {
            done(err, token, user);
          });
        });
      },
      function (token, user, done) {

        nodemailer.createTestAccount((err, account) => {
          var mailOptions = {
            from: '"Fly&Claim " <rxzone@gmail.com>',
            to: req.body.email,
            subject: 'Forgot Password',
            attachments: [{
              filename: 'fly.png',
              path: clientUrl + '/assets/web-icons/fly.png',
              cid: 'abcdse@gm.com' //same cid value as in the html img src
            }],
            html: `
              <div class="container" style="font-family: Montserrat;color: #727c8f;font-size: 17px;">
              <div class="row" style="margin-top:1em;width: calc(50% + 150px); margin: auto">
                 <div class="col-lg-2 col-sm-1 col-xs-1"></div>
                 <div class="col-lg-8 col-sm-10 col-xs-10" style="">
                   <center><a href="https://www.flyandclaim.com"><img src="cid:abcdse@gm.com" style="width: 90px;margin-top:1em;"/></a></center>
                   <hr style="margin-top:1em;border: 0.4px solid #727c8f;">
                   <div>
                     <p>Hello ${user.firstName},</p>
                     <p style="line-height: 1.2">We have received a request to reset the password.<br><br>
                     If you were not the one who send the request, please ignore the message.<br>
                     Otherwise, you can restore it through this button:</p><br>
                     <center><a href= ${clientUrl}/setPassword?link=${token}><button style="background-color: #0052CC;font-family: Montserrat;color: white;cursor: pointer;font-weight: 700;margin: 0 2% 0 0;height: auto;border-radius: 4px;border: none;font-size: 17.5px; padding: 7px 15px;">
                     Restore Password</button></a></center>
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

          };

          transporter.sendMail(mailOptions, function (err, information) {
            if (err) {
            }
            return res.status(200).json({ message: 'Success' });
          })
        });
      }
    ]
    )

  },

  setPassword: (req, res, next) => {
    async.waterfall([
      function (done) {
        User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function (err, user) {
          if (!user) {
            req.flash('error', 'Password reset token is invalid or has expired.');
            return res.status(404).send({ message: "not found" })
          }
          const salt = bcrypt.genSaltSync(10);
          const hashPass = bcrypt.hashSync(req.body.password, salt);

          user.password = hashPass;
          user.resetPasswordToken = undefined;
          user.resetPasswordExpires = undefined;

          user.save(function (err) {
            req.login(user, function (err) {
              return res.status(200).json(user);
            });
          });
        });
      },
    ], function (err) {
      res.redirect('/');
    });
  },

  checkTokenExpire: (req, res, next) => {
    async.waterfall([
      function (done) {
        User.findOne({ resetPasswordToken: req.params.token }, function (err, user) {
          if (!user) {
            req.flash('error', 'Password reset token has expired.');
            return res.status(404).send({ message: "not found" })
          }
          else {
            return res.status(200).send({ message: "Password token has not expired" });
          }
        });
      },
    ], function (err) {
      res.redirect('/');
    });
  },

  checkTokenExpireLogin: (req, res, next) => {
    console.log("eeee", req.body)
    async.waterfall([
      function (done) {
        User.findOne({ verifyUserToken: req.params.token }, function (err, user) {
          if (!user) {
            req.flash('error', 'Email token is invalid or has expired');
            return res.status(404).send({ message: "not found" })
          }
          else {
            user.verifyUserToken = undefined;
            user.isValid = 'true';
            user.save((err) => {
              if (err) {
                return res.status(400).json({ message: 'Something went wrong' });
              }
              req.login(user, function (err) {
                return res.status(200).send(user);
              })
            })
          }
        });
      },
    ], function (err) {
      res.redirect('/');
    });
  },

  // confirmLogin: (req, res, next) => {
  //   async.waterfall([
  //     function (done) {
  //       User.findOne({ verifyUserToken: req.params.token }, function (err, users) {
  //         if (!users) {
  //           req.flash('error', 'Email token is invalid.');
  //           return res.status(404).send({ message: "not found" })
  //         }
  //         users.verifyUserToken = undefined;
  //         users.isValid = 'true';
  //         users.save((err) => {
  //           if (err) {
  //             return res.status(400).json({ message: 'Something went wrong' });
  //           }
  //           req.login(users, (err) => {
  //             if (err) {
  //               return res.status(500).json({ message: 'Something went wrong' });
  //             }
  //             // done(err, users);
  //             return res.status(200).json(users);
  //           });
  //         });
  //       });
  //     },
  //   ], function (err) {
  //     res.redirect('/user');
  //   });

  // },

  login: (req, res, next) => {
    passport.authenticate('local', (err, user, failureDetails) => {
      if (err) return res.status(500).json({ message: 'Something went wrong' });
      if (!user) {
        // if (failureDetails.message == "InvalidUser") {
        //   return res.status(404).json(failureDetails);
        // }
        return res.status(401).json(failureDetails);
      }
      req.login(user, (err) => {
        if (err) return res.status(500).json({ message: 'Something went wrong' });
        return res.status(200).json(req.user);
      });
    })(req, res, next);
  },
  fbSignup: (req, res, next) => {
    passport.authenticate('facebook-token', { session: true }, (err, user, failureDetails) => {
      if (err) return res.status(400).json(err);
      if (!user) return res.status(401).json(failureDetails);

      req.login(user, (err) => {
        if (err) return res.status(500).json({ message: 'Something went wrong' });
        return res.status(200).json(req.user);
      });
    })(req, res, next);
  },
  googleSignup: (req, res, next) => {
    passport.authenticate('google-token', { session: true }, (err, user, failureDetails) => {
      if (err) return res.status(400).json(err);
      console.log("user", user);
      console.log("faliye", failureDetails)
      if (!user) return res.status(401).json(failureDetails);

      req.login(user, (err) => {
        if (err) return res.status(500).json({ message: 'Something went wrong' });
        return res.status(200).json(req.user);
      });
    })(req, res, next);
  },
  logout: (req, res, next) => {
    req.logout();
    return res.status(200).json({});
  },
  loggedin: (req, res, next) => {
    if (req.isAuthenticated()) return res.status(200).json(req.user);
    else return res.status(401).json({ message: 'Unauthorized' });
  },
  idFrontUpload: (req, res, next) => {
    let mime = spliceMime(req.file.mimetype);
    User.update({
      _id: req.body.id
    }, {
        $set: {
          idFront: {
            originalName: req.file.originalname,
            secureUrl: req.file.secure_url,
            mimeType: mime
          }
        }
      },
      (err, docs) => {
        if (err) return res.status(400).json(err);
        else return res.status(200).json(docs);
      });
  },
  idBackUpload: (req, res, next) => {
    let mime = spliceMime(req.file.mimetype);
    User.update({
      _id: req.body.id
    }, {
        $set: {
          idBack: {
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
  addressUpload: (req, res, next) => {
    User.update({
      _id: req.user._id
    }, {
        $set: {
          address: {
            address: req.body.address,
            postalCode: req.body.postalCode,
            city: req.body.city,
            country: req.body.country,
          }
        }
      },
      (err, docs) => {
        if (err) return res.status(400).json(err);
        else return res.status(200).json(docs);
      });
  },
};
