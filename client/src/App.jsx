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

  // onAddToCart ahora recibe un objeto con id, descripcion, precio, talla, color, cantidad
  const onAddToCart = (itemData) => {
    /*
      itemData => {
        id, descripcion, precio, cantidad, talla, color
      }
    */
    // Si ese ítem (mismo id, misma talla y color) ya existe, sumamos cantidad
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
      // Agregar nuevo ítem
      setCart([...cart, itemData]);
    }
    setView("carrito"); // Por ejemplo, ir directamente al carrito
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
    <div style={{ padding: "1rem" }}>
      <h1>Mi Tienda E-commerce</h1>
      <nav style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
        <button onClick={() => setView("catalogo")}>Ver Catálogo</button>
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
  );
}

export default App;
