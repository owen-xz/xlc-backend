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
            select: 'name imageUrl originPrice price'
        })
        handleSuccess(res, carts)
    }),
    addCart: handleErrAsync(async (req, res, next) => {
        const { userId, body } = req
        const { productId, qty } = body
        const product = await Product.findById(productId)
        if(!product) {
            return next(appErr(400, '查無此商品 Id！', next))
        }
        if(!qty) {
            return next(appErr(400, '請輸入商品數量', next))
        }
        if(qty < 1) {
            return next(appErr(400, '數量不可小於 1', next))
        }
        if(qty > product.num) {
            return next(appErr(400, '數量不可大於商品數量'))
        }
        const isInCarts = (await User.find({
            _id: userId,
            'carts.productId': {
                $in: [ productId ]
            }
        })).length
        if(isInCarts) {
            return next(appErr(400, '此商品已加入購物車', next))
        }
        await User.findByIdAndUpdate(userId, {
            $addToSet: {
                carts: {
                    productId,
                    qty
                }
            }
        })
        handleSuccess(res, '')
    }),
    deleteCart: handleErrAsync(async (req, res, next) => {
        const { userId, params } = req
        const { cartId } = params
        const isInCarts = (await User.find({
            _id: userId,
            'carts._id': {
                $in: [ cartId ]
            }
        })).length
        if(!isInCarts) {
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
        const { qty } = body
        const carts = await User.find({
            _id: userId
        })
        .select(carts)
        if(!carts || carts.findIndex(item => item._id === cartId)) {
            return next(appErr(400, '此商品尚未加入購物車', next))
        }
        const productId = carts.find(item => item._id === cartId).productId
        const product = await Product.findById(productId)
        if(!product) {
            return next(appErr(400, '查無此商品', next))
        }
        if(!qty) {
            return next(appErr(400, '請輸入品項數量', next))
        }
        if(qty < 1) {
            return next(appErr(400, '數量不可小於 1', next))
        }
        if(qty > product.num) {
            return next(appErr(400, '數量不可大於商品數量', next))
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
                    'carts.$.qty': qty
                }
            }
        )
        handleSuccess(res, '')
    })
}
module.exports = cartController