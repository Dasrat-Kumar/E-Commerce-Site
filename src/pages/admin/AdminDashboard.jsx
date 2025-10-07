import React, { useState, useEffect } from "react";
import {
  Package,
  ShoppingCart,
  Plus,
  Settings,
  Users,
  DollarSign,
  AlertTriangle,
  TrendingUp,
} from "lucide-react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/config";
import ProductManagement from "./ProductManagement";
import OrderManagement from "./OrderManagement";
import "./../../assets/styles/AdminDashboard.css";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

function AdminDashboard() {
  const getInitialTab = () => {
    const params = new URLSearchParams(window.location.search);
    return params.get("tab") || "overview";
  };

  const [activeTab, setActiveTab] = useState(getInitialTab());
  const [metrics, setMetrics] = useState({
    products: 0,
    orders: 0,
    revenue: 0,
    users: 0,
  });

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const productsSnap = await getDocs(collection(db, "products"));
        const ordersSnap = await getDocs(collection(db, "orders"));
        const usersSnap = await getDocs(collection(db, "users"));

        let totalRevenue = 0;
        ordersSnap.forEach((doc) => {
          const data = doc.data();
          totalRevenue += data.total || 0;
        });

        setMetrics({
          products: productsSnap.size,
          orders: ordersSnap.size,
          revenue: totalRevenue,
          users: usersSnap.size,
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchMetrics();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    params.set("tab", activeTab);
    window.history.replaceState({}, "", `${window.location.pathname}?${params}`);
  }, [activeTab]);

  return (
    <>
      <Navbar />
      <div className="dashboard-wrapper">
        <h1>Admin Dashboard</h1>
        <p className="subtitle">Manage your e-commerce store</p>

        <div className="dashboard-nav">
          <button
            className={`nav-btn ${activeTab === "overview" ? "active" : ""}`}
            onClick={() => setActiveTab("overview")}
          >
            <TrendingUp size={18} /> Overview
          </button>
          <button
            className={`nav-btn ${activeTab === "products" ? "active" : ""}`}
            onClick={() => setActiveTab("products")}
          >
            <Package size={18} /> Manage Products
          </button>
          <button
            className={`nav-btn ${activeTab === "orders" ? "active" : ""}`}
            onClick={() => setActiveTab("orders")}
          >
            <ShoppingCart size={18} /> Manage Orders
          </button>
          <button
            className={`nav-btn ${activeTab === "add" ? "active" : ""}`}
            onClick={() => setActiveTab("add")}
          >
            <Plus size={18} /> Add Product
          </button>
          <button
            className={`nav-btn ${activeTab === "settings" ? "active" : ""}`}
            onClick={() => setActiveTab("settings")}
          >
            <Settings size={18} /> Settings
          </button>
        </div>

        {activeTab === "overview" && (
          <>
            <div className="dashboard-metrics">
              <div className="metric-card">
                <div className="metric-icon">
                  <Package size={22} />
                  <h3>Total Products</h3>
                </div>
                <p>{metrics.products}</p>
                <span>0 low stock</span>
              </div>

              <div className="metric-card">
                <div className="metric-icon">
                  <ShoppingCart size={22} />
                  <h3>Total Orders</h3>
                </div>
                <p>{metrics.orders}</p>
                <span>0 pending</span>
              </div>

              <div className="metric-card">
                <div className="metric-icon">
                  <DollarSign size={22} />
                  <h3>Total Revenue</h3>
                </div>
                <p>${metrics.revenue.toFixed(2)}</p>
                <span>All time revenue</span>
              </div>

              <div className="metric-card">
                <div className="metric-icon">
                  <Users size={22} />
                  <h3>Active Users</h3>
                </div>
                <p>{metrics.users}</p>
                <span>Registered users</span>
              </div>
            </div>

            <div className="insights-card">
              <div className="insights-header">
                <TrendingUp size={18} />
                <span>Quick Insights</span>
              </div>
              <div className="insights-grid">
                <div className="insight-item">
                  <p className="insight-value blue">
                    ${(metrics.revenue / (metrics.orders || 1)).toFixed(2)}
                  </p>
                  <span>Average Order Value</span>
                </div>
                <div className="insight-item">
                  <p className="insight-value green">
                    {metrics.orders > 0 ? "100%" : "0%"}
                  </p>
                  <span>Order Fulfillment Rate</span>
                </div>
                <div className="insight-item">
                  <p className="insight-value purple">{metrics.products * metrics.products?.stock }</p>
                  <span>Total Inventory</span>
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === "products" && <ProductManagement showForm={false} />}
        {activeTab === "orders" && <OrderManagement />}
        {activeTab === "add" && <ProductManagement showForm={true} />}
        {activeTab === "settings" && (
          <div className="settings-page">
            <h2>Store Settings</h2>
            <p>Work in Progress</p>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}

export default AdminDashboard;
