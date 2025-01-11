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

router.get("/", getAllInventory);           // GET /api/inventario
router.get("/:id", getInventoryById);       // GET /api/inventario/:id
router.get("/codigo/:codigo", getInventoryByCodigo);       // GET /api/inventario/codigo/:id
router.post("/", createInventory);          // POST /api/inventario
router.put("/:id", updateInventory);        // PUT /api/inventario/:id
router.delete("/:id", deleteInventory);     // DELETE /api/inventario/:id

export default router;
