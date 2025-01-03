// App.jsx
import React, { useState, useEffect } from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import axios from "axios";

// Importar páginas
import CatalogPage from "./pages/CatalogPage";
import DetailPage from "./pages/DetailPage";
import CartPage from "./pages/CartPage";
import LoginPage from "./pages/LoginPage";
import AdminPage from "./pages/AdminPage";

// Importar componentes (o podrías importarlos dentro de las páginas)
import ProductList from "./components/ProductList";
import ProductDetail from "./components/ProductDetail";
import AdminProductForm from "./components/AdminProductForm";
import OrderCart from "./components/OrderCart";
import Login from "./components/Login";

/** Ruta protegida básica */
function ProtectedRoute({ isAdmin, children }) {
  if (!isAdmin) {
    return (
      <h2 style={{ textAlign: "center", marginTop: "2rem" }}>No Autorizado</h2>
    );
  }
  return children;
}

function App() {
  const [isAdminLogged, setIsAdminLogged] = useState(false);
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  // Al montar, revisamos si hay token en localStorage
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAdminLogged(true);
    }
  }, []);

  /** Login */
  const handleLogin = async (password) => {
    try {
      const res = await axios.post("http://localhost:4000/api/login", {
        password,
      });
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        setIsAdminLogged(true);
        navigate("/admin"); // Redirigir a Admin
      }
    } catch (error) {
      alert("Contraseña incorrecta");
    }
  };

  /** Logout */
  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAdminLogged(false);
    navigate("/"); // Regresar al catálogo
  };

  /** Agregar al carrito */
  const onAddToCart = (itemData) => {
    // itemData => {id, descripcion, precio, talla, color, cantidad}
    const existing = cart.find(
      (p) =>
        p.id === itemData.id &&
        p.talla === itemData.talla &&
        p.color === itemData.color
    );
    if (existing) {
      // Aumentar cantidad
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
    navigate("/carrito");
  };

  return (
    <div className="container">
      {/* HEADER */}
      <header className="header">
        {/* Al hacer click en el título, te lleva al home (catálogo) */}
        <h1 style={{ cursor: "pointer" }} onClick={() => navigate("/")}>
          Rubi Seduction
        </h1>

        {/* Barra de navegación */}
        <nav className="nav">
          <button onClick={() => navigate("/")}>Catálogo</button>
          <button onClick={() => navigate("/carrito")}>
            Carrito ({cart.length})
          </button>
          {!isAdminLogged ? (
            <button onClick={() => navigate("/login")}>Admin Login</button>
          ) : (
            <>
              <button onClick={() => navigate("/admin")}>Administración</button>
              <button onClick={handleLogout}>Cerrar Sesión</button>
            </>
          )}
        </nav>
      </header>

      {/* DEFINICIÓN DE RUTAS */}
      <Routes>
        {/* Ruta principal (catálogo) */}
        <Route path="/" element={<CatalogPage onAddToCart={onAddToCart} />} />

        {/* Detalle de producto */}
        <Route
          path="/detalle/:id"
          element={<DetailPage onAddToCart={onAddToCart} />}
        />

        {/* Carrito */}
        <Route
          path="/carrito"
          element={<CartPage cart={cart} setCart={setCart} />}
        />

        {/* Login */}
        <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />

        {/* Admin (ruta protegida) */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute isAdmin={isAdminLogged}>
              <AdminPage />
            </ProtectedRoute>
          }
        />

        {/* Cualquier otra ruta: se redirige a / (opcional) */}
        <Route
          path="*"
          element={
            <h2 style={{ textAlign: "center", marginTop: "2rem" }}>
              404: Página no encontrada
            </h2>
          }
        />
      </Routes>

      {/* FOOTER */}
      <footer>
        <div className="footer-content">
          <div className="footer-col">
            <h3>Sobre Nosotros</h3>
            {/* <p>Tu tienda de lencería de confianza.</p> */}
          </div>
          <div className="footer-col">
            <h3>Contacto</h3>
            {/* <p>Email: info@mitienda.com</p> */}
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
