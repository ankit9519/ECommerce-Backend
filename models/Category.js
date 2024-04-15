import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: "String",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    image: {
      type: String,
      default:
        "https://as2.ftcdn.net/v2/jpg/00/81/38/59/1000_F_81385977_wNaDMtgrIj5uU5QEQLcC9UNzkJc57xbu.jpg",
      required: true,
    },
    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Category = mongoose.model("Category", categorySchema);

export default Category;
