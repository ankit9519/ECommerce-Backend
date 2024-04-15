import User from "../models/User.js";
import asyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/generateToken.js";
import { getTokenFromHeader } from "../utils/getTokenFromHeader.js";
import { verifyToken } from "../utils/verifyToken.js";

export const register = asyncHandler(async (req, res) => {
  const { fullName, email, password } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    throw new Error("User already exists");
  }

  const salt = await bcrypt.genSalt(10);

  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await User.create({
    fullName,
    email,
    password: hashedPassword,
  });

  res.status(201).json({
    status: "success",
    message: "User created Successfully",
    data: user,
  });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const userFound = await User.findOne({ email });

  if (!userFound) {
    throw new Error("User not found");
  }

  const isMatch = await bcrypt.compare(password, userFound.password);

  if (!isMatch) {
    throw new Error("Please Check your Password");
  }

  res.json({
    status: "success",
    message: "User Logged In Successfully",
    userFound,
    token: generateToken(userFound?._id),
  });
});

export const profile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.userAuthId).populate('orders');
  res.json({
    status: 'success',
    msg: 'Profile fetched Successfully',
    user
  })
});

export const updateShippingAddress = asyncHandler(async (req, res) => {
  const { firstName, lastName, address, city, postalCode, state, phone } =
    req.body;

  const user = await User.findByIdAndUpdate(
    req.userAuthId,
    {
      shippingAddress: {
        firstName,
        lastName,
        address,
        city,
        postalCode,
        state,
        phone,
      },
      hasShippingAddress: true,
    },
    {
      new: true,
    }
  );

  res.json({
    status: "success",
    msg: "Shipping Address Updated Successfully",
    user,
  });
});
