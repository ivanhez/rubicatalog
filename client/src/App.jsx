import React, { useState, useEffect } from "react";
import ProductList from "./components/ProductList";
import AdminProductForm from "./components/AdminProductForm";
import OrderCart from "./components/OrderCart";
import Login from "./components/Login";
import axios from "axios";

function App() {
  const [view, setView] = useState("catalogo");
  const [isAdminLogged, setIsAdminLogged] = useState(false);

  // Carrito de compras (array de productos con {id, descripcion, precio, cantidad})
  const [cart, setCart] = useState([]);

  useEffect(() => {
    // Verificar si existe el token en localStorage
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

  // Función para agregar producto al carrito
  const addToCart = (producto) => {
    // Si el producto ya está en el carrito, incrementar cantidad
    const existing = cart.find((p) => p.id === producto.id);
    if (existing) {
      setCart(
        cart.map((p) =>
          p.id === producto.id ? { ...p, cantidad: p.cantidad + 1 } : p
        )
      );
    } else {
      setCart([...cart, { ...producto, cantidad: 1 }]);
    }
    setView("catalogo");
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h1>Rubi Seduction</h1>
      {/* Menú de navegación */}
      <nav style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
        <button onClick={() => setView("catalogo")}>Ver Catálogo</button>
        <button onClick={() => setView("carrito")}>
          Ver Carrito ({cart.length})
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

      {/* Secciones */}
      {view === "catalogo" && <ProductList onAddToCart={addToCart} />}
      {view === "carrito" && <OrderCart cart={cart} setCart={setCart} />}
      {view === "login" && <Login onLogin={handleLogin} />}
      {view === "admin" && isAdminLogged && <AdminProductForm />}
    </div>
  );
}

export default App;
