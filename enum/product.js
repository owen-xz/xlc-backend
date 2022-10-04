const type = [
    {
        id: 1,
        name: '器材',
    },
    {
        id: 2,
        name: '食品'
    },
    {
        id: 3,
        name: '課程'
    }
]

const typeEnum = type.map(item => item.id)

module.exports = {
    pageList: {
        type
    },
    enumList: {
        typeEnum
    }
}