import express from "express";
import { createOrder } from "../controllers/orderController.js";

const router = express.Router();

router.post("/", createOrder); // POST /api/pedidos

export default router;
