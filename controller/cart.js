const Product = require('../model/products')
const User = require('../model/users')
const handleSuccess = require('../handler/handleSuccess')
const appErr = require('../handler/appErr')
const handleErrAsync = require('../handler/handleErrAsync')

const cartController = {
    getCarts: handleErrAsync(async (req, res, next) => {
        const { userId } = req
        const carts = await User.findById(userId)
        .select('carts')
        .populate({
            path: 'carts.productId',
            select: 'name photo'
        })
        handleSuccess(res, carts)
    }),
    addCart: handleErrAsync(async (req, res, next) => {
        const { userId, params, body } = req
        const { productId, optionId, count } = body
        const product = await Product.findById(productId)
        if(!product) {
            return next(appErr(400, '查無此商品 Id！', next))
        }
        const option = product.options.find(item => item._id.toString() === optionId)
        if(!option) {
            return next(appErr(400, '查無此品項 Id！', next))
        }
        const { price, discountPrice } = option
        if(!count) {
            return next(appErr(400, '請輸入品項數量', next))
        }
        if(count <= 0) {
            return next(appErr(400, '數量不可小於 1', next))
        }
        const isInCart = (await User.find({
            _id: userId,
            'carts.productId': {
                $in: [ productId ]
            },
            'carts.optionId': {
                $in: [ optionId ]
            }
        })).length
        if(isInCart) {
            return next(appErr(400, '此商品已加入購物車', next))
        }
        await User.findByIdAndUpdate(userId, {
            $addToSet: {
                carts: {
                    productId,
                    optionId,
                    price,
                    discountPrice,
                    count
                }
            }
        })
        handleSuccess(res, '')
    }),
    deleteCart: handleErrAsync(async (req, res, next) => {
        const { userId, params } = req
        const { cartId } = params
        const isInCart = (await User.find({
            _id: userId,
            'carts._id': {
                $in: [ cartId ]
            }
        })).length
        if(!isInCart) {
            return next(appErr(400, '此商品尚未加入購物車', next))
        }
        await User.findByIdAndUpdate(userId, {
            $pull: {
                carts: {
                    _id: cartId
                }
            }
        })
        handleSuccess(res, '')
    }),
    editCart: handleErrAsync(async (req, res, next) => {
        const { userId, params, body } = req
        const { cartId } = params
        const { count } = body
        if(!count) {
            return next(appErr(400, '請輸入品項數量', next))
        }
        if(count <= 0) {
            return next(appErr(400, '數量不可小於 1', next))
        }
        const isInCart = (await User.find({
            _id: userId,
            'carts._id': {
                $in: [ cartId ]
            },
        })).length
        if(!isInCart) {
            return next(appErr(400, '此商品尚未加入購物車', next))
        }
        await User.findOneAndUpdate(
            {
                _id: userId,
                carts: {
                    $elemMatch: {
                        _id: cartId
                    }
                }
            },
            {
                $set: {
                    'carts.$.count': count
                }
            }
        )
        handleSuccess(res, '')
    })
}
module.exports = cartController