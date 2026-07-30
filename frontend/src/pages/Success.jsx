import { useLocation, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


const Success = () => {
  const location = useLocation();
  const [order, setOrder] = useState(null);
  const API = import.meta.env.VITE_API_URL;

  if (!location.state?.order_id) {
    return <Navigate to="/" />;
  }

  const navigate = useNavigate();


  const orderId = location.state.order_id;

  useEffect(() => {
    fetch(`${API}/api/order-details/${orderId}/`)
      .then(res => res.json())
      .then(data => setOrder(data));
  }, [orderId]);

  if (!order) return <p className="text-center mt-20">Loading...</p>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="bg-zinc-900 p-6 rounded-xl w-full max-w-md">
        <h1 className="text-2xl font-bold text-emerald-500 mb-3">
          🎉 Payment Successful
        </h1>

        <p><b>Order ID:</b> {order.order_id}</p>
        <p><b>Amount:</b> ₹{order.amount}</p>
        <p><b>Status:</b> {order.status}</p>
        <p><b>Transaction ID:</b> {order.transaction_id}</p>

        <button
          onClick={() => navigate("/")}
          className="w-full mt-4 bg-emerald-500 text-black py-3 rounded-xl font-bold hover:bg-emerald-400 transition"
        >
          Home
        </button>
      </div>
    </div>
  );
};

export default Success;
