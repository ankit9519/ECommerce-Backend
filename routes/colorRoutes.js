import express from "express";
import {
  createColor,
  getAllColor,
  getSingleColor,
  updateColor,
  deleteColor,
} from "../controllers/colorController.js";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";
import isAdmin from "../middlewares/isAdmin.js";
const router = express.Router();

router.post("/", isLoggedIn, isAdmin, createColor);
router.get("/", getAllColor);
router.get("/:id", getSingleColor);
router.put("/:id", isLoggedIn, isAdmin, updateColor);
router.delete("/:id", isLoggedIn, isAdmin, deleteColor);

export default router;
