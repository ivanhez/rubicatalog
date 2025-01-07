import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const OrderCart = ({ cart, setCart }) => {
  const navigate = useNavigate();

  const handleConfirmOrder = async () => {
    if (cart.length === 0) return;

    // 1. Construir array para enviar al backend
    const productosPedido = cart.map((item) => ({
      id: item.id,
      cantidad: item.cantidad,
      talla: item.talla,
      color: item.color,
    }));

    // 2. Calcular el total
    let total = 0;
    cart.forEach((item) => {
      total += item.precio * item.cantidad;
    });

    try {
      // 3. Crear el pedido en tu backend
      const res = await axios.post("http://localhost:4000/api/pedidos", {
        productos: productosPedido,
      });

      // 4. Preparar el texto con el detalle completo del carrito
      /*
        Ejemplo de mensaje:
        "Detalles de mi pedido:
         1) Conjunto Encaje, Talla: M, Color: Negro, Cantidad: 2
         2) Body Rojo, Talla: S, Color: Rojo, Cantidad: 1
         Total: Q120
         ID Pedido: 12345"
      */
      let mensaje = "Detalles de mi pedido:\n";
      cart.forEach((item, i) => {
        mensaje += `${i + 1}) ${item.descripcion}, Talla: ${
          item.talla
        }, Color: ${item.color}, Cantidad: ${item.cantidad}\n`;
      });
      mensaje += `\nTotal: Q${total}\n`;
    //   mensaje += `ID Pedido: ${res.data.pedidoId}`;

      // 5. Abrir WhatsApp Web/Móvil con el mensaje
      const phoneNumber = "50231383430"; // Reemplaza con tu número (código de país)
      const waUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
        mensaje
      )}`;
      window.open(waUrl, "_blank");

      // 6. Vaciar carrito
      setCart([]);
    } catch (error) {
      console.error(error);
      alert("Error al crear el pedido");
    }
  };

  const removeItem = (index) => {
    setCart(cart.filter((_, i) => i !== index));
  };

  // Calcular total también para mostrarlo en la interfaz
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
                    <td
                      style={{ cursor: "pointer" }}
                      onClick={() => navigate(`/detalle/${item.id}`)}
                    >
                      <img
                        className="cart-image"
                        src={
                          item.fotos && item.fotos.length > 0
                            ? `data:image/jpeg;base64,${item.fotos[0]}`
                            : "https://via.placeholder.com/80?text=No+Image"
                        }
                        alt={item.descripcion}
                      />
                    </td>
                    <td
                      style={{ cursor: "pointer" }}
                      onClick={() => navigate(`/detalle/${item.id}`)}
                    >
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
