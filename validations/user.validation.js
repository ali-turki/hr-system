'use strict';
const {
  body
} = require('express-validator/check');
const User = require('../models/user');

module.exports = {
  createNewuser: () => {
    return [
      body('username')
      .exists()
      .custom((value) => /^[a-zA-Z0-9]+$/.test(value))
      .custom(value => {
        return User.findOne({
            username: value
          })
          .then(user => {
            if (user)
              return Promise.reject('Username is already in use.');
          });
      }),
      body('name')
      .exists()
      .custom(value => /^[a-zA-Z ]+$/.test(value)),
      body('email')
      .exists()
      .isEmail()
      .custom(value => {
        return User.findOne({
            email: value
          })
          .then(user => {
            if (user)
              return Promise.reject('Email is already in use.');
          });
      }),
    ];
  },
  login: () => {
    return [
      body('username')
      .exists(),
      body('password')
      .exists()
    ];
  },
  isAdmin: () => {
    return body('isAdmin').exists().isBoolean();
  }
};