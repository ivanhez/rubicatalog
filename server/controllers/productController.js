import { pool } from "../config/db.js";

export const getAllProducts = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM productos");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query("SELECT * FROM productos WHERE id = ?", [
      id,
    ]);
    if (rows.length === 0) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { descripcion, talla, colores, precio, foto } = req.body;
    const [result] = await pool.query(
      "INSERT INTO productos (descripcion, talla, colores, precio, foto) VALUES (?, ?, ?, ?, ?)",
      [descripcion, talla, colores, precio, foto]
    );
    res.json({
      id: result.insertId,
      descripcion,
      talla,
      colores,
      precio,
      foto,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { descripcion, talla, colores, precio, foto } = req.body;
    const [result] = await pool.query(
      "UPDATE productos SET descripcion=?, talla=?, colores=?, precio=?, foto=? WHERE id=?",
      [descripcion, talla, colores, precio, foto, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }
    res.json({ message: "Producto actualizado correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query("DELETE FROM productos WHERE id = ?", [
      id,
    ]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }
    res.json({ message: "Producto eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
