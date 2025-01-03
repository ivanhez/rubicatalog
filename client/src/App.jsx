// App.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";

import ProductList from "./components/ProductList";
import ProductDetail from "./components/ProductDetail";
import AdminProductForm from "./components/AdminProductForm";
import OrderCart from "./components/OrderCart";
import Login from "./components/Login";

function App() {
  const [view, setView] = useState("catalogo");
  const [isAdminLogged, setIsAdminLogged] = useState(false);
  const [cart, setCart] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAdminLogged(true);
    }
  }, []);

  const handleLogin = async (password) => {
    try {
      const res = await axios.post("http://localhost:4000/api/login", {
        password,
      });
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        setIsAdminLogged(true);
        setView("admin");
      }
    } catch (error) {
      alert("Contraseña incorrecta");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAdminLogged(false);
    setView("catalogo");
  };

  const onAddToCart = (itemData) => {
    const existing = cart.find(
      (p) =>
        p.id === itemData.id &&
        p.talla === itemData.talla &&
        p.color === itemData.color
    );
    if (existing) {
      setCart(
        cart.map((p) =>
          p === existing
            ? { ...p, cantidad: p.cantidad + itemData.cantidad }
            : p
        )
      );
    } else {
      setCart([...cart, itemData]);
    }
    setView("carrito");
  };

  const handleSelectProduct = (id) => {
    setSelectedProductId(id);
    setView("detalle");
  };

  const handleGoBack = () => {
    setSelectedProductId(null);
    setView("catalogo");
  };

  return (
    <div className="container">
      {/* HEADER */}
      <header className="header">
        <h1 onClick={() => setView("catalogo")}>Rubi Seduction</h1>
        <nav className="nav">
          <button onClick={() => setView("catalogo")}>Catálogo</button>
          <button onClick={() => setView("carrito")}>
            Carrito ({cart.length})
          </button>
          {!isAdminLogged ? (
            <button onClick={() => setView("login")}>Admin Login</button>
          ) : (
            <>
              <button onClick={() => setView("admin")}>Administración</button>
              <button onClick={handleLogout}>Cerrar Sesión</button>
            </>
          )}
        </nav>
      </header>

      {/* MAIN CONTENT */}
      {view === "catalogo" && (
        <>
          {/* HERO opcional */}
          <section className="hero">
            <div className="hero-content">
              <h1>Descubre nuestra nueva colección</h1>
              <p>Sensualidad y elegancia en cada prenda</p>
              <a
                className="hero-button"
                href="#"
                onClick={() => setView("catalogo")}
              >
                ¡Comprar Ahora!
              </a>
            </div>
          </section>

          <section className="section">
            <ProductList
              onSelectProduct={handleSelectProduct}
              onAddToCart={onAddToCart}
            />
          </section>
        </>
      )}

      {view === "detalle" && (
        <ProductDetail
          productId={selectedProductId}
          onAddToCart={onAddToCart}
          goBack={handleGoBack}
        />
      )}
      {view === "carrito" && <OrderCart cart={cart} setCart={setCart} />}
      {view === "login" && <Login onLogin={handleLogin} />}
      {view === "admin" && isAdminLogged && <AdminProductForm />}

      {/* FOOTER (Opcional) */}
      <footer>
        <div className="footer-content">
          <div className="footer-col">
            <h3>Sobre Nosotros</h3>
            <p>Tu tienda de lencería de confianza.</p>
          </div>
          <div className="footer-col">
            <h3>Contacto</h3>
            <p>Email: info@mitienda.com</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
