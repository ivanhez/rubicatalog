import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ITEMS_PER_PAGE = 8;

const ProductList = () => {
  const [productos, setProductos] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  // Aquí guardamos combos de inventario por código:
  // combosMap = { "BAO1": [ {color, talla, cantidad}, ... ], "BAS1": [ ... ] }
  const [combosMap, setCombosMap] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    fetchProductos(currentPage);
  }, [currentPage]);

  // 1. Obtener productos con page/limit
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
      setIsLoading(false);
      window.scrollTo({ top: 550, behavior: "smooth" });
    }
  };

  // 2. Para cada producto, si tiene .codigo, obtener combos del inventario (si no está en combosMap)
  useEffect(() => {
    // Recolectar códigos de productos
    const codigos = [
      ...new Set(productos.map((p) => p.codigo).filter(Boolean)),
    ];

    // Para cada código, si combosMap no lo tiene, hacemos fetch
    codigos.forEach((code) => {
      if (!combosMap[code]) {
        fetchInventarioPorCodigo(code);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productos]);

  // 3. Función para obtener combos de inventario por codigo
  const fetchInventarioPorCodigo = async (codigo) => {
    try {
      const res = await axios.get(
        `https://rubiseduction.shop:4000/api/inventario/codigo/${codigo}`
      );
      // res.data => array de combos ( { descripcion, color, talla, cantidad, codigo } )
      setCombosMap((prev) => ({
        ...prev,
        [codigo]: res.data,
      }));
    } catch (err) {
      console.error(err);
    }
  };

  const handleSelectProduct = (_id) => {
    navigate(`/detalle/${_id}`);
  };

  // Lógica de paginación local
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
          <div className="catalog-grid">
            {productos.map((prod) => {
              // combosMap[prod.codigo] => array de { color, talla, cantidad, ... }
              const combos = combosMap[prod.codigo] || [];

              // Sacar todas las tallas únicas
              const tallas = [
                ...new Set(combos.map((c) => c.talla?.trim() || "")),
              ].filter((x) => x !== "");

              // Sacar todos los colores únicos
              const colores = [
                ...new Set(combos.map((c) => c.color?.trim() || "")),
              ].filter((x) => x !== "");

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
                  <h3 className="product-title">{prod.descripcion}</h3>
                  <p className="product-price">Q{prod.precio}</p>

                  {/* Mostrar tallas como botones, sacadas de combos de inventario */}
                  {tallas.length > 0 && (
                    <div className="tallas-container">
                      {tallas.map((talla) => (
                        <button
                          key={talla}
                          className="talla-button"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {talla}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Mostrar colores como botones */}
                  {colores.length > 0 && (
                    <div className="colores-container">
                      {colores.map((color) => (
                        <button
                          key={color}
                          className="color-button"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {color}
                        </button>
                      ))}
                    </div>
                  )}
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
