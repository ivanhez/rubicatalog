import React, { useEffect, useState } from "react";
import axios from "axios";

const ProductList = ({ onAddToCart, onSelectProduct }) => {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    fetchProductos();
  }, []);

  const fetchProductos = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/productos");
      /*
        Cada producto tiene formato:
        {
          id, descripcion, talla, colores, precio,
          fotos: [ "BASE64_1", "BASE64_2", ...]
        }
      */
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
          gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
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
              cursor: "pointer",
            }}
          >
            {/* Mostrar la primera imagen más grande */}
            {prod.fotos && prod.fotos.length > 0 && (
              <img
                src={`data:image/jpeg;base64,${prod.fotos[0]}`}
                alt={prod.descripcion}
                style={{ width: "200px", height: "200px", objectFit: "cover" }}
                onClick={() => onSelectProduct(prod.id)}
                /* 
                  onSelectProduct => función que lleva al detalle del producto
                  (podrías usar React Router, un modal, etc.)
                */
              />
            )}
            <h3>{prod.descripcion}</h3>
            <p>Precio: Q{prod.precio}</p>
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
