import React from "react";
import axios from "axios";

const OrderCart = ({ cart, setCart }) => {
  // Confirmar pedido
  const handleConfirmOrder = async () => {
    if (cart.length === 0) return;

    /*
      Antes enviábamos un array de {id, cantidad},
      pero ahora tenemos talla y color. 
      Dependiendo de tu backend, podrías necesitar 
      guardarlo o no en la tabla "pedidos_detalles".
      Por ejemplo, podrías añadir columnas 'talla' y 'color'
      en tu base de datos. (Opcional, si lo deseas).
    */

    // Adaptar para tu backend. Si el backend no soporta talla/ color,
    // solo mandamos {id, cantidad}.
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
