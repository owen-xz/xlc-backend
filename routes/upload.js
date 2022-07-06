var express = require('express');
var router = express.Router();
const { isAuth } = require('../handler/auth')
const handleSuccess = require('../handler/handleSuccess')
const appErr = require('../handler/appErr')
const handleErrAsync = require('../handler/handleErrAsync')
const { imgUpload } = require('../handler/upload')
const sizeOf = require("image-size");
const { ImgurClient } = require('imgur')

router.post('/img', isAuth, imgUpload, handleErrAsync(async (req, res, next) => {
  if(!req.files.length) {
    return next(appErr(400, '未上傳檔案', next))
  }
  // const dimensions = sizeOf(req.files[0].buffer);
  // if (dimensions.width !== dimensions.height) {
  //   return next(appErr(400, '圖片長寬不符合 1:1 尺寸。', next));
  // }
  const client = new ImgurClient({
    clientId: process.env.IMGUR_CLIENTID,
    clientSecret: process.env.IMGUR_CLIENT_SECRET,
    refreshToken: process.env.IMGUR_REFRESH_TOKEN,
  });
  const response = await client.upload({
    image: req.files[0].buffer.toString('base64'),
    type: 'base64',
    album: process.env.IMGUR_ALBUM_ID
  });
  handleSuccess(res, response.data.link)
}))

module.exports = router
