// src/data/products.js
import image1 from "../assets/images/image1.jpg";
import image2 from "../assets/images/image2.jpg";
import image3 from "../assets/images/image3.jpg";
import image4 from "../assets/images/image4.jpg";
import image5 from "../assets/images/image5.jpg";
import image6 from "../assets/images/image6.jpg";

const products = [
  {
    id: 1,
    title: "Coffee Maker",
    category: "Home",
    description: "Programmable coffee maker with built-in grinder and thermal carafe.",
    price: 129.99,
    rating: 4.5,
    stock: 25,
    image: image1,
  },
  {
    id: 2,
    title: "Desk Lamp",
    category: "Home",
    description: "LED desk lamp with adjustable brightness and color temperature.",
    price: 49.99,
    rating: 4.5,
    stock: 40,
    image: image2,
  },
  {
    id: 3,
    title: "Running Shoes",
    category: "Sports",
    description: "Comfortable running shoes with advanced cushioning technology.",
    price: 79.99,
    rating: 4.5,
    stock: 30,
    image: image3,
  },
  {
    id: 4,
    title: "Smartphone Case",
    category: "Electronics",
    description: "Durable protective case for smartphones with shock absorption.",
    price: 24.99,
    rating: 4.5,
    stock: 100,
    image: image4,
  },
  {
    id: 5,
    title: "Wireless Bluetooth Headphones",
    category: "Electronics",
    description: "Premium quality wireless headphones with noise cancellation and 30-hour battery life.",
    price: 99.99,
    rating: 4.5,
    stock: 100,
    image: image5,
  },
  {
    id: 6,
    title: "Yoga Mat",
    category: "Sports",
    description: "Non-slip yoga mat made from eco-friendly materials.",
    price: 39.99,
    rating: 4.5,
    stock: 75,
    image: image6,
  },
  // New products
  {
    id: 7,
    title: "Smart Watch",
    category: "Electronics",
    description: "Feature-rich smart watch with heart rate monitor and GPS.",
    price: 149.99,
    rating: 4.7,
    stock: 60,
    image: image4,
  },
  {
    id: 8,
    title: "Blender",
    category: "Home",
    description: "High-speed blender for smoothies and shakes.",
    price: 89.99,
    rating: 4.6,
    stock: 35,
    image: image1,
  },
  {
    id: 9,
    title: "Football",
    category: "Sports",
    description: "Professional-grade football for outdoor play.",
    price: 29.99,
    rating: 4.4,
    stock: 80,
    image: image3,
  },
  {
    id: 10,
    title: "Bluetooth Speaker",
    category: "Electronics",
    description: "Portable Bluetooth speaker with deep bass and long battery life.",
    price: 59.99,
    rating: 4.5,
    stock: 90,
    image: image5,
  },
];

export default products;
