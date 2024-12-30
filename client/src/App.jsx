// App.jsx
import React, { useState, useEffect } from "react";
import ProductList from "./components/ProductList";
import ProductDetail from "./components/ProductDetail";
import AdminProductForm from "./components/AdminProductForm";
import OrderCart from "./components/OrderCart";
import Login from "./components/Login";
import axios from "axios";

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
      <header className="header">
        <div className="header__logo">
          <h1>Rubi Seduction</h1>
        </div>
        <nav className="header__nav">
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

      <div className="main-content">
        {view === "catalogo" && (
          <ProductList
            onSelectProduct={handleSelectProduct}
            onAddToCart={onAddToCart}
          />
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
      </div>
    </div>
  );
}

export default App;
