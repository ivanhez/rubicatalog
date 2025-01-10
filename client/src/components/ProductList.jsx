import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ITEMS_PER_PAGE = 4; // Número de productos por página

const ProductList = () => {
  const [productos, setProductos] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProductos();
  }, []);

  const fetchProductos = async () => {
    try {
      const res = await axios.get(
        "https://rubiseduction.shop:4000/api/productos"
      );
      setProductos(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSelectProduct = (id) => {
    navigate(`/detalle/${id}`);
  };

  // Función para capitalizar/descripción
  const titleCase = (str) => {
    return str
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  // Calcular límites para la página actual
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const totalPages = Math.ceil(productos.length / ITEMS_PER_PAGE);

  // Productos visibles en la página actual
  const visibleProducts = productos.slice(startIndex, endIndex);

  // Manejo de cambio de página
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div>
      <div className="catalog-grid">
        {visibleProducts.map((prod) => {
          const tallasArray = prod.talla ? prod.talla.split(",") : [];
          const coloresArray = prod.colores ? prod.colores.split(",") : [];

          tallasArray.sort();
          coloresArray.sort();

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
                loading="lazy"
                decoding="async"
              />

              <h3 className="product-title">{titleCase(prod.descripcion)}</h3>
              <p className="product-price">Q{prod.precio}</p>

              {/* <div style={{ marginTop: "1rem" }}>
                <h4 className="product-subtitle">Tallas:</h4>
                <div
                  style={{
                    display: "flex",
                    gap: "0.5rem",
                    flexWrap: "wrap",
                    justifyContent: "center",
                  }}
                >
                  {tallasArray.map((talla) => (
                    <button
                      key={talla.trim()}
                      className="talla-button"
                      onClick={(e) => {
                        e.stopPropagation();
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
                <div
                  style={{
                    display: "flex",
                    gap: "0.5rem",
                    flexWrap: "wrap",
                    justifyContent: "center",
                  }}
                >
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
              </div> */}
            </div>
          );
        })}
      </div>

      {/* Sección de paginación */}
      {totalPages > 1 && (
        <div className="pagination">
          {/* Botón 'Prev' */}
          <button
            className="page-button"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Prev
          </button>

          {/* Números de página */}
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              className={`page-button ${page === currentPage ? "active" : ""}`}
              onClick={() => handlePageChange(page)}
            >
              {page}
            </button>
          ))}

          {/* Botón 'Next' */}
          <button
            className="page-button"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductList;
