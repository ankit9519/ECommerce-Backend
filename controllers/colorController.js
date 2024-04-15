import Color from "../models/Color.js";
import asyncHandler from "express-async-handler";

export const createColor = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const colorFound = await Color.findOne({ name });

  if (colorFound) {
    throw new Error("Color already exists");
  }

  const color = await Color.create({
    name: name.toLowerCase(),
    user: req.userAuthId,
  });

  res.json({
    status: "success",
    message: "Color created successfully",
    color,
  });
});

export const getAllColor = asyncHandler(async (req, res) => {
  const colors = await Color.find();

  res.json({
    status: "success",
    message: "Colors fetched successfully",
    colors,
  });
});

export const getSingleColor = asyncHandler(async (req, res) => {
  const color = await Color.findById(req.params.id);

  res.json({
    status: "success",
    message: "Color fetched Successfully",
    color,
  });
});

export const updateColor = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const color = await Color.findByIdAndUpdate(req.params.id, {
    name: name.toLowerCase(),
  });

  res.json({
    status: "success",
    message: "Color Updated Successfully",
    color,
  });
});

export const deleteColor = asyncHandler(async (req, res) => {
  await Color.findByIdAndDelete(req.params.id);
  res.json({
    status: "success",
    message: "Color deleted Successfully",
  });
});
