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
    foto: "",
  });

  useEffect(() => {
    fetchProductos();
  }, []);

  const fetchProductos = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/productos");
      setProductos(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  // Manejar cambios en los inputs de texto
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Manejar la carga de archivo (imagen)
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Convertir archivo a base64
    const reader = new FileReader();
    reader.onload = (evt) => {
      const base64String = evt.target.result.split(",")[1];
      setForm({ ...form, foto: base64String });
    };
    reader.readAsDataURL(file);
  };

  // Crear nuevo producto
  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:4000/api/productos", {
        descripcion: form.descripcion,
        talla: form.talla,
        colores: form.colores,
        precio: form.precio,
        foto: form.foto,
      });
      alert("Producto creado");
      setForm({
        id: "",
        descripcion: "",
        talla: "",
        colores: "",
        precio: "",
        foto: "",
      });
      fetchProductos();
    } catch (error) {
      console.error(error);
    }
  };

  // Seleccionar producto para edición
  const handleSelectProduct = (prod) => {
    setForm({
      id: prod.id,
      descripcion: prod.descripcion,
      talla: prod.talla,
      colores: prod.colores,
      precio: prod.precio,
      foto: prod.foto, // base64
    });
  };

  // Actualizar producto
  const handleUpdate = async () => {
    try {
      await axios.put(`http://localhost:4000/api/productos/${form.id}`, {
        descripcion: form.descripcion,
        talla: form.talla,
        colores: form.colores,
        precio: form.precio,
        foto: form.foto,
      });
      alert("Producto actualizado");
      setForm({
        id: "",
        descripcion: "",
        talla: "",
        colores: "",
        precio: "",
        foto: "",
      });
      fetchProductos();
    } catch (error) {
      console.error(error);
    }
  };

  // Eliminar producto
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:4000/api/productos/${id}`);
      alert("Producto eliminado");
      fetchProductos();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h2>Administrar Productos</h2>
      <form onSubmit={handleCreate} style={{ marginBottom: "1rem" }}>
        <div>
          <label>Descripción:</label>
          <input
            type="text"
            name="descripcion"
            value={form.descripcion}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Talla:</label>
          <input
            type="text"
            name="talla"
            value={form.talla}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Colores:</label>
          <input
            type="text"
            name="colores"
            value={form.colores}
            onChange={handleChange}
          />
        </div>
        <div>
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
        <div>
          <label>Imagen (base64):</label>
          <input type="file" accept="image/*" onChange={handleFileChange} />
          {/* Si deseas ver un preview de la imagen base64 */}
          {form.foto && (
            <div style={{ marginTop: "1rem" }}>
              <img
                src={`data:image/png;base64,${form.foto}`}
                alt="preview"
                style={{ width: 100, height: 100, objectFit: "cover" }}
              />
            </div>
          )}
        </div>
        <div style={{ marginTop: "1rem" }}>
          <button type="submit">Crear Producto</button>
          {form.id && (
            <button
              type="button"
              onClick={handleUpdate}
              style={{ marginLeft: "1rem" }}
            >
              Actualizar Producto
            </button>
          )}
        </div>
      </form>

      <table
        border="1"
        cellPadding="5"
        style={{ width: "100%", textAlign: "left" }}
      >
        <thead>
          <tr>
            <th>ID</th>
            <th>Descripción</th>
            <th>Talla</th>
            <th>Colores</th>
            <th>Precio</th>
            <th>Foto (base64)</th>
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
                {prod.foto && (
                  <img
                    src={`data:image/png;base64,${prod.foto}`}
                    alt={prod.descripcion}
                    style={{
                      width: "80px",
                      height: "80px",
                      objectFit: "cover",
                    }}
                  />
                )}
              </td>
              <td>
                <button onClick={() => handleSelectProduct(prod)}>
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(prod.id)}
                  style={{ marginLeft: "0.5rem" }}
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
