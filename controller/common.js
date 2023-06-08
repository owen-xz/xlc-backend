const handleSuccess = require('../handler/handleSuccess')
const appErr = require('../handler/appErr')
const handleErrAsync = require('../handler/handleErrAsync')
const pageList = require('../enum/index')

const commonController = {
    getPageListItem: handleErrAsync(async (req, res, next) => {
        const { featureName } = req.params
        if(!pageList[featureName]) {
            return next(appErr(400, '查無此功能', next))
        }
        handleSuccess(res, pageList[featureName])
    })
}
module.exports = commonController