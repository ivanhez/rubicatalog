import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Tabla de descuentos para 3 productos de cierto precio
const discountMapping = {
  25: 70,
  30: 75,
  60: 175,
  65: 190,
};

/**
 * Calcula el total con la regla de "3 productos" de cierto precio => precio especial.
 * @param {Array} cart - Array de productos ( { precio, cantidad, ... } )
 * @returns {number} total con descuento.
 */
function calculateTotalWithDiscount(cart) {
  const priceMap = {};

  cart.forEach((item) => {
    const price = item.precio;
    if (!priceMap[price]) {
      priceMap[price] = 0;
    }
    priceMap[price] += item.cantidad;
  });

  let total = 0;

  for (let priceStr in priceMap) {
    const price = Number(priceStr);
    const count = priceMap[priceStr];

    if (discountMapping[price]) {
      const groupsOf3 = Math.floor(count / 3);
      const remainder = count % 3;
      const discountedPriceFor3 = discountMapping[price];

      total += groupsOf3 * discountedPriceFor3;
      total += remainder * price;
    } else {
      total += price * count;
    }
  }

  return total;
}

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

    try {
      // 2. Crear el pedido en tu backend
      const res = await axios.post(
        "https://rubiseduction.shop:4000/api/pedidos",
        {
          productos: productosPedido,
        }
      );

      // 3. Calcular total con descuentos
      const totalConDescuento = calculateTotalWithDiscount(cart);

      // 4. Preparar texto para WhatsApp con subtotales
      let mensaje = "Detalles de mi pedido:\n";
      cart.forEach((item, i) => {
        const subTotalNormal = item.precio * item.cantidad;
        mensaje += `${i + 1}) ${item.descripcion}, Talla: ${
          item.talla
        }, Color: ${item.color}, Cantidad: ${
          item.cantidad
        }, Subtotal sin desc: Q${subTotalNormal}\n`;
      });
      mensaje += `\nTotal con Descuento: Q${totalConDescuento}\n`;
      // mensaje += `ID Pedido: ${res.data.pedidoId}\n`;

      // 5. Abrir WhatsApp
      const phoneNumber = "50231383430"; // Reemplaza con tu número
      const waUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
        mensaje
      )}`;
      window.open(waUrl, "_blank");

      // 6. No vaciamos el carrito
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

  // Calcular total con descuento para mostrar en la interfaz
  const totalConDescuento = calculateTotalWithDiscount(cart);

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
                  Total con Descuento: Q{totalConDescuento}
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
