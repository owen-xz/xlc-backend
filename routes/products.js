var express = require('express');
const productController = require('../controller/product')
const { isAdmin, isUser } = require('../handler/auth')

var router = express.Router();

/* GET users listing. */
router.get('/products/', productController.getProducts_any)
router.get('/admin/products/', isUser, productController.getProducts)
router.get('/product/:productId', productController.getProduct)
router.post('/admin/product/', isAdmin, productController.createProduct)
router.delete('/admin/products/', isAdmin, productController.deleteProducts)
router.delete('/admin/product/:productId', isAdmin, productController.deleteProduct)
router.patch('/admin/product/:productId', isAdmin, productController.editProduct)

module.exports = router;
