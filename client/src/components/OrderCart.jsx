import React from "react";
import axios from "axios";

const OrderCart = ({ cart, setCart }) => {
  // Confirmar pedido
  const handleConfirmOrder = async () => {
    if (cart.length === 0) return;

    // cart => array con { id, descripcion, precio, cantidad, talla, color, foto/fotos }
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
        `Pedido creado. ID: ${res.data.pedidoId}, Total: Q${res.data.total}`
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

  // Calcular total general
  let total = 0;
  cart.forEach((item) => {
    total += item.precio * item.cantidad;
  });

  return (
    <div className="cart">
      <h2 className="cart-title">Carrito</h2>

      {cart.length === 0 ? (
        <p className="cart-empty">No hay productos en el carrito.</p>
      ) : (
        <>
          <table className="table cart-table">
            <thead>
              <tr>
                <th>Foto</th>
                <th>Producto</th>
                <th>Talla</th>
                <th>Color</th>
                <th>Cantidad</th>
                <th>Precio Unitario</th>
                <th>Subtotal</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item, index) => {
                const subTotal = item.precio * item.cantidad;
                return (
                  <tr key={index} className="cart-item">
                    <td>
                      {/* Si usas item.fotos, podrías hacer item.fotos[0] */}
                      <img
                        className="cart-image"
                        src={
                          item.foto
                            ? `data:image/jpeg;base64,${item.fotos[0]}`
                            : "https://via.placeholder.com/80?text=No+Image"
                        }
                        alt={item.descripcion}
                      />
                    </td>
                    <td>
                      <strong>{item.descripcion}</strong>
                    </td>
                    <td>{item.talla}</td>
                    <td>{item.color}</td>
                    <td>{item.cantidad}</td>
                    <td>Q{item.precio}</td>
                    <td>Q{subTotal}</td>
                    <td>
                      <button
                        className="cart-remove-button"
                        onClick={() => removeItem(index)}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr>
                <td
                  colSpan="7"
                  style={{ textAlign: "right", fontWeight: "bold" }}
                >
                  Total: Q{total}
                </td>
              </tr>
            </tfoot>
          </table>

          <button className="cart-confirm-button" onClick={handleConfirmOrder}>
            Confirmar Pedido
          </button>
        </>
      )}
    </div>
  );
};

export default OrderCart;
