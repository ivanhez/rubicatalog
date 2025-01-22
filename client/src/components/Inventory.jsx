import React, { useState, useEffect } from "react";
import axios from "axios";
// Puedes usar react-icons
import { FaEdit, FaTrash, FaSave, FaTimes } from "react-icons/fa";

const InventoryPage = () => {
  const [inventory, setInventory] = useState([]);
  const [editingRow, setEditingRow] = useState(null); // _id de la fila en edición

  // Buscador / orden
  const [searchText, setSearchText] = useState("");
  const [sortField, setSortField] = useState("");
  const [sortAsc, setSortAsc] = useState(true);

  // Form para crear
  const [formNew, setFormNew] = useState({
    descripcion: "",
    color: "",
    talla: "",
    cantidad: "",
    codigo: "",
  });

  useEffect(() => {
    fetchInventory();
  }, []);

  /** 1. Obtener lista de inventario */
  const fetchInventory = async () => {
    try {
      const res = await axios.get(
        "https://rubiseduction.shop:4000/api/inventario"
      );
      setInventory(res.data);
    } catch (err) {
      console.error(err);
      alert("Error al cargar el inventario.");
    }
  };

  /** 2. Edición de filas */
  const handleEditRow = (rowId) => {
    setEditingRow(rowId);
  };

  const handleCellChange = (rowId, field, value) => {
    setInventory((prev) =>
      prev.map((item) =>
        item._id === rowId ? { ...item, [field]: value } : item
      )
    );
  };

  const handleSaveRow = async (rowId) => {
    try {
      const confirmUpdate = window.confirm("¿Actualizar este registro?");
      if (!confirmUpdate) return;

      const rowData = inventory.find((i) => i._id === rowId);
      if (!rowData) return;

      await axios.put(
        `https://rubiseduction.shop:4000/api/inventario/${rowId}`,
        {
          descripcion: rowData.descripcion,
          color: rowData.color,
          talla: rowData.talla,
          cantidad: Number(rowData.cantidad),
          codigo: rowData.codigo,
        }
      );

      alert("Registro actualizado correctamente.");
      setEditingRow(null);
      fetchInventory();
    } catch (err) {
      console.error(err);
      alert("Error al actualizar registro.");
    }
  };

  const handleCancelRow = () => {
    // descartar cambios
    fetchInventory();
    setEditingRow(null);
  };

  const handleDelete = async (_id) => {
    try {
      const confirmDelete = window.confirm("¿Eliminar este registro?");
      if (!confirmDelete) return;

      await axios.delete(
        `https://rubiseduction.shop:4000/api/inventario/${_id}`
      );
      alert("Registro eliminado.");
      fetchInventory();
    } catch (err) {
      console.error(err);
      alert("Error al eliminar registro.");
    }
  };

  /** 3. Crear nuevo registro */
  const handleNewChange = (e) => {
    setFormNew({ ...formNew, [e.target.name]: e.target.value });
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const confirmCreate = window.confirm(
        "¿Crear este registro de inventario?"
      );
      if (!confirmCreate) return;

      await axios.post("https://rubiseduction.shop:4000/api/inventario", {
        descripcion: formNew.descripcion,
        color: formNew.color,
        talla: formNew.talla,
        cantidad: Number(formNew.cantidad),
        codigo: formNew.codigo,
      });

      alert("Registro creado exitosamente");
      setFormNew({
        descripcion: "",
        color: "",
        talla: "",
        cantidad: "",
        codigo: "",
      });
      fetchInventory();
    } catch (err) {
      console.error(err);
      alert("Error al crear registro.");
    }
  };

  /** 4. Buscar / Ordenar */
  // Filtrar por searchText
  let filteredData = inventory.filter((item) => {
    const text = searchText.toLowerCase();
    return (
      item.descripcion.toLowerCase().includes(text) ||
      item.color.toLowerCase().includes(text) ||
      item.codigo.toLowerCase().includes(text) ||
      item.talla.toLowerCase().includes(text)
    );
  });

  // Orden
  if (sortField) {
    filteredData.sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];

      if (sortField === "cantidad") {
        valA = Number(valA);
        valB = Number(valB);
      } else {
        valA = valA.toString().toLowerCase();
        valB = valB.toString().toLowerCase();
      }

      if (valA < valB) return sortAsc ? -1 : 1;
      if (valA > valB) return sortAsc ? 1 : -1;
      return 0;
    });
  }

  const handleSort = (field) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  /** 5. Total dinámico de la 'cantidad' en los datos filtrados */
  const totalCantidad = filteredData.reduce(
    (acc, item) => acc + Number(item.cantidad),
    0
  );

  return (
    <div className="inventory-container">
      <h1>Gestión de Inventario</h1>

      {/* FORM para crear nuevo */}
      <form onSubmit={handleCreate} className="inventory-form">
        <div className="form-group">
          <label>Descripción:</label>
          <input
            type="text"
            name="descripcion"
            value={formNew.descripcion}
            onChange={handleNewChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Color:</label>
          <input
            type="text"
            name="color"
            value={formNew.color}
            onChange={handleNewChange}
          />
        </div>
        <div className="form-group">
          <label>Talla:</label>
          <input
            type="text"
            name="talla"
            value={formNew.talla}
            onChange={handleNewChange}
          />
        </div>
        <div className="form-group">
          <label>Cantidad:</label>
          <input
            type="number"
            name="cantidad"
            value={formNew.cantidad}
            onChange={handleNewChange}
          />
        </div>
        <div className="form-group">
          <label>Código:</label>
          <input
            type="text"
            name="codigo"
            value={formNew.codigo}
            onChange={handleNewChange}
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-primary">
            Crear
          </button>
        </div>
      </form>

      {/* BUSCADOR */}
      <div className="filter-section">
        <input
          type="text"
          placeholder="Buscar..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="search-input"
        />
      </div>

      {/* Info del total */}
      <div style={{ margin: "0.5rem 0", fontWeight: "bold" }}>
        Total Cantidad (Filtrada): {totalCantidad}
      </div>

      <div className="table-responsive">
        <table className="inventory-table">
          <thead>
            <tr>
              <th onClick={() => handleSort("codigo")}>Código</th>
              <th onClick={() => handleSort("descripcion")}>Descripción</th>
              <th onClick={() => handleSort("color")}>Color</th>
              <th onClick={() => handleSort("talla")}>Talla</th>
              <th onClick={() => handleSort("cantidad")}>Cantidad</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item) => {
              const isEditing = editingRow === item._id;

              return (
                <tr key={item._id}>
                  <td>
                    {isEditing ? (
                      <input
                        type="text"
                        value={item.codigo}
                        onChange={(e) =>
                          handleCellChange(item._id, "codigo", e.target.value)
                        }
                      />
                    ) : (
                      item.codigo
                    )}
                  </td>
                  <td>
                    {isEditing ? (
                      <input
                        type="text"
                        value={item.descripcion}
                        onChange={(e) =>
                          handleCellChange(
                            item._id,
                            "descripcion",
                            e.target.value
                          )
                        }
                      />
                    ) : (
                      item.descripcion
                    )}
                  </td>
                  <td>
                    {isEditing ? (
                      <input
                        type="text"
                        value={item.color}
                        onChange={(e) =>
                          handleCellChange(item._id, "color", e.target.value)
                        }
                      />
                    ) : (
                      item.color
                    )}
                  </td>
                  <td>
                    {isEditing ? (
                      <input
                        type="text"
                        value={item.talla}
                        onChange={(e) =>
                          handleCellChange(item._id, "talla", e.target.value)
                        }
                      />
                    ) : (
                      item.talla
                    )}
                  </td>
                  <td>
                    {isEditing ? (
                      <input
                        type="number"
                        value={item.cantidad}
                        onChange={(e) =>
                          handleCellChange(item._id, "cantidad", e.target.value)
                        }
                      />
                    ) : (
                      item.cantidad
                    )}
                  </td>

                  <td>
                    {isEditing ? (
                      <>
                        <button
                          className="icon-button"
                          onClick={() => handleSaveRow(item._id)}
                        >
                          <FaSave /> {/* Icono de salvar */}
                        </button>
                        <button
                          className="icon-button"
                          onClick={handleCancelRow}
                        >
                          <FaTimes /> {/* Icono de cancelar */}
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          className="icon-button"
                          onClick={() => handleEditRow(item._id)}
                        >
                          <FaEdit /> {/* Icono de edición */}
                        </button>
                        <button
                          className="icon-button"
                          onClick={() => handleDelete(item._id)}
                        >
                          <FaTrash /> {/* Icono de basura */}
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InventoryPage;
