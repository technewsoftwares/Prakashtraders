import { useEffect, useState } from "react";

import AllProducts from "../Components/AllProducts";
import CategorySlider from "../Components/CategorySlider";
import Personalized from "../Components/Personalized";
import Slider from "../Components/Slider";
import BrandSlider from "../Components/BrandPartnersBanner";
import WeekBest from "../Components/WeekBest";
import GoogleReviews from "../Components/GoogleReviews";

import { API_BASE } from "../Config";

const API = API_BASE;

const Home = () => {
  const [personalizedProducts, setPersonalizedProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    const fetchPersonalizedProducts = async () => {
      try {
        setIsLoading(true);

       const category = localStorage.getItem("category");

const url = new URL(`${API}/api/products/random/`);

if (category) {
  url.searchParams.set("category", category);
}

const response = await fetch(url, {
  signal: controller.signal,
});

        if (!response.ok) {
          throw new Error("Failed to fetch personalized products");
        }

        const data = await response.json();

        if (!controller.signal.aborted) {
          setPersonalizedProducts(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Home personalized fetch error:", error);
          setPersonalizedProducts([]);
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    fetchPersonalizedProducts();

    return () => {
      controller.abort();
    };
  }, []);

  return (
    <main>
      {/* HERO SLIDER */}
      <Slider />

      {/* CATEGORY */}
      <CategorySlider />

      <div className="w-full py-4">
        {/* PERSONALIZED PRODUCTS */}
        <Personalized
          products={personalizedProducts}
          isLoading={isLoading}
        />

        {/* BRAND PARTNERS */}
        <BrandSlider />

        {/* ALL PRODUCTS */}
        <AllProducts />

        {/* WEEK BEST */}
        <WeekBest />

        {/* GOOGLE REVIEWS */}
        <GoogleReviews />
      </div>
    </main>
  );
};

export default Home;
