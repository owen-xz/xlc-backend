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
                title: {
                    type: String,
                    require: [true, 'title 必填']
                },
                price: {
                    type: Number,
                    required: [true, 'price 必填']
                },
                qty: {
                    type: Number,
                    require: [true, 'qty 必填']
                }
            }
        ],
        status: {
            type: Number,
            enum: enumList.statusEnum,
            require: [true, 'status 必填'],
            default: 1
        },
        user: {
            name: {
                type: String,
                require: [true, 'user.name 必填']
            },
            tel: {
                type: String,
                require: [true, 'user.tel 必填']
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
            code: {
                type: String
            },
            percent: {
                type: Number
            }
        },
        message: {
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