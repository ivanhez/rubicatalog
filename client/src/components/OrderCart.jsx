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
    alert(`Pedido creado. ID: ${res.data.pedidoId}, Total: $${res.data.total}`);
    // Vaciar carrito
    setCart([]);
  } catch (error) {
    console.error(error);
    alert("Error al crear el pedido");
  }
};
