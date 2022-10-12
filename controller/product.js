const Product = require('../model/products')
const User = require('../model/users')
const handleSuccess = require('../handler/handleSuccess')
const appErr = require('../handler/appErr')
const handleErrAsync = require('../handler/handleErrAsync')

const productController = {
    getProducts: handleErrAsync(async (req, res, next) => {
        const { sort, keyword, type, offset, maxCount } = req.query
        if(!offset) {
            return next(appErr(400, 'offset is required', next))
        }
        if(!maxCount) {
            return next(appErr(400, 'maxCount is required', next))
        }
        let filterSort = 'createdAt'
        switch(sort) {
            case '0':
                filterSort = 'createdAt'
            case '1':
                filterSort = '-createAt'
            case '2':
                filterSort = 'price'
            case '3':
                filterSort = '-price'
            case '4':
                filterSort = 'score'
            case '5':
                filterSort = '-score'
        }
        const searchKeyword = keyword ? {"name": new RegExp(req.query.keyword)} : {};
        const searchType = type ? { type } : {}
        const searchParams = {...searchKeyword, ...searchType}
        const total = await Product.countDocuments(searchParams)
        let products = await Product.find(searchParams)
        .populate({
            path: 'comments.user',
            select: 'name'
        })
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
        const { name, type, options } = body
        if(!name || !name.trim()) {
            return next(appErr(400, '請輸入產品名稱', next))
        }
        if(!type) {
            return next(appErr(400, '請輸入產品類型', next))
        }
        if(!options || !options.length) {
            return next(appErr(400, '請輸入產品品項', next))
        }
        options.forEach(item => {
            if(!item.name || !item.name.trim()) {
                return next(appErr(400, '請輸入品項名稱', next))
            }
            if(!item.price) {
                return next(appErr(400, '請輸入品項價格', next))
            }
            if(item.discountPrice && item.price < item.discountPrice) {
                return next(appErr(400, '品項價格不可低於折扣價格', next))
            }
            if(!item.count) {
                return next(appErr(400, '請輸入品項數量', next))
            }
            if(item.count < 0) {
                return next(appErr(400, '數量不可小於 0', next))
            }
        })
        await Product.create(body)
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
        const { name, type, options } = body
        const { productId } = params
        if(!name || !name.trim()) {
            return next(appErr(400, '請輸入產品名稱', next))
        }
        if(!type) {
            return next(appErr(400, '請輸入產品類型', next))
        }
        if(!options || !options.length) {
            return next(appErr(400, '請輸入產品品項', next))
        }
        options.forEach(item => {
            if(!item.name || !item.name.trim()) {
                return next(appErr(400, '請輸入品項名稱', next))
            }
            if(!item.price) {
                return next(appErr(400, '請輸入品項價格', next))
            }
            if(item.discountPrice && item.price < item.discountPrice) {
                return next(appErr(400, '品項價格不可低於折扣價格', next))
            }
            if(!item.count) {
                return next(appErr(400, '請輸入品項數量', next))
            }
            if(item.count < 0) {
                return next(appErr(400, '數量不可小於 0', next))
            }
        })
        const product = await Product.findByIdAndUpdate(productId, body)
        if(!product) {
            return next(appErr(400, '查無此 Id！', next))
        }
        handleSuccess(res, '')
    }),
    createComment: handleErrAsync(async (req, res, next) => {
        const { userId, params, body } = req
        const { productId } = params
        const { commentMessage, score } = body
        if(!commentMessage || !commentMessage.trim()) {
            return next(appErr(400, 'commentMessage 不可為空', next))
        }
        if(!score) {
            return next(appErr(400, '請輸入評分', next))
        }
        const product = await Product.findByIdAndUpdate(productId, {
            $addToSet: {
                comments: {
                    user: userId,
                    commentMessage,
                    score
                }
            }
        })
        if(!product) {
            return next(appErr(400, '查無此 Id！', next))
        }
        const commentCount = product.comments.length + 1
        const averageScore = ((product.score * (commentCount - 1) + score) / commentCount).toFixed(1)
        await Product.findByIdAndUpdate(productId, {
            score: averageScore
        })
        handleSuccess(res, '')
    })
}
module.exports = productController