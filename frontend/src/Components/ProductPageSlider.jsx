import { useMemo, useState } from "react";
import { Star } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import demoProducts from "../../DB/productSlide.json";

const bannerImages = [
  "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
  "https://images.unsplash.com/photo-1517336714731-489689fd1ca8",
  "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f",
];

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function ProductPageSlider() {
  const [cart, setCart] = useState([]);
  const shouldReduceMotion = useReducedMotion();

  const groupedByCategory = useMemo(() => {
    return Object.entries(demoProducts).map(([category, products]) => ({
      category,
      items: products.map((product) => ({
        ...product,
        category,
      })),
    }));
  }, []);

  const handleAddToCart = (productId) => {
    setCart((previousCart) =>
      previousCart.includes(productId)
        ? previousCart
        : [...previousCart, productId]
    );

    setTimeout(() => {
      setCart((previousCart) =>
        previousCart.filter((id) => id !== productId)
      );
    }, 1500);
  };

  return (
    <section className="product-slider-page">
      <h1 className="product-slider-title">FIND YOUR PRODUCT</h1>

      {groupedByCategory.map(({ category, items }, categoryIndex) => (
        <div className="product-category" key={category}>
          {categoryIndex > 0 && (
            <div
              className="category-banner"
              style={{
                backgroundImage: `url("${bannerImages[
                  categoryIndex % bannerImages.length
                ]}")`,
              }}
              aria-hidden="true"
            />
          )}

          <h2 className="category-title">{capitalize(category)}</h2>

          <div className="product-scroll-container">
            <motion.div
              className="product-list"
              animate={
                shouldReduceMotion
                  ? undefined
                  : { x: ["0%", "-50%"] }
              }
              transition={
                shouldReduceMotion
                  ? undefined
                  : {
                      repeat: Infinity,
                      ease: "linear",
                      duration: 25,
                    }
              }
            >
              {items.map((product, productIndex) => {
                const isAdded = cart.includes(product.id);

                return (
                  <article className="product-card" key={product.id}>
                    <div className="product-image-wrapper">
                      <img
                        src={product.image_url}
                        alt={product.name}
                        width="220"
                        height="140"
                        loading={
                          categoryIndex === 0 && productIndex < 2
                            ? "eager"
                            : "lazy"
                        }
                        fetchPriority={
                          categoryIndex === 0 && productIndex < 2
                            ? "high"
                            : "auto"
                        }
                        decoding="async"
                        className="product-image"
                      />
                    </div>

                    <div className="product-details">
                      <h3 className="product-name">{product.name}</h3>

                      <div className="product-rating">
                        {[...Array(5)].map((_, index) => {
                          const filled =
                            index < Math.floor(product.rating);

                          return (
                            <Star
                              key={index}
                              size={12}
                              fill={filled ? "currentColor" : "none"}
                              className={
                                filled
                                  ? "rating-star filled"
                                  : "rating-star"
                              }
                              aria-hidden="true"
                            />
                          );
                        })}

                        <span>{product.rating.toFixed(1)}</span>
                      </div>

                      <div className="product-price">
                        ₹{product.price.toLocaleString("en-IN")}
                      </div>
                    </div>

                    <button
                      type="button"
                      className={`cart-button ${
                        isAdded ? "cart-button-added" : ""
                      }`}
                      onClick={() => handleAddToCart(product.id)}
                      disabled={isAdded}
                    >
                      {isAdded ? "Added!" : "Add to Cart"}
                    </button>
                  </article>
                );
              })}
            </motion.div>
          </div>
        </div>
      ))}

      <style>{`
        .product-slider-page {
          padding: 20px;
          background: #121212;
          color: #fff;
          overflow: hidden;
        }

        .product-slider-title {
          margin: 0 0 30px;
          text-align: center;
          font-size: clamp(24px, 4vw, 36px);
        }

        .product-category {
          margin-bottom: 45px;
        }

        .category-banner {
          width: 100%;
          height: 180px;
          margin: 20px 0;
          border-radius: 10px;
          background-position: center;
          background-size: cover;
          background-repeat: no-repeat;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.5);
        }

        .category-title {
          margin: 0 0 15px;
          color: #ffd700;
          font-size: 22px;
        }

        .product-scroll-container {
          overflow-x: auto;
          padding-bottom: 10px;
          scrollbar-width: none;
        }

        .product-scroll-container::-webkit-scrollbar {
          display: none;
        }

        .product-list {
          display: flex;
          gap: 16px;
          width: max-content;
        }

        .product-card {
          flex: 0 0 180px;
          overflow: hidden;
          border-radius: 10px;
          background: #1e1e1e;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.6);
          display: flex;
          flex-direction: column;
        }

        .product-image-wrapper {
          width: 100%;
          height: 140px;
          overflow: hidden;
          background: #292929;
        }

        .product-image {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .product-details {
          padding: 10px;
          text-align: center;
        }

        .product-name {
          min-height: 34px;
          margin: 0 0 6px;
          color: #fff;
          font-size: 14px;
          line-height: 1.3;
        }

        .product-rating {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 2px;
          margin-bottom: 7px;
          color: #ccc;
          font-size: 12px;
        }

        .rating-star {
          color: #777;
        }

        .rating-star.filled {
          color: #ffd700;
        }

        .product-price {
          color: #ffd700;
          font-weight: 600;
        }

        .cart-button {
          width: calc(100% - 16px);
          margin: auto 8px 8px;
          padding: 8px 0;
          border: 0;
          border-radius: 5px;
          background: #ffd700;
          color: #000;
          font-weight: 600;
          cursor: pointer;
        }

        .cart-button-added {
          background: #555;
          color: #ccc;
          cursor: default;
        }

        @media (max-width: 600px) {
          .product-slider-page {
            padding: 12px;
          }

          .category-banner {
            height: 130px;
          }

          .product-card {
            flex-basis: 160px;
          }

          .product-image-wrapper {
            height: 120px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .product-list {
            transform: none !important;
          }
        }
      `}</style>
    </section>
  );
}

export default ProductPageSlider;
