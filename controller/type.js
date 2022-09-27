const Type = require('../model/types')
const handleSuccess = require('../handler/handleSuccess')
const appErr = require('../handler/appErr')
const handleErrAsync = require('../handler/handleErrAsync')

const typeController = {
    getTypes: handleErrAsync(async (req, res, next) => {
        const types = await Type.find()
        handleSuccess(res, types)
    }),
    createType: handleErrAsync(async (req, res, next) => {
        const { body } = req
        const { name } = body
        console.log(body);
        if(!name || !name.trim()) {
            return next(appErr(400, '請輸入類型名稱', next))
        }
        await Type.create(body)
        handleSuccess(res, '')
    }),
    deleteType: handleErrAsync(async (req, res, next) => {
        const { typeId } = req.params
        const type = await Type.findByIdAndDelete(typeId)
        if(!type) {
            return next(appErr(400, '查無此 Id！', next))
        }
        handleSuccess(res, '')
    }),
    editType: handleErrAsync(async (req, res, next) => {
        const { body, params } = req
        const { name } = body
        const { typeId } = params
        if(!name || !name.trim()) {
            return next(appErr(400, '請輸入類型名稱', next))
        }
        const type = await Type.findByIdAndUpdate(typeId, body)
        if(!type) {
            return next(appErr(400, '查無此 Id！', next))
        }
        handleSuccess(res, '')
    })
}
module.exports = typeController