import dotenv from "dotenv";
import Stripe from "stripe";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import User from "../models/User.js";
import asyncHandler from "express-async-handler";
import Coupon from "../models/Coupon.js";

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_KEY);

export const createOrder = asyncHandler(async (req, res) => {
  const {coupon} = req.query;
  
  const couponFound = await Coupon.findOne({
    code: coupon?.toUpperCase(),
  });

  if(couponFound?.isExpired) {
    throw new Error('Coupon has expired')
  }

  if(!couponFound) {
    throw new Error('Coupon does not exist')
  }

  const discount = couponFound?.discount / 100;

  const { orderItems, shippingAddress, totalPrice } = req.body;
  const user = await User.findById(req.userAuthId);
  if (!user?.hasShippingAddress) {
    throw new Error("Please provide a shipping address");
  }

  if (orderItems?.length <= 0) {
    throw new Error("No Order Items found");
  }

  const order = await Order.create({
    user: user?._id,
    orderItems,
    shippingAddress,
    totalPrice: couponFound ? totalPrice - totalPrice * discount : totalPrice * discount,
  });

  console.log(order);

  const products = await Product.find({ _id: { $in: orderItems } });

  orderItems?.map(async (order) => {
    const product = products.find((product) => {
      return product?._id?.toString() === order?._id?.toString();
    });

    if (product) {
      product.totalSold += order?.qty;
    }

    await product.save();
  });

  user.orders.push(order);
  await user.save();

  const convertedOrders = orderItems.map((item) => {
    return {
      price_data: {
        currency: "usd",
        product_data: {
          name: item?.name,
          description: item?.description,
        },
        unit_amount: item?.price * 100,
      },
      quantity: item?.qty,
    };
  });

  const session = await stripe.checkout.sessions.create({
    line_items: convertedOrders,
    metadata: {
      orderId: JSON.stringify(order?._id),
    },
    mode: "payment",
    success_url: "http://localhost:3000/success",
    cancel_url: "http://localhost:3000/cancel",
  });

  res.send({ url: session.url });
});

export const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find();

  res.json({
    status: 'success',
    msg: 'All Orders',
    orders,
  });
});

export const getOrder = asyncHandler(async (req,res) => {
  const id = req.params.id
  const order = await Order.findById(id);
  res.status(200).json({ 
    status: 'success', 
    msg: 'Order found successfully', 
    order 
  });
});

export const updateOrder = asyncHandler(async (req, res) => {
  const updatedOrder = await Order.findByIdAndUpdate(req.params.id, {
    status: req.body.status,

  }, {
    new: true,
  });

  res.status(200).json({
    statud: 'success',
    msg: 'Order Status Updated',
    updatedOrder,
  })
});

export const deleteOrder = asyncHandler(async (req,res) => {
  await Order.findByIdAndDelete(req.params.id);
  res.json({
    status: 'success',
    msg: 'Order deleted Successfully',
  })
});

export const getOrderSummary = asyncHandler(async (req,res) =>{
  // get the sales
  const ordersSummary = await Order.aggregate([
    {
      $group: {
        _id: null,
        totalSales: {
          $sum:  '$totalPrice',
        },
        maxiumSalePrice: {
          $max: '$totalPrice',
        },
        minimumSalePrice: {
          $min: '$totalPrice', 
        },
        aveageSale: {
          $avg: '$totalPrice',
        }
      }
    }
  ]);

  const date = new Date();
  const today = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const saleToday = await Order.aggregate([
    {
      $match: {
        createdAt:  {
          $gte: today,
        }
      }
    },
    {
      $group: {
        _id: null,
        totalSales: {
          $sum: '$totalPrice',
        }
      }
    }
  ]);

  
  res.json({
    status: 'success',
    msg: 'Total Sales',
    ordersSummary,
    saleToday,
  })
});
