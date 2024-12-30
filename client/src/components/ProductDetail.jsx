import React, { useEffect, useState } from "react";
import axios from "axios";

const ProductDetail = ({ productId, onAddToCart, goBack }) => {
  const [producto, setProducto] = useState(null);

  // Estados para almacenar la selección del usuario
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(
          `http://localhost:4000/api/productos/${productId}`
        );
        /*
          res.data => {
            id, descripcion, talla, colores, precio,
            fotos: ["BASE64_1", "BASE64_2", ...]
          }
        */
        setProducto(res.data);
      } catch (error) {
        console.error(error);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  // Cuando el producto llega, definimos una talla y color por defecto (opcional)
  useEffect(() => {
    if (producto) {
      // Por ejemplo, tomar la primera talla y color como predeterminados
      const tallasArr = producto.talla ? producto.talla.split(",") : [];
      const coloresArr = producto.colores ? producto.colores.split(",") : [];
      if (tallasArr.length > 0) setSelectedSize(tallasArr[0].trim());
      if (coloresArr.length > 0) setSelectedColor(coloresArr[0].trim());
      setQuantity(1);
    }
  }, [producto]);

  if (!producto) {
    return <p>Cargando detalle...</p>;
  }

  // Parsear las tallas y colores a arrays
  const tallas = producto.talla ? producto.talla.split(",") : [];
  const colores = producto.colores ? producto.colores.split(",") : [];

  // Manejar el click en "Agregar al Carrito"
  const handleAddToCart = () => {
    // Construir un objeto con la info necesaria
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
    <div style={{ marginTop: "1rem" }}>
      <button onClick={goBack}>Volver</button>
      <h2>{producto.descripcion}</h2>
      <p>Precio: Q{producto.precio}</p>

      {/* Tallas disponibles */}
      {tallas.length > 0 && (
        <div>
          <label>Talla:</label>
          <select
            value={selectedSize}
            onChange={(e) => setSelectedSize(e.target.value)}
          >
            {tallas.map((t) => (
              <option key={t.trim()} value={t.trim()}>
                {t.trim()}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Colores disponibles */}
      {colores.length > 0 && (
        <div>
          <label>Color:</label>
          <select
            value={selectedColor}
            onChange={(e) => setSelectedColor(e.target.value)}
          >
            {colores.map((c) => (
              <option key={c.trim()} value={c.trim()}>
                {c.trim()}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Cantidad */}
      <div>
        <label>Cantidad:</label>
        <input
          type="number"
          min="1"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          style={{ width: "60px" }}
        />
      </div>

      {/* Mostrar todas las fotos */}
      <div
        style={{
          display: "flex",
          gap: "1rem",
          marginBottom: "1rem",
          marginTop: "1rem",
        }}
      >
        {producto.fotos && producto.fotos.length > 0 ? (
          producto.fotos.map((fotoBase64, index) => (
            <img
              key={index}
              src={`data:image/jpeg;base64,${fotoBase64}`}
              alt={`Foto ${index + 1}`}
              style={{ width: "200px", height: "200px", objectFit: "cover" }}
            />
          ))
        ) : (
          <p>No hay imágenes para este producto.</p>
        )}
      </div>

      <button onClick={handleAddToCart}>Agregar al Carrito</button>
    </div>
  );
};

export default ProductDetail;
