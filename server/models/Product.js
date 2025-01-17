// models/Product.js
import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    descripcion: { type: String, required: true },
    talla: { type: String, default: "" },
    colores: { type: String, default: "" },
    precio: { type: Number, default: 0 },
    fotos: [{ type: String }], // array de base64
  },
  {
    timestamps: true,
    // Forzamos la colección "Product"
    collection: "Product",
  }
);

export const Product = mongoose.model("Product", productSchema);
