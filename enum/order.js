const status = [
    {
        id: 1,
        name: '未付款'
    },
    {
        id: 2,
        name: '已付款'
    },
    {
        id: 3,
        name: '已出貨'
    },
    {
        id: 4,
        name: '待取貨'
    },
    {
        id: 5,
        name: '已完成'
    },
    {
        id: 6,
        name: '已取消'
    }
]
const paymentType = [
    {
        id: 1,
        name: '現金'
    },
    {
        id: 2,
        name: '刷卡'
    }
]
const transportType = [
    {
        id: 1,
        name: '宅配'
    },
    {
        id: 2,
        name: '超商'
    },
    {
        id: 3,
        name: '面交'
    }
]

const statusEnum = status.map(item => item.id)
const paymentTypeEnum = paymentType.map(item => item.id)
const transportTypeEnum = transportType.map(item => item.id)

module.exports = {
    pageList: {
        status,
        paymentType,
        transportType,
    },
    enumList: {
        statusEnum,
        paymentTypeEnum,
        transportTypeEnum
    }
}