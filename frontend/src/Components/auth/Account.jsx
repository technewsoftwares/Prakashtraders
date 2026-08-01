import PropTypes from "prop-types";
import axios from "axios";
import { useContext, useState } from "react";
import { IoCloseOutline } from "react-icons/io5";
import { ShopContext } from "../../Context/Context";
import Loading from "../Loading";
import { API_BASE } from "../../Config";

const API = API_BASE;

// ✅ ADD onSuccess to props
const Account = ({ onClose, onSuccess }) => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [stage, setStage] = useState("email");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  
  const { login } = useContext(ShopContext);

  const handleLogin = async (e) => {
  e.preventDefault();
  setError("");
  setSuccess("");

  // ================= SEND OTP =================
  if (stage === "email") {
    setIsLoading(true);

    try {
      await axios.post(`${API}/api/auth/send-otp/`, { email });

      setStage("otp");

    } catch (err) {
      console.log("========== SEND OTP ERROR ==========");
      console.log("Full Error:", err);
      console.log("Response:", err.response);
      console.log("Data:", err.response?.data);
      console.log("Status:", err.response?.status);

      setError(err.response?.data?.message || "Error sending OTP. Please try again.");

    } finally {
      setIsLoading(false);
    }

    return;
  }

  // ================= VERIFY OTP =================
  if (stage === "otp") {
    setIsLoading(true);

    try {
      const response = await axios.post(
        `${API}/api/auth/verify-otp/`,
        { email, otp }
      );

      if (response.data.success) {
        localStorage.setItem("refresh_token", response.data.refresh);

        login(response.data.access, "user");

        setSuccess("Login successful 🎉");

        setEmail("");
        setOtp("");
        setStage("email");
        onSuccess?.();

      } else {
        setError(response.data.message || "Invalid OTP");
      }

    } catch (err) {
      setError("Error verifying OTP. Please try again.");

    } finally {
      setIsLoading(false);
    }
  }
};
  return (
    <div className="bg-black p-12 w-[500px] shadow-lg rounded-md text-white relative">
      <button className="absolute top-4 right-4" onClick={onClose}>
        <IoCloseOutline className="w-6 h-6 hover:text-red-400" />
      </button>

      <p className="m-4 text-center text-sm font-semibold">
        {stage === "email" ? "Please enter your Email ID " : "Please verify OTP"}
      </p>

      <form className="text-center" onSubmit={handleLogin}>
        {stage === "email" ? (
          <>
            <input
              type="email"
              placeholder="Enter your Email ID"
              className="border border-gray-800 bg-black w-full h-14 text-center rounded-md mb-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit" className="bg-teal-500 w-full h-14 rounded-md font-semibold">
              {isLoading ? <Loading text="Sending OTP..." /> : "Continue"}
            </button>
          </>
        ) : (
          <>
            <input
              type="text"
              placeholder="Enter OTP"
              className="border border-gray-800 bg-black w-full h-14 text-center rounded-md"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
            <button type="submit" className="bg-teal-500 w-full h-14 rounded-md mt-4 font-semibold">
              {isLoading ? <Loading text="Verifying OTP..." /> : "Verify OTP"}
            </button>
          </>
        )}

        {error && <p className="text-red-500 text-xs mt-3">{error}</p>}
        {success && <p className="text-green-500 text-sm mt-3">{success}</p>}
      </form>
    </div>
  );
};

Account.propTypes = {
  onClose: PropTypes.func.isRequired,
  onSuccess: PropTypes.func, // Added prop validation
};

export default Account;
