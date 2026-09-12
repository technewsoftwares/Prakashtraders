import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axiosInstance from "../../axiosInstance";

const UserAddress = () => {
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const fetchAddresses = async () => {
    try {
      const res = await axiosInstance.get(
        "/api/auth/addresses/"
      );

      setAddresses(res.data);
    } catch (error) {
      console.error(
        "LOAD ADDRESSES ERROR:",
        error.response?.data || error.message
      );

      alert("Failed to load addresses");
    } finally {
      setLoading(false);
    }
  };

  fetchAddresses();
}, []);

  const handleDelete = async (id) => {
  if (!window.confirm("Delete this address?")) return;

  try {
    await axiosInstance.delete(
      `/api/auth/addresses/${id}/`
    );

    setAddresses((prev) =>
      prev.filter((a) => a.id !== id)
    );
  } catch (error) {
    console.error(
      "DELETE ADDRESS ERROR:",
      error.response?.data || error.message
    );

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
