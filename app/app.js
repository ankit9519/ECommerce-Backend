import express from "express";
import dotenv from "dotenv";
import Stripe from "stripe";
import cors from "cors";
import connectDB from "../config/db.js";
import userRoutes from "../routes/userRoutes.js";
import productRoutes from "../routes/productRoutes.js";
import categoryRoutes from "../routes/categoryRoutes.js";
import brandRoutes from "../routes/brandRoutes.js";
import colorRoutes from "../routes/colorRoutes.js";
import reviewRoutes from "../routes/reviewRoutes.js";
import orderRoutes from "../routes/orderRoutes.js";
import couponRoutes from "../routes/couponRoutes.js";
import { errorHandler, notFound } from "../middlewares/errorHandler.js";
import Order from "../models/Order.js";

dotenv.config();
const stripe = new Stripe(process.env.STRIPE_KEY);
const app = express();

app.use(cors());

connectDB();

const endpointSecret =
  "whsec_0ca82b95221630b532241648cabf874479ed757a464cfe4986082d5614292c8b";

app.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (request, response) => {
    const sig = request.headers["stripe-signature"];

    let event;

    try {
      event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
    } catch (err) {
      response.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const { orderId } = session.metadata;
      const paymentStatus = session.payment_status;
      const paymentMethod = session.payment_method_types[0];
      const totalAmount = session.amount_total;
      const currency = session.currency;

      const updatedOrder = await Order.findByIdAndUpdate(
        JSON.parse(orderId),
        {
          totalPrice: totalAmount / 100,
          currency,
          paymentMethod,
          paymentStatus,
        },
        {
          new: true,
        }
      );

      console.log(updatedOrder);
    } else {
      return;
    }

    response.send();
  }
);

app.use(express.json());

app.use("/users", userRoutes);
app.use("/products", productRoutes);
app.use("/category", categoryRoutes);
app.use("/brand", brandRoutes);
app.use("/colors", colorRoutes);
app.use("/reviews", reviewRoutes);
app.use("/orders", orderRoutes);
app.use("/coupon", couponRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
