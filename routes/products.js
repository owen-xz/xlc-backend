var express = require('express');
const productController = require('../controller/product')
const { isAuth } = require('../handler/auth')

var router = express.Router();

/* GET users listing. */
router.get('/products/', isAuth, productController.getProducts)
router.post('/product/', isAuth, productController.createProduct)
router.delete('/products/', isAuth, productController.deleteProducts)
router.delete('/product/:productId', isAuth, productController.deleteProduct)
router.patch('/product/:productId', isAuth, productController.editProduct)
router.post('/product/:productId/comment', isAuth, productController.createComment)

module.exports = router;
