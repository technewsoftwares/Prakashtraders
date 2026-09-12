import { useEffect, useState, useContext, memo } from "react";
import { Link } from "react-router-dom";
import { ShopContext } from "../Context/Context";
import toast from "react-hot-toast";
import { API_BASE } from "../Config";
import { getProductImage } from "../utils/imageUrl";

const API = API_BASE;

// Product card loading skeleton
const ProductSkeleton = () => {
  return (
    <div className="relative shrink-0">
      <div className="relative w-[165px] sm:w-64 bg-black border border-white/20 rounded-xl sm:rounded-2xl p-2 sm:p-4 flex flex-col h-[280px] sm:h-[400px] overflow-hidden">

        {/* Wishlist + Cart skeleton buttons */}
        <div className="absolute top-3 right-3 z-20 flex flex-col gap-2">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-zinc-800 animate-pulse" />
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-zinc-800 animate-pulse" />
        </div>

        {/* Image skeleton */}
        <div className="flex-none w-full h-36 sm:h-56 mb-2 sm:mb-4 flex items-center justify-center bg-zinc-900 rounded-lg animate-pulse">
          <div className="w-24 h-24 sm:w-40 sm:h-40 bg-zinc-800 rounded-lg" />
        </div>

        {/* Details skeleton */}
        <div className="flex flex-col gap-2">

          {/* Product name */}
          <div className="h-4 bg-zinc-800 rounded w-4/5 animate-pulse" />
          <div className="h-4 bg-zinc-800 rounded w-3/5 animate-pulse" />

          {/* Price */}
          <div className="flex items-center gap-2 mt-1">
            <div className="h-4 bg-zinc-800 rounded w-14 animate-pulse" />
            <div className="h-5 bg-zinc-700 rounded w-20 animate-pulse" />
          </div>

          {/* Rating */}
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, index) => (
              <div
                key={index}
                className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-zinc-800 animate-pulse"
              />
            ))}
          </div>

          {/* Description */}
          <div className="flex flex-col gap-2 mt-1">
            <div className="h-3 bg-zinc-800 rounded w-full animate-pulse" />
            <div className="h-3 bg-zinc-800 rounded w-4/5 animate-pulse" />
            <div className="h-3 bg-zinc-800 rounded w-3/5 animate-pulse" />
          </div>

        </div>
      </div>
    </div>
  );
};

const ProductCard = memo(
  ({ product, onAddToWishlist, onAddToCart }) => {
    const {
      id,
      name,
      price,
      original_price,
      rating = 0,
      reviews_count = 0,
      description,
    } = product;

    const displayImage = getProductImage(product, 500);

    return (
      <div className="relative group shrink-0 snap-start">
        <div className="absolute top-3 right-3 z-20 flex flex-col gap-2">

          {/* Wishlist */}
          <button
            type="button"
            onClick={(e) => onAddToWishlist(e, product)}
            className="p-2 bg-zinc-800/80 backdrop-blur-md hover:bg-white hover:text-red-500 text-white rounded-full shadow-lg transition-all"
            title="Add to Wishlist"
            aria-label={`Add ${name} to wishlist`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-4 h-4 sm:w-5 sm:h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
              />
            </svg>
          </button>

          {/* Cart */}
          <button
            type="button"
            onClick={(e) => onAddToCart(e, product)}
            className="p-2 bg-zinc-800/80 backdrop-blur-md hover:bg-white hover:text-emerald-600 text-white rounded-full shadow-lg transition-all"
            title="Add to Cart"
            aria-label={`Add ${name} to cart`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-4 h-4 sm:w-5 sm:h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
              />
            </svg>
          </button>
        </div>

        <Link to={`/product/${id}`}>
          <div className="relative w-[165px] sm:w-64 bg-black border border-white/20 rounded-xl sm:rounded-2xl p-2 sm:p-4 hover:bg-black transition-all flex flex-col h-[280px] sm:h-[400px] overflow-hidden">

            {/* Image */}
            <div className="flex-none w-full h-36 sm:h-56 mb-2 sm:mb-4 flex items-center justify-center bg-white/5 rounded-lg overflow-hidden">
              <img
                src={displayImage}
                alt={name || "Product image"}
                width={500}
                height={500}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-contain p-2 transition-transform group-hover:scale-105"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = "https://via.placeholder.com/300";
                }}
              />
            </div>

            {/* Details */}
            <div className="flex flex-col gap-1 sm:gap-2">

              {/* Product name */}
              <h2 className="text-[12px] sm:text-[15px] font-medium line-clamp-2 text-white/90">
                {name}
              </h2>

              {/* Price */}
              <div className="flex items-center gap-2">
                {original_price &&
                  Number(original_price) > Number(price) && (
                    <span className="text-xs sm:text-sm text-zinc-400 line-through font-medium">
                      ₹{Number(original_price).toLocaleString("en-IN")}
                    </span>
                  )}

                <span className="text-sm sm:text-xl font-bold text-white">
                  ₹{Number(price).toLocaleString("en-IN")}
                </span>
              </div>

              {/* Rating */}
              <div
                className="flex items-center gap-1"
                aria-label={`Rating ${rating} out of 5`}
              >
                {[...Array(5)].map((_, index) => (
                  <svg
                    key={index}
                    className={`w-3 h-3 sm:w-4 sm:h-4 ${
                      index < Math.floor(rating)
                        ? "text-green-500 fill-green-500"
                        : "text-gray-600 fill-gray-600"
                    }`}
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118L10 13.348l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L3.567 8.72c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
                  </svg>
                ))}

                {reviews_count > 0 && (
                  <span className="text-[10px] sm:text-xs text-zinc-500 ml-1">
                    ({reviews_count}{" "}
                    {reviews_count === 1 ? "Review" : "Reviews"})
                  </span>
                )}
              </div>

              {/* Description */}
              {description && (
                <ul className="flex flex-col gap-1 mt-2">
                  {description
                    .split("\n")
                    .slice(0, 3)
                    .map((line, index) => (
                      <li
                        key={index}
                        className="text-[11px] text-zinc-400 flex items-start gap-2"
                      >
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-1" />
                        {line}
                      </li>
                    ))}
                </ul>
              )}
            </div>
          </div>
        </Link>
      </div>
    );
  }
);

