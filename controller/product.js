const Product = require('../model/products')
const User = require('../model/users')
const handleSuccess = require('../handler/handleSuccess')
const appErr = require('../handler/appErr')
const handleErrAsync = require('../handler/handleErrAsync')
const pageList = require('../enum/index')

const productController = {
    getProducts_any: handleErrAsync(async (req, res, next) => {
        const { keyword, category, offset, maxCount } = req.query
        if(!offset) {
            return next(appErr(400, 'offset is required', next))
        }
        if(!maxCount) {
            return next(appErr(400, 'maxCount is required', next))
        }
        let filterSort = '-createdAt'
        // switch(sort) {
        //     case '0':
        //         filterSort = 'createdAt'
        //     case '1':
        //         filterSort = '-createAt'
        //     case '2':
        //         filterSort = 'price'
        //     case '3':
        //         filterSort = '-price'
        //     case '4':
        //         filterSort = 'score'
        //     case '5':
        //         filterSort = '-score'
        // }
        const searchKeyword = keyword ? {"name": new RegExp(req.query.keyword)} : {};
        const searchCategory = category ? { category } : {}
        const searchParams = {...searchKeyword, ...searchCategory, isEnabled: true}
        const total = await Product.countDocuments(searchParams)
        let products = await Product.find(searchParams)
        .sort(filterSort)
        .skip(offset)
        .limit(maxCount)
        .select('title categoryName originPrice price imageUrl')
        handleSuccess(res, {
            products,
            total
        })
    }),
    getProducts: handleErrAsync(async (req, res, next) => {
        const { keyword, category, offset, maxCount } = req.query
        if(!offset) {
            return next(appErr(400, 'offset is required', next))
        }
        if(!maxCount) {
            return next(appErr(400, 'maxCount is required', next))
        }
        let filterSort = '-createdAt'
        // switch(sort) {
        //     case '0':
        //         filterSort = 'createdAt'
        //     case '1':
        //         filterSort = '-createAt'
        //     case '2':
        //         filterSort = 'price'
        //     case '3':
        //         filterSort = '-price'
        //     case '4':
        //         filterSort = 'score'
        //     case '5':
        //         filterSort = '-score'
        // }
        const searchKeyword = keyword ? {"name": new RegExp(req.query.keyword)} : {};
        const searchCategory = category ? { category } : {}
        const searchParams = {...searchKeyword, ...searchCategory}
        const total = await Product.countDocuments(searchParams)
        let products = await Product.find(searchParams)
        .sort(filterSort)
        .skip(offset)
        .limit(maxCount)
        handleSuccess(res, {
            products,
            total
        })
    }),
    getProduct: handleErrAsync(async (req, res, next) => {
        const { productId } = req.params
        const product = await Product.findById(productId)
        if(!product) {
            return next(appErr(400, '查無此 Id！', next))
        }
        handleSuccess(res, product)
    }),
    createProduct: handleErrAsync(async (req, res, next) => {
        const { body } = req
        const { title, category, originPrice, unit, num } = body
        if(!title || !title.trim()) {
            return next(appErr(400, '請輸入商品標題', next))
        }
        if(!category) {
            return next(appErr(400, '請輸入商品類型', next))
        }
        if(!originPrice) {
            return next(appErr(400, '請輸入商品價格', next))
        }
        if(originPrice < 0) {
            return next(appErr(400, '價格不可小於 0', next))
        }
        if(!unit) {
            return next(appErr(400, '請輸入商品單位', next))
        }
        if(!num) {
            return next(appErr(400, '請輸入商品數量', next))
        }
        if(num < 0) {
            return next(appErr(400, '數量不可小於 0', next))
        }
        const categoryName = (pageList.product.category.find(item => item.id === category)).name
        await Product.create({
            ...body,
            categoryName
        })
        handleSuccess(res, '')
    }),
    deleteProducts: handleErrAsync(async (req, res, next) => {
        await Product.deleteMany({})
        handleSuccess(res, '')
    }),
    deleteProduct: handleErrAsync(async (req, res, next) => {
        const { productId } = req.params
        const product = await Product.findByIdAndDelete(productId)
        if(!product) {
            return next(appErr(400, '查無此 Id！', next))
        }
        handleSuccess(res, '')
    }),
    editProduct: handleErrAsync(async (req, res, next) => {
        const { body, params } = req
        const { title, category, originPrice, unit, num } = body
        const { productId } = params
        if(!title || !title.trim()) {
            return next(appErr(400, '請輸入商品標題', next))
        }
        if(!category) {
            return next(appErr(400, '請輸入商品類型', next))
        }
        if(!originPrice) {
            return next(appErr(400, '請輸入商品價格', next))
        }
        if(originPrice < 0) {
            return next(appErr(400, '價格不可小於 0', next))
        }
        if(!unit) {
            return next(appErr(400, '請輸入商品單位', next))
        }
        if(!num) {
            return next(appErr(400, '請輸入商品數量', next))
        }
        if(num < 0) {
            return next(appErr(400, '數量不可小於 0', next))
        }
        const categoryName = (pageList.product.category.find(item => item.id === +category)).name
        const newProduct = {
            ...body,
            categoryName
        }
        const product = await Product.findByIdAndUpdate(productId, newProduct)
        if(!product) {
            return next(appErr(400, '查無此 Id！', next))
        }
        handleSuccess(res, '')
    })
}
module.exports = productController