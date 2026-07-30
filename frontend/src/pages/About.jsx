import React, { useState, useEffect } from 'react';
import {
  Phone, Mail, MapPin, Award, Truck, ShieldCheck,
  Factory, ArrowRight, MessageCircle, Star, Users, ExternalLink,
  Gift, Briefcase, CheckCircle2, TrendingUp, Zap
} from 'lucide-react';
import { useNavigate } from "react-router-dom";
// New Import
import latest_launch from "../assets/images/img.png";

// --- Data Sections remain the same ---
const corporateGifting = [
  { category: "Desk Essentials", items: ["Custom Paperweights", "Premium Pens", "Organizers", "Notebooks", "Digital Clocks", "Wireless Mouse"] },
  { category: "Tech Gadgets", items: ["Power Banks", "Bluetooth Audio", "Wireless Chargers", "Smart Wearables", "Multi-port Hubs", "Projectors"] },
  { category: "Lifestyle", items: ["Ceramic Mugs", "Smart Bottles", "Vacuum Flasks", "Electric Kettles", "Gourmet Hampers"] },
  { category: "Travel Gear", items: ["Leather Wallets", "Laptop Backpacks", "Travel Kits", "Luggage Tags"] },
  { category: "Luxury", items: ["Premium Watches", "High-fidelity Audio", "Executive Sets"] },
  { category: "Festive", items: ["Dry Fruit Boxes", "Artisanal Chocolates", "Premium Coffee", "Custom Hampers"] }
];

const clientList = ["Ashok Leyland", "Titan", "Tanishq", "TVS Motor", "Tata Steel", "Weg Industries", "Delta Electronics", "Wendt India", "FIEM Auto", "India Nippon", "Tenneco", "Global Calcium", "CK Airtech", "Taneja Aerospace", "Ascent Circuits", "Sunchirin Auto", "GRB Dairy", "Chennai Silks", "Gunam Hospitals", "Fuji Film", "Jos Alukkas", "Jain Farms", "Ather", "Kauvery Hospitals"];
const brandPartners = ["Samsung", "IFB", "Butterfly", "Whirlpool", "Preethi", "Peps", "Vidiem", "Haier", "Prestige", "Vivo", "Canon", "Fujifilm", "Dell", "V-Guard", "LG"];

const stats = [
  { label: "Founded", value: "1984", icon: <Factory className="w-5 h-5 text-blue-400" /> },
  { label: "Reach", value: "Pan-India", icon: <MapPin className="w-5 h-5 text-emerald-400" /> },
  { label: "Experience", value: "40+ Yrs", icon: <TrendingUp className="w-5 h-5 text-purple-400" /> },
  { label: "Support", value: "24/7", icon: <Phone className="w-5 h-5 text-rose-400" /> }
];

const missionVisionData = [
  { Icon: ShieldCheck, color: "text-emerald-400", bg: "bg-emerald-500/10", title: "Our Purpose", text: "Enhancing everyday living with trusted electronics and gifting solutions that bring style to homes and businesses." },
  { Icon: Award, color: "text-amber-400", bg: "bg-amber-500/10", title: "Our Vision", text: "To be India's preferred destination for lifestyle solutions, setting the benchmark for quality and innovation." },
  { Icon: Zap, color: "text-blue-400", bg: "bg-blue-500/10", title: "Our Mission", text: "Delivering high-quality products with exceptional service, building long-term relationships through trust." }
];

