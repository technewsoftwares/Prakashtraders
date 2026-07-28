import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Loading from "./Loading";
import ProductCard from "./CategoryProducts";

const API = import.meta.env.VITE_API_URL;

const ProductPage = () => {
  const { category } = useParams();
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const getCategoryWiseProduct = async () => {
    setIsLoading(true);

    try {
      const res = await axios.get(
        `${API}/api/products/?category=${category}`
      );

      setProducts(res.data.products || []);
    } catch (error) {
      console.log(error);
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (category) getCategoryWiseProduct();
  }, [category]);

  return (
    <>
      <div className="container py-8">
        {category?.toUpperCase()}
      </div>

      {isLoading && (
        <div className="h-48 flex items-center justify-center">
          <Loading text="Loading..." />
        </div>
      )}

      {!isLoading && (
        <div className="container py-8 flex gap-8 flex-wrap items-center">
          {products.map((e, index) => (
            <ProductCard key={index} {...e} />
          ))}
        </div>
      )}
    </>
  );
};

export default ProductPage;
