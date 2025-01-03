// CatalogPage.jsx
import React from "react";
import { Link } from "react-router-dom";
import ProductList from "../components/ProductList";

function CatalogPage({ onAddToCart }) {
  return (
    <>
      <section className="hero">
        <div className="hero-content">
          <h1>Descubre nuestra nueva colección</h1>
          <p>Sensualidad y elegancia en cada prenda</p>
          {/* Botón que baje al catálogo, o que navegue a otra ruta */}
          <a className="hero-button" href="#catalog-section">
            ¡Comprar Ahora!
          </a>
        </div>
      </section>

      <section className="section" id="catalog-section">
        <ProductList onAddToCart={onAddToCart} />
      </section>
    </>
  );
}

export default CatalogPage;
