import React, { useEffect, useState } from "react";
import axios from "axios";

const ProductDetail = ({ productId, onAddToCart, goBack }) => {
  const [producto, setProducto] = useState(null);

  // Estados para la selección del usuario
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);

  // Estado para el carrusel infinito
  const [currentSlide, setCurrentSlide] = useState(0);

  // Estado para controlar el modal (imagen grande)
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(
          `http://localhost:4000/api/productos/${productId}`
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

  // Configurar talla y color por defecto
  useEffect(() => {
    if (producto) {
      const tallasArr = producto.talla ? producto.talla.split(",") : [];
      const coloresArr = producto.colores ? producto.colores.split(",") : [];
      if (tallasArr.length > 0) setSelectedSize(tallasArr[0].trim());
      if (coloresArr.length > 0) setSelectedColor(coloresArr[0].trim());
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

  // --- Carrusel infinito ---
  const handlePrev = () => {
    setCurrentSlide((prev) => (prev === 0 ? fotos.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev === fotos.length - 1 ? 0 : prev + 1));
  };

  // --- Modal (imagen grande) ---
  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

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

  return (
    <div className="product-detail">
      <button className="product-detail__back-button" onClick={goBack}>
        Volver
      </button>

      <div className="product-detail__content">
        {/* Carrusel a la izquierda */}
        <div className="carousel-infinite">
          {fotos && fotos.length > 0 ? (
            <>
              <button className="carousel-button" onClick={handlePrev}>
                &lt;
              </button>
              {/* Al hacer clic en la imagen, abrimos el modal */}
              <img
                className="carousel-image"
                src={`data:image/jpeg;base64,${fotos[currentSlide]}`}
                alt={`Foto ${currentSlide + 1}`}
                onClick={handleOpenModal}
              />
              <button className="carousel-button" onClick={handleNext}>
                &gt;
              </button>
            </>
          ) : (
            <p>No hay imágenes disponibles.</p>
          )}
        </div>

        {/* Información del producto a la derecha */}
        <div className="product-detail__info">
          <h2 className="product-detail__title">{producto.descripcion}</h2>
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

      {/* Modal de imagen grande, con carrusel infinito */}
      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-button" onClick={handleCloseModal}>
              X
            </button>

            {/* El mismo carrusel, pero mostrando la imagen en grande */}
            <div className="modal-carousel">
              <button className="carousel-button" onClick={handlePrev}>
                &lt;
              </button>
              <img
                className="modal-image"
                src={`data:image/jpeg;base64,${fotos[currentSlide]}`}
                alt={`Foto grande ${currentSlide + 1}`}
              />
              <button className="carousel-button" onClick={handleNext}>
                &gt;
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
