const mongoose = require('mongoose')

const coupon = new mongoose.Schema(
    {
        code: {
            type: String,
            require: [true, 'code 必填']
        },
        percent: {
            type: Number,
            require: [true, 'percent 必填']
        },
        isEnabled: {
            type: Boolean,
            default: true
        },
        dueAt: {
            type: Date,
            require: [true, 'dueAt 必填']
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
const Coupon = mongoose.model('coupon', coupon)

module.exports = Coupon