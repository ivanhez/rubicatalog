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
      const res = await axios.get("http://52.22.5.226:4000/api/productos");
      setProductos(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSelectProduct = (id) => {
    navigate(`/detalle/${id}`);
  };

  return (
    <div className="catalog-grid">
      {productos.map((prod) => {
        // Convertir 'talla' y 'colores' a arrays (S,M,L => ["S","M","L"])
        const tallasArray = prod.talla ? prod.talla.split(",") : [];
        const coloresArray = prod.colores ? prod.colores.split(",") : [];

        return (
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

            <div style={{ marginTop: "1rem" }}>
              <h4 className="product-subtitle">Tallas:</h4>
              <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                {tallasArray.map((talla) => (
                  <button
                    key={talla.trim()}
                    className="talla-button"
                    // Podrías agregar onClick si deseas alguna acción
                    onClick={(e) => {
                      e.stopPropagation();
                      // Evita que se ejecute onClick del card
                      console.log(`Talla seleccionada: ${talla.trim()}`);
                    }}
                  >
                    {talla.trim()}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginTop: "1rem" }}>
              <h4 className="product-subtitle">Colores:</h4>
              <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                {coloresArray.map((color) => (
                  <button
                    key={color.trim()}
                    className="color-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log(`Color seleccionado: ${color.trim()}`);
                    }}
                  >
                    {color.trim()}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ProductList;
