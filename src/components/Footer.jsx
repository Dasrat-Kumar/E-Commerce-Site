import React from 'react'
import "../assets/styles/Footer.css"
import { Package, MapPin, Phone, Mail } from 'lucide-react'
import { Link } from "react-router-dom";

function Footer() {
    return (
        <>
            <footer className='footer'>
                <div className='footer-content'>
                    {/* Site Info */}
                    <div className='footer-section'>
                        <div className="icon-package"><Package /><span>E-Commerce</span></div>
                        <p>Your trusted online store for quality products and exceptional service.</p>
                    </div>
                </div>

                {/* Quick Links */}
                <div className='footer-section'>
                    <h3>Quick Links</h3>
                    <ul>
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/products">All Products</Link></li>
                        <li><Link to="/products">Electronics</Link></li>
                        <li><Link to="/products">Clothing</Link></li>
                    </ul>
                </div>

                {/* Customer Service */}
                <div className='footer-section'>
                    <h3>Customer Service</h3>
                    <ul>
                        <li><a href='#'>Contact Us</a></li>
                        <li><a href='#'>Shopping Info</a></li>
                        <li><a href='#'>Returns</a></li>
                        <li><a href='#'>FAQ</a></li>
                    </ul>
                </div>

                {/* Contact Info */}
                <div className='footer-section'>
                    <h3>Contact Info</h3>
                    <ul>
                        <li>
                            <div className="icon-map-pin icons"><MapPin /><span>123 Commerce St, Business District</span></div>
                        </li>
                        <li>
                            <div className="icon-phone icons"><Phone /> <span>(555) 123-4567</span></div>
                        </li>
                        <li>
                            <div className="icon-mail icons"><Mail /><span>support@ourstore.com</span></div>
                        </li>
                    </ul>
                </div>
            </footer>
            <div className='copyright'>
                <p>&copy; 2024 E-Commerce Store. All rights reserved.</p>
                <div className='copyright-links'>
                    <a href='#'>Privacy Policy</a>
                    <a href='#'>Terms of Service</a>
                </div>
            </div>
        </>
    )
}

export default Footer