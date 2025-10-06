import React, { useEffect, useState } from "react";
import Navbar from "./../../components/Navbar";
import Footer from "./../../components/Footer";
import { db } from "./../../firebase/config";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import "./../../assets/styles/OrderManagement.css"

function OrderManagement() {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    const snap = await getDocs(collection(db, "orders"));
    setOrders(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  };

  useEffect(() => { fetchOrders(); }, []);

  const updateStatus = async (orderId, status) => {
    await updateDoc(doc(db, "orders", orderId), { status });
    window.location.href = '/admin-dashboard?tab=orders';
  };

  return (
    <div className="admin-card">
      <h2 style={{ marginBottom: 16 }}>Orders</h2>
      <div className="admin-list">
        {orders.map(o => (
          <div key={o.id} className="admin-list-item">
            <div>
              <strong>{o.email}</strong> — ${o.total?.toFixed(2)} — {o.status}
              <div style={{ fontSize: 13, color: '#888' }}>{new Date(o.createdAt?.toDate?.() || Date.now()).toLocaleString()}</div>
            </div>
            <div className="admin-actions">
              <button onClick={() => updateStatus(o.id, "shipped")}>Mark Shipped</button>
              <button onClick={() => updateStatus(o.id, "delivered")}>Mark Delivered</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default OrderManagement