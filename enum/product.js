const category = [
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

const categoryEnum = category.map(item => item.id)

module.exports = {
    pageList: {
        category
    },
    enumList: {
        categoryEnum
    }
}