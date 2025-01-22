import React, { useState, useEffect } from "react";
import axios from "axios";

const ITEMS_PER_PAGE = 8; // Cantidad por página

const AdminProductForm = () => {
  const [productos, setProductos] = useState([]);
  const [form, setForm] = useState({
    id: "",
    descripcion: "",
    talla: "",
    colores: "",
    precio: "",
    fotos: [],
    codigo: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchProductos(currentPage);
  }, [currentPage]);

  /** Obtener productos con paginación */
  const fetchProductos = async (page) => {
    try {
      const res = await axios.get(
        `https://rubiseduction.shop:4000/api/productos?page=${page}&limit=${ITEMS_PER_PAGE}`
      );
      // Estructura esperada: { productos, totalPages }
      setProductos(res.data.productos);
      setTotalPages(res.data.totalPages);
    } catch (error) {
      console.error(error);
      alert("Error al cargar los productos.");
    }
  };

  /** Manejo de cambios de formulario */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /** Manejo de archivos (múltiples) */
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
        setForm((prev) => ({
          ...prev,
          fotos: [...prev.fotos, ...base64Images],
        }));
      })
      .catch((err) => console.error(err));
  };

  /** Crear producto */
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
        codigo: form.codigo,
      });

      alert("Producto creado exitosamente.");
      resetForm();
      // Volver a la primera página o recargar la actual
      setCurrentPage(1);
    } catch (error) {
      console.error(error);
      alert("Error al crear el producto.");
    }
  };

  /** Seleccionar producto para edición */
  const handleSelectProduct = (prod) => {
    setForm({
      id: prod._id,
      descripcion: prod.descripcion,
      talla: prod.talla,
      colores: prod.colores,
      precio: prod.precio,
      fotos: prod.fotos || [],
      codigo: prod.codigo,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /** Actualizar producto */
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
          codigo: form.codigo,
        }
      );

      alert("Producto actualizado exitosamente.");
      resetForm();
      // Recargar la página actual
      fetchProductos(currentPage);
    } catch (error) {
      console.error(error);
      alert("Error al actualizar el producto.");
    }
  };

  /** Eliminar producto */
  const handleDelete = async (mongoId) => {
    try {
      const confirmDelete = window.confirm("¿Deseas eliminar este producto?");
      if (!confirmDelete) return;

      await axios.delete(
        `https://rubiseduction.shop:4000/api/productos/${mongoId}`
      );
      alert("Producto eliminado exitosamente.");
      // Recargar la página actual
      fetchProductos(currentPage);
    } catch (error) {
      console.error(error);
      alert("Error al eliminar el producto.");
    }
  };

  /** Resetear formulario */
  const resetForm = () => {
    setForm({
      id: "",
      descripcion: "",
      talla: "",
      colores: "",
      precio: "",
      fotos: [],
      codigo: "",
    });
  };

  /** Cambiar de página */
  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <div className="admin-container">
      <h2>Administrar Productos</h2>

      {/* Formulario */}
      <form onSubmit={handleCreate} className="admin-form">
        <div className="form-group">
          <label>Código:</label>
          <input
            type="text"
            name="codigo"
            value={form.codigo}
            onChange={handleChange}
            required
          />
        </div>
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
          {!form.id ? (
            <button type="submit" className="btn-primary">
              Crear Producto
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={handleUpdate}
                className="btn-secondary"
              >
                Actualizar Producto
              </button>
              <button type="button" onClick={resetForm} className="btn-reset">
                Cancelar
              </button>
            </>
          )}
        </div>
      </form>

      {/* TABLA (envuelta en un div con scroll horizontal si es necesario) */}
      <div className="table-responsive">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Código</th>
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
              <tr key={prod._id}>
                <td>{prod.codigo}</td>
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
                    onClick={() => handleDelete(prod._id)}
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

      {/* Paginación */}
      <div className="pagination">
        <button
          className="page-button"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          ←
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            className={`page-button ${page === currentPage ? "active" : ""}`}
            onClick={() => handlePageChange(page)}
          >
            {page}
          </button>
        ))}

        <button
          className="page-button"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          →
        </button>
      </div>
    </div>
  );
};

export default AdminProductForm;
