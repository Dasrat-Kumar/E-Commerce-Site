import React, { useState, useEffect, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { db } from "../firebase/config";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { CartContext } from "../context/CartContext.js";
import ProductCard from "../components/ProductsCard";
import { Star, ArrowLeft, Truck, Shield, RotateCcw } from "lucide-react";
import "./../assets/styles/ProductDetailsPage.css";

function ProductDetailsPage() {
  const { id } = useParams();
  const { addToCart } = useContext(CartContext);

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);

  // Fetch the selected product
  useEffect(() => {
    const fetchProduct = async () => {
      const docRef = doc(db, "products", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setProduct({ id: docSnap.id, ...docSnap.data() });
      }
    };
    fetchProduct();
  }, [id]);

  // Fetch related products based on category
  useEffect(() => {
    const fetchRelated = async () => {
      if (!product?.category) return;
      const snap = await getDocs(collection(db, "products"));
      const all = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      const related = all
        .filter((p) => p.category === product.category && p.id !== product.id)
        .slice(0, 4);
      setRelatedProducts(related);
    };
    fetchRelated();
  }, [product]);

  if (!product)
    return (
      <>
        <Navbar />
        <div className="product-loading">Loading product...</div>
        <Footer />
      </>
    );

  return (
    <>
      <Navbar />
      <div className="details-wrapper">
        <Link to="/products" className="back-link">
          <ArrowLeft size={16} /> Back to Products
        </Link>

        <div className="product-details-grid">
          <div className="product-image">
            <img src={product.image} alt={product.name} />
          </div>

          <div className="product-info">
            <span className="product-category">{product.category}</span>
            <h1>{product.name}</h1>

            <div className="rating-row">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={18}
                  className={`star-icon ${i < Math.round(product.rating || 0) ? "filled" : ""}`}
                />
              ))}
              <span className="rating-value">{product.rating?.toFixed(1) || "4.5"}</span>
              <span className="rating-count">(123 reviews)</span>
            </div>


            <p className="product-price">${product.price?.toFixed(2)}</p>
            <hr />
            <h3>Description</h3>
            <p className="product-description">{product.description}</p>
            <hr />

            <p className="availability">
              Availability:{" "}
              <span className="in-stock">{product.stock} in stock</span>
            </p>

            <div className="product-buttons">
              <button
                className="add-to-cart-btn"
                onClick={() => addToCart(product)}
              >
                Add to Cart - ${product.price?.toFixed(2)}
              </button>
            </div>

            <div className="product-icons">
              <div>
                <Truck size={18} /> Free shipping over $50
              </div>
              <div>
                <Shield size={18} /> 1 year warranty
              </div>
              <div>
                <RotateCcw size={18} /> 30-day returns
              </div>
            </div>
          </div>
        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <>
            <h2 className="related-title">
              Related{" "}
              {product.category
                ? `${product.category} Products`
                : "Products"}
            </h2>

            <div className="related-products-grid">
              {relatedProducts.map((p) => (
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
              ))}
            </div>
          </>
        )}
      </div>
      <Footer />
    </>
  );
}

export default ProductDetailsPage;
