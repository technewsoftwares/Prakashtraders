import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE } from "../../Config";

const API = API_BASE;
const UserAddress = () => {
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);


  const token = localStorage.getItem("access_token");

  useEffect(() => {
    if (!token) return;

    axios
      .get(`${API}/api/auth/addresses/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setAddresses(res.data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        alert("Failed to load addresses");
      });
  }, [token]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this address?")) return;

    try {
      await axios.delete(
        `${API}/api/auth/addresses/${id}/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setAddresses((prev) => prev.filter((a) => a.id !== id));
    } catch {
      alert("Delete failed");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        Loading addresses...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white px-6 py-10">
      <p className="text-sm text-gray-400 mb-4">
        My Account <span className="mx-2">{">"}</span> My Addresses
      </p>

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold">My Addresses</h1>
        <button
          onClick={() => navigate("/add-address")}
          className="text-emerald-400 font-semibold"
        >
          + ADD NEW ADDRESS
        </button>
      </div>

      {addresses.length === 0 && (
        <p className="text-gray-400">No addresses added yet.</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {addresses.map((addr) => (
          <div key={addr.id} className="border border-gray-700 rounded-lg p-6">
            <h2 className="text-emerald-400 font-semibold mb-2">
              {addr.full_name}
            </h2>
            <p className="text-sm mb-2">{addr.mobile}</p>
            <p className="text-sm text-gray-300 mb-4">{addr.address}</p>

            <div className="flex justify-between items-center text-sm">
              <span className="capitalize">{addr.address_type}</span>
              <button
                onClick={() => handleDelete(addr.id)}
                className="border px-4 py-2 rounded hover:bg-red-600"
              >
                DELETE
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserAddress;
