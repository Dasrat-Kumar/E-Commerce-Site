import React, { useState, useEffect, useContext } from "react";
import "../assets/styles/Navbar.css";
import { Package, Search, ShoppingCart, User, LogOut, Menu, X } from "lucide-react";
import { CartContext } from "../context/CartContext.js";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";

function Navbar() {
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
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
    setMenuOpen(false);
    navigate("/login");
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  // Calculate cart item count
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="navbar">
      <div className="left-navbar">
        <Link to="/" className="icon-package">
          <Package />
          <p>E-Commerce</p>
        </Link>
      </div>

      {/* Search bar for desktop */}
      <div className="icon-search desktop-only">
        <span className="search-icon-wrapper">
          <Search size={20} />
        </span>
        <input type="text" placeholder="Search products..." />
      </div>

      {/* Hamburger toggle button */}
      <button
        className="hamburger mobile-only"
        aria-label="Toggle menu"
        aria-expanded={menuOpen}
        onClick={toggleMenu}
      >
        {menuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile menu */}
      <div className={`mobile-menu mobile-only ${menuOpen ? "show" : ""}`}>
        {/* Search inside mobile menu */}
        <div className="icon-search">
          <span className="search-icon-wrapper">
            <Search size={20} />
          </span>
          <input type="text" placeholder="Search products..." />
        </div>

        {/* Mobile right navbar */}
        <nav className="right-navbar-mobile">
          <Link to="/products" className="btn-products" onClick={() => setMenuOpen(false)}>
            Products
          </Link>

          {!user ? (
            <>
              <Link to="/login" className="btn-login" onClick={() => setMenuOpen(false)}>
                Login
              </Link>
              <Link to="/signup" className="btn-signup" onClick={() => setMenuOpen(false)}>
                Sign Up
              </Link>
            </>
          ) : (
            <>
              {/* Cart for non-admins */}
              {user.email !== "admin@ecommercehai.com" && (
                <Link
                  to="/cart"
                  className="btn-products"
                  style={{ position: "relative" }}
                  onClick={() => setMenuOpen(false)}
                >
                  <ShoppingCart />
                  <p className="btn-products-text">Cart</p>
                  {cartCount > 0 && (
                    <span className="cart-count">{cartCount}</span>
                  )}
                </Link>
              )}
              {/* Admin dashboard for admin */}
              {user.email === "admin@ecommercehai.com" && (
                <Link to="/admin-dashboard" className="btn-products" onClick={() => setMenuOpen(false)}>
                  Admin Dashboard
                </Link>
              )}

              {/* Profile dropdown */}
              <div className="profile-dropdown-mobile">
                <button
                  className="btn-profile"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                  <User />
                  <p className="btn-profile-text">Profile</p>
                </button>

                {dropdownOpen && (
                  <div className="dropdown-menu">
                    <p className="user-email">{user.email}</p>
                    <button className="logout-button" onClick={() => {
                      handleLogout();
                      setMenuOpen(false);
                    }}>
                      <LogOut size={16} /> Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </nav>
      </div>

      {/* Desktop right navbar */}
      <nav className="right-navbar desktop-only">
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
            {/* Cart for non-admins */}
            {user.email !== "admin@ecommercehai.com" && (
              <Link
                to="/cart"
                className="btn-products"
                style={{ position: "relative" }}
              >
                <ShoppingCart />
                {cartCount > 0 && (
                  <span className="cart-count">{cartCount}</span>
                )}
              </Link>
            )}
            {/* Admin dashboard for admin */}
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
                <div className="dropdown-menu">
                  <p className="user-email">{user.email}</p>
                  <button className="logout-button" onClick={handleLogout}>
                    <LogOut size={16} /> Logout
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </nav>
    </header>
  );
}

export default Navbar;
