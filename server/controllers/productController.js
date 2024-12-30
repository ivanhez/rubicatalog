import { pool } from "../config/db.js";

/**
 * Obtener todos los productos
 */
export const getAllProducts = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM productos");
    // 'fotos' viene almacenado como string JSON, debemos parsearlo antes de enviarlo al frontend (opcional)
    const productos = rows.map((row) => {
      return {
        ...row,
        fotos: row.fotos ? JSON.parse(row.fotos) : [], // Parse JSON
      };
    });
    res.json(productos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Obtener detalle de un producto por ID
 */
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query("SELECT * FROM productos WHERE id = ?", [
      id,
    ]);
    if (rows.length === 0) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }
    const product = rows[0];
    // Parsear fotos
    product.fotos = product.fotos ? JSON.parse(product.fotos) : [];
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Crear un producto con varias fotos en base64
 */
export const createProduct = async (req, res) => {
  try {
    const { descripcion, talla, colores, precio, fotos } = req.body;
    /*
      fotos => array de strings base64
      Ejemplo: ["BASE64_1", "BASE64_2", ...]
    */
    const fotosJSON = JSON.stringify(fotos || []);
    const [result] = await pool.query(
      "INSERT INTO productos (descripcion, talla, colores, precio, fotos) VALUES (?, ?, ?, ?, ?)",
      [descripcion, talla, colores, precio, fotosJSON]
    );
    res.json({
      id: result.insertId,
      descripcion,
      talla,
      colores,
      precio,
      fotos,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Actualizar un producto
 */
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { descripcion, talla, colores, precio, fotos } = req.body;
    const fotosJSON = JSON.stringify(fotos || []);
    const [result] = await pool.query(
      "UPDATE productos SET descripcion=?, talla=?, colores=?, precio=?, fotos=? WHERE id=?",
      [descripcion, talla, colores, precio, fotosJSON, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }
    res.json({ message: "Producto actualizado correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Eliminar un producto
 */
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
