import express from "express";
import { createReview } from "../controllers/reviewContoller.js";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";

const router = express.Router();

router.post("/:productId", isLoggedIn, createReview);

export default router;
