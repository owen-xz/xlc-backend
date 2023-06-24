var express = require('express');
const orderController = require('../controller/order')
const { isAdmin, isUser } = require('../handler/auth')

var router = express.Router();

/* GET users listing. */
router.get('/orders/', isAdmin, orderController.getOrders)
router.get('/order/:orderId', isUser, orderController.getOrder)
router.post('/order', isUser, orderController.createOrder)
router.patch('/order/:orderId', isUser, orderController.editOrder)
router.post('/order/:orderId/cancel', isUser, orderController.cancelOrder)
router.post('/order/:orderId/complete', isAdmin, orderController.completeOrder)
router.post('/order/:orderId/pay', isAdmin, orderController.payOrder)

module.exports = router;
