import React, { useState, useEffect } from "react";
import axios from "axios";

const InventoryPage = () => {
  const [inventory, setInventory] = useState([]); // lista de registros
  const [form, setForm] = useState({
    id: "",
    descripcion: "",
    color: "",
    talla: "",
    cantidad: "",
    codigo: "",
  });

  useEffect(() => {
    fetchInventory();
  }, []);

  /** 1. Obtener toda la lista de inventario */
  const fetchInventory = async () => {
    try {
      const res = await axios.get("https://rubiseduction.shop:4000/api/inventario");
      setInventory(res.data);
    } catch (err) {
      console.error(err);
      alert("Error al cargar el inventario.");
    }
  };

  /** 2. Manejar cambios en el formulario */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /** 3. Crear nuevo registro */
  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      // Confirmar
      const confirmCreate = window.confirm(
        "¿Crear este registro de inventario?"
      );
      if (!confirmCreate) return;

      await axios.post("https://rubiseduction.shop:4000/api/inventario", {
        descripcion: form.descripcion,
        color: form.color,
        talla: form.talla,
        cantidad: Number(form.cantidad),
        codigo: form.codigo,
      });

      alert("Registro creado exitosamente");
      resetForm();
      fetchInventory();
    } catch (err) {
      console.error(err);
      alert("Error al crear registro.");
    }
  };

  /** 4. Seleccionar registro para editar */
  const handleSelect = (item) => {
    setForm({
      id: item.id.toString(),
      descripcion: item.descripcion,
      color: item.color,
      talla: item.talla,
      cantidad: item.cantidad.toString(),
      codigo: item.codigo,
    });
    // Mover el scroll al formulario (opcional)
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /** 5. Actualizar un registro */
  const handleUpdate = async () => {
    try {
      const confirmUpdate = window.confirm("¿Actualizar este registro?");
      if (!confirmUpdate) return;

      await axios.put(`https://rubiseduction.shop:4000/api/inventario/${form.id}`, {
        descripcion: form.descripcion,
        color: form.color,
        talla: form.talla,
        cantidad: Number(form.cantidad),
        codigo: form.codigo,
      });

      alert("Registro actualizado correctamente.");
      resetForm();
      fetchInventory();
    } catch (err) {
      console.error(err);
      alert("Error al actualizar registro.");
    }
  };

  /** 6. Eliminar un registro */
  const handleDelete = async (id) => {
    try {
      const confirmDelete = window.confirm("¿Eliminar este registro?");
      if (!confirmDelete) return;

      await axios.delete(`https://rubiseduction.shop:4000/api/inventario/${id}`);
      alert("Registro eliminado.");
      fetchInventory();
    } catch (err) {
      console.error(err);
      alert("Error al eliminar registro.");
    }
  };

  /** 7. Resetear formulario */
  const resetForm = () => {
    setForm({
      id: "",
      descripcion: "",
      color: "",
      talla: "",
      cantidad: "",
      codigo: "",
    });
  };

  return (
    <div className="inventory-container">
      <h1>Gestión de Inventario</h1>

      {/* Formulario */}
      <form onSubmit={handleCreate} className="inventory-form">
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
          <label>Color:</label>
          <input
            type="text"
            name="color"
            value={form.color}
            onChange={handleChange}
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
          <label>Cantidad:</label>
          <input
            type="number"
            name="cantidad"
            value={form.cantidad}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Código:</label>
          <input
            type="text"
            name="codigo"
            value={form.codigo}
            onChange={handleChange}
          />
        </div>

        <div className="form-actions">
          {/* Si form.id está vacío => crear, si no => actualizar */}
          {!form.id ? (
            <button type="submit" className="btn btn-primary">
              Crear
            </button>
          ) : (
            <>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleUpdate}
              >
                Actualizar
              </button>
              <button
                type="button"
                className="btn btn-reset"
                onClick={resetForm}
              >
                Cancelar
              </button>
            </>
          )}
        </div>
      </form>

      {/* Tabla */}
      <table className="inventory-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Descripción</th>
            <th>Color</th>
            <th>Talla</th>
            <th>Cantidad</th>
            <th>Código</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {inventory.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.descripcion}</td>
              <td>{item.color}</td>
              <td>{item.talla}</td>
              <td>{item.cantidad}</td>
              <td>{item.codigo}</td>
              <td>
                <button onClick={() => handleSelect(item)}>Editar</button>
                <button onClick={() => handleDelete(item.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InventoryPage;
