import React, { useEffect, useState } from "react";
import { Package, Calendar, IndianRupee, ShoppingBag } from "lucide-react";
import { API_BASE } from "../Config";

const API = API_BASE;

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("access_token");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch(`${API}/api/my-orders/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Failed to fetch orders");
      }

      const data = await res.json();

      setOrders(data);
    } catch (err) {
      console.error(err);
      setError("Unable to load your orders.");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const statusColor = (status) => {
    switch (status) {
      case "PAID":
        return "bg-green-100 text-green-700";

      case "PENDING":
        return "bg-yellow-100 text-yellow-700";

      case "FAILED":
        return "bg-red-100 text-red-700";

      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-slate-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-14 w-14 border-b-4 border-indigo-600 mx-auto"></div>

          <p className="mt-5 font-semibold text-slate-600">
            Loading your orders...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-slate-50">
        <div className="bg-white p-8 rounded-xl shadow text-center">

          <h2 className="text-xl font-bold text-red-600">
            {error}
          </h2>

        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex justify-center items-center">

        <div className="text-center">

          <ShoppingBag
            className="mx-auto text-slate-300"
            size={90}
          />

          <h2 className="mt-5 text-2xl font-bold">
            No Orders Yet
          </h2>

          <p className="text-slate-500 mt-2">
            Start shopping to see your orders here.
          </p>

        </div>

      </div>
    );
  }
    return (
    <div className="min-h-screen bg-slate-100 py-10">
      <div className="max-w-6xl mx-auto px-4">

        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Package className="text-indigo-600" size={34} />
          <div>
            <h1 className="text-3xl font-black text-slate-900">
              My Orders
            </h1>
            <p className="text-slate-500">
              {orders.length} Order{orders.length > 1 ? "s" : ""}
            </p>
          </div>
        </div>

        <div className="space-y-7">

          {orders.map((order) => (

            <div
              key={order.order_id}
              className="bg-white rounded-3xl shadow-lg border border-slate-200 overflow-hidden"
            >

              {/* ORDER HEADER */}

              <div className="bg-slate-50 border-b px-7 py-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                <div>

                  <p className="text-xs text-slate-500 uppercase tracking-widest">
                    Order ID
                  </p>

                  <h2 className="font-black text-slate-800">
                    {order.order_id}
                  </h2>

                </div>

                <div className="flex items-center gap-6 flex-wrap">

                  <div className="flex items-center gap-2 text-slate-600">

                    <Calendar size={18} />

                    <span className="font-semibold">
                      {formatDate(order.created_at)}
                    </span>

                  </div>

                  <span
                    className={`px-4 py-2 rounded-full text-xs font-black uppercase ${statusColor(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </span>

                </div>

              </div>

              {/* PRODUCTS */}

              <div className="divide-y">

                {order.items.map((item, index) => (

                  <div
                    key={index}
                    className="p-6 flex flex-col md:flex-row gap-6 md:items-center justify-between"
                  >

                    {/* LEFT */}

                    <div className="flex gap-5">

                      <div className="w-24 h-24 rounded-2xl bg-slate-100 flex items-center justify-center">

                        <Package
                          size={45}
                          className="text-slate-400"
                        />

                      </div>

                      <div>

                        <h3 className="font-bold text-lg text-slate-800">
                          {item.product_name}
                        </h3>

                        <p className="text-slate-500 mt-2">
                          Quantity :
                          <span className="font-bold text-slate-700 ml-2">
                            {item.quantity}
                          </span>
                        </p>

                        <div className="flex items-center gap-2 mt-3">

                          <IndianRupee
                            size={18}
                            className="text-green-600"
                          />

                          <span className="font-black text-green-700 text-lg">
                            {item.price.toLocaleString("en-IN")}
                          </span>

                        </div>

                      </div>

                    </div>

                    {/* RIGHT */}

                    <div className="flex flex-col items-start md:items-end gap-3">

                      <div>

                        <p className="text-xs uppercase text-slate-500">
                          Payment
                        </p>

                        <span
                          className={`inline-block mt-1 px-4 py-2 rounded-full text-xs font-black ${statusColor(
                            order.status
                          )}`}
                        >
                          {order.status}
                        </span>

                      </div>

                      <div>

                        <p className="text-xs uppercase text-slate-500">
                          Total
                        </p>

                        <h2 className="font-black text-2xl text-indigo-700">

                          ₹
                          {(
                            item.price *
                            item.quantity
                          ).toLocaleString("en-IN")}

                        </h2>

                      </div>

                    </div>

                  </div>

                ))}

              </div>
                            {/* ORDER FOOTER */}

              <div className="border-t bg-slate-50 px-6 py-5">

                <div className="flex flex-col md:flex-row justify-between items-center gap-4">

                  <div>

                    <p className="text-sm text-slate-500">
                      Thank you for shopping with
                    </p>

                    <h3 className="font-bold text-indigo-700">
                      Prakash Traders
                    </h3>

                  </div>

                  <div className="flex flex-wrap gap-3">

                    <button
                      className="px-5 py-2 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition"
                      onClick={() =>
                        alert("Track Order feature coming soon.")
                      }
                    >
                      Track Order
                    </button>

                    <button
                      className="px-5 py-2 rounded-xl border border-indigo-600 text-indigo-600 font-bold hover:bg-indigo-50 transition"
                      onClick={() =>
                        alert("Buy Again feature coming soon.")
                      }
                    >
                      Buy Again
                    </button>

                  </div>

                </div>

              </div>

            </div>

          ))}

        </div>

      </div>

    </div>
  );
};

export default MyOrders;
