const mongoose = require('mongoose')
const { enumList } = require('../enum/product')

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
            type: Number,
            enum: enumList.typeEnum,
            require: [true, 'type 必填']
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
            type: Boolean,
            default: true
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