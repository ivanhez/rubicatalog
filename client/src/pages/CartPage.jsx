// pages/CartPage.jsx
import React from "react";
import OrderCart from "../components/OrderCart";

function CartPage({ cart, setCart }) {
  return (
    <div style={{ marginTop: "2rem" }}>
      <OrderCart cart={cart} setCart={setCart} />
    </div>
  );
}

export default CartPage;
