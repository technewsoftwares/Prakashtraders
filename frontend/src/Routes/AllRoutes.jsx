import { Routes, Route } from "react-router-dom";

import Home from "../pages/Home";
import SingleItem from "../Components/SingleItem";
import PrivateRoute from "./PrivateRoute";

import Profile from "../Components/auth/Profile";
import UserAddress from "../Components/auth/UserAddress";
import AddAddress from "../Components/auth/AddAddress";
import Login from "../Components/auth/Login";

import AdminLogin from "../Components/auth/AdminLogin";
import AdminProtectedRoute from "./AdminProtectedRoute";
import Dashboard from "../Components/AdminDashboard";
import About from "../pages/About";


import ProductList from "../Components/ProductList";
import BrandProducts from "../Components/BrandProducts";
import CategoryProducts from "../Components/CategoryProducts";

import Wishlist from "../pages/Wishlist";
import Cart from "../pages/Cart";

import Payment from "../Components/Payment";
import Success from "../pages/Success";
import PaymentFailed from "../pages/PaymentFailed";


import Contact from "../pages/info/Contact";
import BuyingGuide from "../pages/info/BuyingGuide";
import ReturnPolicy from "../pages/info/ReturnPolicy";
import Careers from "../pages/info/Careers";
import Blog from "../pages/info/Blog";

import Terms from "../pages/info/Terms";
import Privacy from "../pages/info/TermsAndConditions"
import Shipping from "../pages/info/ShippingDelivery"

const AllRoutes = () => {
  return (
    <Routes>

      {/* PUBLIC */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/about" element={<About />} />
      <Route path="/productlist" element={<ProductList />} />
      <Route path="/wishlist" element={<Wishlist />} />

      {/* PRODUCTS */}
      <Route path="/product/:id" element={<SingleItem />} />
      <Route path="/brand/:brandName" element={<BrandProducts />} />
      <Route path="/products/:category" element={<CategoryProducts />} />

      {/* USER (PROTECTED) */}
      <Route
        path="/profile"
        element={
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        }
      />

      <Route
        path="/address"
        element={
          <PrivateRoute>
            <UserAddress />
          </PrivateRoute>
        }
      />

      <Route
        path="/add-address"
        element={
          <PrivateRoute>
            <AddAddress />
          </PrivateRoute>
        }
      />

      <Route
        path="/cart"
        element={
          <PrivateRoute>
            <Cart />
          </PrivateRoute>
        }
      />

      <Route path="/payment-failed" element={<PaymentFailed />} />


      {/* PAYMENT FLOW */}
      <Route path="/payment" element={<Payment />} />
      <Route path="/success" element={<Success />} />

      {/* ADMIN */}
      <Route path="/admin-login" element={<AdminLogin />} />
      <Route
        path="/dashboard"
        element={
          <AdminProtectedRoute>
            <Dashboard />
          </AdminProtectedRoute>
        }
      />




      {/* INFO */}
      <Route path="/contact" element={<Contact />} />
      <Route path="/buying-guide" element={<BuyingGuide />} />
      <Route path="/return-policy" element={<ReturnPolicy />} />
      <Route path="/careers" element={<Careers />} />
         <Route path="/blog" element={<Blog />} />
      <Route path="/Terms" element={<Terms />} />
      <Route path="/TermsAndConditions" element={<Privacy />} />
      <Route path="/ShippingDelivery" element={<Shipping />} />
    </Routes>
  );
};

export default AllRoutes;
