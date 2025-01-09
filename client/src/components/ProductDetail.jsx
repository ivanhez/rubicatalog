import React, { useEffect, useState } from "react";
import axios from "axios";

const ProductDetail = ({ productId, onAddToCart, goBack }) => {
  const [producto, setProducto] = useState(null);

  // Estados para la selección del usuario
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);

  // Carrusel infinito
  const [currentSlide, setCurrentSlide] = useState(0);

  // Modal de imagen grande
  const [showModal, setShowModal] = useState(false);

  // Cargar la info del producto
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(
          `https://rubiseduction.shop:4000/api/productos/${productId}`
        );
        setProducto(res.data);
      } catch (error) {
        console.error(error);
      }
    };
    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  // Reiniciar quantity y currentSlide cuando se actualiza `producto`
  useEffect(() => {
    if (producto) {
      setQuantity(1);
      setCurrentSlide(0);
    }
  }, [producto]);

  if (!producto) {
    return <p className="loading">Cargando detalle...</p>;
  }

  const tallas = producto.talla ? producto.talla.split(",") : [];
  const colores = producto.colores ? producto.colores.split(",") : [];
  const fotos = producto.fotos || [];

  // Ordenar tallas y colores alfabéticamente (opcional)
  tallas.sort();
  colores.sort();

  // Funciones del carrusel
  const handlePrev = () => {
    setCurrentSlide((prev) => (prev === 0 ? fotos.length - 1 : prev - 1));
  };
  const handleNext = () => {
    setCurrentSlide((prev) => (prev === fotos.length - 1 ? 0 : prev + 1));
  };

  // Modal
  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  // Agregar al carrito
  const handleAddToCart = () => {
    const itemToAdd = {
      id: producto.id,
      descripcion: producto.descripcion,
      precio: producto.precio,
      cantidad: Number(quantity),
      talla: selectedSize,
      color: selectedColor,
    };
    onAddToCart(itemToAdd);
  };

  // Opción: capitalizar la descripción
  const titleCase = (str) => {
    return str
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <div className="product-detail">
      <button className="product-detail__back-button" onClick={goBack}>
        Volver
      </button>

      <div className="product-detail__content">
        {/* Carrusel de imágenes */}
        <div className="carousel-infinite">
          {fotos && fotos.length > 0 ? (
            <>
              <button className="carousel-button prev" onClick={handlePrev}>
                {"<"}
              </button>
              <img
                className="carousel-image"
                src={`data:image/jpeg;base64,${fotos[currentSlide]}`}
                alt={`Foto ${currentSlide + 1}`}
                onClick={handleOpenModal}
              />
              <button className="carousel-button next" onClick={handleNext}>
                {">"}
              </button>
            </>
          ) : (
            <p>No hay imágenes disponibles.</p>
          )}
        </div>

        <div className="product-detail__info">
          <h2 className="product-detail__title">
            {titleCase(producto.descripcion)}
          </h2>
          <p className="product-detail__price">Precio: Q{producto.precio}</p>

          {/* Tallas */}
          {tallas.length > 0 && (
            <div className="size-selector">
              <p className="selector-label">Talla:</p>
              <div className="selector-buttons">
                {tallas.map((talla) => {
                  const trimmed = talla.trim();
                  return (
                    <button
                      key={trimmed}
                      className={`selector-button ${
                        selectedSize === trimmed ? "active" : ""
                      }`}
                      onClick={() => setSelectedSize(trimmed)}
                    >
                      {trimmed}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Colores */}
          {colores.length > 0 && (
            <div className="color-selector">
              <p className="selector-label">Color:</p>
              <div className="selector-buttons">
                {colores.map((color) => {
                  const trimmed = color.trim();
                  return (
                    <button
                      key={trimmed}
                      className={`selector-button ${
                        selectedColor === trimmed ? "active" : ""
                      }`}
                      onClick={() => setSelectedColor(trimmed)}
                    >
                      {trimmed}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Cantidad */}
          <div className="quantity-selector">
            <label htmlFor="quantity">Cantidad:</label>
            <input
              id="quantity"
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="quantity-input"
            />
          </div>

          <button className="add-to-cart-button" onClick={handleAddToCart}>
            Agregar al Carrito
          </button>
        </div>
      </div>

      {/* Modal de imagen grande */}
      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-button" onClick={handleCloseModal}>
              X
            </button>
            {/* Carrusel en el modal */}
            <div className="modal-carousel">
              <button className="carousel-button prev" onClick={handlePrev}>
                {"<"}
              </button>
              <img
                className="modal-image"
                src={`data:image/jpeg;base64,${fotos[currentSlide]}`}
                alt={`Foto grande ${currentSlide + 1}`}
              />
              <button className="carousel-button next" onClick={handleNext}>
                {">"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
