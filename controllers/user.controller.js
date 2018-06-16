const {
  isValidRequest
} = require('../helpers/handleErrors');
const User = require('../models/user');
const {
  pick
} = require('lodash');
const jwt = require('jsonwebtoken');
const config = require('../config/index');

/**
 * @api {post} /user Add new user
 * @apiGroup User
 * @apiPermission Admin
 * @apiHeader (Headers) {String} Content-Type Request format.
 * @apiHeaderExample {json} Headers-Example:
 *  {
 *    "Content-Type": "Content-Type: application/json",
 *    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiI1YjI0ODM0NTE1NTUxZjU2ODU4MzQ0ZDQiLCJpYXQiOjE1MjkxMTk3MjV9.V4PC8Xr0kMr4OFq59mPS3EvcEMa9aAKtZvltKSa3b2o"
 *  }
 * @apiParam {String} username A unique username.
 * @apiParam {String} [password=123456789] The user's login password.
 * @apiParam {String} name User's fullname.
 * @apiParam {String} [email] email.
 * @apiParam {String} [title] title.
 * @apiParam {String} [sallary] sallary.
 * @apiParamExample {json} Request-Example:
 * {
 *   "username": "ali",
 *   "name": "ali turki",
 *   "password": "password",
 *   "email": "ali@example.com",
 *   "title": "web developer",
 *   "sallary": "100"
 * }
 * @apiSuccessExample {json} Success-Response-Example:
 *  HTTP/1.1 200 OK
 *  {
 *   "username": "ali",
 *   "name": "ali turki",
 *   "email": "ali@example.com",
 *   "title": "web developer",
 *   "sallary": "100",
 *   "isAdmin": false,
 *   "addedBy": "5b24b634721f387f1301ab98",
 *   "updateAt": "Sat Jun 16 2018 08:12:13 GMT+0200 (EET)",
 *   "createdAt": "Sat Jun 16 2018 08:12:13 GMT+0200 (EET)"
 *  }
 * @apiError InvalidToken.
 * @apiErrorExample {json} Response-Error-Example:
 *  HTTP/1.1 400 BadRequest
 * {
 *  "message": "unvalid token"
 * }
 * @apiError unauthenticated.
 * @apiErrorExample {json} Response-Error-Example:
 *  HTTP/1.1 401 unauthenticated
 * {
 *  "message": "un authenticated"
 * }
 * @apiError unauthorized.
 * @apiErrorExample {json} Response-Error-Example:
 *  HTTP/1.1 401 unauthorized
 * {
 *  "message": "you have not permission."
 * }
 * @apiError (400) ValidationError.
 * @apiErrorExample {json} Response-Validation-Example:
 *  HTTP/1.1 400 Bad Request
 *{
 *  "errors": [
 *   {
 *     "location": "body",
 *     "param": "username",
 *     "msg": "Invalid value"
 *    }
 *   ]
}
*/
module.exports.create = (req, res, next) => {
  return isValidRequest(req, res);
  /*   const userFields = Object.keys(User.schema.paths);
    const requestBody = pick(req.body, userFields);
    const newUser = new User(requestBody);
    newUser.save()
      .then(result => {
        res.json(result);
      })
      .catch(err => {
        return next(err);
      }); */
  verifyToken(req, res, next, (err, admin) => {
    const userFields = Object.keys(User.schema.paths);
    const requestBody = pick(req.body, userFields);
    const newUser = new User(requestBody);
    newUser.addedBy = admin._id;
    newUser.save()
      .then(result => {
        res.json(result);
      })
      .catch(err => {
        return next(err);
      });
  });
};

/**
 * @api {post} /login login
 * @apiGroup User
 * @apiHeader (Headers) {String} Content-Type Request format.
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
 * @apiSuccessExample {json} Success-Response-Example:
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
 *  {
 *  "errors": [
 *   {
 *     "location": "body",
 *     "param": "password",
 *     "msg": "Invalid value"
 *    }
 *   ]
 * }
 */
module.exports.login = (req, res, next) => {
  isValidRequest(req, res);
  User.findOne({
    username: req.body.username
  }, (err, user) => {
    if (err) return next(err);
    if (!user) res.sendStatus(401);
    user.comparePassword(req.body.password, (err, isMatch) => {
      if (err) return next(err);
      if (!isMatch) res.sendStatus(401);
      jwt.sign({
        uid: user._id
      }, config.JWT.SECRET, (err, token) => {
        res.status(200).json({
          token: token
        });
      });
    });
  });

};


