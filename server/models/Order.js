// models/Order.js
import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  cantidad: Number,
  talla: String,
  color: String,
  precioUnitario: Number,
  subtotal: Number,
});

const orderSchema = new mongoose.Schema(
  {
    estado: { type: String, default: "pendiente" },
    total: { type: Number, default: 0 },
    items: [orderItemSchema],
  },
  { timestamps: true, collection: "Order" }
);

export const Order = mongoose.model("Order", orderSchema);
