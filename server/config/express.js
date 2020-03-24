const express = require('express');
const bodyParser = require('body-parser');
const logger = require('morgan');
const path = require('path');
const passport = require('passport');
const mongoose = require('mongoose');
const config = require('./config');
const session = require('express-session');
const flash = require('connect-flash');
const MongoStore = require('connect-mongo')(session);

module.exports = function (app) {

  mongoose.connect(config.db);

  app.set('views', config.rootPath + 'views');
  app.set('view engine', 'ejs');
  // uncomment after placing your favicon in /public
  //app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
  app.use(logger('dev'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use((req, res, next) => {
    //set headers to allow cross origin request.
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });
  app.use(session({
    secret: process.env.SESSION_SECRET,
    name: 'SSID',
    resave: true,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      //siempre false sino no funcionará el auth
      secure: false,
      //miliseconds
      maxAge: 12 * 30 * 24 * 60 * 60 * 1000
    },
    store: new MongoStore({
      mongooseConnection: mongoose.connection,
      //seconds
      ttl: 12 * 30 * 24 * 60 * 60
    })
  }));
  app.use(passport.initialize());
  app.use(passport.session());

  app.use((req, res, next) => {
    res.locals.user = req.user;
    res.locals.title = 'FlyAndClaim S.L.';
    next();
  });
  app.use(flash());
};
