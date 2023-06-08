const mongoose = require('mongoose')
const { enumList } = require('../enum/product')

const product = new mongoose.Schema(
    {
        title: {
            type: String,
            require: [true, 'title 必填']
        },
        category: {
            type: Number,
            enum: enumList.categoryEnum,
            require: [true, 'category 必填']
        },
        content: {
            type: String
        },
        description: {
            type: String
        },
        originPrice: {
            type: Number,
            require: [true, 'originPrice 必填']
        },
        price: {
            type: Number,
            require: [true, 'price 必填']
        },
        unit: {
            type: String,
            require: [true, 'unit 必填']
        },
        num: {
            type: Number,
            require: [true, 'num 必填']
        },
        isEnabled: {
            type: Boolean,
            default: true
        },
        imageUrl: {
            type: String
        },
        imagesUrl: [
            {
                type: String
            }
        ],
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