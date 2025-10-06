import React, { useState } from "react";
import "./../assets/styles/Login.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { toast } from "react-toastify";
import { auth, db } from "./../firebase/config";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const userCred = await signInWithEmailAndPassword(auth, email, password);
      const user = userCred.user;

      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        // Assign isAdmin based on email
        const isAdmin = user.email === "admin@ecommercehai.com";
        await setDoc(userRef, { email: user.email, isAdmin });

        toast.success("Login successful!");
        if (isAdmin) {
          navigate("/admin-dashboard");
        } else {
          navigate("/");
        }
      } else {
        const isAdmin = userSnap.data().isAdmin;

        toast.success("Login successful!");
        if (isAdmin) {
          navigate("/admin-dashboard");
        } else {
          navigate("/");
        }
      }
    } catch (err) {
      console.error("Login error:", err.message);
      setError("Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="login-wrapper">
        <div className="login-card">
          <h2>Sign in to your account</h2>
          <p className="subtitle">
            Enter your email and password to access your account
          </p>

          {error && <p className="error">{error}</p>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email address</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="signin-btn" disabled={loading}>
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <div className="divider">
            <span>Don't have an account?</span>
          </div>

          <button
            className="create-btn"
            onClick={() => navigate("/signup")}
          >
            Create new account
          </button>

          <div className="demo-box">
            <strong>Demo Credentials:</strong>
            <p>
              Admin: <b>admin@ecommercehai.com</b> / <b>chalbhai</b>
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default LoginPage;
