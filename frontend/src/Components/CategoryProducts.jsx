import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { ShopContext } from "../Context/Context";
import toast from "react-hot-toast";
import { API_BASE } from "../Config";
const CategoryProducts = () => {
  const { category } = useParams();
  const navigate = useNavigate();

  if (!category) {
    return <div className="h-screen bg-[#0a0a0a]"></div>;
  }

  // 🔹 CONFIG: API URL
  const API = API_BASE;

  // ✅ DECODE CATEGORY (slug-case -> Title Case)
  // Example: "washing-machines" -> "Washing Machines"
  const decodedCategory = category
    ? category
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
    : "";

  const [activeFilter, setActiveFilter] = useState(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔹 USE CONTEXT
  const { addToCart, addToWishlist } = useContext(ShopContext);

  // 🔹 FILTER STATES
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [rating, setRating] = useState("");
  const [availability, setAvailability] = useState("");
  const [sortOrder, setSortOrder] = useState("");

  // ✅ 1. HELPER FUNCTIONS (Fixed for Production)
  const toFullImageUrl = (img) => {
    if (!img) return "https://via.placeholder.com/150";
    if (img.startsWith("http")) return img;
    const cleanPath = img.startsWith("/") ? img : `/${img}`;
    // ❌ OLD: return `http://localhost:8000${cleanPath}`;
    // ✅ NEW:
    return `${API}${cleanPath}`;
  };

  const getFirstValidImage = (product) => {
    return [product.image_1, product.image_2, product.image_3].find(Boolean);
  };

  useEffect(() => {
    if (!decodedCategory) return;

    const fetchCategoryProducts = async () => {
      try {
        setLoading(true);
        // Ensure we handle cases where API might differ
        const res = await fetch(
          `${API}/api/products/?category=${encodeURIComponent(decodedCategory)}`
        );
        if (!res.ok) throw new Error("Failed to fetch");
        
        const result = await res.json();
        // Handle if backend returns { products: [...] } or just [...]
        const products = Array.isArray(result) ? result : result.products || [];
        setData(products);
      } catch (error) {
        console.error("Error fetching category products:", error);
        setData([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCategoryProducts();
  }, [decodedCategory, API]);

  // 🔹 FILTER + SORT LOGIC
  const filteredData = data
    .filter((p) => !minPrice || p.price >= Number(minPrice))
    .filter((p) => !maxPrice || p.price <= Number(maxPrice))
    .filter((p) => !rating || (p.rating || 0) >= Number(rating))
    .filter((p) =>
      !availability
        ? true
        : availability === "in"
        ? p.in_stock === true
        : p.in_stock === false
    )
    .sort((a, b) => {
      // Ensure prices are numbers for sorting
      const priceA = Number(a.price) || 0;
      const priceB = Number(b.price) || 0;
      if (sortOrder === "low-high") return priceA - priceB;
      if (sortOrder === "high-low") return priceB - priceA;
      return 0;
    });

  // ✅ 2. HANDLERS
  const handleAddToWishlist = (e, product) => {
    e.preventDefault();
    e.stopPropagation();

    const wishlistItem = {
      ...product,
      image: toFullImageUrl(getFirstValidImage(product)),
    };

    const isAdded = addToWishlist(wishlistItem);

    if (isAdded) {
      toast.success("Added to Wishlist ❤️", { id: `wish-${product.id}` });
    } else {
      toast.success("Item already in Wishlist!", { id: `wish-exist-${product.id}` });
    }
  };

  const handleAddToCart = (e, product) => {
    e.preventDefault();
    e.stopPropagation();

    const cartItem = {
      ...product,
      image: toFullImageUrl(getFirstValidImage(product)),
    };

    const isAdded = addToCart(cartItem);

    if (isAdded) {
      toast.success("Added to Cart 🛒", { id: `cart-${product.id}` });
    } else {
      toast.success("Item already in Cart", { id: `cart-exist-${product.id}` });
    }
  };

  // ✅ 3. NAVIGATION HANDLER (Better than window.location)
  const handleViewProduct = (e, productId) => {
    e.preventDefault(); 
    e.stopPropagation();
    navigate(`/product/${productId}`);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-100 pb-10">
      <div className="container mx-auto px-2 md:px-4">
        {/* TITLE */}
        <h1 className="text-xl md:text-3xl font-bold text-center py-8 tracking-tight uppercase">
          {decodedCategory} <span className="text-emerald-400">Products</span>
        </h1>

        {/* 🔥 HORIZONTAL FILTER BAR */}
        <div className="mb-4">
          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2 pl-4 pr-2">
            {[
              { key: "price", label: "Price" },
              { key: "rating", label: "Rating" },
              { key: "sort", label: "Sort" },
            ].map((item) => (
              <button
                key={item.key}
                onClick={() =>
                  setActiveFilter(activeFilter === item.key ? null : item.key)
                }
                className={`px-4 py-2 rounded-full text-sm whitespace-nowrap ${
                  activeFilter === item.key
                    ? "bg-zinc-700 text-white"
                    : "bg-zinc-800 text-zinc-200 hover:bg-zinc-700"
                }`}
              >
                {item.label} ▾
              </button>
            ))}
          </div>

          {/* FILTER CONTENT */}
          {activeFilter && (
            <div className="flex mt-3 bg-zinc-900 p-4 rounded-xl text-sm">
              {activeFilter === "price" && (
                <div className="flex gap-3">
                  <input
                    type="number"
                    placeholder="Min ₹"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="bg-zinc-800 p-2 rounded w-full text-white"
                  />
                  <input
                    type="number"
                    placeholder="Max ₹"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="bg-zinc-800 p-2 rounded w-full text-white"
                  />
                </div>
              )}
              {activeFilter === "rating" && (
                <div className="flex gap-3">
                  {[4, 3, 2].map((r) => (
                    <button
                      key={r}
                      onClick={() => setRating(r)}
                      className={`px-4 py-2 rounded-full ${
                        rating === r
                          ? "bg-emerald-500 text-black"
                          : "bg-zinc-800 text-zinc-200"
                      }`}
                    >
                      {r}★ & above
                    </button>
                  ))}
                </div>
              )}
              {activeFilter === "sort" && (
                <div className="flex gap-3">
                  <button
                    onClick={() => setSortOrder("low-high")}
                    className={`px-4 py-2 rounded-full ${sortOrder === 'low-high' ? 'bg-emerald-500 text-black' : 'bg-zinc-800'}`}
                  >
                    Price: Low → High
                  </button>
                  <button
                    onClick={() => setSortOrder("high-low")}
                    className={`px-4 py-2 rounded-full ${sortOrder === 'high-low' ? 'bg-emerald-500 text-black' : 'bg-zinc-800'}`}
                  >
                    Price: High → Low
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* PRODUCTS */}
        {loading ? (
          <p className="text-center text-zinc-400">Loading...</p>
        ) : filteredData.length === 0 ? (
          <p className="text-center text-zinc-400">
            No products found for "{decodedCategory}" <br/>
            <span className="text-xs text-zinc-600">(Check backend category naming)</span>
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-0.5 md:gap-6 bg-zinc-800 md:bg-transparent">
            {filteredData.map((product) => {
              const validImage = getFirstValidImage(product);
              const fullImageUrl = toFullImageUrl(validImage);

              return (
                <Link
                  key={product.id}
                  to={`/product/${product.id}`}
                  state={{ product }}
                  className="group bg-zinc-900 md:rounded-2xl overflow-hidden hover:bg-zinc-800/50 transition-all duration-300 md:border md:border-zinc-800 md:hover:border-zinc-600 relative block"
                >
                  <div className="flex flex-row md:flex-col h-full">
                    {/* IMAGE CONTAINER */}
                    <div className="relative w-1/3 md:w-full bg-black backdrop-blur-sm p-3 md:p-6 flex items-center justify-center">
                      {/* WISHLIST BUTTON */}
                      <button
                        onClick={(e) => handleAddToWishlist(e, product)}
                        className="absolute top-2 right-2 p-2 bg-black/40 backdrop-blur-md rounded-full text-white hover:bg-white hover:text-red-500 transition-all transform hover:scale-110 z-10"
                        title="Add to Wishlist"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={2}
                          stroke="currentColor"
                          className="w-4 h-4 md:w-5 md:h-5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                          />
                        </svg>
                      </button>

                      <img
                        src={fullImageUrl}
                        alt={product.name}
                        className="h-28 md:h-48 w-full object-contain transition-transform duration-500 group-hover:scale-110"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = "https://via.placeholder.com/150";
                        }}
                      />
                    </div>

                    {/* DETAILS */}
                    <div className="w-2/3 md:w-full p-4 flex flex-col justify-between border-l border-zinc-800 md:border-l-0">
                      <div>
                        <h2 className="text-sm md:text-base font-medium line-clamp-2 leading-snug text-zinc-200">
                          {product.name}
                        </h2>
                        
                        {/* Rating */}
                        {(product.rating > 0 || product.reviews_count > 0) && (
                          <div className="flex items-center mt-1.5 gap-2">
                            {product.rating > 0 && (
                              <span className="bg-green-700 text-white px-1.5 py-0.5 rounded text-[10px] font-bold">
                                {product.rating} ★
                              </span>
                            )}
                            <span className="text-zinc-500 text-[11px]">
                              ({product.reviews_count || 0} Reviews)
                            </span>
                          </div>
                        )}

                        {/* Description (Desktop) */}
                        <div className="mt-3 hidden md:block">
                          <ul className="flex flex-col gap-2 mt-2">
                            {product.description
                              ?.split("\n")
                              .filter((line) => line.trim() !== "")
                              .slice(0, 3)
                              .map((line, index) => (
                                <li
                                  key={index}
                                  className="text-[11px] text-zinc-400 flex items-start gap-2"
                                >
                                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-1 shrink-0"></div>
                                  <span className="line-clamp-1">{line}</span>
                                </li>
                              ))}
                          </ul>
                        </div>
                      </div>

                      {/* PRICE + ACTIONS */}
                      <div className="mt-4 flex flex-col gap-3">
                        <div className="flex items-baseline gap-2">
                          {product.original_price &&
                            Number(product.original_price) > Number(product.price) && (
                              <span className="text-[10px] md:text-xs text-zinc-500 line-through">
                                ₹{Number(product.original_price).toLocaleString("en-IN")}
                              </span>
                            )}
                          <span className="text-lg md:text-xl font-bold text-white">
                            ₹{Number(product.price).toLocaleString("en-IN")}
                          </span>
                        </div>

                        <div className="hidden md:flex gap-2">
                          <button
                            onClick={(e) => handleViewProduct(e, product.id)}
                            className="flex-1 text-[11px] py-2 rounded-lg bg-zinc-800 text-white hover:bg-zinc-700 transition"
                          >
                            View
                          </button>

                          <button
                            onClick={(e) => handleAddToCart(e, product)}
                            className="flex-1 text-[11px] py-2 rounded-lg bg-emerald-500 text-black font-semibold hover:bg-emerald-400 transition"
                          >
                            Add to Cart
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryProducts;
