const passport = require("passport");
const LocalStrategy = require('passport-local').Strategy;
const FacebookTokenStrategy = require('passport-facebook-token');
const GoogleTokenStrategy = require('passport-google-token').Strategy;
const bcrypt = require('bcrypt');
const User = require('../models/user');
const dotenv = require("dotenv").load();

module.exports = function(passport) {

  //standard login
  passport.use(new LocalStrategy({
    usernameField: 'email',
  },(email, password, next) => {
    User.findOne({
      email
    }, (err, foundUser) => {
      if (err) {
        next(err);
        return;
      }

      if (!foundUser) {
        next(null, false, {
          message: 'Unauthorised User'
        });
        return;
      }
      if (!bcrypt.compareSync(password, foundUser.password)) {
        next(null, false, {
          message: 'Incorrect Password'
        });
        return;
      }
      // else {
       // if(foundUser.isValid == "true"){
          next(null, foundUser);
        //}
        // else {
        //   next(null, false, {
        //     message: 'InvalidUser'
        //   });
        // }
        return;
      // }
      
    });
  }));

  passport.serializeUser((loggedInUser, cb) => {
    cb(null, loggedInUser._id);
  });

  passport.deserializeUser((userIdFromSession, cb) => {
    User.findById(userIdFromSession, (err, userDocument) => {
      if (err) {
        cb(err);
        return;
      }

      cb(null, userDocument);
    });
  });

  //facebook login
  passport.use(new FacebookTokenStrategy({
      clientID: '726042150925672',
      clientSecret: process.env.FB_SECRET
    },
    function(accessToken, refreshToken, profile, done) {
      User.upsertFbUser(accessToken, refreshToken, profile, (err, user) => {
        return done(err, user);
      });
    }));

  passport.use(new GoogleTokenStrategy({
      clientID: '766486881645-j0g1rttu1t8obljmmdmrqf96l664ou9g.apps.googleusercontent.com',
      clientSecret: process.env.GOOGLE_SECRET
    },
    function(accessToken, refreshToken, profile, done) {
      User.upsertGoogleUser(accessToken, refreshToken, profile, (err, user) => {
        return done(err, user);
      });
    }
  ));
};
