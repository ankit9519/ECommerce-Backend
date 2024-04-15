import mongoose from "mongoose";

// Generate random numbers for order
const randomText = Math.random().toString(36).substring(7).toLocaleUpperCase();
const randomNumber = Math.floor(1000 + Math.random() * 90000);

const OrderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    orderItems: [
      {
        type: Object,
        required: true,
      },
    ],

    shippingAddress: {
      type: Object,
      required: true,
    },

    orderNumber: {
      type: String,
      required: true,
      default: randomText + randomNumber,
    },

    paymentStatus: {
      type: String,
      required: true,
      default: "Not Paid",
    },

    paymentMethod: {
      type: String,
      default: "Not Specified",
    },

    totalPrice: {
      type: Number,
      default: 0.0,
    },

    currency: {
      type: String,
      default: "Not Specified",
    },

    // For admin
    status: {
      type: String,
      default: "Pending",
      enum: ["Pending", "Processing", "Shipped", "Delivered"],
    },

    deliveredAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model("Order", OrderSchema);

export default Order;
