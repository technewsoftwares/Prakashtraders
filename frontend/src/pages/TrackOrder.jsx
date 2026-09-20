import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Package,
  CheckCircle,
  Clock,
  Truck,
  MapPin,
  ArrowLeft,
  XCircle,
} from "lucide-react";
import axiosInstance from "../axiosInstance";

const TrackOrder = () => {
  const { order_id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchTracking();
  }, [order_id]);

  const fetchTracking = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axiosInstance.get(
        `/api/track/${order_id}/`
      );

      setOrder(response.data);
    } catch (err) {
      console.error("TRACK ORDER ERROR:", err);

      if (err.response?.status === 404) {
        setError("Order not found.");
      } else {
        setError("Unable to load order tracking.");
      }
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "ORDER_PLACED":
        return <Package size={22} />;

      case "CONFIRMED":
        return <CheckCircle size={22} />;

      case "PACKED":
        return <Package size={22} />;

      case "SHIPPED":
        return <Truck size={22} />;

      case "OUT_FOR_DELIVERY":
        return <Truck size={22} />;

      case "DELIVERED":
        return <CheckCircle size={22} />;

      case "CANCELLED":
        return <XCircle size={22} />;

      default:
        return <Clock size={22} />;
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-14 w-14 border-b-4 border-indigo-600 mx-auto"></div>

          <p className="mt-5 font-semibold text-slate-600">
            Loading order tracking...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center max-w-md w-full">
          <XCircle
            size={60}
            className="mx-auto text-red-500"
          />

          <h2 className="text-2xl font-black text-slate-800 mt-5">
            {error}
          </h2>

          <button
            onClick={() => navigate("/orders")}
            className="mt-6 px-6 py-3 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition"
          >
            Back to My Orders
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 py-10 px-4">
      <div className="max-w-4xl mx-auto">

        {/* BACK BUTTON */}

        <button
          onClick={() => navigate("/orders")}
          className="flex items-center gap-2 text-indigo-600 font-bold mb-6 hover:text-indigo-800 transition"
        >
          <ArrowLeft size={20} />
          Back to My Orders
        </button>

        {/* HEADER */}

        <div className="bg-white rounded-3xl shadow-lg border border-slate-200 p-7 mb-6">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

            <div>
              <p className="text-xs text-slate-500 uppercase tracking-widest">
                Order ID
              </p>

              <h1 className="text-2xl md:text-3xl font-black text-slate-900 mt-1">
                {order.order_id}
              </h1>
            </div>

            <div className="text-left md:text-right">
              <p className="text-xs text-slate-500 uppercase">
                Payment / Order Status
              </p>

              <span className="inline-block mt-2 px-5 py-2 rounded-full bg-green-100 text-green-700 font-black text-sm">
                {order.order_status}
              </span>
            </div>

          </div>

        </div>

        {/* TRACKING TIMELINE */}

        <div className="bg-white rounded-3xl shadow-lg border border-slate-200 p-7">

          <div className="flex items-center gap-3 mb-8">

            <Truck
              size={30}
              className="text-indigo-600"
            />

            <div>
              <h2 className="text-2xl font-black text-slate-900">
                Order Tracking
              </h2>

              <p className="text-slate-500">
                Track the progress of your order
              </p>
            </div>

          </div>

          {order.tracking?.length === 0 ? (
            <div className="text-center py-10">
              <Clock
                size={50}
                className="mx-auto text-slate-300"
              />

              <p className="mt-4 text-slate-500 font-semibold">
                Tracking information is not available yet.
              </p>
            </div>
          ) : (
            <div className="relative">

              {order.tracking.map((update, index) => {

                const isLast =
                  index === order.tracking.length - 1;

                return (
                  <div
                    key={`${update.status}-${index}`}
                    className="relative flex gap-5 pb-8"
                  >

                    {/* TIMELINE LINE */}

                    {!isLast && (
                      <div className="absolute left-[19px] top-10 w-[3px] h-full bg-indigo-200"></div>
                    )}

                    {/* ICON */}

                    <div
                      className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                        update.status === "CANCELLED"
                          ? "bg-red-100 text-red-600"
                          : "bg-indigo-100 text-indigo-600"
                      }`}
                    >
                      {getStatusIcon(update.status)}
                    </div>

                    {/* CONTENT */}

                    <div className="flex-1">

                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">

                        <h3 className="font-black text-lg text-slate-800">
                          {update.status_display}
                        </h3>

                        <span className="text-sm text-slate-500">
                          {formatDate(update.created_at)}
                        </span>

                      </div>

                      {update.message && (
                        <p className="mt-2 text-slate-600">
                          {update.message}
                        </p>
                      )}

                      {update.tracking_number && (
                        <div className="mt-3 flex items-center gap-2 text-sm text-slate-600">
                          <Truck size={17} />

                          <span>
                            Tracking Number:
                            <strong className="ml-2 text-slate-800">
                              {update.tracking_number}
                            </strong>
                          </span>
                        </div>
                      )}

                      {update.carrier && (
                        <div className="mt-2 text-sm text-slate-600">
                          Carrier:
                          <strong className="ml-2 text-slate-800">
                            {update.carrier}
                          </strong>
                        </div>
                      )}

                      {update.location && (
                        <div className="mt-2 flex items-center gap-2 text-sm text-slate-600">
                          <MapPin size={17} />

                          <span>
                            {update.location}
                          </span>
                        </div>
                      )}

                    </div>

                  </div>
                );
              })}

            </div>
          )}

        </div>

      </div>
    </div>
  );
};

export default TrackOrder;
