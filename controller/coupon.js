const Coupon = require('../model/coupons')
const handleSuccess = require('../handler/handleSuccess')
const appErr = require('../handler/appErr')
const handleErrAsync = require('../handler/handleErrAsync')

const couponController = {
    getCoupons: handleErrAsync(async (req, res, next) => {
        const coupons = await Coupon.find()
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
        const { couponSn, discount, startAt, dueAt } = body
        if(!couponSn || !couponSn.trim()) {
            return next(appErr(400, '請輸入優惠券序號', next))
        }
        if(!discount) {
            return next(appErr(400, '請輸入優惠比例', next))
        }
        if(discount < 0 || discount > 1) {
            return next(appErr(400, '優惠比例需介於 0～1 之間', next))
        }
        if(!startAt) {
            return next(appErr(400, '請輸入開始時間', next))
        }
        if(!dueAt) {
            return next(appErr(400, '請輸入到期時間', next))
        }
        await Coupon.create(body)
        handleSuccess(res, '')
    }),
    deleteCoupons: handleErrAsync(async (req, res, next) => {
        await Coupon.deleteMany({})
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
        const { couponSn, discount, startAt, dueAt } = body
        const { couponId } = params
        if(!couponSn || !couponSn.trim()) {
            return next(appErr(400, '請輸入優惠券序號', next))
        }
        if(!discount) {
            return next(appErr(400, '請輸入優惠比例', next))
        }
        if(discount < 0 || discount > 1) {
            return next(appErr(400, '優惠比例需介於 0～1 之間', next))
        }
        if(!startAt) {
            return next(appErr(400, '請輸入開始時間', next))
        }
        if(!dueAt) {
            return next(appErr(400, '請輸入到期時間', next))
        }
        const coupon = await Coupon.findByIdAndUpdate(couponId, body)
        handleSuccess(res, '')
    })
}
module.exports = couponController