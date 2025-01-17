// pages/AdminPage.jsx
import React from "react";
import AdminProductForm from "../components/AdminProductForm";
import InventoryPage from "../components/Inventory";

function AdminPage() {
  return (
    <div style={{ marginTop: "2rem" }}>
      <h2>Administración de Productos</h2>
      <AdminProductForm />
    </div>
  );
}

export default AdminPage;
