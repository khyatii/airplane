const dotenv = require('dotenv').config();
const path = require('path');
const rootPath = path.normalize(__dirname+'/../');

module.exports = {
  db: process.env.MONGO_DB_URLLOCAL,
  rootPath: rootPath
};
