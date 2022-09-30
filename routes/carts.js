var express = require('express');
const cartController = require('../controller/cart')
const { isUser } = require('../handler/auth')

var router = express.Router();

/* GET users listing. */
router.get('/carts', isUser, cartController.getCarts)
router.post('/cart', isUser, cartController.addCart)
router.delete('/cart/:cartId', isUser, cartController.deleteCart)
router.patch('/cart/:cartId', isUser, cartController.editCart)

module.exports = router;
