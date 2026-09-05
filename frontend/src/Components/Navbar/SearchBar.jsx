import React, { useState, useEffect, useRef } from "react";
import { CiSearch } from "react-icons/ci";
import { useNavigate } from "react-router-dom"; // Removed Link, using useNavigate
import { FaChevronRight, FaTag, FaBuilding } from "react-icons/fa";
import axios from "axios";
import { API_BASE } from "../../Config";

const API = API_BASE;


// --- STATIC DATA ---
const BRANDS_LIST = [
  "Atomberg", "Blue Star", "Bosch", "Butterfly", "Crompton",
  "Daikin", "Dell", "Haier", "Havells", "HP", "IFB", "LG", "Milton",
  "O'General", "Oppo", "Philips", "Pigeon", "Preethi", "Prestige",
  "Samsung", "Sony", "Sujata", "TCL", "Usha", "V-Guard", "Vivo",
  "Whirlpool", "Zebronics"
];

const CATEGORIES_LIST = [
  "Refrigerators", "Washing Machines", "Vacuum Cleaners", "Air Conditioners",
  "Air Coolers", "Water Heaters", "Solar Water Heaters", "Room Heaters",
  "Mixer Grinders", "Wet Grinders", "Induction Stoves", "Gas Stoves",
  "Water Purifiers", "Blenders", "Water Bottles", "Flasks",
  "Tawas", "Appachetties",
  "Sofas", "Corner Sofas", "Recliners", "Centre Tables", "Dining Tables",
  "Chairs", "Cots", "Mattresses", "Ottomans", "Pillows", "Bed Sheets",
  "Office Tables", "Office Chairs", "Executive Chairs", "Plastic Chairs",
  "Dressing Tables", "Metal Wardrobes", "Wooden Wardrobes",
];

