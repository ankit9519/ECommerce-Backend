import express from 'express';
import { createCoupon, getAllCoupons, getCoupon, deleteCoupon, updateCoupon } from '../controllers/couponController.js';
import { isLoggedIn } from '../middlewares/isLoggedIn.js';
import isAdmin from '../middlewares/isAdmin.js';

const router = express.Router();

router.post('/', isLoggedIn, isAdmin, createCoupon)
router.get('/',getAllCoupons)
router.get('/:id', getCoupon)
router.put('/:id', isLoggedIn, isAdmin, updateCoupon)
router.delete('/:id', isLoggedIn, isAdmin, deleteCoupon)

export default router
