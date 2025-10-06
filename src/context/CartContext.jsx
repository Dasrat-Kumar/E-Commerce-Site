// import React, { useState, useEffect, useContext } from "react";
// import { CartContext } from "./CartContext.js";
// import { db } from "../firebase/config";
// import { AuthContext } from "./AuthContext";
// import { doc, setDoc, getDoc } from "firebase/firestore";

// export const CartProvider = ({ children }) => {
//   const [cart, setCart] = useState([]);
//   const { user } = useContext(AuthContext);

//   // Load cart from Firestore on login
//   useEffect(() => {
//     const loadCart = async () => {
//       if (user) {
//         const cartRef = doc(db, "carts", user.uid);
//         const cartSnap = await getDoc(cartRef);
//         if (cartSnap.exists()) {
//           setCart(cartSnap.data().items || []);
//         } else {
//           setCart([]);
//         }
//       } else {
//         setCart([]);
//       }
//     };
//     loadCart();
//   }, [user]);

//   // Save cart to Firestore on change
//   useEffect(() => {
//     const saveCart = async () => {
//       if (user) {
//         const cartRef = doc(db, "carts", user.uid);
//         await setDoc(cartRef, { items: cart });
//       }
//     };
//     saveCart();
//   }, [cart, user]);

//   const addToCart = (product) => {
//     setCart((prev) => {
//       const existing = prev.find((item) => item.id === product.id);
//       if (existing) {
//         return prev.map((item) =>
//           item.id === product.id
//             ? { ...item, quantity: item.quantity + 1 }
//             : item
//         );
//       }
//       return [...prev, { ...product, quantity: 1 }];
//     });
//   };

//   const removeFromCart = (id) => {
//     setCart((prev) => prev.filter((item) => item.id !== id));
//   };


//   const updateQuantity = (id, delta) => {
//     setCart((prev) =>
//       prev.map((item) =>
//         item.id === id
//           ? { ...item, quantity: Math.max(1, item.quantity + delta) }
//           : item
//       )
//     );
//   };

//   const clearCart = () => setCart([]);

//   return (
//   <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, updateQuantity }}>
//       {children}
//     </CartContext.Provider>
//   );
// };


import React, { useState, useEffect, useContext } from "react";
import { CartContext } from "./CartContext"; // Make sure this only exports createContext()
import { AuthContext } from "./AuthContext";
import { db } from "../firebase/config";
import { doc, setDoc, getDoc } from "firebase/firestore";

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const loadCart = async () => {
      if (!user) {
        setCart([]);
        return;
      }

      try {
        const cartRef = doc(db, "carts", user.uid);
        const cartSnap = await getDoc(cartRef);

        if (cartSnap.exists()) {
          setCart(cartSnap.data().items || []);
        } else {
          await setDoc(cartRef, { items: [] });
          setCart([]);
        }
      } catch (error) {
        console.error("🔥 Error loading cart:", error);
      }
    };

    loadCart();
  }, [user]);

  useEffect(() => {
    if (!user) return;

    const timeout = setTimeout(async () => {
      try {
        const sanitizedCart = cart.map((item) => {
          const cleanItem = {};
          Object.entries(item).forEach(([key, value]) => {
            if (value !== undefined) cleanItem[key] = value;
          });
          return cleanItem;
        });

        const cartRef = doc(db, "carts", user.uid);
        await setDoc(cartRef, { items: sanitizedCart });
      } catch (error) {
        console.error("🔥 Error saving cart:", error);
      }
    }, 500);

    return () => clearTimeout(timeout);
  }, [cart, user]);

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id, delta) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  const clearCart = () => setCart([]);
  const getCartTotal = () =>
    cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        updateQuantity,
        getCartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