function verifyToken(req, res, next, cb) {
  if (!req.headers.token) {
    res.status(400).json({
      message: 'invalid token'
    });
  };

  jwt.verify(req.headers.token, config.JWT.SECRET, (err, payload) => {
    if (err) {
      res.status(400).json({
        message: 'invalid token'
      });
    }
    User.findById(payload.uid).then(addBy => {
      if (!addBy) {
        res.status(401).json({
          message: 'un authenticated'
        });
      }
      if (!addBy.isAdmin) {
        res.status(401).json({
          message: 'you have not permission.'
        });
      }

      cb(null, addBy);

    }).catch(err => next(err));

  });
}
/**
 * @api {get} /user get all users
 * @apiSuccessExample {json} Success-Response-Example:
 *  HTTP/1.1 200 OK
 *  {
 *   "username": "ali",
 *   "name": "ali turki",
 *   "email": "ali@example.com",
 *   "title": "web developer",
 *   "sallary": "100",
 *   "isAdmin": false,
 *   "addedBy": "5b24b634721f387f1301ab98",
 *   "updateAt": "Sat Jun 16 2018 08:12:13 GMT+0200 (EET)",
 *   "createdAt": "Sat Jun 16 2018 08:12:13 GMT+0200 (EET)"
 *  }
 * @apiPermission Admin
 * @apiHeader (Headers) {String} Content-Type Request format.
 * @apiHeaderExample {json} Headers-Example:
 *  {
 *    "Content-Type": "Content-Type: application/json",
 *    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiI1YjI0ODM0NTE1NTUxZjU2ODU4MzQ0ZDQiLCJpYXQiOjE1MjkxMTk3MjV9.V4PC8Xr0kMr4OFq59mPS3EvcEMa9aAKtZvltKSa3b2o"
 *  }
 * @apiError InvalidToken.
 * @apiErrorExample {json} Response-Error-Example:
 *  HTTP/1.1 400 BadRequest
 * {
 *  "message": "unvalid token"
 * }
 * @apiError unauthenticated.
 * @apiErrorExample {json} Response-Error-Example:
 *  HTTP/1.1 401 unauthenticated
 * {
 *  "message": "un authenticated"
 * }
 * @apiError unauthorized.
 * @apiErrorExample {json} Response-Error-Example:
 *  HTTP/1.1 401 unauthorized
 * {
 *  "message": "you have not permission."
 * }
}
 */
exports.fetchAll = (req, res, next) => {
  verifyToken(req, res, next, (err, admin) => {
    User.find().then(users => {
      res.json(users);
    }).catch(err => nwxt(err));
  });
};

/**
 * @api {put} /user/admin/userId set/take out an admin permission
 * @apiSuccessExample {json} Success-Response-Example:
 *  HTTP/1.1 200 OK
 *  {
 *   "username": "ali",
 *   "name": "ali turki",
 *   "email": "ali@example.com",
 *   "title": "web developer",
 *   "sallary": "100",
 *   "isAdmin": false,
 *   "addedBy": "5b24b634721f387f1301ab98",
 *   "updateAt": "Sat Jun 16 2018 08:12:13 GMT+0200 (EET)",
 *   "createdAt": "Sat Jun 16 2018 08:12:13 GMT+0200 (EET)"
 *  }
 * @apiPermission Admin
 * @apiHeader (Headers) {String} Content-Type Request format.
 * @apiHeaderExample {json} Headers-Example:
 *  {
 *    "Content-Type": "Content-Type: application/json",
 *    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiI1YjI0ODM0NTE1NTUxZjU2ODU4MzQ0ZDQiLCJpYXQiOjE1MjkxMTk3MjV9.V4PC8Xr0kMr4OFq59mPS3EvcEMa9aAKtZvltKSa3b2o"
 *  }
 * @apiError InvalidToken.
 * @apiErrorExample {json} Response-Error-Example:
 *  HTTP/1.1 400 BadRequest
 * {
 *  "message": "unvalid token"
 * }
 * @apiError unauthenticated.
 * @apiErrorExample {json} Response-Error-Example:
 *  HTTP/1.1 401 unauthenticated
 * {
 *  "message": "un authenticated"
 * }
 * @apiError unauthorized.
 * @apiErrorExample {json} Response-Error-Example:
 *  HTTP/1.1 401 unauthorized
 * {
 *  "message": "you have not permission."
 * }
 * @apiError isAdminRequired.
 * @apiErrorExample {json} Response-Error-Example:
 *  HTTP/1.1 400 BadRequest
 *  {
 *  "errors": [
 *   {
 *     "location": "body",
 *     "param": "isAdmin",
 *     "msg": "Invalid value"
 *    }
 *   ]
 * }
 */

exports.setAdmin = (req, res, next) => {
  isValidRequest(req, res);
  verifyToken(req, res, next, (err, admin) => {
    User.findByIdAndUpdate(req.params.userId, {
      isAdmin: req.body.isAdmin
    }, {
      new: true
    }).then(user => {
      res.json(user);
    }).catch(err => next(err));
  });
};