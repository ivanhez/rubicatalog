import { pool } from "../config/db.js";

export const createOrder = async (req, res) => {
  try {
    const { productos } = req.body;
    /*
      productos => [
        { id: 1, cantidad: 2, talla: "M", color: "Rojo" },
        { id: 2, cantidad: 3, talla: "S", color: "Azul" },
        ...
      ]
    */

    // 1. Crear registro en la tabla 'pedidos'
    const [orderResult] = await pool.query(
      "INSERT INTO pedidos (estado) VALUES (?)",
      ["pendiente"]
    );
    const pedidoId = orderResult.insertId;

    let total = 0;

    // 2. Insertar detalles en 'pedidos_detalles'
    for (let producto of productos) {
      const { id, cantidad, talla, color } = producto;
      // Obtener precio del producto
      const [rows] = await pool.query(
        "SELECT precio FROM productos WHERE id = ?",
        [id]
      );
      const precioUnitario = rows[0].precio || 0;
      const subtotal = precioUnitario * cantidad;
      total += subtotal;

      // Insertar detalle con talla y color
      await pool.query(
        "INSERT INTO pedidos_detalles (pedido_id, producto_id, cantidad, talla, color) VALUES (?, ?, ?, ?, ?)",
        [pedidoId, id, cantidad, talla, color]
      );
    }

    // 3. Actualizar el total en la tabla 'pedidos'
    await pool.query("UPDATE pedidos SET total = ? WHERE id = ?", [
      total,
      pedidoId,
    ]);

    res.json({ message: "Pedido creado correctamente", pedidoId, total });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};
