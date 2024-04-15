import express from "express";
import upload from '../config/fileUpload.js'
import {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";
import isAdmin from "../middlewares/isAdmin.js";

const router = express.Router();

router.post("/", isLoggedIn, isAdmin, upload.array('files'), createProduct);
router.get("/", getAllProducts);
router.get("/:id", getSingleProduct);
router.put("/:id", isLoggedIn, isAdmin, updateProduct);
router.delete("/:id", isLoggedIn, isAdmin, deleteProduct);

export default router;
