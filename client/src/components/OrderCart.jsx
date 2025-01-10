import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const OrderCart = ({ cart, setCart }) => {
  const navigate = useNavigate();

  // Confirmar pedido
  const handleConfirmOrder = async () => {
    if (cart.length === 0) return;

    // 1. Construir array para enviar al backend
    const productosPedido = cart.map((item) => ({
      id: item.id,
      cantidad: item.cantidad,
      talla: item.talla,
      color: item.color,
    }));

    // 2. Calcular el total general
    let total = 0;
    cart.forEach((item) => {
      total += item.precio * item.cantidad;
    });

    try {
      // 3. Crear el pedido en tu backend
      const res = await axios.post(
        "https://rubiseduction.shop:4000/api/pedidos",
        {
          productos: productosPedido,
        }
      );

      // 4. Preparar texto para WhatsApp con subtotales
      let mensaje = "Detalles de mi pedido:\n";
      cart.forEach((item, i) => {
        const subTotal = item.precio * item.cantidad;
        mensaje += `${i + 1}) ${item.descripcion}, Talla: ${
          item.talla
        }, Color: ${item.color}, Cantidad: ${
          item.cantidad
        }, Subtotal: Q${subTotal}\n`;
      });
      mensaje += `\nTotal: Q${total}\n`;
      // Si quieres usar el ID del pedido:
      // mensaje += `ID Pedido: ${res.data.pedidoId}\n`;

      // 5. Abrir WhatsApp
      const phoneNumber = "50231383430"; // Reemplaza con tu número (código de país)
      const waUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
        mensaje
      )}`;
      window.open(waUrl, "_blank");

      // 6. **No** vaciamos el carrito (removimos setCart([]))
      // setCart([]);
    } catch (error) {
      console.error(error);
      alert("Error al crear el pedido");
    }
  };

  // Eliminar un ítem del carrito
  const removeItem = (index) => {
    setCart(cart.filter((_, i) => i !== index));
  };

  // Calcular total para mostrar en la interfaz
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
          {/* Botón para regresar al catálogo */}
          <div className="cart-actions">
            <button className="btn-continue" onClick={() => navigate("/")}>
              Seguir comprando
            </button>
          </div>

          <table className="table cart-table">
            <thead>
              <tr>
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
                    <td
                      data-label="Producto"
                      onClick={() => navigate(`/detalle/${item.id}`)}
                      style={{ cursor: "pointer", color: "#1e90ff" }}
                    >
                      <strong>{item.descripcion}</strong>
                    </td>
                    <td data-label="Talla">{item.talla}</td>
                    <td data-label="Color">{item.color}</td>
                    <td data-label="Cantidad">{item.cantidad}</td>
                    <td data-label="Precio Unitario">Q{item.precio}</td>
                    <td data-label="Subtotal">Q{subTotal}</td>
                    <td data-label="Acciones">
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
                  colSpan="6"
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
