import { useEffect, useState } from "react";
import { Star, ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";
import demoProducts from "../../DB/productSlide.json";

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function ProductPageSlider() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const allProducts = Object.keys(demoProducts).flatMap(
      (key) => demoProducts[key].map(p => ({ ...p, category: key }))
    );
    setProducts(allProducts);
  }, []);

  // group by category
  const groupedByCategory = products.reduce((acc, p) => {
    acc[p.category] = acc[p.category] || [];
    acc[p.category].push(p);
    return acc;
  }, {});

  const bannerImages = [
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
    "https://images.unsplash.com/photo-1517336714731-489689fd1ca8",
    "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f"
  ];

  const handleAddToCart = (product) => {
    if (!cart.includes(product.id)) {
      setCart((prev) => [...prev, product.id]);
      setTimeout(() => setCart((prev) => prev.filter((id) => id !== product.id)), 1500);
    }
  };

  return (
    <div style={{ padding: "20px", background: "#121212", color: "#fff" }}>
      <br />
      <center><h1>FIND YOUR PRODUCT</h1></center>
      <br />

      {Object.entries(groupedByCategory).map(([category, items], idx) => (
        <div key={category} style={{ marginBottom: "50px" }}>
          {/* Banner between categories */}
          {idx > 0 && (
            <div
              style={{
                width: "100%",
                height: "180px",
                background: `url('${bannerImages[idx % bannerImages.length]}') center/cover no-repeat`,
                borderRadius: "10px",
                margin: "20px 0",
                boxShadow: "0 4px 15px rgba(0,0,0,0.5)"
              }}
            ></div>
          )}

          {/* Category Name */}
          <h3 style={{ marginBottom: "15px", color: "#ffd700" }}>
            {capitalize(category)}
          </h3>

          <div
            style={{
              overflowX: "auto",
              whiteSpace: "nowrap",
              paddingBottom: "10px",
              scrollbarWidth: "none", // Firefox
              msOverflowStyle: "none" // IE/Edge
            }}
            className="no-scrollbar"
          >
            <motion.div
              style={{ display: "flex", gap: "16px", width: "max-content", flexWrap: "wrap" }}
              animate={{ x: ["0%", "-50%"] }}
              transition={{ repeat: Infinity, ease: "linear", duration: 25 }}
            >
              {[...items, ...items].map((product, i) => (
                <div
                  key={`${product.id}-${i}`}
                  style={{
                    minWidth: "160px",
                    maxWidth: "220px",
                    flex: "0 0 auto",
                    marginBottom: "16px",
                    cursor: "pointer",
                    borderRadius: "10px",
                    overflow: "hidden",
                    background: "#1e1e1e",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.6)",
                    color: "#fff",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center"
                  }}
                >
                  {/* Image */}
                  <div style={{ position: "relative", height: "140px", width: "100%", overflow: "hidden" }}>
                    <img
                      src={product.image_url}
                      alt={product.name}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  </div>

                  {/* Name */}
                  <div style={{ padding: "8px", textAlign: "center" }}>
                    <h6 style={{ fontSize: "14px", marginBottom: "5px", color: "#fff" }}>
                      {product.name}
                    </h6>

                    {/* Rating */}
                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginBottom: "5px" }}>
                      {[...Array(5)].map((_, j) => (
                        <Star
                          key={j}
                          size={12}
                          className={j < Math.floor(product.rating) ? "text-warning" : "text-secondary"}
                          fill={j < Math.floor(product.rating) ? "currentColor" : "none"}
                        />
                      ))}
                      <small style={{ marginLeft: "4px", fontSize: "12px", color: "#ccc" }}>
                        {product.rating.toFixed(1)}
                      </small>
                    </div>

                    {/* Price */}
                    <div style={{ fontWeight: 600, color: "#ffd700" }}>
                      ₹{product.price.toLocaleString("en-IN")}
                    </div>
                  </div>

                  {/* Add to Cart */}
                  <div style={{ padding: "8px", width: "100%" }}>
                    <button
                      style={{
                        backgroundColor: cart.includes(product.id) ? "#555" : "#ffd700",
                        color: cart.includes(product.id) ? "#ccc" : "#000",
                        border: "none",
                        width: "100%",
                        padding: "8px 0",
                        borderRadius: "5px",
                        fontWeight: 600,
                        transition: "0.3s"
                      }}
                      onClick={() => handleAddToCart(product)}
                    >
                   
                      {cart.includes(product.id) ? "Added!" : "Add to Cart test"}
                    </button>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      ))}

      {/* CSS to hide scrollbar for Webkit browsers */}
      <style>
        {`
          .no-scrollbar::-webkit-scrollbar {
            display: none;
          }
        `}
      </style>
    </div>
  );
}

export default ProductPageSlider;
