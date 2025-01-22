import React, { useState, useEffect } from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import axios from "axios";

// Importar páginas
import CatalogPage from "./pages/CatalogPage";
import DetailPage from "./pages/DetailPage";
import CartPage from "./pages/CartPage";
import LoginPage from "./pages/LoginPage";
import AdminPage from "./pages/AdminPage";
import InventoryPage from "./pages/InventoryPage";

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

  // Estados para responsive nav
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [navOpen, setNavOpen] = useState(false);

  useEffect(() => {
    // Revisar admin token
    const token = localStorage.getItem("token");
    if (token) {
      setIsAdminLogged(true);
    }

    // Listener de resize
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) {
        // Si la pantalla vuelve a modo escritorio, cierra el nav
        setNavOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  /** Login */
  const handleLogin = async (password) => {
    try {
      const res = await axios.post(
        "https://rubiseduction.shop:4000/api/login",
        {
          password,
        }
      );
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        setIsAdminLogged(true);
        navigate("/admin");
      }
    } catch (error) {
      alert("Contraseña incorrecta");
    }
  };

  /** Logout */
  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAdminLogged(false);
    navigate("/");
  };

  /** Agregar al carrito */
  const onAddToCart = (itemData) => {
    /*
      itemData => { id, descripcion, precio, talla, color, cantidad }
    */
    const existing = cart.find(
      (p) =>
        p._id === itemData.id &&
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
    navigate("/carrito");
  };

  // Toggle nav en móvil
  const toggleNav = () => {
    setNavOpen(!navOpen);
  };

  // Función para navegar y cerrar menú en móvil
  const handleNavClick = (path) => {
    navigate(path);
    setNavOpen(false);
  };

  return (
    <div className="container">
      {/* HEADER */}
      <header className="header">
        <h1 className="header__logo" onClick={() => navigate("/")}>
          Rubi Seduction
        </h1>

        {!isMobile ? (
          /* Nav escritorio */
          <nav className="nav-desktop">
            <button onClick={() => navigate("/")}>Catálogo</button>
            <button onClick={() => navigate("/carrito")}>
              Carrito ({cart.length})
            </button>
            {isAdminLogged && (
              <>
                <button onClick={() => navigate("/admin")}>Productos</button>
                <button onClick={() => navigate("/inventario")}>
                  Inventario
                </button>
                <button onClick={handleLogout}>Cerrar Sesión</button>
              </>
            )}
          </nav>
        ) : (
          /* Botón hamburger en móvil */
          <button className="hamburger" onClick={toggleNav}>
            ☰
          </button>
        )}
      </header>

      {/* Sidebar overlay para móvil */}
      {isMobile && navOpen && (
        <div className="overlay" onClick={toggleNav}>
          <div className="sidebar" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={toggleNav}>
              ✕
            </button>
            <nav className="nav-mobile">
              <div>
                {" "}
                <button onClick={() => handleNavClick("/")}>Catálogo</button>
              </div>
              <div>
                <button onClick={() => handleNavClick("/carrito")}>
                  Carrito ({cart.length})
                </button>
              </div>
              {isAdminLogged && (
                <>
                  <div>
                    <button onClick={() => handleNavClick("/admin")}>
                      Productos
                    </button>
                  </div>
                  <div>
                    <button onClick={() => handleNavClick("/inventario")}>
                      Inventario
                    </button>
                  </div>
                  <div>
                    {" "}
                    <button onClick={handleLogout}>Cerrar Sesión</button>
                  </div>
                </>
              )}
            </nav>
          </div>
        </div>
      )}

      <Routes>
        <Route path="/" element={<CatalogPage onAddToCart={onAddToCart} />} />
        <Route
          path="/detalle/:id"
          element={<DetailPage onAddToCart={onAddToCart} />}
        />
        <Route
          path="/carrito"
          element={<CartPage cart={cart} setCart={setCart} />}
        />
        <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute isAdmin={isAdminLogged}>
              <AdminPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/inventario"
          element={
            <ProtectedRoute isAdmin={isAdminLogged}>
              <InventoryPage />
            </ProtectedRoute>
          }
        />
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
            <p>Lencería para seducir 🌹</p>
            <p>Contamos con lencería y todo tipo de ropa interior para dama</p>
          </div>
          <div className="footer-col">
            <h3>Contacto</h3>
            <p>
              <a href="https://www.instagram.com/rubiseductiongt/">
                Instagram: @rubiseductiongt
              </a>
            </p>
            <p>
              <a href="https://api.whatsapp.com/send?phone=50231383430">
                Whatsapp: 3138-3430
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
