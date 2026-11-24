import { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE } from "../Config";

const PriceComparison = ({ productId }) => {
  const [comparison, setComparison] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!productId) return;

    const fetchPrices = async () => {
      try {
        setLoading(true);
        setError(false);

        const response = await axios.get(
          `${API_BASE}/api/products/${productId}/price-comparison/`
        );

        const results = response.data.comparison || [];

        const sortedResults = results
          .filter((item) => Number(item.price) > 0 && item.link)
          .sort((a, b) => Number(a.price) - Number(b.price));

        setComparison(sortedResults);

      } catch (err) {
        console.error("Price comparison error:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchPrices();
  }, [productId]);

  return (
    <section className="mt-8 bg-zinc-900/40 border border-zinc-800 rounded-2xl p-5">

      {/* Heading */}

      <div className="flex justify-between items-center mb-5">

        <div>
          <h2 className="text-xl font-bold text-white">
            Compare Prices
          </h2>

          <p className="text-xs text-zinc-500 mt-1">
            Find the best available deal across stores
          </p>
        </div>

        <span className="text-emerald-400 text-xs font-semibold">
          LIVE DEALS
        </span>

      </div>

      {/* Loading */}

      {loading && (
        <div className="space-y-3">

          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-20 rounded-xl bg-zinc-800/70 animate-pulse"
            />
          ))}

          <p className="text-center text-xs text-zinc-500">
            Finding the best prices...
          </p>

        </div>
      )}

      {/* Error */}

      {!loading && error && (
        <div className="text-center py-8">

          <p className="text-zinc-400 text-sm">
            Unable to fetch prices right now.
          </p>

          <button
            onClick={() => {
              setLoading(true);
              setError(false);
              window.location.reload();
            }}
            className="text-emerald-400 text-xs mt-3"
          >
            Try Again
          </button>

        </div>
      )}

      {/* No Results */}

      {!loading && !error && comparison.length === 0 && (
        <p className="text-center text-zinc-500 text-sm py-8">
          No comparison prices available at the moment.
        </p>
      )}

      {/* Results */}

      {!loading && comparison.length > 0 && (

        <div className="space-y-3">

          {comparison.map((item, index) => (

            <div
              key={`${item.store}-${index}`}
              className={`relative flex items-center gap-3 p-3 rounded-xl border transition-all
                ${
                  index === 0
                    ? "border-emerald-500/50 bg-emerald-500/5"
                    : "border-zinc-800 bg-black/30 hover:border-zinc-600"
                }`}
            >

              {/* Best Price Badge */}

              {index === 0 && (
                <span className="absolute -top-2 left-3 bg-emerald-500 text-black text-[9px] font-bold px-2 py-0.5 rounded">
                  BEST PRICE
                </span>
              )}

              {/* Product Image */}

              <div className="w-16 h-16 flex-shrink-0 bg-white rounded-lg p-1">

                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-contain"
                />

              </div>

              {/* Store Details */}

              <div className="flex-1 min-w-0">

                <h3 className="text-white font-semibold text-sm">
                  {item.store}
                </h3>

                <p className="text-zinc-500 text-xs mt-1 line-clamp-2">
                  {item.title}
                </p>

              </div>

              {/* Price */}

              <div className="text-right flex-shrink-0">

                <p className="text-white font-bold text-lg">
                  ₹{Number(item.price).toLocaleString("en-IN")}
                </p>

                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-1 bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold px-3 py-2 rounded-lg transition"
                >
                  View Deal ↗
                </a>

              </div>

            </div>

          ))}

        </div>

      )}

      {/* Footer */}

      <p className="text-[10px] text-zinc-600 mt-5 text-center">
        Prices and availability may change. Verify the final price
        on the retailer's website.
      </p>

    </section>
  );
};

export default PriceComparison;
