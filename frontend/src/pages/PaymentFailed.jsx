import { useNavigate } from "react-router-dom";

const PaymentFailed = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white">
      <h1 className="text-3xl font-bold text-red-500">❌ Payment Failed</h1>
      <p className="text-zinc-400 mt-2">
        Payment could not be verified. Please try again.
      </p>

      <button
        onClick={() => navigate("/cart")}
        className="mt-6 px-6 py-3 bg-emerald-500 text-black rounded-xl"
      >
        Go to Cart
      </button>
    </div>
  );
};

export default PaymentFailed;
