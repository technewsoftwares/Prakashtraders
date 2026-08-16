import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { API_BASE } from "../Config";
import toast from "react-hot-toast";

export const ShopContext = createContext();

const ShopContextProvider = ({ children }) => {


  // ================= AUTH STATE =================

  const [isAuth, setIsAuth] = useState(false);
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);

  // ================= CART & WISHLIST =================

  const [cartItems, setCartItems] = useState([]);
  const [wishlistItems, setWishlistItems] = useState(() => {
    const saved = localStorage.getItem("wishlistItems");
    return saved ? JSON.parse(saved) : [];
  });

  // ================= RESTORE LOGIN ON REFRESH =================

useEffect(() => {
  const token =

    localStorage.getItem("access_token") ||
    localStorage.getItem("adminToken")
  const role = localStorage.getItem("role");

  if (token && role) {
    setIsAuth(true);
    setToken(token);
    setRole(role);
  }
}, []);

   // ================= SAVE WISHLIST =================
useEffect(() => {
  localStorage.setItem("wishlistItems", JSON.stringify(wishlistItems));
}, [wishlistItems]);


  // ================= RESTORE CART =================



  // ================= SAVE CART =================

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);


  // ================= LOGIN =================

 const login = (accessToken, refreshToken, role) => {
  setIsAuth(true);
  setToken(accessToken);
  setRole(role);

  if (role === "admin") {
    localStorage.setItem("adminToken", accessToken);
  } else {
    localStorage.setItem("access_token", accessToken);
  }

  // Save refresh token
  if (refreshToken) {
    localStorage.setItem("refresh_token", refreshToken);
  }

  localStorage.setItem("role", role);
};

  // ================= LOGOUT =================

  const logout = () => {
    setIsAuth(false);
    setToken(null);
    setRole(null);
    setCartItems([]);
    setWishlistItems([]);

    localStorage.clear();

  };



  // ================= IMAGE NORMALIZER =================

  const toFullImageUrl = (img) => {
  if (!img || typeof img !== "string") return "/image.jpeg";

  if (img.startsWith("http")) return img;

  return `${API_BASE}${img}`;
};



  const normalizeProduct = (product) => ({

    ...product,

image: toFullImageUrl(product?.image || product?.image_1),

  });



  // ================= CART FUNCTIONS =================

  const addToCart = (product) => {

    const normalized = normalizeProduct(product);

    const exist = cartItems.find((x) => x.id === normalized.id);


    if (exist) return false;
    setCartItems([...cartItems, { ...normalized, qty: 1 }]);

    return true;

  };
  const removeFromCart = (id) => {
    setCartItems(cartItems.filter((x) => x.id !== id));
  };



  // ================= WISHLIST =================

const addToWishlist = async (product) => {

  const token = localStorage.getItem("access_token");

  if (!token) {
    toast.error("Please login to add items to wishlist");
    return false;
  }

  const normalized = normalizeProduct(product);

  const exist = wishlistItems.find((x) => x.id === normalized.id);

  if (exist) {
    toast("Already in wishlist");
    return false;
  }

  // ✅ ADD LOCALLY FIRST (instant UI)
  setWishlistItems((prev) => [...prev, normalized]);

  try {
    // ✅ THEN SAVE TO BACKEND
    await axios.post(
      `${API_BASE}/api/auth/wishlist/`,
      { product_id: product.id },
      { headers: { Authorization: `Bearer ${token}` } }
    );
  } catch (error) {
    console.error("Permanent Wishlist Error:", error);
  }

  return true;
};



  const removeFromWishlist = (id) => {

    setWishlistItems(wishlistItems.filter((x) => x.id !== id));

  };



  return (

    <ShopContext.Provider
      value={{
        isAuth,
        token,
        role,
        login,
        logout,
        cartItems,
        addToCart,
        removeFromCart,
        wishlistItems,
        addToWishlist,
        removeFromWishlist,
      }}
    >
      {children}
    </ShopContext.Provider>

  );

};



export default ShopContextProvider;




