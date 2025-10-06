import React, { useState, useEffect, useContext } from "react";
import "../assets/styles/Navbar.css";
import { Package, Search, ShoppingCart, User, LogOut, Pencil, Trash2, Plus, Minus } from "lucide-react";
import { CartContext } from "../context/CartContext.js";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";

function Navbar() {
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const auth = getAuth();
  const { cart } = useContext(CartContext);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, [auth]);

  const handleLogout = async () => {
    await signOut(auth);
    setDropdownOpen(false);
    navigate("/login");
  };

  // Calculate cart item count
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="navbar">
      {/* Left navbar / Logo */}
      <div className="left-navbar">
        <Link to="/" className="icon-package">
          <Package />
          <p>E-Commerce</p>
        </Link>
      </div>

      {/* Middle / Search bar */}
      <div className="icon-search">
        <span className="search-icon-wrapper">
          <Search size={20} />
        </span>
        <input type="text" placeholder="Search products..." />
      </div>

      {/* Right Navbar */}
      <div className="right-navbar">
        <Link to="/products" className="btn-products">
          Products
        </Link>

        {!user ? (
          <>
            <Link to="/login" className="btn-login">
              Login
            </Link>
            <Link to="/signup" className="btn-signup">
              Sign Up
            </Link>
          </>
        ) : (
          <>
            {/* Cart only for non-admins */}
            {user.email !== "admin@ecommercehai.com" && (
              <Link to="/cart" className="btn-products" style={{ position: "relative" }}>
                <ShoppingCart />
                {cartCount > 0 && (
                  <span style={{
                    position: "absolute",
                    top: -6,
                    right: -6,
                    background: "#111827",
                    color: "#fff",
                    borderRadius: "50%",
                    padding: "2px 7px",
                    fontSize: 12,
                    fontWeight: 700,
                  }}>{cartCount}</span>
                )}
              </Link>
            )}
            {/* Admin dashboard link for admin */}
            {user.email === "admin@ecommercehai.com" && (
              <Link to="/admin-dashboard" className="btn-products">
                Admin Dashboard
              </Link>
            )}
            {/* Profile dropdown */}
            <div className="profile-dropdown">
              <button
                className="btn-profile"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <User />
              </button>

              {dropdownOpen && (
                <div className="dropdown-menu" style={{ minWidth: 180, right: 0, top: 40, position: "absolute", background: "#fff", boxShadow: "0 2px 8px rgba(0,0,0,0.08)", borderRadius: 8, padding: 12, zIndex: 100 }}>
                  <p style={{ marginBottom: 8, fontWeight: 500 }}>{user.email}</p>
                  <button onClick={handleLogout} style={{ width: "100%", background: "#111827", color: "#fff", border: "none", borderRadius: 6, padding: "8px 0", fontWeight: 500, cursor: "pointer" }}>
                    <LogOut size={16} /> Logout
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </header>
  );
}

export default Navbar;