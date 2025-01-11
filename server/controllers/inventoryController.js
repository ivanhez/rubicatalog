import { pool } from "../config/db.js";

/**
 * Obtener todo el inventario
 */
export const getAllInventory = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM inventario");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Obtener registro de inventario por ID
 */
export const getInventoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query("SELECT * FROM inventario WHERE id = ?", [
      id,
    ]);
    if (rows.length === 0) {
      return res
        .status(404)
        .json({ message: "Registro de inventario no encontrado" });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Obtener registro de inventario por codigo
 */
export const getInventoryByCodigo = async (req, res) => {
  try {
    const { codigo } = req.params;
    const [rows] = await pool.query("SELECT * FROM inventario WHERE codigo = ?", [
      codigo,
    ]);
    if (rows.length === 0) {
      return res
        .status(404)
        .json({ message: "Codigo de inventario no encontrado" });
    }
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
/**
 * Crear un registro de inventario
 */
export const createInventory = async (req, res) => {
  try {
    const { descripcion, color, talla, cantidad, codigo } = req.body;
    const [result] = await pool.query(
      "INSERT INTO inventario (descripcion, color, talla, cantidad, codigo) VALUES (?, ?, ?, ?, ?)",
      [descripcion, color, talla, cantidad, codigo]
    );
    res.json({
      id: result.insertId,
      descripcion,
      color,
      talla,
      cantidad,
      codigo,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Actualizar un registro de inventario
 */
export const updateInventory = async (req, res) => {
  try {
    const { id } = req.params;
    const { descripcion, color, talla, cantidad, codigo } = req.body;

    const [result] = await pool.query(
      "UPDATE inventario SET descripcion=?, color=?, talla=?, cantidad=?, codigo=? WHERE id=?",
      [descripcion, color, talla, cantidad, codigo, id]
    );
    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ message: "Registro de inventario no encontrado" });
    }
    res.json({ message: "Registro de inventario actualizado correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Eliminar un registro de inventario
 */
export const deleteInventory = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query("DELETE FROM inventario WHERE id = ?", [
      id,
    ]);
    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ message: "Registro de inventario no encontrado" });
    }
    res.json({ message: "Registro de inventario eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
