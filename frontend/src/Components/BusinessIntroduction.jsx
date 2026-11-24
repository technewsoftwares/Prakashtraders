
import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  Building2,
  Gift,
  Armchair,
  MessageCircle,
  Send,
  CheckCircle,
} from "lucide-react";
import { API_BASE } from "../Config";

const BusinessIntroduction = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    enquiry_type: "Corporate Gifting",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  const whatsappNumber = "919663418188";

  const services = [
    {
      icon: <Gift size={30} />,
      title: "Corporate Gifting",
      description:
        "Explore electronics and customised gifting solutions for employees, clients and business events.",
    },
    {
      icon: <Building2 size={30} />,
      title: "Institutional Supply",
      description:
        "Reliable electronics and appliance supply solutions for offices, institutions and organisations.",
    },
    {
      icon: <Armchair size={30} />,
      title: "Furniture Solutions",
      description:
        "Furniture manufacturing and customised furniture solutions to meet your business requirements.",
    },
  ];

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus("");

    try {
      await axios.post(`${API_BASE}/api/auth/contact/`, {
        name: form.name,
        email: form.email,
        message: form.message,
        phone: form.phone,
        company: form.company,
        enquiry_type: form.enquiry_type,
      });

      setStatus("success");
      setForm({
        name: "",
        email: "",
        phone: "",
        company: "",
        enquiry_type: "Corporate Gifting",
        message: "",
      });
    } catch (error) {
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  const whatsappMessage = encodeURIComponent(
    "Hello Prakash Traders, I would like to enquire about your corporate and institutional services."
  );

  return (
    <section className="bg-black text-white">
      <div className="max-w-7xl mx-auto px-5 py-16 md:py-20">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <p className="text-emerald-700 font-semibold tracking-widest uppercase text-sm mb-3">
            Trusted Since 1984
          </p>

          <h2 className="text-3xl md:text-5xl font-bold mb-5">
            Everything for Your Home.
            <span className="block text-emerald-700">
              Everything for Your Business.
            </span>
          </h2>

          <p className="text-gray-300 leading-7">
            Prakash Traders brings decades of experience in electronics,
            home appliances and business solutions. From individual
            purchases to large-scale institutional requirements, we aim
            to provide dependable products and service.
          </p>

          <Link
            to="/about"
            className="inline-block mt-6 text-emerald-700 font-semibold hover:underline"
          >
            Know More About Us →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-white text-black border border-gray-200 rounded-xl p-7 hover:border-emerald-600 hover:shadow-lg transition"
            >
              <div className="text-emerald-700 mb-5">
                {service.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">
                {service.title}
              </h3>
              <p className="text-gray-600 leading-7">
                {service.description}
              </p>
              <a
                href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 mt-5 text-emerald-700 font-semibold"
              >
                Enquire Now <MessageCircle size={17} />
              </a>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 bg-gray-50 rounded-2xl p-6 md:p-10">
          <div className="flex flex-col justify-center">
            <p className="text-emerald-700 font-semibold uppercase tracking-wider text-sm mb-3">
              Business Enquiries
            </p>
            <h2 className="text-3xl font-bold mb-4">
              Let's Discuss Your Requirements
            </h2>
            <p className="text-gray-600 leading-7 mb-6">
              Looking for corporate gifts, institutional supplies or
              customised furniture? Contact our team and share your
              requirements.
            </p>

            <a
              href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-emerald-700 text-white rounded-lg px-6 py-3 font-semibold w-fit hover:bg-emerald-800"
            >
              <MessageCircle size={20} />
              Enquire on WhatsApp
            </a>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Your Name"
              required
              className="w-full border rounded-lg px-4 py-3 bg-white"
            />

            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email Address"
              required
              className="w-full border rounded-lg px-4 py-3 bg-white"
            />

            <input
              name="phone"
              type="tel"
              value={form.phone}
              onChange={handleChange}
              placeholder="Phone Number"
              className="w-full border rounded-lg px-4 py-3 bg-white"
            />

            <input
              name="company"
              value={form.company}
              onChange={handleChange}
              placeholder="Company / Organisation"
              className="w-full border rounded-lg px-4 py-3 bg-white"
            />

            <select
              name="enquiry_type"
              value={form.enquiry_type}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-3 bg-white"
            >
              <option>Corporate Gifting</option>
              <option>Institutional Supply</option>
              <option>Furniture Solutions</option>
              <option>General Business Enquiry</option>
            </select>

            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder="Tell us about your requirements"
              required
              rows="4"
              className="w-full border rounded-lg px-4 py-3 bg-white"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-emerald-700 text-white rounded-lg px-6 py-3 font-semibold hover:bg-emerald-800 disabled:opacity-60"
            >
              {loading ? "Submitting..." : "Submit Enquiry"}
              <Send size={18} />
            </button>

            {status === "success" && (
              <p className="text-green-700 flex items-center gap-2">
                <CheckCircle size={18} />
                Your enquiry has been submitted successfully.
              </p>
            )}

            {status === "error" && (
              <p className="text-red-600">
                Unable to submit your enquiry. Please try again or contact us on WhatsApp.
              </p>
            )}
          </form>
        </div>
      </div>
    </section>
  );
};

export default BusinessIntroduction;
