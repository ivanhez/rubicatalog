import React, { useState, useEffect } from "react";
import axios from "axios";

const OrderForm = () => {
  const [productos, setProductos] = useState([]);
  const [pedidoProductos, setPedidoProductos] = useState([]);

  useEffect(() => {
    fetchProductos();
  }, []);

  const fetchProductos = async () => {
    try {
      const res = await axios.get("https://rubiseduction.shop:4000/api/productos");
      setProductos(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddToOrder = (prod) => {
    // Ver si ya existe en el pedido
    const existente = pedidoProductos.find((p) => p._id === prod._id);
    if (existente) {
      // Incrementar la cantidad
      setPedidoProductos(
        pedidoProductos.map((p) =>
          p._id === prod._id ? { ...p, cantidad: p.cantidad + 1 } : p
        )
      );
    } else {
      // Agregar nuevo
      setPedidoProductos([...pedidoProductos, { ...prod, cantidad: 1 }]);
    }
  };

  const handleCreateOrder = async () => {
    // Preparar array para enviar al backend
    const productosPedido = pedidoProductos.map((p) => ({
      id: p._id, // Aquí enviamos _id en lugar de id
      cantidad: p.cantidad,
    }));

    try {
      const res = await axios.post("https://rubiseduction.shop:4000/api/pedidos", {
        productos: productosPedido,
      });
      alert(
        `Pedido creado con ID: ${res.data.pedidoId}. Total: $${res.data.total}`
      );
      // Limpiar el pedido
      setPedidoProductos([]);
    } catch (error) {
      console.error(error);
      alert("Error al crear el pedido");
    }
  };

  return (
    <div>
      <h2>Crear Pedido</h2>
      <div style={{ display: "flex", gap: "2rem" }}>
        <div>
          <h3>Productos Disponibles</h3>
          {productos.map((prod) => (
            <div key={prod._id} style={{ marginBottom: "0.5rem" }}>
              <span>
                {prod.descripcion} (${prod.precio})
              </span>
              <button
                onClick={() => handleAddToOrder(prod)}
                style={{ marginLeft: "1rem" }}
              >
                Añadir
              </button>
            </div>
          ))}
        </div>

        <div>
          <h3>Productos en el Pedido</h3>
          {pedidoProductos.length === 0 ? (
            <p>No hay productos en el pedido</p>
          ) : (
            <ul>
              {pedidoProductos.map((p) => (
                <li key={p._id}>
                  {p.descripcion} (Cantidad: {p.cantidad})
                </li>
              ))}
            </ul>
          )}
          <button
            // onClick={handleCreateOrder}
            disabled={pedidoProductos.length === 0}
          >
            Confirmar Pedido
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderForm;
