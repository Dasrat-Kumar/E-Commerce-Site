import React from 'react'
import { useNavigate } from 'react-router-dom';
import "./assets/styles/Home.css"
import { Truck, Shield, CreditCard } from 'lucide-react';
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import ProductCard from './components/ProductsCard';
import { db } from './firebase/config';
import { collection, getDocs } from 'firebase/firestore';

function Home() {
    const navigate = useNavigate();
    const [products, setProducts] = React.useState([]);

    React.useEffect(() => {
        const fetchProducts = async () => {
            const snap = await getDocs(collection(db, "products"));
            setProducts(snap.docs.map(d => ({ id: d.id, ...d.data() })));
        };
        fetchProducts();
    }, []);

    const featuredProducts = products.filter(p => p.featured);

    return (
        <div className="home-container">
            <Navbar />

            {/* Welcome Section */}
            <section className='welcome-section'>
                <div className='welcome-content'>
                    <h1 className='welcome-title'>Welcome to E-Commerce</h1>
                    <p className='welcome-subtitle'>Discover amazing products at great prices. Fast shipping, secure checkout, and excellent customer service.</p>
                    <div className="welcome-buttons">
                        <button className='shop-btn' onClick={() => navigate('/products')}>Shop Now &#8594;</button>
                        <button className='browse-btn' onClick={() => navigate('/products?category=Electronics')}>Browse Electronics</button>
                    </div>
                </div>
            </section>

            {/* Featured Section */}
            <section className='featured-section'>
                <h2 className='featured-title'>Why Choose Us?</h2>
                <p className='featured-subtitle'>We provide the best shopping experience with top-quality products and exceptional service.</p>
                <div className='featured-container'>
                    <div className='featured-box'>
                        <div className='featured-card'>
                            <div className="icon-truck"><Truck /></div>
                            <h3 className='featured-card-title'>Fast Delivery</h3>
                            <p className='featured-card-description'>Free shipping on orders over $50. Express delivery available.</p>
                        </div>
                    </div>
                    <div className='featured-box'>
                        <div className='featured-card'>
                            <div className="icon-shield"><Shield /></div>
                            <h3 className='featured-card-title'>Secure Shopping</h3>
                            <p className='featured-card-description'>Your data is protected with industry-standard encryption.</p>
                        </div>
                    </div>
                    <div className='featured-box'>
                        <div className='featured-card'>
                            <div className='icon-credit-card'><CreditCard /></div>
                            <h3 className='featured-card-title'>Easy Returns</h3>
                            <p className='featured-card-description'>30-day money-back guarantee on all purchases.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Products section */}
            <section className='products-section'>
                <div className='products-container'>
                    <div className='products-heading'>
                        <h2>Featured Products</h2>
                        <p>Check out our most popular items</p>
                    </div>
                    <div className='product-items'>
                        {featuredProducts.length === 0 ? (
                            <span>No featured products yet.</span>
                        ) : (
                            featuredProducts.slice(0, 3).map((p) => (
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
                        )}
                    </div>
                    <div className='product-items-button'>
                        <button className='view-product-items-button' onClick={() => navigate('/products')}>View all Products</button>
                    </div>
                </div>
            </section>

            {/* Category of Shops Section */}
            <section className='category-section'>
                <div className='category-container'>
                    <h2 className='category-title'>Shop by Category</h2>
                    <p className='category-subtitle'>Find exactly what you're looking for</p>
                </div>
                <div className='category-box'>
                    <div className='category-card' onClick={() => navigate('/products?category=Electronics')} tabIndex={0} role="button" aria-label="Shop Electronics">
                        <h3>Electronics</h3>
                        <p>{products.filter(p => p.category === 'Electronics').length} products</p>
                    </div>
                    <div className='category-card' onClick={() => navigate('/products?category=Sports')} tabIndex={0} role="button" aria-label="Shop Sports">
                        <h3>Sports</h3>
                        <p>{products.filter(p => p.category === 'Sports').length} products</p>
                    </div>
                    <div className='category-card' onClick={() => navigate('/products?category=Home')} tabIndex={0} role="button" aria-label="Shop Home">
                        <h3>Home</h3>
                        <p>{products.filter(p => p.category === 'Home').length} products</p>
                    </div>
                </div>
            </section>
            <Footer />
        </div>
    )
}

export default Home