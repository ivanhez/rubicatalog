// DetailPage.jsx
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import ProductDetail from "../components/ProductDetail";

function DetailPage({ onAddToCart }) {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <ProductDetail
      productId={id}
      onAddToCart={onAddToCart}
      goBack={() => navigate(-1)}
    />
  );
}

export default DetailPage;
