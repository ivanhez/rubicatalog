import React, { useState, useEffect } from "react";
import axios from "axios";

const AdminProductForm = () => {
  const [productos, setProductos] = useState([]);
  const [form, setForm] = useState({
    id: "",
    descripcion: "",
    talla: "",
    colores: "",
    precio: "",
    fotos: [],
  });

  useEffect(() => {
    fetchProductos();
  }, []);

  const fetchProductos = async () => {
    try {
      const res = await axios.get(
        "https://rubiseduction.shop:4000/api/productos"
      );
      setProductos(res.data);
    } catch (error) {
      console.error(error);
      alert("Error al cargar los productos.");
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /**
   * Manejo de archivos (múltiples)
   */
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    let promises = files.map((file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (evt) => {
          const base64String = evt.target.result.split(",")[1];
          resolve(base64String);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    });

    Promise.all(promises)
      .then((base64Images) => {
        setForm({ ...form, fotos: [...form.fotos, ...base64Images] });
      })
      .catch((err) => console.error(err));
  };

  /**
   * Crear producto
   */
  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const confirmCreate = window.confirm("¿Deseas crear este producto?");
      if (!confirmCreate) return;

      await axios.post("https://rubiseduction.shop:4000/api/productos", {
        descripcion: form.descripcion,
        talla: form.talla,
        colores: form.colores,
        precio: form.precio,
        fotos: form.fotos,
      });

      alert("Producto creado exitosamente.");
      resetForm();
      fetchProductos();
    } catch (error) {
      console.error(error);
      alert("Error al crear el producto.");
    }
  };

  /**
   * Seleccionar producto para edición
   */
  const handleSelectProduct = (prod) => {
    setForm({
      id: prod.id,
      descripcion: prod.descripcion,
      talla: prod.talla,
      colores: prod.colores,
      precio: prod.precio,
      fotos: prod.fotos || [],
    });
    // Podrías hacer scroll al formulario (opcional)
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /**
   * Actualizar producto
   */
  const handleUpdate = async () => {
    try {
      const confirmUpdate = window.confirm("¿Deseas actualizar este producto?");
      if (!confirmUpdate) return;

      await axios.put(
        `https://rubiseduction.shop:4000/api/productos/${form.id}`,
        {
          descripcion: form.descripcion,
          talla: form.talla,
          colores: form.colores,
          precio: form.precio,
          fotos: form.fotos,
        }
      );

      alert("Producto actualizado exitosamente.");
      resetForm();
      fetchProductos();
    } catch (error) {
      console.error(error);
      alert("Error al actualizar el producto.");
    }
  };

  /**
   * Eliminar producto
   */
  const handleDelete = async (id) => {
    try {
      const confirmDelete = window.confirm("¿Deseas eliminar este producto?");
      if (!confirmDelete) return;

      await axios.delete(`https://rubiseduction.shop:4000/api/productos/${id}`);
      alert("Producto eliminado exitosamente.");
      fetchProductos();
    } catch (error) {
      console.error(error);
      alert("Error al eliminar el producto.");
    }
  };

  /**
   * Resetear formulario
   */
  const resetForm = () => {
    setForm({
      id: "",
      descripcion: "",
      talla: "",
      colores: "",
      precio: "",
      fotos: [],
    });
  };

  return (
    <div className="admin-container">
      <h2>Administrar Productos</h2>

      <form onSubmit={handleCreate} className="admin-form">
        <div className="form-group">
          <label>Descripción:</label>
          <input
            type="text"
            name="descripcion"
            value={form.descripcion}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Talla:</label>
          <input
            type="text"
            name="talla"
            value={form.talla}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Colores:</label>
          <input
            type="text"
            name="colores"
            value={form.colores}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Precio:</label>
          <input
            type="number"
            name="precio"
            value={form.precio}
            onChange={handleChange}
            step="0.01"
            required
          />
        </div>
        <div className="form-group">
          <label>Imágenes (base64):</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
          />
        </div>

        {/* Previsualizar fotos seleccionadas */}
        {form.fotos.length > 0 && (
          <div className="preview-container">
            {form.fotos.map((foto, idx) => (
              <img
                key={idx}
                src={`data:image/jpeg;base64,${foto}`}
                alt="preview"
                className="preview-image"
              />
            ))}
          </div>
        )}

        <div className="form-actions">
          <button type="submit" className="btn-primary">
            Crear Producto
          </button>
          {form.id && (
            <button
              type="button"
              onClick={handleUpdate}
              className="btn-secondary"
            >
              Actualizar Producto
            </button>
          )}
          {form.id && (
            <button type="button" onClick={resetForm} className="btn-reset">
              Cancelar
            </button>
          )}
        </div>
      </form>

      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Descripción</th>
            <th>Talla</th>
            <th>Colores</th>
            <th>Precio</th>
            <th>Imágenes</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productos.map((prod) => (
            <tr key={prod.id}>
              <td>{prod.id}</td>
              <td>{prod.descripcion}</td>
              <td>{prod.talla}</td>
              <td>{prod.colores}</td>
              <td>{prod.precio}</td>
              <td>
                {Array.isArray(prod.fotos) && prod.fotos.length > 0 ? (
                  prod.fotos.map((foto, idx) => (
                    <img
                      key={idx}
                      src={`data:image/jpeg;base64,${foto}`}
                      alt="prod"
                      className="prod-image"
                    />
                  ))
                ) : (
                  <span>Sin imágenes</span>
                )}
              </td>
              <td>
                <button onClick={() => handleSelectProduct(prod)}>
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(prod.id)}
                  className="btn-delete"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminProductForm;
