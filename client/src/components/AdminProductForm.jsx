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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

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

  const handleSelectProduct = (prod) => {
    setForm({
      id: prod.id,
      descripcion: prod.descripcion,
      talla: prod.talla,
      colores: prod.colores,
      precio: prod.precio,
      foto: prod.foto,
    });
  };

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
        <input
          type="text"
          name="descripcion"
          placeholder="Descripción"
          value={form.descripcion}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="talla"
          placeholder="Talla"
          value={form.talla}
          onChange={handleChange}
        />
        <input
          type="text"
          name="colores"
          placeholder="Colores"
          value={form.colores}
          onChange={handleChange}
        />
        <input
          type="number"
          name="precio"
          placeholder="Precio"
          value={form.precio}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="foto"
          placeholder="URL de la foto"
          value={form.foto}
          onChange={handleChange}
        />
        <button type="submit">Crear Producto</button>

        {form.id && (
          <button type="button" onClick={handleUpdate}>
            Actualizar Producto
          </button>
        )}
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
            <th>Foto</th>
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
                    src={prod.foto}
                    alt={prod.descripcion}
                    style={{ height: "50px" }}
                  />
                )}
              </td>
              <td>
                <button onClick={() => handleSelectProduct(prod)}>
                  Editar
                </button>
                <button onClick={() => handleDelete(prod.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminProductForm;
