var express = require('express');
const cartController = require('../controller/cart')
const { isAuth } = require('../handler/auth')

var router = express.Router();

/* GET users listing. */
router.get('', isAuth, cartController.getCarts)
router.post('/:productId/:optionId', isAuth, cartController.addCart)
router.delete('/:productId/:optionId', isAuth, cartController.deleteCart)
router.patch('/:productId/:optionId', isAuth, cartController.editCart)

module.exports = router;
