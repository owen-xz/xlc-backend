const mongoose = require('mongoose')

const coupon = new mongoose.Schema(
    {
        couponSn: {
            type: String,
            require: [true, 'couponSn 必填']
        },
        discount: {
            type: Number,
            require: [true, 'discount 必填']
        },
        enable: {
            type: Boolean,
            default: true
        },
        startAt: {
            type: Date,
            require: [true, 'startAt 必填']
        },
        dueAt: {
            type: Date,
            require: [true, 'dueAt 必填']
        },
        createdAt: {
            type: Date,
            default: Date.now
        },
        description: {
            type: String
        }
    },
    {
        versionKey: false
    }
)
const Coupon = mongoose.model('coupon', coupon)

module.exports = Coupon