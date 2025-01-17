import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ITEMS_PER_PAGE = 8;

const ProductList = () => {
  const [productos, setProductos] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    fetchProductos(currentPage);
  }, [currentPage]);

  // Petición al backend con page & limit
  const fetchProductos = async (page) => {
    try {
      setIsLoading(true);
      const res = await axios.get(
        `https://rubiseduction.shop:4000/api/productos?page=${page}&limit=${ITEMS_PER_PAGE}`
      );
      setProductos(res.data.productos);
      setTotalPages(res.data.totalPages);
    } catch (error) {
      console.error(error);
    } finally {
      // Terminamos la carga
      setIsLoading(false);
      // Regresar al tope con suavidad
      window.scrollTo({ top: 550, behavior: "smooth" });
    }
  };

  const handleSelectProduct = (_id) => {
    navigate(`/detalle/${_id}`);
  };

  const titleCase = (str) => {
    return str
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  // Cambio de página
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div>
      {isLoading ? (
        <div style={{ textAlign: "center", margin: "2rem 0" }}>
          <p>Cargando productos...</p>
        </div>
      ) : (
        <>
          {/* Grid de productos */}
          <div className="catalog-grid">
            {productos.map((prod) => {
              return (
                <div
                  key={prod._id}
                  className="product-card"
                  onClick={() => handleSelectProduct(prod._id)}
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

                  <h3 className="product-title">
                    {titleCase(prod.descripcion)}
                  </h3>
                  <p className="product-price">Q{prod.precio}</p>
                </div>
              );
            })}
          </div>

          {/* Paginación */}
          {totalPages > 1 && (
            <div className="pagination">
              <button
                className="page-button"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                ←
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    className={`page-button ${
                      page === currentPage ? "active" : ""
                    }`}
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </button>
                )
              )}

              <button
                className="page-button"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ProductList;
