const mongoose = require('mongoose')
const { enumList } = require('../enum/order')

const order = new mongoose.Schema(
    {
        products: [
            {
                productId: {
                    type: mongoose.Schema.ObjectId,
                    ref: 'product',
                    require: [true, 'productId 必填']
                },
                productName: {
                    type: String,
                    require: [true, 'productName 必填']
                },
                optionId: {
                    type: mongoose.Schema.ObjectId,
                    require: [true, 'objectId 必填']
                },
                optionName: {
                    type: String,
                    require: [true, 'optionName 必填']
                },
                price: {
                    type: Number,
                    require: [true, 'price 必填']
                },
                discountPrice: {
                    type: Number,
                    require: [true, 'discountPrice 必填']
                },
                count: {
                    type: Number,
                    require: [true, 'count 必填']
                }
            }
        ],
        status: {
            type: Number,
            enum: enumList.statusEnum,
            require: [true, 'status 必填'],
            default: 1
        },
        orderer: {
            ordererId: {
                type: mongoose.Schema.ObjectId,
                ref: 'user',
                require: [true, 'orderer 必填']
            },
            ordererName: {
                type: String
            }
        },
        receiver: {
            name: {
                type: String,
                require: [true, 'user.name 必填']
            },
            phone: {
                type: String,
                require: [true, 'user.phone 必填']
            },
            email: {
                type: String,
                require: [true, 'user.email 必填']
            },
            address: {
                type: String,
                require: [true, 'user.address 必填']
            }
        },
        paymentType: {
            type: Number,
            enum: enumList.paymentTypeEnum,
            require: [true, 'paymentType 必填']
        },
        transportType: {
            type: Number,
            enum: enumList.transportTypeEnum,
            require: [true, 'transportType 必填']
        },
        coupon: {
            couponSn: {
                type: String
            },
            discount: {
                type: Number
            }
        },
        note: {
            type: String
        },
        totalPrice: {
            type: Number
        },
        finalPrice: {
            type: Number
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    },
    {
        versionKey: false
    }
)
const Order = mongoose.model('order', order)

module.exports = Order