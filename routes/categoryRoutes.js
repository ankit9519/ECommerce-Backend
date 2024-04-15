import express from "express";
import {
  createCategory,
  getAllCategory,
  getSingleCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController.js";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";
import upload from "../config/fileUpload.js";
import isAdmin from "../middlewares/isAdmin.js";
const router = express.Router();

router.post("/", isLoggedIn, isAdmin, upload.single('file') ,createCategory);
router.get("/", getAllCategory);
router.get("/:id", getSingleCategory);
router.put("/:id", isLoggedIn, isAdmin, updateCategory);
router.delete("/:id", isLoggedIn, isAdmin, deleteCategory);

export default router;
