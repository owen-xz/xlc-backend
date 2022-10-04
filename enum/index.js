const productEnum = require('./product')
const orderEnum = require('./order')

module.exports = {
    product: productEnum.pageList,
    order: orderEnum.pageList
}