import React, { useEffect, useState } from "react";
import axios from "axios";

const ProductDetail = ({ productId, onAddToCart, goBack }) => {
  const [producto, setProducto] = useState(null);

  // Estados de selección
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);

  // Carrusel infinito
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showModal, setShowModal] = useState(false);

  // Lista de combos (color/talla/cantidad) para este producto
  const [availableCombos, setAvailableCombos] = useState([]);

  // 1. Cargar el producto principal (por ID)
  useEffect(() => {
    if (!productId) return;

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

    fetchProduct();
  }, [productId]);

  // 2. Cuando ya tenemos el `producto`, cargamos la lista de combos usando su "codigo"
  useEffect(() => {
    if (!producto) return;

    // Reiniciar selección
    setQuantity(1);
    setCurrentSlide(0);
    setSelectedSize("");
    setSelectedColor("");

    // Si el producto tiene un campo "codigo", hacemos la 2a petición para combos
    if (producto.codigo) {
      fetchCombos(producto.codigo);
    }
  }, [producto]);

  // Función para traer combos según el código
  const fetchCombos = async (codigo) => {
    try {
      // Ejemplo: GET /api/inventario/codigo/{codigo} => retorna array de combos
      const res = await axios.get(
        `https://rubiseduction.shop:4000/api/inventario/codigo/${codigo}`
      );
      setAvailableCombos(res.data); // array de { color, talla, cantidad, codigo... }
    } catch (err) {
      console.error(err);
    }
  };

  if (!producto) {
    return <p className="loading">Cargando detalle...</p>;
  }

  const fotos = producto.fotos || [];

  // 3. Calcular tallas y colores disponibles en base a availableCombos

  // Si hay color seleccionado, filtra combos para ese color; si no, todos.
  const tallasDisponibles = [
    ...new Set(
      availableCombos
        .filter((c) =>
          selectedColor
            ? c.color.toLowerCase() === selectedColor.toLowerCase()
            : true
        )
        .map((c) => c.talla)
    ),
  ].sort(); // Ordenar alfabéticamente

  // Si hay talla seleccionada, filtra combos para esa talla; si no, todos.
  const coloresDisponibles = [
    ...new Set(
      availableCombos
        .filter((c) =>
          selectedSize
            ? c.talla.toLowerCase() === selectedSize.toLowerCase()
            : true
        )
        .map((c) => c.color)
    ),
  ].sort(); // Ordenar alfabéticamente

  // Carrusel
  const handlePrev = () => {
    setCurrentSlide((prev) => (prev === 0 ? fotos.length - 1 : prev - 1));
  };
  const handleNext = () => {
    setCurrentSlide((prev) => (prev === fotos.length - 1 ? 0 : prev + 1));
  };

  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  // 4. Funciones para (des)seleccionar talla y color

  const handleSelectSize = (talla) => {
    // Si está seleccionada la misma talla, la deseleccionamos poniéndola en ""
    if (selectedSize === talla) {
      setSelectedSize("");
    } else {
      setSelectedSize(talla);
    }
  };

  const handleSelectColor = (color) => {
    // Si está seleccionado el mismo color, deseleccionamos
    if (selectedColor === color) {
      setSelectedColor("");
    } else {
      setSelectedColor(color);
    }
  };

  // 5. Agregar al carrito con validación de combos
  const handleAddToCart = () => {
    // Buscar combo que coincida con talla/color
    const comboValido = availableCombos.find(
      (c) =>
        c.color.toLowerCase() === selectedColor.toLowerCase() &&
        c.talla.toLowerCase() === selectedSize.toLowerCase()
    );

    if (!comboValido) {
      alert("Esta combinación de color/talla no está disponible.");
      return;
    }

    if (quantity > comboValido.cantidad) {
      alert(
        `Solo hay ${comboValido.cantidad} disponibles en (${selectedColor}, ${selectedSize}).`
      );
      return;
    }

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
        {/* Carrusel */}
        <div className="carousel-infinite">
          {fotos.length > 0 ? (
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

              {/* Thumbnails */}
              {fotos.length > 1 && (
                <div className="thumbnail-list">
                  {fotos.map((foto, i) => (
                    <img
                      key={i}
                      className={`thumbnail-image ${
                        i === currentSlide ? "active" : ""
                      }`}
                      src={`data:image/jpeg;base64,${foto}`}
                      alt={`Miniatura ${i + 1}`}
                      onClick={() => setCurrentSlide(i)}
                    />
                  ))}
                </div>
              )}
            </>
          ) : (
            <p>No hay imágenes disponibles.</p>
          )}
        </div>

        <div className="product-detail__info">
          <h2 className="product-detail__title">{producto.descripcion}</h2>
          <p className="product-detail__price">Precio: Q{producto.precio}</p>

          {/* Tallas */}
          <div className="size-selector">
            <p className="selector-label">Talla:</p>
            <div className="selector-buttons">
              {tallasDisponibles.map((talla) => (
                <button
                  key={talla}
                  className={`selector-button ${
                    selectedSize === talla ? "active" : ""
                  }`}
                  onClick={() => handleSelectSize(talla)}
                >
                  {talla}
                </button>
              ))}
            </div>
          </div>

          {/* Colores */}
          <div className="color-selector">
            <p className="selector-label">Color:</p>
            <div className="selector-buttons">
              {coloresDisponibles.map((color) => (
                <button
                  key={color}
                  className={`selector-button ${
                    selectedColor === color ? "active" : ""
                  }`}
                  onClick={() => handleSelectColor(color)}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>

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

      {/* Modal imagen grande */}
      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-button" onClick={handleCloseModal}>
              X
            </button>
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
