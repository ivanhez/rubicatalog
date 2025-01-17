// controllers/productController.js
import { Product } from "../models/Product.js";

/**
 * Obtener todos los productos
 */
export const getAllProducts = async (req, res) => {
  try {
    // Encuentra todos los documentos de 'Product'
    const productos = await Product.find();
    // No necesitas parsear 'fotos': ya es un array en el schema
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
    // Buscar por _id
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }
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
    // fotos => array de strings base64
    // Ejemplo: ["BASE64_1", "BASE64_2", ...]

    // Creamos un nuevo documento Mongoose
    const newProduct = new Product({
      descripcion,
      talla,
      colores,
      precio,
      fotos: fotos || [],
    });

    // Guardar en MongoDB
    const savedProduct = await newProduct.save();
    res.json(savedProduct);
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

    // findByIdAndUpdate => busca y actualiza
    const updated = await Product.findByIdAndUpdate(
      id,
      {
        descripcion,
        talla,
        colores,
        precio,
        fotos: fotos || [],
      },
      { new: true } // retorna el doc actualizado
    );

    if (!updated) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }
    res.json({ message: "Producto actualizado correctamente", updated });
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
    const removed = await Product.findByIdAndDelete(id);
    if (!removed) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }
    res.json({ message: "Producto eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// productController.js (Mongoose / MongoDB ejemplo)
export const getAllProductsPaginated = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 8;

    // Contar total de documentos
    const totalDocs = await Product.countDocuments();

    // Encontrar productos con skip/limit
    const productos = await Product.find()
      .skip((page - 1) * limit)
      .limit(limit);

    // Calcular total de páginas
    const totalPages = Math.ceil(totalDocs / limit);

    res.json({
      productos,
      totalDocs,
      totalPages,
      currentPage: page,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
