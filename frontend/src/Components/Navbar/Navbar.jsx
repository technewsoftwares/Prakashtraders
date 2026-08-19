import { IoMenuOutline, IoCloseOutline } from "react-icons/io5";
import { FaRegUserCircle, FaRegHeart, FaChevronRight, FaUserShield, FaShoppingCart, FaUser } from "react-icons/fa";
import { FaRegAddressBook } from "react-icons/fa6";
import { MdOutlineDevices } from "react-icons/md";
import { LuCodesandbox } from "react-icons/lu";
import { PiMedalLight } from "react-icons/pi";
import { RiCustomerService2Line } from "react-icons/ri";
import { AiOutlineLogout, AiOutlineLogin } from "react-icons/ai";
import { CiSearch } from "react-icons/ci";
import { useContext, useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ShopContext } from "../../Context/Context";
import Account from "../auth/Account";
import axios from "axios";
import SearchBar from "./SearchBar";
import logo from "../../assets/images/logo.png";
import ProductCard from "../CategoryProducts";
import { FaInfoCircle } from "react-icons/fa";
import { API_BASE } from "../../Config";
const API = API_BASE;
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  

  const {
    isAuth,
    role,
    cartItems,
    wishlistItems,
    logout,
    token
  } = useContext(ShopContext);

  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [query, setQuery] = useState("");
  const [window, setWindow] = useState(false);
  const [data, setData] = useState(null);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [openCategory, setOpenCategory] = useState(null);

  const navigate = useNavigate();

  // --- STYLING CONSTANTS FOR UNIFORMITY ---
  // 1. Main Menu Links (Top Brands, About, Category Names)
  const menuLinkStyle = "text-sm font-bold tracking-wide";

  // 2. Sub Menu Links (The actual brands and sub-categories)
  const subMenuLinkStyle = "text-sm font-medium text-gray-400 hover:text-white transition-colors";

  const brands = [
     "Atomberg", "Blue Star", "Bosch", "Butterfly", "Crompton",
    "Daikin", "Dell", "Haier", "Havells", "HP", "IFB", "LG", "Milton",
    "O'General", "Oppo", "Philips", "Pigeon", "Preethi", "Prestige",
    "Samsung", "Sony", "Sujata", "TCL", "Usha", "V-Guard", "Vivo",
    "Whirlpool", "Zebronics"
  ];

  const categories = [
      {
        name: "Home Appliances",
        sub: [
          "Refrigerators", "Washing Machines", "Vacuum Cleaners", "Air Conditioners",
          "Air Coolers", "Water Heaters", "Solar Water Heaters", "Room Heaters", "Sofas",
        ],
      },
      {
        name: "Kitchen Appliances",
        sub: [
          "Mixer Grinders", "Wet Grinders", "Induction Stoves", "Gas Stoves",
          "Water Purifiers", "Blenders", "Water Bottles", "Flasks",
          "Tawas", "Appachetties", "Cookers", "Electric Cookers",
        ],
      },
      {
        name: "Furniture",
        sub: [
          "Sofas", "Corner Sofas", "Recliners", "Centre Tables", "Dining Tables",
          "Chairs", "Cots", "Mattresses", "Ottomans", "Pillows", "Bed Sheets",
          "Office Tables", "Office Chairs", "Executive Chairs", "Plastic Chairs",
          "Dressing Tables", "Metal Wardrobes", "Wooden Wardrobes",
        ],
      },
      {
       name:"Digital Products" ,
       sub:[
          "Mobiles" , "Laptops" ,"Tabs" , "Television"
        ],
      },
    ];

  const getCategoryLink = (subCategory) => {
    const slug = subCategory.toLowerCase().replace(/\s+/g, '-').replace(/'/g, '');
    return `/products/${slug}`;
  };

  const dataForSidebar = [
    { icon: <FaRegUserCircle className="w-5 h-5" />, name: "My Profile", link: "/profile" },
    { icon: <FaRegAddressBook className="w-5 h-5" />, name: "My Address", link: "/address" },
    { icon: <LuCodesandbox className="w-5 h-5" />, name: "My Orders", link: "/orders" },
    { icon: <FaRegHeart className="w-5 h-5" />, name: "My Wishlist", link: "/wishlist" },
    { icon: <RiCustomerService2Line className="w-5 h-5" />, name: "Support Center", link: "tel:+919663418188" },
  ];

  const closeUserMenu = () => {
    setShowProfileMenu(false);
  };

  const fetchData = async () => {
    try {
      const res = await axios.get(`${API}/api/products?q=${query}`);
      setData(res.data.product);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const delay = setTimeout(fetchData, 500);
    return () => clearTimeout(delay);
  }, [query]);

  const handleSearch = (e) => {
    const value = e.target.value;
    setQuery(value);
    setWindow(value !== "");
  };

  return (
    <>
      <header className="fixed top-0 left-0 w-full bg-black text-white z-50 shadow-md border-b border-gray-800">
        <nav className="container mx-auto flex items-center justify-between px-5 py-4">

          {/* LEFT SECTION */}
          <div className="flex flex-row-reverse md:flex-row items-center gap-4 md:gap-10">
            <Link to="/">
              <img src={logo} alt="logo" className="w-[150px] md:w-[260px]" />
            </Link>

            <div className="relative">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 hover:text-emerald-400 transition-colors py-2"
              >
                {isOpen ? <IoCloseOutline className="w-8 h-8" /> : <IoMenuOutline className="w-6 h-6" />}
                <span className="hidden md:block font-medium">Menu</span>
              </button>

              {/* DROPDOWN MENU */}
              {isOpen && (
                <div className="absolute top-[100%] left-0 w-[320px] md:w-[400px] bg-[#1a1a1a] text-white shadow-2xl border border-gray-800 rounded-b-md animate-in fade-in slide-in-from-top-2 duration-200 z-[60]">
                  <div className="flex flex-col max-h-[80vh] overflow-y-auto custom-scrollbar">

                    <div className="p-2">
                      {/* TOP BRANDS ACCORDION */}
                      <div className="border-b border-gray-800">
                        <button
                          onClick={() => setOpenCategory(openCategory === 'brands' ? null : 'brands')}
                          className={`w-full flex justify-between items-center px-4 py-3 hover:text-black hover:bg-emerald-400 rounded-md transition-all ${openCategory === 'brands' ? 'bg-emerald-400 text-black' : ''}`}
                        >
                          {/* ✅ Applied menuLinkStyle */}
                          <span className={menuLinkStyle}>Top Brands</span>
                          <FaChevronRight className={`w-3 h-3 transition-transform duration-300 ${openCategory === 'brands' ? 'rotate-90' : 'text-gray-500'}`} />
                        </button>

                        {openCategory === 'brands' && (
                           <div className="bg-black/40 p-3 grid grid-cols-2 gap-2 animate-in fade-in zoom-in-95 duration-200">
                           {brands.map((brand) => (
  <Link
    key={brand}
    to={`/brand/${encodeURIComponent(brand)}`}
    onClick={() => setIsOpen(false)}
    className={`px-2 py-1 rounded hover:bg-gray-800 ${subMenuLinkStyle}`}
  >
    {brand}
  </Link>
))}

                         </div>
                        )}
                      </div>



                    </div>

                    <div className="bg-gray-900/50 px-6 py-3 border-y border-gray-800">
                       <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Shop by Category</h3>
                    </div>

                    {/* DYNAMIC CATEGORIES */}
                    <div className="p-2">
                      {categories.map((cat) => (
                        <div key={cat.name} className="border-b border-gray-800 last:border-0">
                          <button
                            onClick={() => setOpenCategory(openCategory === cat.name ? null : cat.name)}
                            className={`w-full flex justify-between items-center px-4 py-3 hover:text-black hover:bg-emerald-400 rounded-md transition-all ${openCategory === cat.name ? 'text-teal-400' : ''}`}
                          >
                            {/* ✅ Applied menuLinkStyle */}
                            <span className={menuLinkStyle}>{cat.name}</span>
                            <FaChevronRight className={`w-3 h-3 transition-transform duration-300 ${openCategory === cat.name ? 'rotate-90 text-teal-400' : 'text-gray-500'}`} />
                          </button>

                          {openCategory === cat.name && (
                            <div className="bg-black/40 mx-2 mb-2 rounded-md overflow-hidden py-2">
                              {cat.sub.map((sub) => (
                               <Link
                                  key={sub}
                                  to={getCategoryLink(sub)}
                                  onClick={() => {
                                    setIsOpen(false);
                                    setOpenCategory(null);
                                  }}
                                  // ✅ Applied subMenuLinkStyle
                                  className={`block px-8 py-2 hover:bg-gray-800 ${subMenuLinkStyle}`}
                                >
                                  {sub}
                                </Link>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-auto border-t border-gray-800 p-4 bg-black rounded-b-md">
                    <p className="text-[10px] text-center text-gray-500 font-bold uppercase tracking-tighter">
                      © PRAKASH TRADERS
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* SEARCH DESKTOP */}
          <div className="hidden md:flex flex-1 mx-12 relative">
            <SearchBar handleSearch={handleSearch} window={window} data={data} />
            {window && (
              <div className="absolute top-full left-0 bg-white text-black w-full z-10 shadow-xl max-h-[400px] overflow-y-auto rounded-b-lg">
                {data?.length ? (
                  data.map((e, i) => <ProductCard key={i} {...e} />)
                ) : (
                  <p className="p-4 text-center">No results found</p>
                )}
              </div>
            )}
          </div>

          {/* 🔹 RIGHT ICONS */}
          <div className="flex items-center gap-3 md:gap-6">

            <button className="md:hidden" onClick={() => setMobileSearchOpen(!mobileSearchOpen)}>
              <CiSearch className="w-7 h-7" />
            </button>

            {/* WISHLIST ICON & BADGE */}
            <Link to="/wishlist" className="relative hover:text-teal-400 transition-colors">
              <FaRegHeart className="w-5 h-5" />
              {wishlistItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                  {wishlistItems.length}
                </span>
              )}
            </Link>

            <div
              className="relative py-2"
            >
              <FaUser className="w-5 h-5 cursor-pointer hover:text-teal-400"
                onClick={() => setShowProfileMenu(!showProfileMenu)}
              />

              {showProfileMenu && (
                <div className="absolute right-0 top-full bg-[#1a1a1a] p-2 w-64 z-50 shadow-2xl border border-gray-700 rounded-md">
                   {dataForSidebar.map((e, i) => {
                      if (e.link.startsWith("tel:")) {
                        return (
                          <a
                            key={i}
                            href={e.link}
                            onClick={closeUserMenu}
                            className="flex items-center gap-4 p-3 hover:bg-gray-800 rounded-md transition-all text-sm"
                          >
                            {e.icon}
                            {e.name}
                          </a>
                        );
                      }
                      return (
                        <Link
                          key={i}
                          to={e.link}
                          onClick={closeUserMenu}
                          className="flex items-center gap-4 p-3 hover:bg-gray-800 rounded-md transition-all text-sm"
                        >
                          {e.icon}
                          {e.name}
                        </Link>
                      );
                    })}

                  <hr className="border-gray-700 my-2" />

                  {token && isAuth ? (
                    <>
                      {/* ADMIN DASHBOARD LINK */}
                      {role === "admin" && (
                        <Link
                          to="/dashboard"
                          className="flex items-center gap-3 w-full p-3 hover:bg-purple-900/20 text-purple-400 text-sm font-semibold"
                        >
                          <FaUserShield /> Dashboard
                        </Link>
                      )}

                      {/* LOGOUT */}
                      <button
                        onClick={() => {
                          logout();
                          setShowPopup(false);
                          setShowProfileMenu(false);
                        }}
                        className="flex items-center gap-3 w-full p-3 hover:bg-red-900/20 text-red-400 text-sm"
                      >
                        <AiOutlineLogout /> Logout
                      </button>
                    </>
                  ) : (
                    <>
                      {/* USER LOGIN */}
                      <button
                        onClick={() => setShowPopup(true)}
                        className="flex items-center gap-3 w-full p-3 hover:bg-teal-900/20 text-teal-400 text-sm font-semibold"
                      >
                        <AiOutlineLogin /> User Login
                      </button>
                       {/* here i was removed the admin login by kabilan */}
                     </>
                  )}
                </div>
              )}
            </div>


            {/* CART ICON & BADGE */}
            <div
              onClick={() => {
                if (token && isAuth) {
                  navigate("/cart");
                } else {
                  setShowPopup(true);
                }
              }}
              className="relative cursor-pointer hover:text-teal-400 transition-colors"
            >

              <FaShoppingCart className="w-5 h-5" />
              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-emerald-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                  {cartItems.length}
                </span>
              )}
            </div>
            <Link
              to="/about"
              className="relative cursor-pointer hover:text-teal-400 transition-colors flex items-center gap-1"
            >
              <FaInfoCircle className="w-5 h-5" />
              <span className="hidden md:block text-sm font-bold">About</span>
            </Link>
          </div>

        </nav>
      </header>

      {/* MOBILE SEARCH BAR */}
      {mobileSearchOpen && (
        <div className="md:hidden fixed top-[72px] left-0 w-full p-4 bg-black z-40 border-b border-gray-800">
          <SearchBar autoFocus handleSearch={handleSearch} window={window} data={data} />
        </div>
      )}

      {/* LOGIN POPUP */}
      {showPopup && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100] flex justify-center items-center">
          <Account 
              onClose={() => setShowPopup(false)}
              onSuccess={() => setShowPopup(false)}
          />
        </div>
      )}

      <div className="pt-[72px]" />

      {isOpen && (
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-40"
            onClick={() => setIsOpen(false)}
          />
      )}
    </>
  );
};

export default Navbar;

