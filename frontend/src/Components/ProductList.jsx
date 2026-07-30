import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const AllProducts = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    setData(demoProducts);
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-100 pb-10">
      <div className="container mx-auto px-2 md:px-4">
        <h1 className="text-xl md:text-3xl font-bold text-center py-8 tracking-tight uppercase">
          Best <span className="text-blue-500">Mobile</span> Deals
        </h1>

        {/* GRID: 
           - Mobile: 1 column (Row Layout)
           - Desktop: 4 columns (Grid Layout) 
        */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-0.5 md:gap-6 bg-zinc-800 md:bg-transparent">
          {data.map((product) => (
           <Link
            key={product._id}
            to={`/product/${product._id}`}
            state={{ product }} //  FULL PRODUCT OBJECT
            className="group bg-zinc-900 md:rounded-2xl overflow-hidden hover:bg-zinc-800/50 transition-all duration-300 md:border md:border-zinc-800 md:hover:border-zinc-600"
          >

              {/* Layout Switch: Row on Mobile (flex-row), Column on Desktop (md:flex-col) */}
              <div className="flex flex-row md:flex-col h-full">
                
                {/* 🖼 LEFT SIDE: IMAGE */}
                <div className="w-1/3 md:w-full bg-white p-3 md:p-6 flex items-center justify-center">
                  <img
                    src={product.product_image[0]}
                    alt={product.product_title}
                    className="h-28 md:h-48 w-full object-contain group-hover:scale-110 transition-transform duration-500"
                  />
                </div>

                {/* 📄 RIGHT SIDE: DETAILS */}
                <div className="w-2/3 md:w-full p-4 flex flex-col justify-between border-l border-zinc-800 md:border-l-0">
                  <div>
                    {/* TITLE */}
                    <h2 className="text-sm md:text-base font-medium line-clamp-2 leading-snug text-zinc-200">
                      {product.product_title}
                    </h2>

                    {/* RATING */}
                    <div className="flex items-center mt-1.5 gap-2">
                      <span className="bg-green-700 text-white px-1.5 py-0.5 rounded text-[10px] font-bold">
                        {product.rating} ★
                      </span>
                      <span className="text-zinc-500 text-[11px] md:text-xs">
                        ({product.reviews.toLocaleString()})
                      </span>
                    </div>

                    {/* 🛠 SPECIFICATIONS - Now visible on both! */}
                    <div className="mt-3">
                      {/* Mobile View: Small horizontal list */}
                      <p className="md:hidden text-[11px] text-zinc-400 line-clamp-1">
                        8GB RAM | 128GB | 5000mAh | 5G
                      </p>
                      
                      {/* Desktop View: Clean bullet points */}
                      <ul className="hidden md:flex flex-col gap-1">
                        <li className="text-[11px] text-zinc-400 flex items-center gap-2">
                          <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
                          8 GB RAM | 128 GB ROM
                        </li>
                        <li className="text-[11px] text-zinc-400 flex items-center gap-2">
                          <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
                          5000 mAh Lithium Battery
                        </li>
                        <li className="text-[11px] text-zinc-400 flex items-center gap-2">
                          <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
                          50MP Rear | 16MP Front
                        </li>
                      </ul>
                    </div>
                  </div>

                  {/*  PRICE SECTION */}
                  <div className="mt-4 flex flex-col">
                    <div className="flex items-baseline gap-2">
                      <span className="text-lg md:text-xl font-bold text-white">
                        {product.price.toLocaleString("en-IN", {
                          style: "currency",
                          currency: "INR",
                          maximumFractionDigits: 0,
                        })}
                      </span>
                      <span className="text-[10px] md:text-xs text-zinc-500 line-through">
                        ₹{(product.price * 1.2).toFixed(0)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-[11px] text-green-500 font-semibold uppercase">Free Delivery</span>
                        <span className="hidden md:block text-[10px] text-zinc-500">Upto ₹2,000 Off on Exchange</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AllProducts;