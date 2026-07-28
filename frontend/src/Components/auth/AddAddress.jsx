import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";


const API = import.meta.env.VITE_API_URL;
const AddAddress = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("access_token");

  const [form, setForm] = useState({
    full_name: "",
    mobile: "",
    pincode: "",
    address: "",
    landmark: "",
    locality: "",
    state: "",
    city: "",
    address_type: "home",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!token) return; // 👈 IMPORTANT

    try {
      await axios.post(
        `${API}/api/auth/addresses/`,
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      navigate("/address");
    } catch (error) {
      console.error(error.response?.data || error.message);
      alert("Failed to save address");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white px-6 py-10">
      <p className="text-sm text-gray-400 mb-6">
        My Account <span className="mx-2">{">"}</span> My Addresses{" "}
        <span className="mx-2">{">"}</span> Add Address
      </p>

      <h1 className="text-xl font-semibold mb-8 text-center">
        Add New Address
      </h1>

      <div className="max-w-2xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        <input name="full_name" placeholder="Full Name" onChange={handleChange} className="p-3 text-black" />
        <input name="mobile" placeholder="Mobile Number" onChange={handleChange} className="p-3 text-black" />
        <input name="pincode" placeholder="Pin Code" onChange={handleChange} className="p-3 text-black" />
        <input name="locality" placeholder="Locality / Area" onChange={handleChange} className="p-3 text-black" />

        <input
          name="address"
          placeholder="Flat / Street / Building"
          onChange={handleChange}
          className="p-3 text-black col-span-2"
        />

        <input
          name="landmark"
          placeholder="Landmark"
          onChange={handleChange}
          className="p-3 text-black col-span-2"
        />

        <input name="state" placeholder="State" onChange={handleChange} className="p-3 text-black" />
        <input name="city" placeholder="City" onChange={handleChange} className="p-3 text-black" />

        <div className="col-span-2 flex gap-6 text-sm">
          {["home", "work", "other"].map((type) => (
            <label key={type} className="flex items-center gap-2">
              <input
                type="radio"
                name="address_type"
                value={type}
                checked={form.address_type === type}
                onChange={handleChange}
              />
              {type.toUpperCase()}
            </label>
          ))}
        </div>

        <button
          onClick={handleSubmit}
          className="col-span-2 bg-emerald-400 text-black py-3 rounded font-semibold"
        >
          SAVE ADDRESS
        </button>
      </div>
    </div>
  );
};

export default AddAddress;
