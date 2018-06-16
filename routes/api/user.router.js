const router = require('express').Router();
const UserController = require('../../controllers/user.controller');
const UserValidator = require('../../validations/user.validation');

router.post('/user', UserValidator.createNewuser(), UserController.create);
router.get('/user', UserController.fetchAll);
router.put('/user/admin/:userId', UserValidator.isAdmin(), UserController.setAdmin);
router.post('/login', UserValidator.login(), UserController.login);

module.exports = router;