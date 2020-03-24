const getDiscount = require('../utilities/get-discount');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  firstName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    trim: true, unique: true,
    match: /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
    required: true
  },
  password: {
    type: String,
    required: false
  },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  verifyUserToken: String,
  //verifyUserIdExpires: Date,
  isValid: {
    type: String,
    default: 'false',
    required: true
  },
  promoCode: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['USER', 'ADMIN'],
    default : 'USER'
  },
  adminSecret: {
    type: String,
  },
  idFront: {
    originalName: String,
    secureUrl: String,
    mimeType: String
  },
  idBack: {
    originalName: String,
    secureUrl: String,
    mimeType: String
  },
  address: {
    address: String,
    postalCode: String,
    city: String,
    country: String,
  },
  usedPromoBefore: {
    type: Boolean,
    required: false
  },
  facebookProvider: {
    type: {
      id: String,
      token: String
    },
    select: false
  },
  googleProvider: {
    type: {
      id: String,
      token: String
    },
    select: false
  },
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

userSchema.set('toJSON', {getters: true, virtuals: true});

userSchema.statics.upsertFbUser = function(accessToken, refreshToken, profile, cb) {

  var that = this;
  return this.findOne({
    'facebookProvider.id': profile.id
  }, (err, user) => {

    if (!user) {
      User.findOne({
        email: profile.emails[0].value
      }, '_id', (err, foundUser) => {
        if (foundUser) return cb({message: 'E-mail, fb login, already exists'}, user);
        else {
            getDiscount(User)
            .then(promoCode => {
              var newUser = new that({
                firstName: profile.displayName,
                email: profile.emails[0].value,
                promoCode,
                facebookProvider: {
                  id: profile.id,
                  token: accessToken
                }
              });

            newUser.save((error, savedUser) => {
              if (error) return error;
              return cb(error, savedUser);
            });
          });
        }
      });
    } else {
      return cb(err, user);
    }
  });
};

userSchema.statics.upsertGoogleUser = function(accessToken, refreshToken, profile, cb) {

  var that = this;
  return this.findOne({
    'googleProvider.id': profile.id
  }, (err, user) => {


    if (!user) {
      User.findOne({
        email: profile.emails[0].value
      }, '_id', (err, foundUser) => {
        if (foundUser) return cb({message: 'E-mail, google login, already exists'}, user);
        else {
          getDiscount(User)
          .then(promoCode => {
            var newUser = new that({
              firstName: profile.displayName,
              email: profile.emails[0].value,
              promoCode,
              googleProvider: {
                id: profile.id,
                token: accessToken
              }
            });

            newUser.save((error, savedUser) => {
              if (error) return error;
              return cb(error, savedUser);
            });
          });
        }
      });
    } else {
      return cb(err, user);
    }
  });
};

const User = mongoose.model('User', userSchema);
module.exports = User;
