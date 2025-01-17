// controllers/inventoryController.js
import { Inventory } from "../models/Inventory.js";

/**
 * Obtener todo el inventario
 */
export const getAllInventory = async (req, res) => {
  try {
    // Devuelve todos los documentos
    const rows = await Inventory.find();
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
    const doc = await Inventory.findById(id);
    if (!doc) {
      return res
        .status(404)
        .json({ message: "Registro de inventario no encontrado" });
    }
    res.json(doc);
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
    // Si tu lógica es "todos los items que tengan ese código"
    // => find({ codigo })
    const rows = await Inventory.find({ codigo: codigo });
    if (rows.length === 0) {
      return res
        .status(404)
        .json({ message: "Código de inventario no encontrado" });
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
    const newItem = new Inventory({
      descripcion,
      color,
      talla,
      cantidad,
      codigo,
    });
    const saved = await newItem.save();
    res.json(saved);
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

    // { new: true } => retorna el documento actualizado
    const updated = await Inventory.findByIdAndUpdate(
      id,
      { descripcion, color, talla, cantidad, codigo },
      { new: true }
    );

    if (!updated) {
      return res
        .status(404)
        .json({ message: "Registro de inventario no encontrado" });
    }
    res.json({
      message: "Registro de inventario actualizado correctamente",
      updated,
    });
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
    const removed = await Inventory.findByIdAndDelete(id);
    if (!removed) {
      return res
        .status(404)
        .json({ message: "Registro de inventario no encontrado" });
    }
    res.json({ message: "Registro de inventario eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
