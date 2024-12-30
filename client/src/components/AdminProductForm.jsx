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
    fotos: [], // array de base64
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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /**
   * Manejar múltiples archivos
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
        // Concatenar nuevas imágenes con las que ya existen en form.fotos
        setForm({ ...form, fotos: [...form.fotos, ...base64Images] });
      })
      .catch((err) => console.error(err));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:4000/api/productos", {
        descripcion: form.descripcion,
        talla: form.talla,
        colores: form.colores,
        precio: form.precio,
        fotos: form.fotos,
      });
      alert("Producto creado");
      resetForm();
      fetchProductos();
    } catch (error) {
      console.error(error);
    }
  };

  const handleSelectProduct = (prod) => {
    setForm({
      id: prod.id,
      descripcion: prod.descripcion,
      talla: prod.talla,
      colores: prod.colores,
      precio: prod.precio,
      fotos: prod.fotos || [], // array base64
    });
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`http://localhost:4000/api/productos/${form.id}`, {
        descripcion: form.descripcion,
        talla: form.talla,
        colores: form.colores,
        precio: form.precio,
        fotos: form.fotos,
      });
      alert("Producto actualizado");
      resetForm();
      fetchProductos();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:4000/api/productos/${id}`);
      alert("Producto eliminado");
      fetchProductos();
    } catch (error) {
      console.error(error);
    }
  };

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
          <label>Imágenes (base64):</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
          />
        </div>

        {form.fotos.length > 0 && (
          <div style={{ display: "flex", gap: "1rem", margin: "1rem 0" }}>
            {form.fotos.map((foto, idx) => (
              <img
                key={idx}
                src={`data:image/jpeg;base64,${foto}`}
                alt="preview"
                style={{ width: 80, height: 80, objectFit: "cover" }}
              />
            ))}
          </div>
        )}

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
                {prod.fotos && prod.fotos.length > 0 ? (
                  prod.fotos.map((foto, idx) => (
                    <img
                      key={idx}
                      src={`data:image/jpeg;base64,${foto}`}
                      alt="prod"
                      style={{
                        width: 50,
                        height: 50,
                        objectFit: "cover",
                        marginRight: 5,
                      }}
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
