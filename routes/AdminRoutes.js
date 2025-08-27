import express from "express";
import {
  adminLogin,
  getOrders,
  addProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../controllers/AdminController.js";
import upload from "../utils/uploads.js"

const router = express.Router();

router.post("/login", adminLogin);
router.get("/orders", getOrders);

router.post("/products", upload.single("image"), addProduct);
router.put("/products/:id", upload.single("image"), updateProduct);
router.get("/products", getAllProducts);
router.get("/products/:id", getProductById);
router.post("/products", addProduct);
router.put("/products/:id", updateProduct);
router.delete("/products/:id", deleteProduct);


export default router;
