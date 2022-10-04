const appErr = (statusCode, err, next) => {
    console.log(err);
    let error
    if(err.code) {
        error = new Error(err.message)
        error.code = err.code
        if(err.data) {
            error.data = err.data
        }
    } else {
        error = new Error(err)
    }
    error.statusCode = statusCode
    error.isOperational = true
    next(error)
}
module.exports = appErr