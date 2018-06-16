const mongoose = require('mongoose');
const bycrpt = require('bcrypt');
const Schema = mongoose.Schema;
const config = require('../config');

function hashPassword(plaintextPassword, cb) {
  bycrpt.hash(plaintextPassword, config.BYCRPT.SALT_ROUNDS, (err, hashedPasswored) => {
    if (err) return cb(err);
    cb(null, hashedPasswored);
  });
}
const UserSchema = new Schema({
  username: {
    required: true,
    type: String
  },
  password: {
    default: null,
    type: String
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    default: null
  },
  title: {
    type: String,
    default: null
  },
  sallary: {
    type: String,
    default: null
  },
  addedBy: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'User',
    default: null
  },
  updateddBy: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'User',
    default: null
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: String
  },
  updateAt: {
    type: String
  }
});


// Hashing the new passwords before save
UserSchema.pre('save', function (next) {

  let time = new Date();
  this.updateAt = time;
  if (this.isNew) {
    this.createdAt = time;
  }
  // check whether this is a new record and has not entered a password
  if (this.isNew && !this.password) {
    this.password = config.USER.DEFAULT_PASSWORD;
  }
  if (this.isModified('password')) {
    hashPassword(this.password, (err, hash) => {
      if (err) return next(err);
      this.password = hash;
      next();
    });
  } else {
    next();
  }
});

// add custom method to compare the hashed password
UserSchema.methods.comparePassword = function (plaintextPassword, cb) {
  return bycrpt.compare(plaintextPassword, this.password, (err, isMatch) => {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

module.exports = mongoose.model('User', UserSchema);