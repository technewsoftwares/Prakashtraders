import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { ShopContext } from "../Context/Context";
import toast from "react-hot-toast";
import { API_BASE } from "../../Config";

const API = API_BASE;

const AllProducts = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  

  
  
  // 1. Get Context Functions
  const { addToCart, addToWishlist } = useContext(ShopContext);

  useEffect(() => {
    const fetchBestProducts = async () => {
      try {
        const res = await fetch(`${API}/api/products/best/`);
        if (!res.ok) throw new Error("Failed to fetch best products");
        const result = await res.json();
        setData(result);
      } catch (error) {
        console.error("Error fetching best products:", error);
        setData([]);
      } finally {
        setLoading(false);
      }
    };
    fetchBestProducts();
  }, [API]);

  //  HELPER: Convert relative path to full URL
  const toFullImageUrl = (img) => {
    if (!img) {
      return <div className="w-full h-40 bg-zinc-900" />;
    }
    if (img.startsWith("http")) return img;
    const cleanPath = img.startsWith("/") ? img : `/${img}`;
    return `${API}${cleanPath}`;
  };

  //  HELPER: Get the first available image
  const getProductImage = (product) => {
    const rawImage = product.image_1 || product.image_2 || product.image_3;
    return toFullImageUrl(rawImage);
  };

  // ✅ UPDATED HANDLERS
  const handleAddToWishlist = (e, product) => {
    e.preventDefault();
    e.stopPropagation();

    const itemToAdd = {
      ...product,
      image: getProductImage(product),
    };

    const isAdded = addToWishlist(itemToAdd);

    if (isAdded) {
      toast.success("Added to Wishlist ❤️");
    } else {
      toast.success("Item already in Wishlist!");
    }
  };

  const handleAddToCart = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    const itemToAdd = {
      ...product,
      image: getProductImage(product),
    };

    const isAdded = addToCart(itemToAdd);

    if (isAdded) {
      toast.success("Added to Cart 🛒");
    } else {
      toast.success("Item already in Cart");
    }
  };

    if (loading) {
      return <div className="h-10"></div>;
    }

    if (!Array.isArray(data) || data.length === 0) {
      return <div className="h-10"></div>;
    }



  return (
    <>
      <style>
        {`
          .no-scrollbar::-webkit-scrollbar { display: none; }
          .no-scrollbar {
            scrollbar-width: none;
            -ms-overflow-style: none;
          }
        `}
      </style>

      <div className="w-full mx-auto mt-4 mb-10 px-4">
{/* HEADER */}
        <div className="flex items-center justify-center mb-6">
          <h2 className="text-2xl font-bold tracking-tight text-white uppercase text-center">
            Our Best Products
          </h2>
        </div>

        {/* HORIZONTAL SCROLL CONTAINER */}
<div className="flex gap-3 sm:gap-6 overflow-x-auto no-scrollbar pb-1">
          {data.map((product) => {
            const {
              id,
              name,
              price,
              original_price,
              rating = 0,
              reviews_count = 0,
              description,
            } = product;
            const displayImage = getProductImage(product);

            return (
              <div key={id} className="relative group shrink-0 snap-start">

                {/* ✅ BUTTONS (Placed Absolute) */}
                <div className="absolute top-3 right-3 z-20 flex flex-col gap-2">
                  {/* Wishlist Button */}
                  <button
                    onClick={(e) => handleAddToWishlist(e, product)}
                    className="p-2 bg-zinc-800/80 backdrop-blur-md hover:bg-white hover:text-red-500 text-white rounded-full shadow-lg transition-all"
                    title="Add to Wishlist"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 sm:w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                    </svg>
                  </button>
                  
                  {/* Cart Button */}
                  <button
                    onClick={(e) => handleAddToCart(e, product)}
                    className="p-2 bg-zinc-800/80 backdrop-blur-md hover:bg-white hover:text-emerald-600 text-white rounded-full shadow-lg transition-all"
                    title="Add to Cart"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 sm:w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                    </svg>
                  </button>
                </div>

                {/* CARD CONTAINER */}
                <Link to={`/product/${id}`}>
                  <div className="relative w-[165px] sm:w-64 bg-[#000000] border border-white/20 rounded-xl sm:rounded-2xl p-2 sm:p-4 hover:bg-black transition-all flex flex-col h-[280px] sm:h-[400px] overflow-hidden">
{/* IMAGE */}
<div className="flex-none w-full h-36 sm:h-56 mb-2 sm:mb-4 flex items-center justify-center bg-white/5 rounded-lg overflow-hidden">

  <img
    src={displayImage}
    alt={name}
    className="w-full h-full object-contain p-2 transition-transform group-hover:scale-105"
    onError={(e) => (e.target.src = "https://via.placeholder.com/300")}
  />

</div>


                    {/* DETAILS */}
                    <div className="flex flex-col gap-1 sm:gap-2">
                      <h1 className="text-[12px] sm:text-[15px] font-medium line-clamp-2 text-white/90">
                        {name}
                      </h1>
                      <div className="flex items-center gap-2">
                        {original_price && Number(original_price) > Number(price) && (
                          <span className="text-xs sm:text-sm text-zinc-400 line-through font-medium">
                            ₹{Number(original_price).toLocaleString("en-IN")}
                          </span>
                        )}

                        <span className="text-sm sm:text-xl font-bold text-white">
                          ₹{Number(price).toLocaleString("en-IN")}
                        </span>
                      </div>

                      {/* ⭐ RATING + REVIEW COUNT */}
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`w-3 h-3 sm:w-4 sm:h-4 ${
                              i < Math.floor(rating)
                                ? "text-green-500 fill-green-500"
                                : "text-gray-600 fill-gray-600"
                            }`}
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118L10 13.348l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L3.567 8.72c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
                          </svg>
                        ))}

                        {/* 🧾 REVIEW COUNT */}
                        {reviews_count > 0 && (
                          <span className="text-[10px] sm:text-xs text-zinc-500 ml-1">
                            ({reviews_count} {reviews_count === 1 ? "Review" : "Reviews"})
                          </span>
                        )}
                      </div>

                      {/* DESCRIPTION */}
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
                                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-1"></span>
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
          })}
        </div>
      </div>
    </>
  );
};

export default AllProducts;
