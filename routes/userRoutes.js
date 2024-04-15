import express from "express";
import {
  register,
  login,
  profile,
  updateShippingAddress,
} from "../controllers/userController.js";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/profile", isLoggedIn, profile);
router.put("/address", isLoggedIn, updateShippingAddress);

export default router;
