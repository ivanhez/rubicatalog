import React, { useEffect, useState } from "react";
import axios from "axios";

const ProductList = ({ onAddToCart }) => {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    fetchProductos();
  }, []);

  const fetchProductos = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/productos");
      setProductos(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h2>Catálogo de Productos</h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3,1fr)",
          gap: "1rem",
        }}
      >
        {productos.map((prod) => (
          <div
            key={prod.id}
            style={{
              border: "1px solid #ccc",
              padding: "1rem",
              borderRadius: "5px",
              textAlign: "center",
            }}
          >
            {/* Renderizar imagen base64 */}
            {prod.foto && (
              <img
                src={`data:image/png;base64,${prod.foto}`}
                alt={prod.descripcion}
                style={{
                  maxWidth: "100px",
                  maxHeight: "100px",
                  objectFit: "cover",
                }}
              />
            )}
            <h3>{prod.descripcion}</h3>
            <p>Talla: {prod.talla}</p>
            <p>Colores: {prod.colores}</p>
            <p>Precio: ${prod.precio}</p>
            <button onClick={() => onAddToCart(prod)}>
              Agregar al carrito
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
