// controllers/orderController.js
import { Order } from "../models/Order.js";

/**
 * Crear un pedido
 */
export const createOrder = async (req, res) => {
  try {
    // datos en req.body => { estado, total, items: [{ productId, cantidad, talla, color, precioUnitario, subtotal }] }
    const { estado, total, items } = req.body;

    // Crear la instancia del modelo
    const newOrder = new Order({
      estado,
      total,
      items
    });

    // Guardar en la base de datos
    const savedOrder = await newOrder.save();

    // Devolver la respuesta
    res.json(savedOrder);
  } catch (error) {
    console.error("Error al crear pedido:", error);
    return res.status(500).json({ error: "Error al crear el pedido" });
  }
};
