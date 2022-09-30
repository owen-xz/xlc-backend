var express = require('express');
const productController = require('../controller/product')
const { isAdmin, isUser } = require('../handler/auth')

var router = express.Router();

/* GET users listing. */
router.get('/products/', isUser, productController.getProducts)
router.get('/product/:productId', isUser, productController.getProduct)
router.post('/product/', isAdmin, productController.createProduct)
router.delete('/products/', isAdmin, productController.deleteProducts)
router.delete('/product/:productId', isAdmin, productController.deleteProduct)
router.patch('/product/:productId', isAdmin, productController.editProduct)
router.post('/product/:productId/comment', isAdmin, productController.createComment)

module.exports = router;
