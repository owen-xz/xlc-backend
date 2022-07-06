const multer = require("multer");
const path = require("path");
const handleErrAsync = require('../handler/handleErrAsync')
const appErr = require('../handler/appErr')

const imgUploadCheck = multer({
    limits: {
        fileSize: 2 * 1024 * 1024
    },
    fileFilter(req, file, cb) {
        const ext = path.extname(file.originalname).toLowerCase()
        if(ext !== '.jpg' && ext !== '.jpeg' && ext !== '.png') {
            cb(new Error('檔案格式錯誤，限 jpg、jpeg、png'))
        }
        cb(null, true)
    }
}).any()

const imgUpload = handleErrAsync(async(req, res, next) => {
    imgUploadCheck(req, res, function (err) {
        if (err) {
            return next(appErr(400, err.message, next))
        }
        next()
    })
})

module.exports = {
    imgUpload
}
