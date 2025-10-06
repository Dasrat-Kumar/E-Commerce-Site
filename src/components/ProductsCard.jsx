import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext.js";
import { Star } from "lucide-react";

function ProductCard({ image, title, category, description, price, rating, stock, id }) {
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);
  const handleAddToCart = () => {
    addToCart({ id, image, title, category, description, price, rating, stock });
  };

  return (
    <div className="product-card">
      <img src={image} alt={title} className="product-image" />

      <div className="product-content">
        <span className="product-category">{category}</span>
        <h3 className="product-title">{title}</h3>
        <p className="product-description">{description}</p>
        <p className="product-price">${price}</p>
        <p style={{ color: "#888", fontSize: 13 }}>Stock: {stock}</p>

        <div className="rating-row">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              size={16}
              className={`star-icon ${i < Math.round(rating || 0) ? "filled" : ""}`}
            />
          ))}
          <span className="rating-value">{rating?.toFixed(1) || "4.5"}</span>
        </div>

        <div className="product-buttons">
          <button className="btn-outline" onClick={() => navigate(`/product/${id}`)}>View</button>
          <button className="btn-primary" onClick={handleAddToCart}>Add</button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