const getCategoryLink = (subCategory) => {
  const slug = subCategory.toLowerCase().replace(/\s+/g, '-').replace(/'/g, '');
  return `/products/${slug}`;
};

const SearchBar = ({ autoFocus = false }) => {
 
  const [searchTerm, setSearchTerm] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  
  const searchTimer = useRef(null);
  
  const navigate = useNavigate();

  

  console.log("API =", API);

  // --- Search Result States ---
  const [matchedCategories, setMatchedCategories] = useState([]);
  const [matchedBrands, setMatchedBrands] = useState([]);
  const [matchedProducts, setMatchedProducts] = useState([]);

  // 1. FETCH PRODUCTS
 // Fetch matching products after the user stops typing
  useEffect(() => {
    const query = searchTerm.trim();
  
    // Cancel the previous timer
    clearTimeout(searchTimer.current);
  
    // Empty search
    if (!query) {
      setMatchedProducts([]);
      setSearchLoading(false);
      return;
    }
  
    // Wait 400ms before making the API request
    searchTimer.current = setTimeout(async () => {
      try {
        setSearchLoading(true);
  
        const response = await axios.get(`${API}/api/products/`, {
          params: {
            q: query,
          },
        });
  
        const result = response.data;
  
        const products = Array.isArray(result)
          ? result
          : result.results || result.products || [];
  
        // Display only five suggestions
        setMatchedProducts(products.slice(0, 5));
      } catch (error) {
        console.error("Search error:", error);
        setMatchedProducts([]);
      } finally {
        setSearchLoading(false);
      }
    }, 400);
  
    // Clear timer when the user types again
    return () => {
      clearTimeout(searchTimer.current);
    };
  }, [searchTerm]);
  // 2. SEARCH LOGIC
   const handleSearch = (e) => {
    const query = e.target.value;
  
    setSearchTerm(query);
  
    if (query.trim() === "") {
      setShowResults(false);
      setMatchedCategories([]);
      setMatchedBrands([]);
      setMatchedProducts([]);
      return;
    }
  
    const lowerQuery = query.toLowerCase();
  
    // Search categories locally
    const cats = CATEGORIES_LIST.filter((cat) =>
      cat.toLowerCase().includes(lowerQuery)
    ).slice(0, 3);
  
    // Search brands locally
    const brands = BRANDS_LIST.filter((brand) =>
      brand.toLowerCase().includes(lowerQuery)
    ).slice(0, 3);
  
    setMatchedCategories(cats);
    setMatchedBrands(brands);
    setShowResults(true);
  };
  // 3. NAVIGATION HANDLER (The "Old" Code Logic)
  // We use this instead of <Link> to ensure it works with onMouseDown
  const handleNavigate = (path) => {
    setShowResults(false);
    setSearchTerm(""); // Optional: clear search after clicking
    navigate(path);
  };

  // 4. HANDLE BLUR
  const handleBlur = () => {
    // Small delay to allow clicks if they are fast, but onMouseDown
    // usually beats this anyway.
    setTimeout(() => setShowResults(false), 200);
  };

  // 5. HANDLE ENTER KEY
  const handleEnterKey = (e) => {
    if (e.key === 'Enter') {
        if(matchedCategories.length > 0) {
            handleNavigate(getCategoryLink(matchedCategories[0]));
        } else if(matchedBrands.length > 0) {
            handleNavigate(`/brand/${matchedBrands[0]}`);
        } else if(matchedProducts.length > 0) {
            handleNavigate(`/product/${matchedProducts[0].id}`);
        }
    }
  }

  const hasResults = matchedCategories.length > 0 || matchedBrands.length > 0 || matchedProducts.length > 0;

  return (
    <div className="relative w-full max-w-xl mx-auto z-50">

      {/* INPUT */}
      <div className="flex items-center bg-white text-black px-4 py-2 rounded-full border border-gray-200 shadow-sm focus-within:ring-2 focus-within:ring-indigo-100 transition-all w-full">
        <input
          type="text"
          autoFocus={autoFocus}
          className="outline-none w-full text-base bg-transparent placeholder-gray-400 font-medium"
          placeholder="Search products, brands, categories..."
          value={searchTerm}
          onChange={handleSearch}
          onKeyDown={handleEnterKey}
          onFocus={() => searchTerm && setShowResults(true)}
          onBlur={handleBlur} // This closes the dropdown when you click outside
        />
        <button className="ml-2 bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-full transition-colors">
          <CiSearch className="w-5 h-5" />
        </button>
      </div>

      {/* DROPDOWN */}
      {showResults && searchTerm && (
        <div className="absolute top-full left-0 bg-white border border-gray-100 shadow-2xl w-full mt-2 rounded-2xl max-h-[500px] overflow-y-auto custom-scrollbar animate-in fade-in zoom-in-95 duration-200">

       {searchLoading ? (
            <div className="px-4 py-6 text-center text-gray-500">
              Searching products...
            </div>
          ) : hasResults ? (
            <div className="py-2">

              {/* CATEGORIES */}
              {matchedCategories.length > 0 && (
                <div className="mb-2">
                  <h3 className="px-4 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                    <FaTag /> Categories
                  </h3>
                  {matchedCategories.map((cat, idx) => (
                    <div
                      key={idx}
                      //  FIXED: Using onMouseDown prevents conflict with onBlur
                      onMouseDown={() => handleNavigate(getCategoryLink(cat))}
                      className="flex items-center justify-between px-4 py-2 hover:bg-slate-50 text-slate-700 font-medium text-sm transition-colors cursor-pointer"
                    >
                      <span>{cat}</span>
                      <FaChevronRight className="text-gray-300 text-xs"/>
                    </div>
                  ))}
                </div>
              )}

              {/* BRANDS */}
              {matchedBrands.length > 0 && (
                <div className="mb-2 border-t border-gray-50">
                  <h3 className="px-4 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2 mt-2">
                    <FaBuilding /> Brands
                  </h3>
                  {matchedBrands.map((brand, idx) => (
                    <div
                      key={idx}
                      //  FIXED: Using onMouseDown
                      onMouseDown={() => handleNavigate(`/brand/${encodeURIComponent(brand)}`)}
                      className="flex items-center justify-between px-4 py-2 hover:bg-slate-50 text-slate-700 font-medium text-sm transition-colors cursor-pointer"
                    >
                      <span>{brand} Store</span>
                      <FaChevronRight className="text-gray-300 text-xs"/>
                    </div>
                  ))}
                </div>
              )}

              {/* PRODUCTS */}
              {matchedProducts.length > 0 && (
                <div className="border-t border-gray-50">
                  <h3 className="px-4 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-2">
                    📦 Products
                  </h3>
                  {matchedProducts.map((item) => (
                    <div
                      key={item.id}
                      //  FIXED: Using onMouseDown
                      onMouseDown={() => handleNavigate(`/product/${item.id}`)}
                      className="flex items-center gap-4 px-4 py-3 hover:bg-slate-50 transition-colors border-b border-gray-50 last:border-0 cursor-pointer"
                    >
                      <img
                        src={item.image_1 || "https://via.placeholder.com/50"}
                        alt={item.name}
                        className="w-10 h-10 rounded-lg object-cover bg-gray-100"
                      />
                      <div className="flex-1">
                        <h4 className="text-sm font-bold text-slate-800 line-clamp-1">{item.name}</h4>
                        <p className="text-[10px] text-slate-500 font-bold uppercase">{item.category}</p>
                      </div>
                      <span className="text-sm font-black text-indigo-600">₹{item.price}</span>
                    </div>
                  ))}
                </div>
              )}

            </div>
          ) : (
            <div className="px-4 py-8 text-center text-gray-500 flex flex-col items-center">
              <CiSearch className="w-8 h-8 text-gray-300 mb-2"/>
              <p className="text-sm font-medium">No results for "{searchTerm}"</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
