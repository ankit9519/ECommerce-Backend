import Brand from "../models/Brand.js";
import asyncHandler from "express-async-handler";

export const createBrand = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const brandFound = await Brand.findOne({ name });
  if (brandFound) {
    throw new Error("Brand already exists");
  }

  const brand = await Brand.create({
    name: name.toLowerCase(),
    user: req.userAuthId,
  });

  res.json({
    status: "success",
    message: "Brand created successfully",
    brand,
  });
});

export const getAllBrand = asyncHandler(async (req, res) => {
  const brand = await Brand.find();
  if (!brand) {
    throw new Error("Brand not found");
  }

  res.json({
    status: "success",
    msg: "Brand found successfully",
    brand,
  });
});

export const getSingleBrand = asyncHandler(async (req, res) => {
  const brand = await Brand.findById(req.params.id);
  if (!brand) {
    throw new Error("Brand not found");
  }

  res.json({
    status: "success",
    msg: "Brand fetched Successfully",
    brand,
  });
});

export const updateBrand = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const brand = await Brand.findByIdAndUpdate(req.params.id, {
    name: name.toLowerCase(),
  });

  res.json({
    status: "success",
    msg: "Brand updated successfully",
    brand,
  });
});

export const deleteBrand = asyncHandler(async (req, res) => {
  await Brand.findByIdAndDelete(req.params.id);
  res.json({
    status: "success",
    msg: "Brand deleted successfully",
  });
});
