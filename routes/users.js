var express = require('express');
var router = express.Router();
const userController = require('../controller/user')
const { isAuth } = require('../handler/auth')

/* GET users listing. */
router.post('/sign_up', userController.signUp);
router.post('/sign_in', userController.signIn);
router.post('/updatePassword', isAuth, userController.updatePassword);
router.get('/profile', isAuth, userController.getUserProfile);
router.patch('/profile', isAuth, userController.patchUserProfile);

module.exports = router;
