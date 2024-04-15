import Coupon from '../models/Coupon.js';
import asyncHandler from 'express-async-handler';

export const createCoupon = asyncHandler(async (req,res) => {
    const {code, startDate, endDate, discount} = req.body;

    const couponExists = await Coupon.findOne({
        code,
    });

    if (couponExists) {
        throw new Error('Coupon already exists')
    }

    if(isNaN(discount)) {
        throw new Error('Discount is not a number')
    }

    const coupon = await Coupon.create({
        code: code?.toUpperCase(),
        startDate,
        endDate, 
        discount, 
        user: req.userAuthId,
    })

    res.json({
        status:'success',
        msg: 'Coupon Controller',
        coupon,
    })
});

export const getAllCoupons = asyncHandler(async(req, res) => {
    const coupons = await Coupon.find();
    res.json({
        status: 'success',
        msg: 'Coupons fetched successfully',
        coupons
    })
});

export const getCoupon = asyncHandler(async(req, res) => {
    const coupon = await Coupon.findById(req.params.id);
    res.json({
        status: 'success',
        msg: 'Coupon fetched successfully',
        coupon,
    })
});

export const updateCoupon = asyncHandler(async(req, res) => {
    const {code, startDate, endDate, discount} = req.body;
    const coupon = await Coupon.findByIdAndUpdate(req.params.id, {
        code: code?.toUpperCase(),
        discount,
        startDate,
        endDate,

    }, {
        new: true,
    });

    res.json({
        status: 'success',
        msg: 'Coupon updated successfully',
        coupon,
    })
});

export const deleteCoupon = asyncHandler(async(req, res) => {
    await Coupon.findByIdAndDelete(req.params.id);
    res.json({
        status: 'success',
        msg: 'Coupon deleted successfully',
    })
});