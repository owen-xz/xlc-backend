const handleSuccess = require('../handler/handleSuccess')
const appErr = require('../handler/appErr')
const handleErrAsync = require('../handler/handleErrAsync')
const pageList = require('../enum/index')

const commonController = {
    getPageListItem: handleErrAsync(async (req, res, next) => {
        const { featureName } = req.params
        handleSuccess(res, pageList[featureName])
    })
}
module.exports = commonController