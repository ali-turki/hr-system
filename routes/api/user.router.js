const router = require('express').Router();
const UserController = require('../../controllers/user.controller');
const UserValidator = require('../../validations/user.validation');

router.post('/user', UserValidator.createNewuser(), UserController.create);
router.post('/login', UserValidator.login(), UserController.login);

module.exports = router;