import express from "express";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";
import { createOrder, getAllOrders, getOrder, getOrderSummary, updateOrder } from "../controllers/orderController.js";

const router = express.Router();

router.post("/", isLoggedIn, createOrder);
router.get("/", isLoggedIn, getAllOrders);
router.get("/stats", isLoggedIn, getOrderSummary)
router.get("/:id", isLoggedIn, getOrder); 
router.put("/:id", isLoggedIn, updateOrder); 

export default router;
