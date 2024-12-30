import React from "react";
import axios from "axios";

const OrderCart = ({ cart, setCart }) => {
  // Confirmar pedido
  const handleConfirmOrder = async () => {
    if (cart.length === 0) return;

    // cart => array con { id, cantidad, talla, color, ... }
    const productosPedido = cart.map((item) => ({
      id: item.id,
      cantidad: item.cantidad,
      talla: item.talla,
      color: item.color,
    }));

    try {
      const res = await axios.post("http://localhost:4000/api/pedidos", {
        productos: productosPedido,
      });
      alert(
        `Pedido creado. ID: ${res.data.pedidoId}, Total: $${res.data.total}`
      );
      // Vaciar carrito
      setCart([]);
    } catch (error) {
      console.error(error);
      alert("Error al crear el pedido");
    }
  };

  const removeItem = (index) => {
    setCart(cart.filter((_, i) => i !== index));
  };

  return (
    <div>
      <h2>Carrito</h2>
      {cart.length === 0 ? (
        <p>No hay productos en el carrito.</p>
      ) : (
        <>
          <ul>
            {cart.map((item, index) => (
              <li key={index}>
                <strong>{item.descripcion}</strong>
                <br />
                Talla: {item.talla}
                <br />
                Color: {item.color}
                <br />
                Cantidad: {item.cantidad}
                <br />
                Precio Unitario: Q{item.precio}
                <button
                  onClick={() => removeItem(index)}
                  style={{ marginLeft: "1rem" }}
                >
                  Eliminar
                </button>
              </li>
            ))}
          </ul>
          <button onClick={handleConfirmOrder}>Confirmar Pedido</button>
        </>
      )}
    </div>
  );
};

export default OrderCart;
