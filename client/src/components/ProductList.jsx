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
      setProductos(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="section">
      <h2 className="section-title">Catálogo de Productos</h2>
      <div className="catalog-grid">
        {productos.map((prod) => (
          <div
            key={prod.id}
            className="product-card"
            onClick={() => onSelectProduct(prod.id)}
          >
            {prod.fotos && prod.fotos.length > 0 && (
              <img
                className="product-image"
                src={`data:image/jpeg;base64,${prod.fotos[0]}`}
                alt={prod.descripcion}
              />
            )}
            <h3 className="product-title">{prod.descripcion}</h3>
            <p className="product-price">${prod.precio}</p>
            <button
              className="product-button"
              // Evita que el onClick del card te mande siempre al detalle
              // al hacer click en el botón. Podrías hacer e.stopPropagation()
              onClick={(e) => {
                e.stopPropagation();
                onAddToCart({
                  id: prod.id,
                  descripcion: prod.descripcion,
                  precio: prod.precio,
                  cantidad: 1,
                  talla: prod.talla || "Única",
                  color: prod.colores || "Único",
                });
              }}
            >
              Agregar al carrito
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
