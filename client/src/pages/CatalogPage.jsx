import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ProductList from "../components/ProductList";

function CatalogPage({ onAddToCart }) {
  // 1. Array de imágenes (puedes usar URLs reales, base64, o imports estáticos)
  const heroImages = [
    "/images/3.png",
    "/images/2.jpg",
    "/images/3.png",
  ];
  // 2. Estado para el carrusel
  const [currentSlide, setCurrentSlide] = useState(0);

  // 3. Auto-play (cada 10 segundos)
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) =>
        prev === heroImages.length - 1 ? 0 : prev + 1
      );
    }, 10000);
    return () => clearInterval(interval);
  }, [heroImages]);

  // 4. Funciones para cambiar de slide manualmente
  const handlePrev = () => {
    setCurrentSlide((prev) => (prev === 0 ? heroImages.length - 1 : prev - 1));
  };
  const handleNext = () => {
    setCurrentSlide((prev) => (prev === heroImages.length - 1 ? 0 : prev + 1));
  };

  return (
    <>
      <section className="hero-carousel">
        {/* Hero con carrusel */}
        {heroImages.length > 0 && (
          <div key={currentSlide} className="hero-slide fade">
            <img
              className="hero-image"
              src={heroImages[currentSlide]}
              alt={`Slide ${currentSlide + 1}`}
            />
            <div className="hero-overlay" />

            <div className="hero-content">
              <h1>Descubre nuestra nueva colección de inicio de año</h1>
              <p>Sensualidad y elegancia en cada prenda</p>
            </div>

            {/* Botones para cambiar manualmente */}
            {/* <button className="carousel-button prev" onClick={handlePrev}>
              &lt;
            </button>
            <button className="carousel-button next" onClick={handleNext}>
              &gt;
            </button> */}
          </div>
        )}
      </section>

      <section className="section" id="catalog-section">
        <ProductList onAddToCart={onAddToCart} />
      </section>
    </>
  );
}

export default CatalogPage;
