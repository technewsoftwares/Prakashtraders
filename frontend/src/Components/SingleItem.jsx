import axios from "axios";
import { useContext, useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ShopContext } from "../Context/Context";

const SingleItem = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isMounted = useRef(true); // 1. Ref declared

  const [product, setProduct] = useState(null);
  const [galleryImages, setGalleryImages] = useState([]);
  const [activeImage, setActiveImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  const API = import.meta.env.VITE_API_URL;
  const { addToCart: contextAddToCart } = useContext(ShopContext);

  // ✅ FIX: This useEffect is now at the TOP, before any conditional return
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  // --- HELPER FUNCTIONS ---
  const toFullImageUrl = (img) => {
    if (!img) {
      return <div className="w-full h-64 bg-zinc-900" />;
    }
    if (img.startsWith("http")) return img;
    const cleanPath = img.startsWith("/") ? img : `/${img}`;
    return `${API}${cleanPath}`;
  };

  const getProductImage = (product) => {
    const rawImage = product.image_1 || product.image_2 || product.image_3;
    return toFullImageUrl(rawImage);
  };

  // SMARTER BACK NAVIGATION HANDLER
  const handleBack = () => {
    if (window.history.state && window.history.state.idx > 0) {
      navigate(-1);
    } else {
      const lastCategory = sessionStorage.getItem("lastCategory");
      navigate(lastCategory || "/products");
    }
  };

  // --- FETCH DATA ---
  const fetchSingleProduct = async () => {
    try {
      setLoading(true);

      const res = await axios.get(`${API}/api/products/${id}/`);
      if (!res.data || !isMounted.current) return;

      const productData = res.data;
      setProduct(productData);

      const images = [
        productData.image_1,
        productData.image_2,
        productData.image_3,
        productData.image_4,
        productData.image_5,
      ].filter(Boolean);

      setGalleryImages(images.map(toFullImageUrl));
      setActiveImage(images[0] || "");
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      if (isMounted.current) setLoading(false);
    }
  };

  // Fetch Effect
  useEffect(() => {
    fetchSingleProduct();
    const timer = setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "auto" });
    }, 100);
    return () => clearTimeout(timer);
  }, [id]);

  // AUTO-SCROLL EFFECT
  useEffect(() => {
    if (!galleryImages.length || isHovered) return;

    const interval = setInterval(() => {
      if (!isMounted.current) return;

      setActiveImage((current) => {
        const index = galleryImages.indexOf(current);
        return galleryImages[(index + 1) % galleryImages.length];
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [galleryImages, isHovered]);

  // --- HANDLERS ---
  const handleAddToCart = () => {
    if (product) {
      const cartItem = {
        ...product,
        image: activeImage || getProductImage(product),
      };
      contextAddToCart(cartItem);
    }
  };

  const handleBuyNow = () => {
    if (!product) return;
    navigate("/payment", {
      state: {
        items: [
          {
            ...product,
            qty: 1,
            image: activeImage || getProductImage(product),
          },
        ],
        total: product.price,
        source: "buy_now",
      },
    });
  };

if (loading) {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-zinc-400">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm">Loading Details...</p>
      </div>
    </div>
  );
}

if (!product) {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-zinc-500 text-sm">
      Product not found
    </div>
  );
}


  // ✅ Destructuring happens safely because we passed the loading check
  const {
    name,
    price,
    original_price,
    description,
    rating = 0,
    reviews_count = 0,
    brand = "",
    product_color = "",
    in_stock = true,
    warranty,
    length,
    breadth,
    height,
    weight,
  } = product;

  return (
    <div className="min-h-screen bg-[#000000] text-zinc-100 pb-10 pt-6 font-sans">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <button
            onClick={handleBack}
            className="text-zinc-500 hover:text-emerald-400 text-xs sm:text-sm inline-flex items-center gap-2 transition-colors bg-transparent border-none cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
            Back to Products
          </button>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {/* --- LEFT: COMPACT IMAGE GALLERY --- */}
          <div className="flex flex-col gap-3">
            <div
              className="w-full h-[350px] sm:h-[400px] bg-black rounded-xl overflow-hidden border border-zinc-800 relative group flex items-center justify-center"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <img
                src={activeImage}
                alt={name}
                className="max-w-full max-h-full object-contain p-4 transition-transform duration-500 group-hover:scale-105"
                onError={(e) => {
                  e.target.src =
                    "https://via.placeholder.com/600x600?text=No+Image";
                }}
              />
              {!isHovered && galleryImages.length > 1 && (
                <div className="absolute bottom-2 right-2 w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              )}
            </div>

            {/* Thumbnails */}
            {galleryImages.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                {galleryImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(img)}
                    className={`relative w-16 h-16 flex-shrink-0 rounded-lg border overflow-hidden bg-black transition-all ${
                      activeImage === img
                        ? "border-emerald-500"
                        : "border-zinc-800 hover:border-zinc-600"
                    }`}
                  >
                    <img
                      src={img}
                      alt={`View ${i + 1}`}
                      className="w-full h-full object-contain p-1"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* --- RIGHT: COMPACT DETAILS --- */}
          <div className="flex flex-col h-fit">
            <div className="mb-3">
              {brand && (
                <span className="text-emerald-500 font-bold tracking-wide text-[10px] uppercase mb-1 block">
                  {brand}
                </span>
              )}
              <h1 className="text-2xl sm:text-3xl font-bold text-white leading-tight">
                {name}
              </h1>
            </div>

            <div className="flex items-center gap-2 mb-5">
              <div className="flex items-center gap-1 bg-zinc-900 px-1.5 py-0.5 rounded border border-zinc-800">

<span className="text-xs font-bold text-white">
  {Number(rating || 0)}
</span>
               <svg
                  className="w-3 h-3 text-emerald-500 fill-emerald-500"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
              <span className="text-zinc-500 text-xs">
{Number(reviews_count || 0)} Reviews
              </span>
            </div>

            <div className="mb-6 bg-zinc-900/30 p-4 rounded-xl border border-zinc-800/50">
              <div className="flex items-baseline gap-2">
                <h2 className="text-3xl font-bold text-white">
                 ₹{Number(price || 0).toLocaleString("en-IN")}
                </h2>
                {original_price && Number(original_price) > Number(price) && (
                  <>
                    <span className="text-sm text-zinc-500 line-through">
                      ₹{Number(original_price || 0).toLocaleString("en-IN")}
                    </span>
                    <span className="text-emerald-400 text-xs font-bold ml-1">
                      {original_price && price
  ? Math.round(
      ((Number(original_price) - Number(price)) /
        Number(original_price)) *
        100
    )
  : 0}
% OFF

                    </span>
                  </>
                )}
              </div>
              <p className="text-zinc-500 text-[10px] mt-1">
                Inclusive of all taxes
              </p>
            </div>

            <div className="flex gap-3 mb-6">
              <button
                onClick={handleBuyNow}
                disabled={!in_stock}
                className={`flex-1 py-3 px-4 rounded-lg font-bold text-sm sm:text-base transition-all transform active:scale-95 ${
                  in_stock
                    ? "bg-emerald-500 hover:bg-emerald-400 text-black shadow-lg shadow-emerald-900/20"
                    : "bg-zinc-800 text-zinc-500 cursor-not-allowed"
                }`}
              >
                {in_stock ? "Buy Now" : "Out of Stock"}
              </button>

              <button
                onClick={handleAddToCart}
                disabled={!in_stock}
                className={`flex-1 py-3 px-4 rounded-lg font-bold text-sm sm:text-base border transition-all transform active:scale-95 ${
                  in_stock
                    ? "bg-transparent border-zinc-700 hover:border-emerald-500 text-white hover:text-emerald-400"
                    : "bg-zinc-900 border-zinc-800 text-zinc-600 cursor-not-allowed"
                }`}
              >
                Add to Cart
              </button>
            </div>

            <div className="space-y-4 flex-grow">
              {/* Description Box */}
              <div className="bg-zinc-900/30 border border-zinc-800 rounded-xl p-4">
                <h3 className="font-semibold text-sm text-white mb-2">
                  Description
                </h3>
                <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed whitespace-pre-line">
                  {description || "No description available."}
                </p>

                {product_color && (
                  <div className="mt-3 pt-3 border-t border-zinc-800 flex items-center gap-2">
                    <span className="text-zinc-500 text-xs font-medium">
                      Color:
                    </span>
                    <span className="text-zinc-300 text-xs capitalize">
                      {product_color}
                    </span>
                  </div>
                )}
              </div>

              {/* Specifications & Warranty Box */}
              {(length || breadth || weight || warranty) && (
                <div className="bg-zinc-900/30 border border-zinc-800 rounded-xl p-4">
                  <h3 className="font-semibold text-sm text-white mb-3">
                    Specifications
                  </h3>

                  {/* Dimensions Grid */}
                  {(length || breadth || height || weight) && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
                      {length && (
                        <div className="bg-zinc-950/50 p-2 rounded-lg border border-zinc-800/50">
                          <span className="text-[10px] text-zinc-500 block uppercase tracking-wider">
                            Length
                          </span>
                          <span className="text-xs font-bold text-zinc-200">
                            {length} cm
                          </span>
                        </div>
                      )}
                      {breadth && (
                        <div className="bg-zinc-950/50 p-2 rounded-lg border border-zinc-800/50">
                          <span className="text-[10px] text-zinc-500 block uppercase tracking-wider">
                            Breadth
                          </span>
                          <span className="text-xs font-bold text-zinc-200">
                            {breadth} cm
                          </span>
                        </div>
                      )}
                      {height && (
                        <div className="bg-zinc-950/50 p-2 rounded-lg border border-zinc-800/50">
                          <span className="text-[10px] text-zinc-500">
                            Height
                          </span>
                          <p className="text-xs font-bold">{height} cm</p>
                        </div>
                      )}

                      {weight && (
                        <div className="bg-zinc-950/50 p-2 rounded-lg border border-zinc-800/50">
                          <span className="text-[10px] text-zinc-500 block uppercase tracking-wider">
                            Weight
                          </span>
                          <span className="text-xs font-bold text-zinc-200">
                            {weight} kg
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Warranty */}
                  {warranty && (
                    <div className="flex items-center gap-2 pt-2 border-t border-zinc-800">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-emerald-500"
                      >
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                      </svg>
                      <span className="text-xs text-zinc-400">
                        Warranty:{" "}
                        <span className="text-white font-medium">
                          {warranty}
                        </span>
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="mt-4 flex items-center gap-2 text-zinc-600 text-[10px]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              <span>Secure Payment & Fast Delivery</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleItem;


