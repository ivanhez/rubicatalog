import React, { useState } from "react";
import ProductList from "./components/ProductList";
import AdminProductForm from "./components/AdminProductForm";
import OrderForm from "./components/OrderForm";

function App() {
  const [view, setView] = useState("catalogo");

  return (
    <div style={{ padding: "1rem" }}>
      <h1>Mi Tienda E-commerce</h1>
      <nav style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
        <button onClick={() => setView("catalogo")}>Catálogo</button>
        <button onClick={() => setView("crearPedido")}>Crear Pedido</button>
        <button onClick={() => setView("admin")}>Administración</button>
      </nav>

      {view === "catalogo" && <ProductList />}
      {view === "crearPedido" && <OrderForm />}
      {view === "admin" && <AdminProductForm />}
    </div>
  );
}

export default App;
