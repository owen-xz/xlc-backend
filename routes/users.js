var express = require('express');
var router = express.Router();
const userController = require('../controller/user')
const { isUser } = require('../handler/auth')

/* GET users listing. */
router.post('/sign_up', userController.signUp);
router.post('/sign_in', userController.signIn);
router.post('/updatePassword', isUser, userController.updatePassword);
router.get('/profile', isUser, userController.getUserProfile);
router.patch('/profile', isUser, userController.patchUserProfile);

module.exports = router;
