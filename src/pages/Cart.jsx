import React, { useContext } from "react";
import { useNavigate } from "react-router";
import "./../assets/styles/Cart.css";
import { CartContext } from "../context/CartContext";
import { Plus, Minus, Trash, ShoppingCart, ShoppingBag } from "lucide-react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

const Cart = () => {
  const navigate = useNavigate();
  const { cart, removeFromCart, clearCart, updateQuantity } = useContext(CartContext);
  const handleQuantityChange = (id, delta) => {
    updateQuantity(id, delta);
  };

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const tax = subtotal * 0.08;
  const shipping = subtotal > 0 ? 0 : 0;
  const total = subtotal + tax + shipping;

  return (
    <div className="cart-page-container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <main style={{ flex: 1 }}>
        <div className="cart-container">
          <div className="cart-main">
            <div className="cart-items-section">
              {cart.length === 0 ? (
                <div className="empty-cart-message" style={{ textAlign: 'center', padding: '40px 0', color: '#888' }}>
                  <ShoppingCart size={48} style={{ marginBottom: 16 }} />
                  <h3>Your cart is empty</h3>
                  <p>Add some products to your cart to see them here.</p>
                </div>
              ) : (
                <>
                  {cart.map((item) => (
                    <div key={item.id} className="cart-item-card">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="cart-item-image"
                      />
                      <div className="cart-item-details">
                        <h4>{item.title}</h4>
                        <p>{item.category}</p>
                        <p className="cart-price">${item.price.toFixed(2)}</p>
                        <div className="cart-quantity-controls">
                          <button onClick={() => handleQuantityChange(item.id, -1)}><Minus size={16} /></button>
                          <span>{item.quantity}</span>
                          <button onClick={() => handleQuantityChange(item.id, 1)}><Plus size={16} /></button>
                        </div>
                        <button className="cart-remove-btn" onClick={() => removeFromCart(item.id)}><Trash size={16} /> Remove</button>
                      </div>
                    </div>
                  ))}
                  <button className="cart-clear-btn" onClick={clearCart}>Clear Cart</button>
                </>
              )}
            </div>
            {cart.length > 0 && (
              <div className="cart-summary-section">
                <h4>Summary</h4>
                <div>
                  <p>
                    <span>Subtotal</span> <span>${subtotal.toFixed(2)}</span>
                  </p>
                  <p>
                    <span>Shipping</span>{" "}
                    <span>{shipping === 0 ? "Free" : `$${shipping}`}</span>
                  </p>
                  <p>
                    <span>Tax</span> <span>${tax.toFixed(2)}</span>
                  </p>
                  <h3>
                    <span>Total</span> <span>${total.toFixed(2)}</span>
                  </h3>
                  <button
                    className="cart-checkout-btn"
                    onClick={() => {
                      if (cart.length === 0) return alert("Your cart is empty!");
                      navigate("/checkout");
                    }}
                  >
                    Proceed to Checkout
                  </button>
                  <button
                    className="cart-continue-btn"
                    onClick={() => navigate("/products")}>
                    <ShoppingBag size={18} /> Continue Shopping
                  </button>

                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Cart;
