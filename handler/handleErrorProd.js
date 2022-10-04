const resErrorProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      message: err.message,
      code: err.code || `${err.statusCode}000`,
      data: err.data || null
    });
  } else {
    // log 紀錄
    console.error("出現重大錯誤", err);
    // 送出罐頭預設訊息
    res.status(500).json({
      status: "error",
      message: "系統錯誤，請恰系統管理員",
    });
  }
};

module.exports = resErrorProd
