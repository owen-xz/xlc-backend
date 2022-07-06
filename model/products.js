const mongoose = require('mongoose')

const product = new mongoose.Schema(
    {
        name: {
            type: String,
            require: [true, 'name 必填']
        },
        photo: {
            type: String
        },
        type: {
            type: String,
            enum: ['器材', '食品', '課程'],
            default: '器材'
        },
        options: [
            {
                name: {
                    type: String
                },
                price: {
                    type: Number,
                    require: [true, 'price 必填']
                },
                discountPrice: {
                    type: Number
                },
                count: {
                    type: Number,
                    require: [true, 'count 必填']
                }
            }
        ],
        description: {
            type: String
        },
        score: {
            type: Number,
            default: 0
        },
        comments: [
            {
                user: {
                    type: mongoose.Schema.ObjectId,
                    ref: 'user'
                },
                commentMessage: {
                    type: String
                },
                score: {
                    type: Number,
                    enum: [1, 2, 3, 4, 5]
                }
            }
        ],
        status: {
            type: String,
            enum: ['上架', '下架'],
            default: '上架'
        },
        createdAt: {
            type: Date,
            default: Date.now,
            select: false
        }
    },
    {
        versionKey: false
    }
)
const Product = mongoose.model('product', product)

module.exports = Product