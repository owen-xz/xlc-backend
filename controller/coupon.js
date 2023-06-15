const Coupon = require('../model/coupons')
const handleSuccess = require('../handler/handleSuccess')
const appErr = require('../handler/appErr')
const handleErrAsync = require('../handler/handleErrAsync')

const couponController = {
    getCoupons: handleErrAsync(async (req, res, next) => {
        const { title, code, isEnabled } = req.query
        const searchTitle = title ? {"code": new RegExp(title)} : {};
        const searchCode = code ? {"code": new RegExp(code)} : {};
        let filterIsEnabled = []
        if(isEnabled) {
            filterIsEnabled = isEnabled.map(item => item === 'false' ? false : true)
        }
        const searchIsEnabled = isEnabled ? {
            "isEnabled": {
                $in: filterIsEnabled
            }
        } : {}
        const searchParams = {
            ...searchTitle,
            ...searchCode,
            ...searchIsEnabled,
        }
        const coupons = await Coupon.find(searchParams)
        .select('title code percent isEnabled dueAt')
        handleSuccess(res, coupons)
    }),
    getCoupon: handleErrAsync(async (req, res, next) => {
        const { couponId } = req.params
        const coupon = await Coupon.findById(couponId)
        if(!coupon) {
            return next(appErr(400, '查無此 Id！', next))
        }
        handleSuccess(res, coupon)
    }),
    createCoupon: handleErrAsync(async (req, res, next) => {
        const { body } = req
        const { title, code, percent, dueAt } = body
        if(!title || !title.trim()) {
            return next(appErr(400, '請輸入優惠券標題', next))
        }
        if(!code || !code.trim()) {
            return next(appErr(400, '請輸入優惠券序號', next))
        }
        if(!percent) {
            return next(appErr(400, '請輸入優惠比例', next))
        }
        if(percent < 0 || percent > 1) {
            return next(appErr(400, '優惠比例需介於 0～1 之間', next))
        }
        if(!dueAt) {
            return next(appErr(400, '請輸入到期時間', next))
        }
        await Coupon.create(body)
        handleSuccess(res, '')
    }),
    deleteCoupons: handleErrAsync(async (req, res, next) => {
        const coupon = await Coupon.deleteMany({})
        if(!coupon) {
            return next(appErr(400, '查無此 Id！', next))
        }
        handleSuccess(res, '')
    }),
    deleteCoupon: handleErrAsync(async (req, res, next) => {
        const { couponId } = req.params
        const coupon = await Coupon.findByIdAndDelete(couponId)
        if(!coupon) {
            return next(appErr(400, '查無此 Id！', next))
        }
        handleSuccess(res, '')
    }),
    editCoupon: handleErrAsync(async (req, res, next) => {
        const { body, params } = req
        const { title, code, percent, dueAt } = body
        const { couponId } = params
        if(!title || !title.trim()) {
            return next(appErr(400, '請輸入優惠券標題', next))
        }
        if(!code || !code.trim()) {
            return next(appErr(400, '請輸入優惠券序號', next))
        }
        if(!percent) {
            return next(appErr(400, '請輸入優惠比例', next))
        }
        if(percent < 0 || percent > 1) {
            return next(appErr(400, '優惠比例需介於 0～1 之間', next))
        }
        if(!dueAt) {
            return next(appErr(400, '請輸入到期時間', next))
        }
        const coupon = await Coupon.findByIdAndUpdate(couponId, body)
        if(!coupon) {
            return next(appErr(400, '查無此 Id！', next))
        }
        handleSuccess(res, '')
    })
}
module.exports = couponController