const AboutPage = () => {
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="bg-slate-950 text-slate-200 min-h-screen font-sans selection:bg-blue-500 selection:text-white overflow-x-hidden">

      {/* --- Background Texture --- */}
      <div className="fixed inset-0 z-0 opacity-10 pointer-events-none"
           style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #334155 1px, transparent 0)', backgroundSize: '32px 32px' }}>
      </div>

      {/* --- Mobile-Optimized Floating Contact Button --- */}
      <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50">
        <a href="https://wa.me/919663418188" target="_blank" rel="noopener noreferrer"
           className="flex items-center justify-center w-14 h-14 md:w-auto md:h-auto md:gap-2 bg-emerald-600 hover:bg-emerald-500 text-white md:px-5 md:py-3 rounded-full shadow-lg transition-all active:scale-95 border border-emerald-400/20">
          <MessageCircle className="w-6 h-6" />
          <span className="hidden md:inline font-medium">Chat with Us</span>
        </a>
      </div>

      {/* --- Hero Section --- */}
      {/* Reduced bottom padding from pb-20 to pb-12 */}
      <section className="relative pt-20 md:pt-32 pb-12 px-4 md:px-6 z-10 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[400px] md:max-w-[600px] h-[400px] md:h-[600px] bg-blue-600/10 rounded-full blur-[80px] md:blur-[120px] -z-10"></div>

        <div className={`max-w-7xl mx-auto transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>

          {/* Flex Container for Text (Left) and Image (Right) */}
          <div className="flex flex-col lg:flex-row items-center gap-10 md:gap-12 mb-12 md:mb-16">

            {/* Left Side: Content */}
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 border border-blue-500/20 rounded-full bg-blue-500/5 backdrop-blur-sm text-blue-300 text-xs md:text-sm font-medium">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                </span>
                Established 1984
              </div>

              <h1 className="text-4xl md:text-7xl font-extrabold mb-6 tracking-tight text-white leading-tight">
                Prakash <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500">Traders</span>
              </h1>

              <p className="text-base md:text-xl text-slate-400 mb-8 md:mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Building the future with trusted electronics and stylish living solutions. Experience quality that lasts generations.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start items-center">
                <button onClick={() => document.getElementById('contact-section').scrollIntoView({ behavior: 'smooth' })}
                  className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-xl font-semibold flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all">
                  Contact Us <ArrowRight className="w-5 h-5" />
                </button>
                <button onClick={() => navigate("/")}
                  className="w-full sm:w-auto px-8 py-4 rounded-xl font-semibold border border-slate-700 text-slate-300 transition-all flex items-center justify-center gap-2 active:bg-slate-800">
                  View Products <ExternalLink className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Right Side: Image */}
            <div className="flex-1 relative w-full max-w-lg lg:max-w-none">
                <div className="absolute -inset-4 bg-blue-500/10 rounded-full blur-3xl"></div>
                <img
                    src={latest_launch}
                    alt="Latest Launch"
                    className="relative z-10 w-2/3 lg:w-3/4 h-auto mx-auto rounded-3xl shadow-2xl border border-slate-800 animate-float"
                    style={{ animation: 'float 6s ease-in-out infinite' }}
                />
                <style dangerouslySetInnerHTML={{__html: `
                    @keyframes float {
                        0%, 100% { transform: translateY(0); }
                        50% { transform: translateY(-20px); }
                    }
                `}} />
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4 max-w-5xl mx-auto">
            {stats.map((stat, i) => (
              <div key={i} className="p-4 md:p-6 border border-slate-800 rounded-2xl bg-slate-900/40 backdrop-blur-md">
                <div className="flex flex-col items-center">
                  <div className="p-2 bg-slate-800/50 rounded-full mb-2">
                    {stat.icon}
                  </div>
                  <p className="text-xl md:text-3xl font-bold text-white">{stat.value}</p>
                  <p className="text-slate-500 text-xs md:text-sm mt-1 font-medium">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- Mission & Vision Section (Layout Changed: Icon Left) --- */}
      {/* Reduced py-24 to py-16 */}
      <section className="py-10 md:py-10 px-4 md:px-6 relative z-10">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {missionVisionData.map((item, index) => (
            <div key={index} className="p-6 md:p-8 rounded-3xl border border-slate-800 bg-slate-900/40">
              {/* Changed layout to Flex Row for Icon + Title */}
              <div className="flex items-center gap-4 mb-4">
                <div className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center shrink-0 ${item.bg}`}>
                  <item.Icon className={`w-6 h-6 md:w-7 md:h-7 ${item.color}`} />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-white">{item.title}</h3>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* --- Corporate Gifting Section --- */}
      {/* Reduced py-24 to py-16 */}
      <section className="py-10 md:py-16 px-4 md:px-6 max-w-7xl mx-auto relative z-10">
        <div className="mb-8 md:mb-12 text-center md:text-left">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 flex flex-row items-center gap-3 justify-center md:justify-start">
               <span className="p-2 bg-purple-500/10 rounded-lg"><Gift className="text-purple-400 w-6 h-6 md:w-8 md:h-8" /></span>
               <span>Corporate Gifting</span>
            </h2>
            <p className="text-slate-400 max-w-2xl text-sm md:text-lg">
              Premium solutions for business excellence. From economical giveaways to executive luxury.
            </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {corporateGifting.map((cat, i) => (
            <div key={i} className="p-5 md:p-6 rounded-2xl border border-slate-800 bg-slate-900/50">
              <h4 className="text-lg font-bold mb-4 text-slate-200 pb-2 border-b border-slate-800">{cat.category}</h4>
              <div className="flex flex-wrap gap-1.5">
                {cat.items.map((item, idx) => (
                  <span key={idx} className="text-[10px] md:text-xs font-medium px-2 py-1 rounded-md bg-slate-800 text-slate-400 border border-slate-700/50">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- Brands Section (Font Increased) --- */}
      {/* Reduced padding to bring sections closer */}
      <section className="py-8 md:py-12 relative overflow-hidden border-y border-slate-800/50 bg-slate-900/20">
        <div className="max-w-6xl mx-auto px-4 text-center relative z-10">
          <Award className="w-10 h-10 text-amber-500 mx-auto mb-4 opacity-80" />
          <h2 className="text-2xl md:text-4xl font-bold mb-4 text-white">40+ Years of Excellence</h2>
          <p className="text-slate-400 text-sm md:text-lg max-w-2xl mx-auto mb-8 md:mb-10">
            Trusted by global leaders and honored for excellence in service.
          </p>

          <div className="flex flex-wrap justify-center gap-3 md:gap-4">
            {brandPartners.map((brand, i) => (
              /* INCREASED TEXT SIZE HERE: text-sm md:text-lg */
              <span key={i} className="px-4 py-2 text-sm md:text-lg font-semibold text-slate-300 border border-slate-800 rounded-full bg-slate-900/70 shadow-sm">
                {brand}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* --- Clients Section --- */}
      {/* Reduced padding to bring sections closer */}
      <section className="py-10 md:py-16 px-4 md:px-6 max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-8 md:mb-10">
            <h2 className="text-2xl md:text-4xl font-bold mb-3 flex items-center justify-center gap-2 text-white">
                <Briefcase className="text-blue-500 w-5 h-5 md:w-6 md:h-6" /> Our Clients
            </h2>
            <p className="text-slate-400 text-sm">Reliability at scale for industry leaders.</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:flex md:flex-wrap justify-center gap-2 md:gap-3">
          {clientList.map((client, i) => (
            <div key={i} className="flex items-center gap-2 px-3 py-2.5 bg-slate-900/60 rounded-lg border border-slate-800">
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 shrink-0" />
              <span className="text-slate-300 text-[11px] md:text-sm font-medium truncate">{client}</span>
            </div>
          ))}
        </div>
      </section>

      {/* --- Contact Section --- */}
      <section id="contact-section" className="pb-8 pt-6 px-4 max-w-7xl mx-auto">
        <div className="bg-gradient-to-br from-blue-900 to-slate-900 rounded-[1.5rem] md:rounded-[2rem] p-6 md:p-16 flex flex-col lg:flex-row justify-between items-center gap-10 relative overflow-hidden border border-blue-500/20">

          <div className="relative z-10 text-center lg:text-left">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Get In Touch</h2>
            <p className="text-blue-100/80 text-base md:text-lg mb-8 max-w-md">Ready to upgrade your lifestyle? Experience technology made easy.</p>
            <button onClick={() => navigate("/contact")} className="w-full sm:w-auto bg-white text-blue-900 px-8 py-3 rounded-xl font-bold active:bg-blue-50 shadow-lg transition-colors">
                Send us a Message
            </button>
          </div>

          <div className="space-y-3 w-full lg:w-auto relative z-10">
            {[
              { icon: MapPin, label: "Visit Us", val: "No. 44, Patwa Plaza, M.G. Road, Hosur" },
              { icon: Mail, label: "Email Us", val: "ptindsupplier@gmail.com" }
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-4 bg-slate-950/30 backdrop-blur-md p-4 rounded-xl border border-white/10">
                <div className="bg-blue-500/20 p-2 rounded-lg">
                   <item.icon className="w-5 h-5 text-blue-300" />
                </div>
                <div className="flex flex-col">
                   <span className="text-[10px] text-blue-300 font-bold tracking-wider uppercase">{item.label}</span>
                   <span className="text-white text-xs md:text-sm">{item.val}</span>
                </div>
              </div>
            ))}

            <div className="flex items-center gap-4 bg-slate-950/30 backdrop-blur-md p-4 rounded-xl border border-white/10">
              <div className="bg-blue-500/20 p-2 rounded-lg">
                <Phone className="w-5 h-5 text-blue-300" />
              </div>
              <div className="flex flex-col text-xs md:text-sm text-white">
                <span className="text-[10px] text-blue-300 font-bold tracking-wider uppercase mb-1">Call Us</span>
                <span>+91 96634 18188</span>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-8 text-slate-600 text-[10px] md:text-xs">
            © {new Date().getFullYear()} Prakash Traders. All rights reserved.
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
