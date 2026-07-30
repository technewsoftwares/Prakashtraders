import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IoTrashOutline } from "react-icons/io5";
import { ShopContext } from "../Context/Context";

const Cart = () => {
  const { cartItems, removeFromCart } = useContext(ShopContext);
  const navigate = useNavigate();

  // 🔹 Calculate total price
 const total = cartItems.reduce(
  (sum, item) => sum + item.price * item.qty,
  0
);


  // 🔹 Empty cart UI
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center text-white">
        <h2 className="text-3xl font-bold mb-4">Your Cart is Empty 🛒</h2>
        <Link
          to="/"
          className="text-emerald-400 underline text-lg"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white py-10 px-4">
      <div className="container mx-auto">

        <h1 className="text-2xl font-bold mb-6">
          Shopping Cart
        </h1>

        <div className="flex flex-col lg:flex-row gap-8">

          {/* LEFT – CART ITEMS */}
          <div className="flex-1 flex flex-col gap-4">
            {cartItems.map(item => (
              <div
                key={item.id}
                className="flex gap-4 bg-[#121212] p-4 rounded-lg border border-white/10 items-center"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 object-contain bg-white/5 rounded"
                  onError={(e) => {
                    e.currentTarget.src =
                      "https://via.placeholder.com/100";
                  }}
                />

                <div className="flex-1">
                  <h3 className="font-medium">
                    {item.name}
                  </h3>
                  <p className="text-emerald-400 font-bold mt-1">
                    ₹{Number(item.price).toLocaleString("en-IN")}
                  </p>
                </div>

                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-red-500 hover:text-red-400 p-2"
                >
                  <IoTrashOutline size={22} />
                </button>
              </div>
            ))}
          </div>

          {/* RIGHT – ORDER SUMMARY */}
          <div className="w-full lg:w-80 bg-[#1a1a1a] p-6 rounded-lg border border-white/10 h-fit">
            <h2 className="text-lg font-bold mb-4">
              Order Summary
            </h2>

            <div className="flex justify-between text-gray-400 mb-2">
              <span>Subtotal ({cartItems.length} items)</span>
              <span>₹{total.toLocaleString("en-IN")}</span>
            </div>

            <div className="flex justify-between text-gray-400 mb-4">
              <span>Shipping</span>
              <span className="text-emerald-400">Free</span>
            </div>

            <hr className="border-gray-700 mb-4" />

            <div className="flex justify-between text-xl font-bold mb-6">
              <span>Total</span>
              <span>₹{total.toLocaleString("en-IN")}</span>
            </div>

            {/* ✅ SAME FLOW AS SingleItem BUY NOW */}
           <button
                onClick={() =>
                    navigate("/payment", {
                    state: {
                        items: cartItems,   // ✅ send FULL cart items
                        total: total,       // ✅ send total
                        source: "cart",     // ✅ identify cart flow
                    },
                    })
                }
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-black py-3 rounded-md font-bold transition"
                >
                Proceed to Checkout
                </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Cart;
