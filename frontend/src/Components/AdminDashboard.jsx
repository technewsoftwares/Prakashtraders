import React, { useEffect, useState, useMemo } from "react";
import {
  Package, DollarSign, ShoppingBag, Users,
  Search, User, Phone, Calendar, Gift, Eye, CreditCard,
  BarChart3, LayoutGrid, Settings, LogOut, Menu,
  Plus, Edit3, Trash2, X
} from "lucide-react";
import Chart from "react-apexcharts";
import toast from "react-hot-toast";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import axiosInstance from "../axiosInstance";

/* ===================== CONFIG ===================== */
import { API_BASE } from "../Config";

const API = API_BASE;

/* ===================== HELPERS ===================== */
const getImageUrl = (path) => {
  if (!path) return "https://via.placeholder.com/150";
  if (path instanceof File) return URL.createObjectURL(path);
  if (path.startsWith("http")) return path;
  return `${API}${path}`;
};

const getToken = () => localStorage.getItem("access_token");

/* ===================== CUSTOMERS ===================== */
const CustomersView = () => {
 const [customers, setCustomers] = useState([]); 
const [loading, setLoading] = useState(true); 
const [searchTerm, setSearchTerm] = useState("");	 
useEffect(() => {
  const fetchCustomers = async () => {
    try {
      const token = localStorage.getItem("access_token"); // ✅ FIXED

      console.log("Token:", token); // debug

const res = await axiosInstance.get(
  "/api/auth/admin-customers/"
);

setCustomers(res.data);
    } catch (error) {
      console.error("Error fetching customers:", error);
    } finally {
      setLoading(false);
    }
  };

  fetchCustomers();
}, []);

const deleteCustomer = async (id) => {
  if (!window.confirm("Are you sure you want to delete this customer?")) {
    return;
  }

  try {
    const response = await axiosInstance.delete(
      `/api/auth/admin-customers/${id}/`
    );

    if (response.status >= 200 && response.status < 300) {
      setCustomers((prev) =>
        prev.filter((customer) => customer.id !== id)
      );

      toast.success("Customer deleted successfully");
    } else {
      toast.error("Failed to delete customer");
    }
  } catch (error) {
    console.error("Delete customer error:", error);

    const message =
      error?.response?.data?.detail ||
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      "Failed to delete customer.";

    toast.error(message);
  }
};

  const filteredCustomers = customers.filter((c) => {
  const fullName = (c.name || "").toLowerCase();
  const mobile = c.mobile || "";
  const search = searchTerm.toLowerCase();

  return (
    fullName.includes(search) ||
    mobile.includes(search) ||
    c.id?.toString().includes(search)
  );
});

  return (
    <div className="rounded-[2rem] bg-white border border-slate-200 shadow-sm overflow-hidden animate-in fade-in duration-500">
      <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-black text-slate-900">Customer Management</h3>
          <p className="text-slate-500 text-xs font-bold mt-1">View registered user details.</p>
        </div>
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search Name or Mobile..."
            className="w-full rounded-xl border-none bg-slate-100 py-3 pl-11 pr-4 text-sm font-medium outline-none ring-2 ring-transparent focus:ring-indigo-100 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50/50">
            <tr className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              <th className="px-8 py-5">User ID</th>
              <th className="px-6 py-5">Full Name</th>
              <th className="px-6 py-5">Mobile</th>
              <th className="px-6 py-5">Gender</th>
              <th className="px-6 py-5">DOB / Anniversary</th>
              <th className="px-8 py-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {loading ? (
              <tr><td colSpan="6" className="px-8 py-10 text-center text-slate-400 font-bold">Loading customers...</td></tr>
            ) : filteredCustomers.length === 0 ? (
              <tr><td colSpan="6" className="px-8 py-10 text-center text-slate-400 font-bold">No customers found.</td></tr>
            ) : (
              filteredCustomers.map((c) => (
                <tr key={c.id} className="group hover:bg-slate-50/50 transition-colors">
                  <td className="px-8 py-5">
                    <span className="font-bold text-slate-900">#{c.id}</span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="bg-indigo-50 p-2 rounded-lg text-indigo-600">
                        <User size={16} />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 text-sm">
                          {c.name || "Guest User"}
                        </p>
                        <p className="text-xs text-slate-500">
                          {c.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2 text-slate-600 font-bold text-xs">
                      <Phone size={14} className="text-slate-400" />
                      {c.mobile || "N/A"}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wide ${c.gender === 'Male' ? 'bg-blue-50 text-blue-600' : c.gender === 'Female' ? 'bg-pink-50 text-pink-600' : 'bg-slate-50 text-slate-600'}`}>
                      {c.gender || "Not Set"}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-slate-500 text-[10px] font-bold">
                        <Calendar size={12} /> DOB: {c.dob || "-"}
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex justify-end gap-2">

                      <button
                        className="text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 p-2 rounded-lg transition-all"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        onClick={() => deleteCustomer(c.id)}
                          className="text-red-500 hover:text-white hover:bg-red-600 p-2 rounded-lg transition-all"
                        >
                          <Trash2 size={18} />
                      </button>

                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// --- INTERNAL COMPONENT: ORDERS VIEW ---
const OrdersView = () => {
  const [authorized, setAuthorized] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

 useEffect(() => {
  const token = localStorage.getItem("access_token");

  // 🔐 AUTH GUARD
  if (!token) {
    setAuthorized(false);
    setLoading(false);
    return;
  }

  const fetchOrders = async () => {
    try {
      const res = await axiosInstance.get(
        "/api/admin-orders/"
      );

      setOrders(res.data);
      setAuthorized(true);

    } catch (error) {
      console.error(
        "Error fetching orders:",
        error
      );

      setAuthorized(false);

    } finally {
      setLoading(false);
    }
  };

  fetchOrders();
}, []); 

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered': return 'bg-emerald-50 text-emerald-600';
      case 'shipped': return 'bg-blue-50 text-blue-600';
      case 'pending': return 'bg-amber-50 text-amber-600';
      case 'cancelled': return 'bg-rose-50 text-rose-600';
      default: return 'bg-slate-50 text-slate-600';
    }
  };

  const filteredOrders = orders.filter(o =>
    o.order_id?.toString().includes(searchTerm) ||
    o.status?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // 🔒 UNAUTHORIZED UI (NO REDIRECT = NO BLACK SCREEN)
if (authorized === false) {
  return (
    <div className="flex h-screen items-center justify-center">
      <p className="font-bold text-red-600">
        Unauthorized. Please login.
      </p>
    </div>
  );
}

// ⏳ AUTH CHECK LOADING
if (authorized === null || loading) {
  return (
    <div className="flex h-screen items-center justify-center">
      Loading orders...
    </div>
  );
}  

const exportOrdersToExcel = () => {
  const excelData = orders.map((o) => ({
    "Order ID": o.order_id,
    "Date": new Date(o.created_at).toLocaleDateString(),
    "Customer": o.name,
    "Mobile": o.mobile,
    "Address": o.address,
    "Pincode": o.pincode,
    "Amount": o.total_amount,
    "Status": o.status,
  }));

  const worksheet = XLSX.utils.json_to_sheet(excelData);
  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workbook, worksheet, "Orders");

  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  });

  const file = new Blob([excelBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  saveAs(file, `Orders_${new Date().toISOString().split("T")[0]}.xlsx`);
};

const handleDeleteOrder = async (orderId) => {
  const token = localStorage.getItem("access_token");

  if (!window.confirm("Are you sure you want to delete this order?")) {
    return;
  }

  try {
    const res = await fetch(
      `${API}/api/admin-orders/delete/${orderId}/`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Delete failed");
    }

    // Remove deleted order from table
    setOrders((prev) =>
      prev.filter((o) => o.order_id !== orderId)
    );

    toast.success("Order deleted successfully");

  } catch (err) {
    console.error(err);
    toast.error(err.message);
  }
};

  return (
    <div className="rounded-[2rem] bg-white border border-slate-200 shadow-sm overflow-hidden animate-in fade-in duration-500">
      <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-black text-slate-900">Order Management</h3>
          <p className="text-slate-500 text-xs font-bold mt-1">Track and update customer orders.</p>
        </div>
        <div className="flex items-center gap-3">

  <button
    onClick={exportOrdersToExcel}
    className="bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-xl font-bold"
  >
    Export Excel
  </button>

  <div className="relative w-full max-w-sm">
    <Search
      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
      size={18}
    />
    <input
      type="text"
      placeholder="Search Order ID or Status..."
      className="w-full rounded-xl border-none bg-slate-100 py-3 pl-11 pr-4 text-sm font-medium outline-none ring-2 ring-transparent focus:ring-indigo-100 transition-all"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
    />
  </div>

</div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50/50">
            <tr className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              <th className="px-8 py-5">Order ID</th>
              <th className="px-6 py-5">Date</th>
              <th className="px-6 py-5">Customer</th>
              <th className="px-6 py-5">Mobile</th>
              <th className="px-6 py-5">Address</th>
              <th className="px-6 py-5">Total Amount</th>
              <th className="px-6 py-5">Status</th>
              <th className="px-8 py-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {loading ? (
              <tr><td colSpan="5" className="px-8 py-10 text-center text-slate-400 font-bold">Loading orders...</td></tr>
            ) : filteredOrders.length === 0 ? (
              <tr><td colSpan="5" className="px-8 py-10 text-center text-slate-400 font-bold">No orders found.</td></tr>
            ) : (
              filteredOrders.map((o) => (
                <tr key={o.order_id} className="group hover:bg-slate-50/50 transition-colors">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="bg-indigo-50 p-2 rounded-lg text-indigo-600"><ShoppingBag size={18} /></div>
                      <span className="font-bold text-slate-900">#{o.order_id}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2 text-slate-500">
                      <Calendar size={14} />
                      <span className="text-xs font-bold">{o.created_at ? new Date(o.created_at).toLocaleDateString() : 'N/A'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-800 text-sm">
                        {o.user?.username || o.name || "Guest"}
                      </span>
                      {o.user?.email && (
                        <span className="text-xs text-slate-500">
                          {o.user.email}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-sm font-semibold">
                     {o.mobile || "N/A"}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-sm text-slate-700">
                     {o.address || "N/A"}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2">
                      <CreditCard size={14} className="text-slate-400" />
                      <span className="font-black text-slate-800">₹{parseFloat(o.total_amount).toLocaleString()}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wide ${getStatusColor(o.status)}`}>
                      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-50" />
                      {o.status}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex justify-end gap-2">
                      <button className="text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 p-2 rounded-lg transition-all">
                       <Eye size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteOrder(o.order_id)}
                        className="text-slate-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-lg transition-all"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div> 
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const RedeemView = () => {
  // 🔹 Load from LocalStorage
  const storedRedeems = JSON.parse(localStorage.getItem("redeems")) || [];

  const [redeems, setRedeems] = React.useState(
    storedRedeems.length
      ? storedRedeems
      : [
          {
            id: 1,
            customerId: "PT1",
            name: "Prakash",
            points: 0,
            status: "Active",
            startDate: "2025-01-01",
            expiryDate: "2025-12-31",
            lastPurchase: "-",
          },
        ]
  );

  const [showForm, setShowForm] = React.useState(false);
  const [editIndex, setEditIndex] = React.useState(null);

  const [formData, setFormData] = React.useState({
    customerId: "",
    name: "",
    points: "",
    startDate: "",
    expiryDate: "",
    status: "",
  });

  const [purchaseAmount, setPurchaseAmount] = React.useState("");

  // 🔹 Save to LocalStorage
  React.useEffect(() => {
    localStorage.setItem("redeems", JSON.stringify(redeems));
  }, [redeems]);

  // 🔹 ADD / EDIT
  const handleSaveRedeem = () => {
  const { customerId, name, points, startDate, expiryDate } = formData;

  if (!customerId || !name || points === "" || !startDate || !expiryDate) {
    alert("Please fill all fields");
    return;
  }

  const today = new Date().toISOString().split("T")[0];
  const status = expiryDate >= today ? "Active" : "Expired";

  if (editIndex !== null) {
    const updated = [...redeems];
    updated[editIndex] = {
      ...updated[editIndex],
      customerId,
      name,
      points: Number(points),
      startDate,
      expiryDate,
      status,
    };
    setRedeems(updated);
  } else {
    setRedeems([
      ...redeems,
      {
        id: redeems.length + 1,
        customerId,
        name,
        points: Number(points),
        startDate,
        expiryDate,
        status,
        lastPurchase: "-",
      },
    ]);
  }

  setFormData({
  customerId: "",
  name: "",
  points: "",
  startDate: "",
  expiryDate: "",
  status: "",
});

  setEditIndex(null);
  setShowForm(false);
};


  // 🔹 DELETE
  const handleDelete = (index) => {
    if (window.confirm("Delete this customer?")) {
      setRedeems(redeems.filter((_, i) => i !== index));
    }
  };

  // 🔹 PURCHASE → ₹10,000 = 100 points
  const handlePurchase = (index) => {
    const amount = Number(purchaseAmount);

    if (!amount || amount < 10000) {
      alert("Minimum ₹10,000 required");
      return;
    }

    const earnedPoints = Math.floor(amount / 10000) * 100;

    const updated = [...redeems];
    updated[index].points += earnedPoints;
    updated[index].lastPurchase = `₹${amount}`;

    setRedeems(updated);
    setPurchaseAmount("");
  };

  // 🔹 REDEEM
  const redeemPoints = (index) => {
    const updated = [...redeems];

    if (updated[index].points < 100) {
      alert("Not enough points");
      return;
    }

    updated[index].points -= 100;
    setRedeems(updated);
  };

  // 🔹 EXPORT TO EXCEL
  const exportExcel = () => {
    const csv =
      "Customer ID,Name,Points,Start Date,Expiry Date,Status,Last Purchase\n" +
      redeems
        .map(
  (r) =>
    `${r.customerId},${r.name},${r.points},${r.startDate},${r.expiryDate},${r.status},${r.lastPurchase}`
)
        .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "redeem_customers.csv";
    a.click();
  };

  return (
    <div className="bg-white p-6 rounded-2xl border shadow-sm">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-black">Redeem Management</h2>
        <div className="flex gap-3">
          <button
            onClick={exportExcel}
            className="bg-emerald-600 text-white px-4 py-2 rounded"
          >
            Export
          </button>
          <button
            onClick={() => {
              setEditIndex(null);
              setFormData({ customerId: "", name: "", points: "", startDate: "", expiryDate: "", status: "", });
              setShowForm(true);
            }}
            className="bg-indigo-600 text-white px-4 py-2 rounded"
          >
            + Add Customer
          </button>
        </div>
      </div>

      {/* TABLE */}
      <table className="w-full border text-left">
        <thead className="bg-slate-50 text-xs uppercase font-bold">
          <tr>
            <th className="p-3">Customer ID</th>
            <th className="p-3">Name</th>
            <th className="p-3">Points</th>
            <th className="p-3">Purchase</th>
            <th className="p-3">Actions</th>
            <th className="p-3">Start Date</th>
            <th className="p-3">Expiry Date</th>
            <th className="p-3">Status</th>
          </tr>
        </thead>
        <tbody>
          {redeems.map((r, index) => (
            <tr key={r.id} className="border-t">
              <td className="p-3 font-bold">{r.customerId}</td>
              <td className="p-3">{r.name}</td>
              <td className="p-3 font-bold">{r.points}</td>

              <td className="p-3">
                <input
                  type="number"
                  placeholder="₹ Amount"
                  className="border p-1 w-24 mr-2"
                  value={purchaseAmount}
                  onChange={(e) => setPurchaseAmount(e.target.value)}
                />
                <button
                  onClick={() => handlePurchase(index)}
                  className="bg-orange-500 text-white px-2 py-1 rounded"
                >
                  Buy
                </button>
              </td>

              <td className="p-3 space-x-2">
                <button
                  onClick={() => {
                    setEditIndex(index);
                    setFormData({
                      customerId: r.customerId,
                      name: r.name,
                      points: r.points,
                      startDate: r.startDate,
                      expiryDate: r.expiryDate,
                      status: r.status,
                    });
                    setShowForm(true);
                  }}
                  className="bg-blue-500 text-white px-2 py-1 rounded"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(index)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Delete
                </button>

                <button
                  onClick={() => redeemPoints(index)}
                  className="bg-purple-500 text-white px-2 py-1 rounded"
                >
                  Redeem
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* MODAL */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-[300px]">
            <h3 className="font-black mb-4">
              {editIndex !== null ? "Edit Customer" : "Add Customer"}
            </h3>

            <input
              placeholder="Customer ID"
              className="w-full border p-2 mb-3 rounded"
              value={formData.customerId}
              onChange={(e) =>
                setFormData({ ...formData, customerId: e.target.value })
              }
            />

            <input
              placeholder="Customer Name"
              className="w-full border p-2 mb-3 rounded"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />

            <input
              type="number"
              placeholder="Points"
              className="w-full border p-2 mb-4 rounded"
              value={formData.points}
              onChange={(e) =>
                setFormData({ ...formData, points: e.target.value })
              }
            />

            <input
              type="date"
              className="w-full border p-2 mb-3 rounded"
              value={formData.startDate}
              onChange={(e) =>
                setFormData({ ...formData, startDate: e.target.value })
              }
            />

            <input
              type="date"
              className="w-full border p-2 mb-4 rounded"
              value={formData.expiryDate}
              onChange={(e) =>
                setFormData({ ...formData, expiryDate: e.target.value })
              }
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowForm(false)}
                className="border px-3 py-1 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveRedeem}
                className="bg-indigo-600 text-white px-3 py-1 rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


// --- MAIN COMPONENT: ADMIN DASHBOARD ---
export default function AdminDashboard() {
  // --- 1. AUTH & ROLE STATE ---
  const [user, setUser] = useState({ name: "Admin User", role: "Super Admin", avatar: "https://ui-avatars.com/api/?name=Admin" });
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("access_token")
  );
  const [chartsReady, setChartsReady] = useState(false);
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      setIsAuthenticated(false);
    }
  }, []);
  
  useEffect(() => {
    const t = setTimeout(() => setChartsReady(true), 100);
    return () => clearTimeout(t);
  }, []);


  // --- 2. DATA STATES ---
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // --- 3. UI STATES ---
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  // ✅ UPDATED FORM STATE
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    brand: "",

    original_price: "",
    price: "",
    discount_price: "",

    stock: "",
    rating: 0,
    reviews_count: 0,

    // --- NEW FIELDS ---
    warranty: "",
    length: "",
    breadth: "",
    height: "",
    weight: "",
    // ------------------

    is_active: true,
    is_best_product: false,
    created_at: new Date().toISOString().split('T')[0]
  });

  // --- 4. ANALYTICS DATA ---
  const salesData = [
    { name: 'Jan', sales: 4000, revenue: 2400 },
    { name: 'Feb', sales: 3000, revenue: 1398 },
    { name: 'Mar', sales: 2000, revenue: 9800 },
    { name: 'Apr', sales: 2780, revenue: 3908 },
    { name: 'May', sales: 1890, revenue: 4800 },
    { name: 'Jun', sales: 2390, revenue: 3800 },
  ];

  const orderStatusData = [
    { name: 'Delivered', value: 400 },
    { name: 'Pending', value: 300 },
    { name: 'Shipped', value: 200 },
  ];
  const COLORS = ['#10b981', '#f59e0b', '#6366f1'];
  
//  🧩 STEP 3: ADD THESE CONFIGS (INSIDE AdminDashboard COMPONENT)

// ================== APEX CHART CONFIG ==================
const revenueOptions = {
  chart: {
    type: "area",
    toolbar: { show: false },
    zoom: { enabled: false },
  },
  stroke: {
    curve: "smooth",
    width: 3,
  },
  dataLabels: { enabled: false },
  colors: ["#6366f1"],
  fill: {
    type: "gradient",
    gradient: {
      opacityFrom: 0.25,
      opacityTo: 0.05,
    },
  },
  xaxis: {
    categories: salesData.map((d) => d.name),
    labels: { style: { colors: "#94a3b8" } },
  },
  yaxis: {
    labels: { style: { colors: "#94a3b8" } },
  },
  grid: {
    borderColor: "#f1f5f9",
    strokeDashArray: 3,
  },
};

const revenueSeries = [
  {
    name: "Revenue",
    data: salesData.map((d) => d.revenue),
  },
];

const orderStatusOptions = {
  labels: orderStatusData.map((d) => d.name),
  colors: COLORS,
  legend: { show: false },
  dataLabels: { enabled: false },
  plotOptions: {
    pie: {
      donut: { size: "60%" },
    },
  },
};
const orderStatusSeries = orderStatusData.map((d) => d.value);

  useEffect(() => {
  const fetchDashboardStats = async () => {
    try {
      const token = localStorage.getItem("access_token");

      const res = await fetch(
        `${API}/api/auth/admin-dashboard/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error("Failed");

      const data = await res.json();

      setDashboardStats(data);

    } catch (err) {
      console.error(err);
    }
  };

  fetchDashboardStats();
}, []);

  useEffect(() => {
  const fetchProducts = async () => {
    try {
      const res = await axiosInstance.get("/api/products/");
      setProducts(res.data);
    } catch (err) {
      console.error("Failed to fetch products:", err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  fetchProducts();
}, []);

const [dashboardStats, setDashboardStats] = useState({
   total_users: 0,
    active_orders: 0,
  });

  // --- 5. LOGIC HELPERS ---
  const stats = useMemo(() => {
    const totalRev = products.reduce((s, p) => s + (Number(p.price) || 0), 0);
    return [
      { title: "Total Revenue", value: `₹${totalRev.toLocaleString()}`, icon: DollarSign, trend: "+12.5%", color: "text-emerald-600", bg: "bg-emerald-50" },
      { title: "Active Orders", value: dashboardStats.active_orders, icon: ShoppingBag, trend: "+3.2%", color: "text-blue-600", bg: "bg-blue-50" },
      { title: "Total Users", value: dashboardStats.total_users, icon: Users, trend: "+18%", color: "text-purple-600", bg: "bg-purple-50" },
      { title: "Stock Units", value: products.length, icon: Package, trend: "-2%", color: "text-amber-600", bg: "bg-amber-50" },
    ];
}, [products, dashboardStats]);

  const filteredProducts = products.filter(p =>
    p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  console.log("ACCESS TOKEN:", localStorage.getItem("access_token"));
const handleSaveProduct = async (e) => {
  e.preventDefault();

  try {
    const token = localStorage.getItem("access_token");

    if (!token) {
      toast.error("Session expired. Please login again.");
      setIsAuthenticated(false);
      return;
    }

    const url = isEditing
      ? `/api/products/${formData.id}/`
      : "/api/products/";

    const method = isEditing ? "PUT" : "POST";

    const form = new FormData();

    const imageKeys = [
      "image_1",
      "image_2",
      "image_3",
      "image_4",
      "image_5",
    ];

    Object.keys(formData).forEach((key) => {
      const value = formData[key];

      if (
        value !== null &&
        value !== undefined
      ) {
        if (imageKeys.includes(key)) {
          if (value instanceof File) {
            form.append(key, value);
          }
        } else {
          form.append(key, value);
        }
      }
    });

    const response = await axiosInstance({
      url,
      method,
      data: form,
    });

    const savedProduct = response.data;

    setProducts((prev) =>
      isEditing
        ? prev.map((p) =>
            p.id === savedProduct.id
              ? savedProduct
              : p
          )
        : [savedProduct, ...prev]
    );

    setShowModal(false);
    setIsEditing(false);

    toast.success(
      isEditing
        ? "✏️ Product updated successfully"
        : "✅ Product added successfully"
    );

  } catch (err) {
    console.error(
      "PRODUCT SAVE ERROR:",
      err
    );

    console.error(
      "STATUS:",
      err?.response?.status
    );

    console.error(
      "SERVER RESPONSE:",
      err?.response?.data
    );

    const message =
      err?.response?.data?.detail ||
      err?.response?.data?.error ||
      err?.response?.data?.message ||
      err?.message ||
      "Unable to save product";

    toast.error(`❌ ${message}`);
  }
};

const handleDeleteProduct = async (id) => {
  if (!window.confirm("❗ Delete this product?")) {
    return;
  }

  try {
    await axiosInstance.delete(
      `/api/products/${id}/`
    );

    setProducts((prev) =>
      prev.filter((p) => p.id !== id)
    );

    toast.success(
      "🗑️ Product deleted successfully"
    );

  } catch (err) {
    console.error(
      "DELETE PRODUCT ERROR:",
      err
    );

    const message =
      err?.response?.data?.detail ||
      err?.response?.data?.error ||
      "Failed to delete product";

    toast.error(`❌ ${message}`);
  }
};

  const handleEditClick = (product) => {
    setFormData({ ...product });
    setIsEditing(true);
    setShowModal(true);
  };

  const handleLogout = () => {
    if (window.confirm("Logout from system?")) setIsAuthenticated(false);
  };

  if (!isAuthenticated) return (
    <div className="flex h-screen flex-col items-center justify-center bg-slate-50">
      <div className="w-full max-w-md rounded-3xl bg-white p-10 shadow-xl shadow-slate-200">
        <h2 className="text-3xl font-black text-slate-900 italic">PRAKASH TRADERS</h2>
        <p className="mt-2 text-slate-500 font-medium">Please sign in to access management.</p>
        <button onClick={() => setIsAuthenticated(true)} className="mt-8 w-full rounded-2xl bg-indigo-600 py-4 font-bold text-white shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all">Sign In to Dashboard</button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-[#f8fafc] text-slate-900 font-sans">

      {/* --- SIDEBAR --- */}
      <aside className={`${sidebarOpen ? 'w-72' : 'w-20'} fixed left-0 top-0 z-40 h-screen bg-white border-r border-slate-200 transition-all duration-300 hidden md:block`}>
        <div className="flex h-full flex-col">
          <div className="p-6 flex items-center gap-3">
            <div className="bg-indigo-600 p-2 rounded-xl text-white"><Package size={24} /></div>
            {sidebarOpen && <span className="text-xl font-black tracking-tighter">PRAKASH TRADERS</span>}
          </div>

          <nav className="flex-1 space-y-1 px-4 mt-4">
            {[
              { name: 'Dashboard', icon: BarChart3 },
              { name: 'Products', icon: LayoutGrid },
              { name: 'Orders', icon: ShoppingBag },
              { name: 'Customers', icon: Users },
              { name: 'Redeem', icon: Users }
            ].map((item) => (
              <button
                key={item.name}
                onClick={() => setActiveTab(item.name)}
                className={`flex w-full items-center gap-4 rounded-xl px-4 py-3.5 transition-all ${activeTab === item.name ? 'bg-indigo-50 text-indigo-600 font-bold' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}
              >
                <item.icon size={20} />
                {sidebarOpen && <span className="text-sm">{item.name}</span>}
              </button>
            ))}
          </nav>

          <div className="p-4 border-t border-slate-100">
            <button onClick={handleLogout} className="flex w-full items-center gap-4 rounded-xl px-4 py-3 text-rose-500 hover:bg-rose-50 transition-all">
              <LogOut size={20} />
              {sidebarOpen && <span className="text-sm font-bold">Logout</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'md:ml-72' : 'md:ml-20'}`}>
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-200 bg-white/80 px-8 py-4 backdrop-blur-md">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg"><Menu size={20} /></button>
            <h2 className="text-lg font-bold text-slate-800">{activeTab}</h2>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold">{user.name}</p>
                <p className="text-[10px] font-medium text-indigo-600">{user.role}</p>
              </div>
              <img src={user.avatar} className="h-9 w-9 rounded-full bg-slate-200 ring-2 ring-indigo-50" alt="Avatar" />
            </div>
          </div>
        </header>

        <div className="p-8">
          {/* DASHBOARD */}
           {activeTab === "Dashboard" && (
           <div
             className="animate-in fade-in duration-500"
           >
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
                {stats.map((stat, i) => (
                  <div key={i} className="group rounded-3xl border border-white bg-white p-6 shadow-sm transition-all hover:shadow-md">
                    <div className="flex items-start justify-between">
                      <div className={`rounded-2xl ${stat.bg} ${stat.color} p-3`}>
                        <stat.icon size={22} />
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-1 rounded-lg ${stat.trend.startsWith('+') ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                        {stat.trend}
                      </span>
                    </div>
                    <div className="mt-4">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{stat.title}</p>
                      <h3 className="mt-1 text-2xl font-black text-slate-900">{stat.value}</h3>
                    </div>
                   </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* Revenue */}
                <div className="lg:col-span-2 rounded-[2rem] bg-white border border-slate-200 p-8 shadow-sm">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-lg font-black tracking-tight">
                      Revenue Analysis
                    </h3>
                  </div>

                  <Chart
                    options={revenueOptions}
                    series={revenueSeries}
                    type="area"
                    height={300}
                  />
                 </div>

                 {/* Order Status */}
                 <div className="rounded-[2rem] bg-white border border-slate-200 p-8 shadow-sm">
                   <h3 className="text-lg font-black tracking-tight mb-8">
                     Order Status
                   </h3>

                   <Chart
                     options={orderStatusOptions}
                     series={orderStatusSeries}
                     type="donut"
                     height={250}
                  />
                 </div>
              </div>
            </div>
           )}

          {/* ORDERS */}
          {activeTab === "Orders" && (
            <OrdersView />
          )}

          {/* CUSTOMERS */}
          {activeTab === "Customers" && (
            <CustomersView />
          )}

          {/* 5. REDEEM VIEW */}

          {activeTab === "Redeem" && <RedeemView/>}
         

          {/* PRODUCTS */}
          {activeTab === "Products" && (
            <div className="rounded-[2rem] bg-white border border-slate-200 shadow-sm overflow-hidden animate-in fade-in duration-500">
              <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="relative w-full max-w-sm">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type="text"
                    placeholder="Search inventory..."
                    className="w-full rounded-xl border-none bg-slate-100 py-3 pl-11 pr-4 text-sm font-medium outline-none ring-2 ring-transparent focus:ring-indigo-100 transition-all"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <button onClick={() => { setFormData({ name: "", category: "", price: "", image_url: null, stock: 0, is_active: true }); setIsEditing(false); setShowModal(true); }} className="flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 font-bold text-white hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all">
                    <Plus size={18} /> Add Item
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50/50">
                    <tr className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                      <th className="px-8 py-5">Product Info</th>
                      <th className="px-6 py-5">Type</th>
                      <th className="px-6 py-5">Price</th>
                      <th className="px-6 py-5">Inventory Status</th>
                      <th className="px-8 py-5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {filteredProducts.map((p) => {
                      const isReady = Number(p.stock) > 0;
                      return (
                        <tr key={p.id} className="group hover:bg-slate-50/50 transition-colors">
                          <td className="px-8 py-5">
                            <div className="flex items-center gap-4">
                              <img
                                src={getImageUrl(p.image_1)}
                                className="h-12 w-12 rounded-xl object-cover bg-slate-100 border border-slate-100"
                                onError={(e) => e.target.src = "https://via.placeholder.com/100"}
                                alt=""
                              />
                              <div>
                                <p className="font-bold text-slate-900 leading-tight">{p.name}</p>
                                <p className="text-[10px] font-bold text-indigo-500 mt-1 uppercase">ID: {p.id}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-5">
                            <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-lg uppercase tracking-wider">{p.category}</span>
                          </td>
                          <td className="px-6 py-5">
                            <div className="flex flex-col">
                              {p.original_price && (
                                <span className="text-xs text-slate-400 line-through font-bold">
                                  ₹{p.original_price}
                                </span>
                              )}
                              <span className="text-sm font-black text-slate-900">
                                ₹{p.price}
                              </span>
                            </div>
                          </td>

                          <td className="px-6 py-5">
                            <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-black uppercase ${isReady ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                              <span className={`h-1.5 w-1.5 rounded-full ${isReady ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                              {isReady ? 'Ready' : 'Out'}
                            </span>
                          </td>
                          <td className="px-8 py-5 text-right">
                            <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button onClick={() => handleEditClick(p)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg">
                                <Edit3 size={16} />
                              </button>
                              <button onClick={() => handleDeleteProduct(p.id)} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg">
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
      

      {/* --- FORM MODAL --- */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowModal(false)}></div>
          <div className="relative w-full max-w-2xl bg-white rounded-[2rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">

            <div className="bg-slate-50 px-8 py-6 border-b border-slate-100 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-black text-slate-900">{isEditing ? "Edit Product" : "Add New Product"}</h3>
                <p className="text-slate-500 text-xs font-medium">Fill in the product catalog details.</p>
              </div>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="p-8 max-h-[70vh] overflow-y-auto space-y-6 custom-scrollbar ">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Product Name</label>
                  <input required className="w-full rounded-xl bg-slate-100 border-none p-3 text-sm font-bold focus:ring-2 focus:ring-indigo-500"
                    value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Brand</label>
                  <input className="w-full rounded-xl bg-slate-100 border-none p-3 text-sm font-bold"
                    value={formData.brand} onChange={(e) => setFormData({ ...formData, brand: e.target.value })} />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Description</label>
                <textarea rows="2" className="w-full rounded-xl bg-slate-100 border-none p-3 text-sm font-bold"
                  value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-1">
                  Original Price (MRP ₹)
                </label>
                <input
                  type="number"
                  className="w-full rounded-xl bg-slate-100 border-none p-3 text-sm font-bold"
                  value={formData.original_price}
                  onChange={(e) =>
                    setFormData({ ...formData, original_price: e.target.value })
                  }
                />
              </div>


              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Price (₹)</label>
                  <input type="number" className="w-full rounded-xl bg-slate-100 border-none p-3 text-sm font-bold"
                    value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Discount (₹)</label>
                  <input type="number" className="w-full rounded-xl bg-slate-100 border-none p-3 text-sm font-bold text-rose-500"
                    value={formData.discount_price} onChange={(e) => setFormData({ ...formData, discount_price: e.target.value })} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Stock Qty</label>
                  <input type="number" className="w-full rounded-xl bg-slate-100 border-none p-3 text-sm font-bold"
                    value={formData.stock} onChange={(e) => setFormData({ ...formData, stock: e.target.value })} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Category</label>
                  <input className="w-full rounded-xl bg-slate-100 border-none p-3 text-sm font-bold"
                    value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} />
                </div>
              </div>

              {/* ✅ NEW SECTION: Dimensions & Warranty */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Warranty</label>
                  <input
                    type="text"
                    placeholder="e.g. 1 Year"
                    className="w-full rounded-xl bg-slate-100 border-none p-3 text-sm font-bold"
                    value={formData.warranty}
                    onChange={(e) => setFormData({ ...formData, warranty: e.target.value })}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Length</label>
                  <input
                    type="text"
                    placeholder="cm/in"
                    className="w-full rounded-xl bg-slate-100 border-none p-3 text-sm font-bold"
                    value={formData.length}
                    onChange={(e) => setFormData({ ...formData, length: e.target.value })}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Breadth</label>
                  <input
                    type="text"
                    placeholder="cm/in"
                    className="w-full rounded-xl bg-slate-100 border-none p-3 text-sm font-bold"
                    value={formData.breadth}
                    onChange={(e) => setFormData({ ...formData, breadth: e.target.value })}
                  />
                </div>
                  <div>
                  <label className="text-[10px] font-black text-slate-400">Height (cm)</label>
                  <input
                    type="number"
                    className="w-full rounded-xl bg-slate-100 p-3 text-sm font-bold"
                    value={formData.height}
                    onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Weight</label>
                  <input
                    type="text"
                    placeholder="kg/g"
                    className="w-full rounded-xl bg-slate-100 border-none p-3 text-sm font-bold"
                    value={formData.weight}
                    onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                  />
                </div>
              </div>

              {/* Ratings & Metadata */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Rating (0-5)</label>
                  <input type="number" step="0.1" max="5" className="w-full rounded-xl bg-slate-100 border-none p-3 text-sm font-bold"
                    value={formData.rating} onChange={(e) => setFormData({ ...formData, rating: e.target.value })} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Review Count</label>
                  <input type="number" className="w-full rounded-xl bg-slate-100 border-none p-3 text-sm font-bold"
                    value={formData.reviews_count} onChange={(e) => setFormData({ ...formData, reviews_count: e.target.value })} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Created At</label>
                  <input type="date" className="w-full rounded-xl bg-slate-100 border-none p-3 text-sm font-bold text-slate-500"
                    value={formData.created_at} onChange={(e) => setFormData({ ...formData, created_at: e.target.value })} />
                </div>
              </div>

              {/* ✅ UPDATED IMAGE SECTION: 5 SLOTS */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Product Images (Max 5)</label>
                {["image_1", "image_2", "image_3", "image_4", "image_5"].map((key, index) => (
                  <div key={key} className="flex items-center gap-3">
                    <span className="text-[10px] font-bold text-slate-400 w-4">{index + 1}.</span>
                    <input type="file" accept="image/*" className="flex-1 rounded-xl bg-slate-100 border-none p-3 text-sm font-bold cursor-pointer"
                      onChange={(e) => setFormData({ ...formData, [key]: e.target.files[0] })} />
                    {formData[key] && (
                      <img
                        src={getImageUrl(formData[key])}
                        className="w-12 h-12 rounded-lg object-cover border"
                        alt={`preview-${index + 1}`}
                      />
                    )}
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100">
                <div className="flex items-center gap-3">
                  <input type="checkbox" id="is_active" className="h-5 w-5 rounded-lg accent-indigo-600"
                    checked={formData.is_active} onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })} />
                  <label htmlFor="is_active" className="text-sm font-bold text-slate-700 uppercase tracking-wider cursor-pointer">Active on Website</label>
                </div>
                <span className={`text-[10px] font-black px-3 py-1 rounded-full ${formData.is_active ? 'bg-emerald-500 text-white' : 'bg-slate-300 text-white'}`}>
                  {formData.is_active ? "LIVE" : "DRAFT"}
                </span>
              </div>

              <div className="flex items-center justify-between p-4 bg-amber-50/50 rounded-2xl border border-amber-100">
                <div className="flex items-center gap-3">
                  <input type="checkbox" id="is_best_product" className="h-5 w-5 rounded-lg accent-amber-500"
                    checked={formData.is_best_product} onChange={(e) => setFormData({ ...formData, is_best_product: e.target.checked })} />
                  <label htmlFor="is_best_product" className="text-sm font-black text-slate-700 uppercase tracking-wider cursor-pointer">Best Product (Show on Home)</label>
                </div>
                <span className={`text-[10px] font-black px-3 py-1 rounded-full ${formData.is_best_product ? "bg-amber-500 text-white" : "bg-slate-300 text-white"}`}>
                  {formData.is_best_product ? "BEST" : "NORMAL"}
                </span>
              </div>

              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-4 text-xs font-black uppercase text-slate-400 tracking-widest hover:text-slate-600 transition-colors">Cancel</button>
                <button type="submit" className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all">
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
   </main>
   </div>
 );
}

