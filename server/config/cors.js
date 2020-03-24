const cors = require('cors');

module.exports = function(app) {
  const whitelist = ['http://localhost:4200'];
  let corsOptions = {
    origin: function(origin, callback) {
      let originIsWhitelisted = whitelist.indexOf(origin) !== -1;
      callback(null, originIsWhitelisted);
    },
    credentials: true,
    exposedHeaders: ['x-auth-token']
  };
  app.use(cors(corsOptions));
};
