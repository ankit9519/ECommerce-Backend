import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    brand: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      ref: "Category",
      required: true,
    },
    sizes: {
      type: [String],
      enum: ["S", "M", "L", "XL", "XXL"],
      required: true,
    },
    colors: {
      type: [String],
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    images: [
      {
        type: String,
        default: "",
      },
    ],
    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
    price: {
      type: Number,
      required: true,
    },
    totalQty: {
      type: Number,
      required: true,
    },
    totalSold: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
);

ProductSchema.virtual("qtyLeft").get(function () {
  const products = this;
  return products.totalQty - products.totalSold;
});

ProductSchema.virtual("totalReviews").get(function () {
  const products = this;
  return products?.reviews?.length;
});

ProductSchema.virtual("averageRating").get(function () {
  let ratingsTotal = 0;
  const products = this;
  products.reviews.forEach((review) => {
    ratingsTotal += review?.rating;
  });

  const averageRating = Number(ratingsTotal / products?.reviews.length).toFixed(
    1
  );
  return averageRating;
});

const Product = mongoose.model("Product", ProductSchema);

export default Product;
