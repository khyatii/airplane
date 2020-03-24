const dotenv = require('dotenv').config();
const config = require('../config/config');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
mongoose.connect(config.db);
const User = require('../models/user');

const salt = bcrypt.genSaltSync(10);
const hashPass = bcrypt.hashSync(process.env.ADMIN_PASSWORD, salt);

const Admin = [{
  firstName: 'Fernando',
  email: 'f.rodriguez.hervias@gmail.com',
  password: hashPass,
  promoCode: 'none',
  role: 'ADMIN',
}];

User.create(Admin, (err, sol) => {
  if (err) {
    throw err;
  }

  sol.forEach((e) => {
  });
  mongoose.connection.close();
});
