const {
  validationErrorsHandler
} = require('../helpers/handleErrors');
const User = require('../models/user');
const {
  pick
} = require('lodash');
module.exports = {
  create: (req, res, next) => {
    validationErrorsHandler(req, res);
    const userFields = Object.keys(User.schema.paths);
    const requestBody = pick(req.body, userFields);
    const newUser = new User(requestBody);
    newUser.save()
      .then(result => {
        res.json(result);
      })
      .catch(err => {
        return next(err);
      });
  }

};