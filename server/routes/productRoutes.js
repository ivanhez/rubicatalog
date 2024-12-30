import express from "express";
import {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";

const router = express.Router();

// GET /api/productos
router.get("/", getAllProducts);

// POST /api/productos
router.post("/", createProduct);

// PUT /api/productos/:id
router.put("/:id", updateProduct);

// DELETE /api/productos/:id
router.delete("/:id", deleteProduct);

export default router;
