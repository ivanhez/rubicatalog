// models/Inventory.js
import mongoose from "mongoose";

const inventorySchema = new mongoose.Schema(
  {
    descripcion: { type: String, required: true },
    color: { type: String, required: true },
    talla: { type: String, required: true },
    cantidad: { type: Number, default: 0 },
    codigo: { type: String, default: "" },
  },
  {
    timestamps: true,
    collection: "Inventory", // coleccion "Inventory"
  }
);

export const Inventory = mongoose.model("Inventory", inventorySchema);
