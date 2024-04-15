import express from "express";
import {
  createBrand,
  getAllBrand,
  getSingleBrand,
  updateBrand,
  deleteBrand,
} from "../controllers/brandController.js";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";
import isAdmin from "../middlewares/isAdmin.js";

const router = express.Router();

router.post("/", isLoggedIn, isAdmin, createBrand);
router.get("/", getAllBrand);
router.get("/:id", getSingleBrand);
router.put("/:id", isLoggedIn, isAdmin, updateBrand);
router.delete("/:id", isLoggedIn,isAdmin, deleteBrand);

export default router;
