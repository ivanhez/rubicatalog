// ProductList.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ProductList = ({ onAddToCart }) => {
  const [productos, setProductos] = useState([]);
  const navigate = useNavigate();

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

  const handleSelectProduct = (id) => {
    // Navegar a la ruta /detalle/:id
    navigate(`/detalle/${id}`);
  };

  return (
    <div className="catalog-grid">
      {productos.map((prod) => (
        <div
          key={prod.id}
          className="product-card"
          onClick={() => handleSelectProduct(prod.id)}
        >
          <img
            className="product-image"
            src={
              prod.fotos && prod.fotos.length > 0
                ? `data:image/jpeg;base64,${prod.fotos[0]}`
                : "https://via.placeholder.com/300x300?text=No+Image"
            }
            alt={prod.descripcion}
          />

          <h3 className="product-title">{prod.descripcion}</h3>
          <p className="product-price">Q{prod.precio}</p>

          {/* Botón "Agregar al Carrito" (detiene la propagación para no disparar el onClick del card) */}
          <button
            className="product-button"
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart({
                id: prod.id,
                descripcion: prod.descripcion,
                precio: prod.precio,
                cantidad: 1, // o la que desees
                talla: prod.talla || "Única",
                color: prod.colores || "Único",
              });
            }}
          >
            Agregar al Carrito
          </button>
        </div>
      ))}
    </div>
  );
};

export default ProductList;
