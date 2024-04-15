import Product from "../models/Product.js";
import Category from "../models/Category.js";
import Brand from "../models/Brand.js";
import Color from "../models/Color.js";
import asyncHandler from "express-async-handler";

export const createProduct = asyncHandler(async (req, res) => {
  console.log(req.files);
  const { name, description, category, colors, sizes, price, totalQty, brand } =
    req.body;

  const productExists = await Product.findOne({ name });
  if (productExists) {
    throw new Error("Product already exists");
  }

  const categoryFound = await Category.findOne({ name: category });
  if (!categoryFound) {
    throw new Error(
      "Category not found. Please create a category first or check the category name"
    );
  }

  const brandFound = await Brand.findOne({ name: brand });
  if (!brandFound) {
    throw new Error(
      "Brand not found. Please create a brand first or check the brand name"
    );
  }

  const colorFound = await Color.findOne({ name: colors });
  if (!colorFound) {
    throw new Error(
      "Color not found. Please create a color first or check the color"
    );
  }

  const product = await Product.create({
    name,
    description,
    category,
    colors,
    sizes,
    price,
    totalQty,
    user: req.userAuthId,
    brand,
  });

  categoryFound?.products?.push(product._id);
  await categoryFound.save();

  brandFound?.products?.push(product._id);
  await brandFound.save();

  colorFound?.products?.push(product._id);
  await colorFound.save();

  res.json({
    status: "success",
    message: "Product created successfully",
    product,
  });
});

export const getAllProducts = asyncHandler(async (req, res) => {
  let productQuery = Product.find();

  // filter product by name
  if (req.query.name) {
    productQuery = productQuery.findOne({
      name: { $regex: req.query.name, $options: "i" },
    });
  }

  // filter product by brand
  if (req.query.brand) {
    productQuery = productQuery.findOne({
      brand: { $regex: req.query.brand, $options: "i" },
    });
  }

  // filter product by colors
  if (req.query.colors) {
    productQuery = productQuery.findOne({
      colors: { $regex: req.query.colors, $options: "i" },
    });
  }

  // filter product by category
  if (req.query.category) {
    productQuery = productQuery.findOne({
      category: { $regex: req.query.category, $options: "i" },
    });
  }

  // filter product by sizes
  if (req.query.sizes) {
    productQuery = productQuery.findOne({
      sizes: { $regex: req.query.sizes, $options: "i" },
    });
  }

  // filter product by price
  if (req.query.price) {
    const priceRange = req.query.price.split("-");

    productQuery = productQuery.findOne({
      price: { $gte: priceRange[0], $lte: priceRange[1] },
    });
  }

  // Pagination
  const page = parseInt(req.query.page) ? parseInt(req.query.page) : 1;
  const limit = parseInt(req.query.limit) ? parseInt(req.query.limit) : 10;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Product.countDocuments();

  productQuery = productQuery.skip(startIndex).limit(limit);

  const pagination = {};

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }

  const allProducts = await productQuery.populate("reviews");

  res.json({
    status: "success",
    total,
    results: allProducts.length,
    pagination,
    message: "Product fetched successfully",
    allProducts,
  });
});

export const getSingleProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id).populate("reviews");

  if (!product) {
    throw new Error("Product not found");
  }

  res.json({
    status: "success",
    message: "Product fetched successfully",
    product,
  });
});

export const updateProduct = asyncHandler(async (req, res) => {
  const {
    name,
    description,
    category,
    colors,
    sizes,
    price,
    totalQty,
    user,
    brand,
  } = req.body;

  const product = await Product.findByIdAndUpdate(
    req.params.id,
    {
      name,
      description,
      category,
      colors,
      sizes,
      price,
      totalQty,
      user,
      brand,
    },
    {
      new: true,
    }
  );
  res.json({
    status: "success",
    message: "Product updated successfully",
    product,
  });
});

export const deleteProduct = asyncHandler(async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);

  res.json({
    status: "success",
    message: "Product deleted successfully",
  });
});
