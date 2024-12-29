import express from "express";
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";

const router = express.Router();

router.get("/", getAllProducts); // GET /api/productos
router.get("/:id", getProductById); // GET /api/productos/:id
router.post("/", createProduct); // POST /api/productos
router.put("/:id", updateProduct); // PUT /api/productos/:id
router.delete("/:id", deleteProduct); // DELETE /api/productos/:id

export default router;
