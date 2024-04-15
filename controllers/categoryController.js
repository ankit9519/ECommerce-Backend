import Category from "../models/Category.js";
import asyncHandler from "express-async-handler";

export const createCategory = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const categoryFound = await Category.findOne({ name });

  if (categoryFound) {
    throw new Error("Category already exists");
  }

  const category = await Category.create({
    name: name.toLowerCase(),
    user: req.userAuthId,
    image: req.file.path,
  });

  res.json({
    status: "success",
    message: "Category created successfully",
    category,
  });
});

export const getAllCategory = asyncHandler(async (req, res) => {
  const categories = await Category.find();

  res.json({
    status: "success",
    message: "Categories fetched successfully",
    categories,
  });
});

export const getSingleCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  res.json({
    status: "success",
    message: "Category fetched Successfully",
    category,
  });
});

export const updateCategory = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const category = await Category.findByIdAndUpdate(req.params.id, {
    name: name.toLowerCase(),
  });

  res.json({
    status: "success",
    message: "Category Updated Successfully",
    category,
  });
});

export const deleteCategory = asyncHandler(async (req, res) => {
  await Category.findByIdAndDelete(req.params.id);
  res.json({
    status: "success",
    message: "Category deleted Successfully",
  });
});
