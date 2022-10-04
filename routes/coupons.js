var express = require('express');
const couponController = require('../controller/coupon')
const { isAdmin } = require('../handler/auth')

var router = express.Router();

/* GET users listing. */
router.get('/coupons', isAdmin, couponController.getCoupons)
router.get('/coupon/:couponId', isAdmin, couponController.getCoupon)
router.post('/coupon', isAdmin, couponController.createCoupon)
router.delete('/coupon/:couponId', isAdmin, couponController.deleteCoupon)
router.patch('/coupon/:couponId', isAdmin, couponController.editCoupon)

module.exports = router;
