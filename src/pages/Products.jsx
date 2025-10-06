import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./../assets/styles/Products.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { db } from "../firebase/config";
import { collection, getDocs } from "firebase/firestore";
import ProductCard from "../components/ProductsCard";

function Products() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All Categories");
  const [priceRange, setPriceRange] = useState("All Prices");
  const [sortBy, setSortBy] = useState("Name (A-Z)");
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const cat = params.get("category");
    if (cat && ["Home", "Sports", "Electronics"].includes(cat)) {
      setCategory(cat);
    }
  }, [location.search]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const snap = await getDocs(collection(db, "products"));
        const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        setProducts(data);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to load products. Please try again later.");
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = products
    .filter((p) => {
      const matchesSearch =
        p.name && p.name.toLowerCase().includes(search.toLowerCase());
      const matchesCategory =
        category === "All Categories" || p.category === category;

      let matchesPrice = true;
      const price = p.price || 0;
      if (priceRange === "Under $50") matchesPrice = price < 50;
      else if (priceRange === "$50 - $100")
        matchesPrice = price >= 50 && price <= 100;
      else if (priceRange === "Over $100") matchesPrice = price > 100;

      return matchesSearch && matchesCategory && matchesPrice;
    })
    .sort((a, b) => {
      if (sortBy === "Name (A-Z)")
        return (a.name || "").localeCompare(b.name || "");
      if (sortBy === "Name (Z-A)")
        return (b.name || "").localeCompare(a.name || "");
      if (sortBy === "Price (Low-High)") return a.price - b.price;
      if (sortBy === "Price (High-Low)") return b.price - a.price;
      return 0;
    });

  return (
    <div
      className="products-page-container"
      style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
    >
      <Navbar />
      <main className="products-wrapper" style={{ flex: 1 }}>
        <h1>All Products</h1>
        <p className="subtitle">Browse our complete collection of products</p>

        <div className="filters">
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search products"
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            aria-label="Select category"
          >
            <option>All Categories</option>
            <option>Home</option>
            <option>Sports</option>
            <option>Electronics</option>
          </select>

          <select
            value={priceRange}
            onChange={(e) => setPriceRange(e.target.value)}
            aria-label="Select price range"
          >
            <option>All Prices</option>
            <option>Under $50</option>
            <option>$50 - $100</option>
            <option>Over $100</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            aria-label="Sort products"
          >
            <option>Name (A-Z)</option>
            <option>Name (Z-A)</option>
            <option>Price (Low-High)</option>
            <option>Price (High-Low)</option>
          </select>
        </div>

        {error && <p className="error-message">{error}</p>}

        <div className="product-grid">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((p) => (
              <ProductCard
                key={p.id}
                image={p.image}
                title={p.name}
                category={p.category}
                description={p.description}
                price={p.price}
                rating={p.rating}
                stock={p.stock}
                id={p.id}
              />
            ))
          ) : (
            !error && (
              <p className="no-products-message">
                No products found matching your filters.
              </p>
            )
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default Products;
