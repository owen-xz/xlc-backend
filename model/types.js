const mongoose = require('mongoose')

const type = new mongoose.Schema(
    {
        name: {
            type: String,
            require: [true, 'name 必填']
        },
    },
    {
        versionKey: false
    }
)
const Type = mongoose.model('type', type)

module.exports = Type