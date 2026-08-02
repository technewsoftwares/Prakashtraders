import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import AllProducts from "../Components/AllProducts";
import CategorySlider from "../Components/CategorySlider";
import Personalized from "../Components/Personalized";
import Slider from "../Components/Slider";
import BrandSlider from "../Components/BrandPartnersBanner";
import WeekBest from "../Components/WeekBest";
import { API_BASE } from "../Config";
import GoogleReviews from "../components/GoogleReviews";

const Home = () => {
  const [personalizedProducts, setPersonalizedProducts] = useState([]);
  const category = localStorage.getItem("category");
  const location = useLocation();   
const API = API_BASE;

useEffect(() => {
  const fetchPersonalized = async () => {
    try {
      let url = `${API}/api/products/random/`;

      if (category) {
        url += `?category=${encodeURIComponent(category)}`;
      }

      const res = await fetch(url);

      if (!res.ok) return;

      const data = await res.json();
      setPersonalizedProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Home personalized fetch error:", error);
      setPersonalizedProducts([]);
    }
  };

  fetchPersonalized();
}, [category, location.pathname]);


  return (
    <div>
      {/* HERO SLIDER */}
      <Slider />

      {/* CATEGORY */}
      <CategorySlider />

      <div className="w-full	 py-4">

           
        {/* ✅ PERSONALIZED (DATA FROM HOME) */}
       <Personalized products={personalizedProducts} />
        


        {/* BRAND PARTNERS */}
        <BrandSlider />



        {/* ALL PRODUCTS */}
        <AllProducts />

        {/* WEEK BEST */}

        <WeekBest />  

        {/* GOOGLE REVIEWS */}
        <GoogleReviews />     

      </div>
    </div>
  );
};

export default Home;
