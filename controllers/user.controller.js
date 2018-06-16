const {
  validationErrorsHandler
} = require('../helpers/handleErrors');
const User = require('../models/user');
const {
  pick
} = require('lodash');
const jwt = require('jsonwebtoken');
const config = require('../config/index');

module.exports.create = (req, res, next) => {
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
};

/**
 * @api {post} /user login
 * @apiGroup User
 * @apiHeader (Headers) {Object} Content-Type Request format.
 * @apiHeaderExample {json} Headers-Example:
 *  {
 *    "Content-Type": "Content-Type: application/json"
 *  }
 * @apiParam {String} username A unique username.
 * @apiParam {String} password The user's login password.
 * @apiParamExample {json} Request-Example:
 *  {
 *    "username": "ali",
 *    "password": "123456789"
 *  }
 * @apiSuccess {String} token The logged in user token.
 * @apiSuccessExample {json} Success-Response:
 *  HTTP/1.1 200 OK
 *  {
 *    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiI1YjI0ODM0NTE1NTUxZjU2ODU4MzQ0ZDQiLCJpYXQiOjE1MjkxMTk3MjV9.V4PC8Xr0kMr4OFq59mPS3EvcEMa9aAKtZvltKSa3b2o"
 *  }
 * @apiError Invalid-data the <code>username</code> and <code>password</code> are invalid.
 * @apiErrorExample {json} Response-Error-Example:
 *  HTTP/1.1 401 unauthenticated
 * @apiError (400) ValidationError the username and password are required.
 * @apiErrorExample {json} Response-Validation-Example:
 *  HTTP/1.1 400 Bad Request
 *{
 *  "errors": [
 *   {
 *     "location": "body",
 *     "param": "password",
 *     "msg": "Invalid value"
 *    }
 *   ]
}
 */
module.exports.login = (req, res, next) => {
  validationErrorsHandler(req, res);
  User.findOne({username: req.body.username}, (err, user) => {
    if (err) return next(err);
    if (!user) res.sendStatus(401);
    user.comparePassword(req.body.password, (err, isMatch) => {
      if (err) return next(err);
      if (!isMatch) res.sendStatus(401);
      jwt.sign({uid: user._id}, config.JWT.SECRET, (err, token) => {
        res.status(200).json({token: token});
      });
    });
  });

};