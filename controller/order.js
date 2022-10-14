const Order = require('../model/orders')
const Product = require('../model/products')
const User = require('../model/users')
const handleSuccess = require('../handler/handleSuccess')
const appErr = require('../handler/appErr')
const handleErrAsync = require('../handler/handleErrAsync')
const Coupon = require('../model/coupons')

const orderController = {
    getOrders: handleErrAsync(async (req, res, next) => {
        const {
            orderId,
            orderer,
            status,
            paymentType,
            transportType,
            startAt,
            dueAt,
            offset,
            maxCount
        } = req.query
        if(!offset) {
            return next(appErr(400, 'offset is required', next))
        }
        if(!maxCount) {
            return next(appErr(400, 'maxCount is required', next))
        }
        const searchOrderId = orderId ? { "_id": orderId } : {};
        const searchOrderer = orderer ? { "orderer.ordererName": new RegExp(orderer) } : {};
        const searchStatus = status ? { status } : {};
        const searchPaymentType = paymentType ? { paymentType } : {};
        const searchTransportType = transportType ? { transportType } : {};
        const searchCreatedAt = {}
        if(startAt || dueAt) {
            searchCreatedAt.createdAt = {}
            if(startAt) searchCreatedAt.createdAt.$gte = startAt
            if(dueAt) searchCreatedAt.createdAt.$lt = dueAt
        }
        const searchParams = {
            ...searchOrderId,
            ...searchOrderer,
            ...searchStatus,
            ...searchPaymentType,
            ...searchTransportType,
            ...searchCreatedAt
        }
        const total = await Order.countDocuments(searchParams)
        const orders = await Order.find(searchParams)
        .select('orderer receiver status paymentType transportType createdAt')
        .skip(offset)
        .limit(maxCount)
        handleSuccess(res, {
            orders,
            total
        })
    }),
    getOrder: handleErrAsync(async (req, res, next) => {
        const { orderId } = req.params
        const order = await Order.findById(orderId)
        .populate({
            path: 'products.productId',
            select: 'name image options'
        })
        .populate({
            path: 'orderer',
            select: 'name'
        })
        if(!order) {
            return next(appErr(400, '查無此 Id！', next))
        }
        handleSuccess(res, order)
    }),
    createOrder: handleErrAsync(async (req, res, next) => {
        const { userId, body } = req
        const {
            products,
            receiver,
            paymentType,
            transportType,
            couponSn,
            ...others
        } = body
        let totalPrice = 0
        const sendProducts = []
        function checkProduct (item) {
            return new Promise(async (resolve, reject) => {
                try {
                    const product = await Product.findById(item.productId)
                    if(!product) {
                        return reject({
                            type: 1,
                            data: item.productId
                        })
                    }
                    const option = product.options.find(optionItem => optionItem._id.toString() === item.optionId)
                    console.log(option);
                    if(!option) {
                        console.log(option);
                        return reject({
                            type: 2,
                            data: item.optionId
                        })
                    }
                    if(!item.count) {
                        return reject({
                            type: 3,
                            data: null
                        })
                    }
                    if(item.count < 1) {
                        return reject({
                            type: 4,
                            data: null
                        })
                    }
                    sendProducts.push({
                        productId: item.productId,
                        productName: product.name,
                        optionId: item.optionId,
                        optionName: option.name,
                        price: option.price,
                        discountPrice: option.discountPrice,
                        count: item.count
                    })
                    totalPrice += option.discountPrice * item.count
                    resolve()
                } catch {
                    reject({
                        type: 5,
                        data: null
                    })
                }
            })
        }
        const promiseList = []
        products.forEach(product => {
            promiseList.push(checkProduct(product))
        })
        Promise.all(promiseList)
        .then(async () => {
            if(!receiver || !receiver.name || !receiver.phone || !receiver.email || !receiver.address) {
                return next(appErr(400, '取貨人資料不完整', next))
            }
            if(!paymentType) {
                return next(appErr(400, '請輸入付款方式', next))
            }
            if(!transportType) {
                return next(appErr(400, '請輸入取貨方式', next))
            }
            let finalPrice = totalPrice
            const orderer = await User.findById(userId).select('name')
            let coupon
            if(couponSn) {
                const selectCoupon = await Coupon.find({
                    couponSn
                })
                if(!selectCoupon || !selectCoupon.length) {
                    return next(appErr(
                        400,
                        {
                            message:'查無此優惠券',
                            code: 400003
                        },
                        next
                    ))
                }
                const { discount, enable, startAt, dueAt } = selectCoupon[0]
                const today = new Date()
                if(startAt > today || dueAt < today || !enable) {
                    return next(appErr(
                        400,
                        {
                            message:'此優惠券已失效',
                            code: 400004
                        },
                        next
                    ))
                }
                coupon = {
                    couponSn,
                    discount
                }
                finalPrice = totalPrice * discount
            } else {
                finalPrice = totalPrice
            }
            await Order.create({
                products: sendProducts,
                receiver,
                paymentType,
                transportType,
                others,
                coupon,
                totalPrice,
                finalPrice,
                orderer: {
                    ordererId: userId,
                    ordererName: orderer.name
                }
            })
            handleSuccess(res, '')
        })
        .catch(err => {
            switch(err.type) {
                case 1:
                    return next(appErr(
                        400,
                        {
                            message:'查無此商品 Id！',
                            code: 400001,
                            data: err.data
                        },
                        next
                    ))
                case 2:
                    return next(appErr(
                        400,
                        {
                            message:'查無此品項 Id！',
                            code: 400002,
                            data: err.data
                        },
                        next
                    ))
                case 3:
                    return next(appErr(400, '請輸入購買數量', next))
                case 4:
                    return next(appErr(400, '購買數量不可 < 1', next))
                case 5:
                    return next(appErr(400, '查無此 Id', next))
            }
        })
    }),
    cancelOrder: handleErrAsync(async (req, res, next) => {
        const { params, userId, roles } = req
        const { orderId } = params
        if(roles && !roles.includes('admin')) {
            const order = await Order.findById(orderId).select('orderer')
            if(userId !== order.orderer.toString()) {
                return next(appErr(403, '您沒有權限進行此操作', next))
            }
        }
        const order = await Order.findByIdAndUpdate(orderId, {
            status: 6
        })
        if(!order) {
            return next(appErr(400, '查無此 Id！', next))
        }
        handleSuccess(res, '')
    }),
    completeOrder: handleErrAsync(async (req, res, next) => {
        const { orderId } = req.params
        const order = await Order.findByIdAndUpdate(orderId, {
            status: 5
        })
        if(!order) {
            return next(appErr(400, '查無此 Id！', next))
        }
        handleSuccess(res, '')
    }),
    payOrder: handleErrAsync(async (req, res, next) => {
        const { params, userId } = req
        const { orderId } = params
        const order = await Order.findById(orderId).select('orderer')
        if(!order) {
            return next(appErr(400, '查無此 Id！', next))
        }
        if(userId !== order.orderer.toString()) {
            return next(appErr(403, '您沒有權限進行此操作', next))
        }
        await Order.findByIdAndUpdate(orderId, {
            status: 2
        })
        handleSuccess(res, '')
    })
}
module.exports = orderController