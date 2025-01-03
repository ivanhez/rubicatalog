// pages/LoginPage.jsx
import React from "react";
import Login from "../components/Login";

function LoginPage({ onLogin }) {
  return (
    <div style={{ marginTop: "2rem" }}>
      <Login onLogin={onLogin} />
    </div>
  );
}

export default LoginPage;
