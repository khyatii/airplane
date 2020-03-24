const express = require('express');
const favicon = require('serve-favicon');
const passport = require('passport');
const bcrypt = require("bcrypt");
const path = require('path');
const db = require('./config/config');

require('dotenv').load();

const app = express();

require('./config/passport')(passport);
require('./config/express')(app);
require('./config/cors')(app);

app.use(express.static(path.join(__dirname, 'public')));

const auth = require('./routes/auth');
const claim = require('./routes/claim-routes');
const airport = require('./routes/airport');
const airline = require('./routes/airline');
const promoCode = require('./routes/promoCode');
const admin = require('./routes/admin');
// const DBAirportCreation = require('./routes/db-airport-creation');
// const DBAirlineCreation = require('./routes/db-airline-creation');


app.use('/', auth);
app.use('/airport', airport);
app.use('/airline', airline);
app.use('/claim', claim);
app.use('/promocode', promoCode);
app.use('/admin', admin);

// app.use('/airport/create', DBAirportCreation);
// app.use('/airline/create', DBAirlineCreation);


app.use((req, res, next) => {
  res.sendFile(__dirname + '/public/index.html');
});


require('./config/error-handler')(app);
module.exports = app;