ProductCard.displayName = "ProductCard";

const AllProducts = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const { addToCart, addToWishlist } = useContext(ShopContext);

  useEffect(() => {
    const controller = new AbortController();

    const fetchBestProducts = async () => {
      try {
        const response = await fetch(`${API}/api/products/best/`, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Failed to fetch best products");
        }

        const result = await response.json();

        if (!controller.signal.aborted) {
          setData(Array.isArray(result) ? result : []);
        }
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Error fetching best products:", error);
          setData([]);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchBestProducts();

    return () => {
      controller.abort();
    };
  }, []);

  // Add to wishlist
  const handleAddToWishlist = (event, product) => {
    event.preventDefault();
    event.stopPropagation();

    const isAdded = addToWishlist({
      ...product,
      image: getProductImage(product),
    });

    toast.success(
      isAdded
        ? "Added to Wishlist ❤️"
        : "Item already in Wishlist!"
    );
  };

  // Add to cart
  const handleAddToCart = (event, product) => {
    event.preventDefault();
    event.stopPropagation();

    const isAdded = addToCart({
      ...product,
      image: getProductImage(product),
    });

    toast.success(
      isAdded
        ? "Added to Cart 🛒"
        : "Item already in Cart"
    );
  };

  // Loading state
  if (loading) {
    return (
      <section
        className="w-full mx-auto mt-4 mb-10 px-4"
        aria-label="Loading products"
      >
        {/* Header skeleton */}
        <div className="flex items-center justify-center mb-6">
          <div className="h-7 w-64 bg-zinc-800 rounded animate-pulse" />
        </div>

        {/* Product skeletons */}
        <div className="flex gap-3 sm:gap-6 overflow-hidden pb-1">
          {[...Array(5)].map((_, index) => (
            <ProductSkeleton key={index} />
          ))}
        </div>
      </section>
    );
  }

  // Empty state
  if (!Array.isArray(data) || data.length === 0) {
    return <div className="h-10" aria-hidden="true" />;
  }

  return (
    <section
      className="w-full mx-auto mt-4 mb-10 px-4"
      aria-labelledby="best-products-title"
    >
      <h2
        id="best-products-title"
        className="text-2xl font-bold tracking-tight text-white uppercase text-center mb-6"
      >
        Our Best Products
      </h2>

      <div className="flex gap-3 sm:gap-6 overflow-x-auto no-scrollbar pb-1 overscroll-x-contain">
        {data.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToWishlist={handleAddToWishlist}
            onAddToCart={handleAddToCart}
          />
        ))}
      </div>
    </section>
  );
};

export default memo(AllProducts);
