import axios from "axios";
import { useContext, useState } from "react";
import { IoCloseOutline } from "react-icons/io5";
import { ShopContext } from "../../Context/Context";
import { useNavigate } from "react-router-dom";
import Loading from "../Loading";
import { API_BASE } from "../../Config";

const API = API_BASE;
const Login = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [stage, setStage] = useState("email");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  

  // ✅ USE ONLY login()
  const { login } = useContext(ShopContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    // ===== ADMIN LOGIN =====
    if (email === "admin@example.com") {
      if (!password) {
        setError("Please enter password for admin.");
        return;
      }

      setIsLoading(true);
      try {
        const response = await axios.post(
          `${API}/api/auth/admin-login/`,
          { email, password }
        );

        if (response.data.success) {
          // ✅ ADMIN ROLE
          login(response.data.access, "admin");
          navigate("/dashboard", { replace: true });
        } else {
          setError(response.data.message || "Invalid credentials");
        }
      } catch (err) {
        setError("Error logging in admin.");
      } finally {
        setIsLoading(false);
      }
      return;
    }

    // ===== CHECK LOGIN TYPE =====
    if (stage === "email") {
      setIsLoading(true);
      try {
        const res = await axios.post(
          `${API}/api/auth/login-type/`,
          { email }
        );

        if (res.data.type === "admin") {
          setStage("admin-password");
          return;
        }

        await axios.post(
          `${API}/api/auth/send-otp/`,
          { email }
        );

        setStage("otp");
      } catch {
        setError("Something went wrong. Please try again.");
      } finally {
        setIsLoading(false);
      }
      return;
    }

    // ===== USER OTP LOGIN =====
    if (stage === "otp") {
      try {
        const response = await axios.post(
          `${API}/api/auth/verify-otp/`,
          { email, otp }
        );

        if (response.data.success) {
          // ✅ USER ROLE
          localStorage.setItem("refresh_token", response.data.refresh);
          login(response.data.access, "user");
          navigate("/", { replace: true });
        } else {
          setError(response.data.message || "Invalid OTP");
        }
      } catch {
        setError("Error verifying OTP.");
      }
    }
  };

  const handleClose = () => navigate("/");

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-40 z-50">
      <div className="bg-black p-12 w-[500px] shadow-lg">
        <button className="float-right" onClick={handleClose}>
          <IoCloseOutline className="w-6 h-6" />
        </button>
        <center>Please enter your Email ID </center><br /> 

        <form onSubmit={handleLogin}>
          {email === "admin@example.com" ? (
            <input
              type="password"
              placeholder="Enter Admin Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full h-14 text-center bg-black border border-gray-800"
            />
          ) : stage === "email" ? (
            <input
              type="email"
              placeholder="Enter your Email ID "
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full h-14 text-center bg-black border border-gray-800"
            />
          ) : (
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              className="w-full h-14 text-center bg-black border border-gray-800"
            />
          )}

          <button className="bg-teal-500 w-full h-14 mt-4">
            {isLoading ? <Loading text="Processing" /> : "Continue"}
          </button>

          {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default Login;
