import express from "express";
import {
  getAllInventory,
  getInventoryById,
  getInventoryByCodigo,
  createInventory,
  updateInventory,
  deleteInventory,
} from "../controllers/inventoryController.js";

const router = express.Router();

// GET /api/inventario
router.get("/", getAllInventory);

// GET /api/inventario/:id
router.get("/:id", getInventoryById);

// GET /api/inventario/codigo/:codigo
router.get("/codigo/:codigo", getInventoryByCodigo);

// POST /api/inventario
router.post("/", createInventory);

// PUT /api/inventario/:id
router.put("/:id", updateInventory);

// DELETE /api/inventario/:id
router.delete("/:id", deleteInventory);

export default router;
