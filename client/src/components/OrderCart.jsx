import React from "react";
import axios from "axios";

const OrderCart = ({ cart, setCart }) => {
  // Confirmar pedido
  const handleConfirmOrder = async () => {
    if (cart.length === 0) return;

    // Transformar {id, descripcion, ...} a {id, cantidad}
    const productosPedido = cart.map((item) => ({
      id: item.id,
      cantidad: item.cantidad,
    }));

    try {
      const res = await axios.post("http://localhost:4000/api/pedidos", {
        productos: productosPedido,
      });
      alert(
        `Pedido creado. ID: ${res.data.pedidoId}, Total: $${res.data.total}`
      );
      // Limpiar carrito
      setCart([]);
    } catch (error) {
      console.error(error);
      alert("Error al crear el pedido");
    }
  };

  const removeItem = (id) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  return (
    <div>
      <h2>Carrito</h2>
      {cart.length === 0 ? (
        <p>No hay productos en el carrito.</p>
      ) : (
        <>
          <ul>
            {cart.map((item) => (
              <li key={item.id}>
                {item.descripcion} - Cantidad: {item.cantidad} - Precio: $
                {item.precio}
                <button
                  onClick={() => removeItem(item.id)}
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
