import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/config";

function ProtectedRoute({ children, requireAdmin = false }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(undefined);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        const adminFlag = firebaseUser.email === "admin@ecommercehai.com";
        setIsAdmin(adminFlag);
      } else {
        setIsAdmin(undefined);
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);


  if (loading || (requireAdmin && isAdmin === undefined)) return <p>Loading...</p>;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If admin route is required → check isAdmin from Firestore
  if (requireAdmin && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;
