import Review from "../models/Review.js";
import Product from "../models/Product.js";
import asyncHandler from "express-async-handler";

export const createReview = asyncHandler(async (req, res) => {
  const { message, rating } = req.body;
  const { productId } = req.params;
  const productFound = await Product.findById(productId);

  if (!productFound) {
    throw new Error("Product Not Found!");
  }

  const hasReviewed = productFound?.reviews?.find((review) => {
    return review.user.toString() === req.userAuthId.toString();
  });

  if (hasReviewed) {
    throw new Error("User Already reviewed this product!");
  }

  const review = await Review.create({
    message,
    rating,
    products: productFound?._id,
    user: req.userAuthId,
  });

  productFound.reviews.push(review._id);
  await productFound.save();

  res.status(201).json({
    status: true,
    msg: "Review created successfully",
  });
});
