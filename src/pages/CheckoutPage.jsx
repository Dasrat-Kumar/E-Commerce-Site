import React, { useState, useContext } from "react";
import "./../assets/styles/CheckoutPage.css";
import { UserRound, MapPin, CreditCard, ShoppingCart } from "lucide-react";
import { CartContext } from "./../context/CartContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Checkout() {
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const { cart, clearCart } = useContext(CartContext);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    zip: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const isFormValid = Object.values(form).every((val) => val.trim() !== "");
  const safeCart = Array.isArray(cart) ? cart : [];
  const subtotal = safeCart.reduce(
    (sum, item) => sum + (item?.price ?? 0) * (item?.quantity ?? 0),
    0
  );
  const tax = subtotal * 0.08;
  const shipping = subtotal > 0 ? 0 : 0;
  const total = subtotal + tax + shipping;

  const handlePlaceOrder = () => {
    if (!isFormValid) {
      alert("⚠️ Please fill in all required fields before placing your order.");
      return;
    }

    if (safeCart.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    alert("✅ Order placed successfully!");
    clearCart();
  };

  return (
    <div
      className="checkout-page"
      style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
    >
      <Navbar />
      <main style={{ flex: 1 }}>
        <div className="checkout-container">
          <h1 className="checkout-title">
            <ShoppingCart
              size={22}
              style={{ marginRight: 8, verticalAlign: "middle" }}
            />
            Checkout
          </h1>

          <div className="checkout-grid">
            {/* LEFT SIDE */}
            <div className="checkout-left">
              <div className="checkout-card">
                <h2>
                  <UserRound
                    size={18}
                    style={{ marginRight: 6, verticalAlign: "middle" }}
                  />
                  Customer Information
                </h2>
                <div className="form-row">
                  <div className="form-group">
                    <label>Full Name *</label>
                    <input
                      name="name"
                      type="text"
                      placeholder="Full name"
                      value={form.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Email Address *</label>
                    <input
                      name="email"
                      type="email"
                      placeholder="email@example.com"
                      value={form.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Phone Number *</label>
                  <input
                    name="phone"
                    type="text"
                    placeholder="Phone number"
                    value={form.phone}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* Shipping Address */}
              <div className="checkout-card">
                <h2>
                  <MapPin
                    size={18}
                    style={{ marginRight: 6, verticalAlign: "middle" }}
                  />
                  Shipping Address
                </h2>
                <div className="form-group">
                  <label>Street Address *</label>
                  <input
                    name="street"
                    type="text"
                    placeholder="Street address"
                    value={form.street}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>City *</label>
                    <input
                      name="city"
                      type="text"
                      placeholder="City"
                      value={form.city}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>State *</label>
                    <input
                      name="state"
                      type="text"
                      placeholder="State"
                      value={form.state}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>ZIP Code *</label>
                    <input
                      name="zip"
                      type="text"
                      placeholder="ZIP"
                      value={form.zip}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="checkout-card">
                <h2>
                  <CreditCard
                    size={18}
                    style={{ marginRight: 6, verticalAlign: "middle" }}
                  />
                  Payment Method
                </h2>
                <div className="payment-methods">
                  <label>
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === "cod"}
                      onChange={() => setPaymentMethod("cod")}
                    />
                    Cash on Delivery
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === "card"}
                      onChange={() => setPaymentMethod("card")}
                    />
                    Credit/Debit Card (Demo - Not functional)
                  </label>
                </div>
                <p className="demo-note">
                  This is a demo application. Payment processing is simulated
                  for demonstration purposes only.
                </p>
              </div>
            </div>

            {/* RIGHT SIDE */}
            <div className="checkout-right">
              <div className="checkout-card order-summary">
                <h2>
                  <ShoppingCart
                    size={18}
                    style={{ marginRight: 6, verticalAlign: "middle" }}
                  />
                  Order Summary
                </h2>

                {safeCart.length === 0 ? (
                  <p
                    style={{
                      textAlign: "center",
                      color: "#888",
                      padding: "20px 0",
                    }}
                  >
                    Your cart is empty.
                  </p>
                ) : (
                  <>
                    {safeCart.map((item) => (
                      <div className="order-item" key={item.id}>
                        <img src={item.image} alt={item.title} />
                        <div className="order-details">
                          <p>{item.title}</p>
                          <small>Qty: {item.quantity}</small>
                        </div>
                        <p>
                          $
                          {((item.price ?? 0) * (item.quantity ?? 0)).toFixed(
                            2
                          )}
                        </p>
                      </div>
                    ))}

                    <div className="summary-line">
                      <span>Subtotal:</span>{" "}
                      <span>${subtotal.toFixed(2)}</span>
                    </div>

                    <div className="summary-line">
                      <span>Shipping:</span>{" "}
                      <span className="green-text">
                        {shipping === 0
                          ? "Free"
                          : `$${shipping.toFixed(2)}`}
                      </span>
                    </div>

                    <div className="summary-line">
                      <span>Tax:</span> <span>${tax.toFixed(2)}</span>
                    </div>

                    <div className="summary-total">
                      <strong>Total:</strong>{" "}
                      <strong>${total.toFixed(2)}</strong>
                    </div>

                    <button
                      className="place-order-btn"
                      onClick={handlePlaceOrder}
                      disabled={!isFormValid}
                      style={{
                        opacity: !isFormValid ? 0.5 : 1,
                        cursor: !isFormValid ? "not-allowed" : "pointer",
                      }}
                    >
                      Place Order - ${total.toFixed(2)}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default Checkout;