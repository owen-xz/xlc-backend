const jwt = require("jsonwebtoken")
const User = require('../model/users')
const appErr = require('./appErr')
const handleErrAsync = require('../handler/handleErrAsync')

const generateSendJWT = (user, res) => {
  const { _id, roles } = user
  const token = jwt.sign({ id: _id, roles }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_DAY
  })
  res.status(200).json({
    status: 'success',
    data: token
  })
}

const isAdmin = handleErrAsync(async(req, res, next) => {
  let token
  if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1]
  }
  if(!token) {
    return next(appErr(401, '登入過期或驗證失敗！', next))
  }
  const decode = jwt.verify(token, process.env.JWT_SECRET)
  if(!decode.roles.includes('admin')) {
    return next(appErr(403, '您沒有權限進行此操作', next))
  }
  req.userId = decode.id
  req.roles = decode.roles
  next()
})

const isUser = handleErrAsync(async(req, res, next) => {
  let token
  if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1]
  }
  if(!token) {
    return next(appErr(401, '登入過期或驗證失敗！', next))
  }
  const decode = jwt.verify(token, process.env.JWT_SECRET)
  if(!decode.roles.includes('user')) {
    return next(appErr(403, '您沒有權限進行此操作', next))
  }
  req.userId = decode.id
  req.roles = decode.roles
  next()
})

module.exports = {
  generateSendJWT,
  isAdmin,
  isUser
}
