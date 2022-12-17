var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose')
var cors = require('cors')
const dotenv = require('dotenv')

var handleErrorDev = require('./handler/handleErrorDev')
var handleErrorProd = require('./handler/handleErrorProd')

var indexRouter = require('./routes/index');
var commonRouter = require('./routes/common');
var usersRouter = require('./routes/users');
var productsRouter = require('./routes/products');
var cartsRouter = require('./routes/carts');
var uploadRouter = require('./routes/upload');
var ordersRouter = require('./routes/orders');
var couponsRouter = require('./routes/coupons');

var app = express();

dotenv.config({path: './config.env'})
const DB = process.env.DATABASE.replace('<password>', process.env.DATABASE_PASSWORD)
mongoose.connect(DB)
.then(() => {
    console.log('資料庫連線成功');
})
.catch(err => {
    console.log(err);
})

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors())

process.on('uncaughtException', err => {
  //記錄錯誤下來，等到服務都處理完後，停掉該 process
	console.error('Uncaughted Exception！')
	console.error(err);
	process.exit(1);
});

app.use('/', indexRouter);
app.use('/common', commonRouter);
app.use('/users/', usersRouter);
app.use(productsRouter);
app.use('/', cartsRouter);
app.use('/upload/', uploadRouter);
app.use('/', ordersRouter);
app.use('/', couponsRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  res.status(404).send({
    status: false,
    message: '您的路由不存在，請檢查路徑是否正確'
  })
});

// error handler
app.use(function(err, req, res, next) {
  err.statusCode = err.statusCode || 500
  if(process.env.NODE_ENV === 'dev') {
    return handleErrorDev(err, res)
  }
  if (err.name === "ValidationError") {
    err.statusCode = 400
    err.message = "資料欄位未填寫正確，請重新輸入！";
    err.isOperational = true;
  }
  if (err.name === "CastError") {
    err.statusCode = 400
    err.message = "查無此 Id！";
    err.isOperational = true;
  }
  if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
    err.statusCode = 401
    err.message = "登入過期或驗證失敗！";
    err.isOperational = true;
  }
  handleErrorProd(err, res);
});

// 未捕捉到的 catch
process.on('unhandledRejection', (reason, promise) => {
  console.error('未捕捉到的 rejection：', promise, '原因：', reason);
  // 記錄於 log 上
});

console.log('success')
module.exports = app;
