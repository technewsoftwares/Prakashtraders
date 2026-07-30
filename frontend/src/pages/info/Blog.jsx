import { useState } from "react";
import { FaChevronRight, FaCalendarAlt, FaUser, FaArrowRight, FaArrowLeft } from "react-icons/fa";

const Blog = () => {
  // State for active category selection
  const [activeCategory, setActiveCategory] = useState("All Categories");
  // State to track if a specific post is open
  const [selectedPost, setSelectedPost] = useState(null);

  // Updated categories based on the new blog content
  const categories = [
    "All Categories",
    "Home Appliances",
    "Televisions"
  ];

  // Updated mock data with your specific blog posts
  const blogPosts = [
    {
      id: 1,
      title: "LG vs Samsung Washing Machine – Which One Is Better in 2026? (Complete Buying Guide)",
      category: "Home Appliances",
      author: "Prakash Traders Expert",
      date: "Mar 10, 2026",
      excerpt: "If you're planning to buy a washing machine in 2026, one of the biggest confusions is choosing between LG and Samsung. Read our expert comparison.",
      imageUrl: "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&q=80&w=800", 
      fullContent: [
        "If you're planning to buy a washing machine in 2026, one of the biggest confusions is choosing between LG and Samsung. Both brands dominate the Indian appliance market. But which one is actually better for your home? With 40+ years of experience in selling appliances, here’s an expert comparison to help you decide.",
        "1️⃣ Technology Comparison: LG machines are known for durability and low vibration. They feature Inverter Direct Drive Motors, Steam Wash Technology, AI DD (AI Fabric Protection), and 6 Motion Control. On the other hand, Samsung focuses more on innovation and smart connectivity with features like the Digital Inverter Motor, EcoBubble Technology, AI Control, and Hygiene Steam.",
        "👉 Verdict: For durability – LG. For tech features – Samsung.",
        "2️⃣ Front Load vs Top Load Options: Both brands offer Fully Automatic Front Load, Fully Automatic Top Load, and Semi-Automatic (budget range) options. For better cleaning & water saving, Front Load is best. For budget & ease of use, Top Load works well.",
        "3️⃣ Energy Efficiency: Both brands offer 3-Star models and 5-Star energy-saving models. A 5-Star model saves more electricity long-term.",
        "4️⃣ Price Range in India (2026): Top Load machines range from ₹15,000 – ₹28,000, while Front Load machines range from ₹28,000 – ₹60,000. Prices vary depending on capacity & features.",
        "5️⃣ Which One Should You Buy? Buy LG if you want long-term durability, less noise & vibration, and a strong after-sales network. Buy Samsung if you love smart features, app connectivity, and modern UI & display panels.",
        "Where to Buy? If you're looking for the best washing machine in India or specifically in Hosur, Krishnagiri, Dharmapuri, Bangalore and nearby areas, visit Prakash Traders – trusted appliance experts for over 43+ years. We offer multi-brand comparisons under one roof + the best price guarantee."
      ],
      contentImage: "https://images.unsplash.com/photo-1582735689309-4ce3153c39fc?auto=format&fit=crop&q=80&w=800" 
    },
    {
      id: 2,
      title: "Front Load vs Top Load Washing Machine – Which Should You Buy in 2026?",
      category: "Home Appliances",
      author: "Prakash Traders Expert",
      date: "Mar 05, 2026",
      excerpt: "Buying a washing machine but confused between front load and top load? Discover the pros, cons, and which one fits your needs best.",
      imageUrl: "https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?auto=format&fit=crop&q=80&w=800",
      fullContent: [
        "Buying a washing machine but confused between front load and top load? You’re not alone. This is one of the most searched appliance questions in India.",
        "What is a Front Load Washing Machine? Front load machines open from the front and use tumble wash technology. The pros include better cleaning, using less water, high energy efficiency, and being ideal for large families. However, they come at a higher price point and have slightly longer wash times.",
        "What is a Top Load Washing Machine? These machines open from the top and use agitator or pulsator wash technology. The pros are that they are budget-friendly, offer faster wash cycles, and are very easy to use. The downside is that they use more water and offer slightly less fabric care compared to front loaders.",
        "Cost Comparison in India (2026): Front Load machines typically range between ₹28,000 – ₹60,000, whereas Top Load machines sit between ₹15,000 – ₹28,000.",
        "Electricity & Water Usage Comparison: Front Load machines use 40–50% less water and result in lower electricity bills. Top Load machines have higher water usage and slightly higher electricity consumption.",
        "Which One Is Best for You? Choose a Front Load if you want better fabric care, run daily loads, and care about long-term savings. Choose a Top Load if you’re on a budget, want simple operation, or wash clothes occasionally.",
        "For expert advice and live demos in Hosur & nearby cities, visit Prakash Traders."
      ],
      contentImage: null 
    },
    {
      id: 3,
      title: "LED vs QLED vs OLED TV – What’s the Real Difference?",
      category: "Televisions",
      author: "Prakash Traders Expert",
      date: "Feb 28, 2026",
      excerpt: "Planning to buy a new TV in 2026? Understand the difference between LED, QLED, and OLED to make the perfect choice for your home theater.",
      imageUrl: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&q=80&w=800",
      fullContent: [
        "Planning to buy a new TV in 2026? Then you must understand the difference between LED, QLED and OLED. Top brands like Samsung, LG, and Sony offer all three types.",
        "1️⃣ LED TV: This is the most affordable option. It provides good brightness and is highly suitable for regular cable & OTT viewing. It is the best choice for budget buyers.",
        "2️⃣ QLED TV: Developed mainly by Samsung, QLED TVs offer brighter colors and better contrast than standard LEDs. They are great for watching sports and perform exceptionally well in bright rooms. This falls into the mid-to-premium category.",
        "3️⃣ OLED TV: Manufactured mostly by LG & Sony, OLED technology delivers perfect blacks, a true cinematic experience, and the best viewing angles. This is the top-tier, premium segment for home entertainment.",
        "Price Comparison (India 2026): \n• LED: ₹15,000 – ₹50,000 \n• QLED: ₹45,000 – ₹1,20,000 \n• OLED: ₹90,000 – ₹2,50,000",
        "No matter your budget or room setup, seeing these screens in person helps immensely. Drop by Prakash Traders to experience the differences live."
      ],
      contentImage: "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?auto=format&fit=crop&q=80&w=800"
    }
  ];

  // Filter posts based on selected category
  const filteredPosts = activeCategory === "All Categories"
    ? blogPosts
    : blogPosts.filter(post => post.category === activeCategory);

  // Function to handle category change (also resets selected post)
  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    setSelectedPost(null);
  };

  return (
    <div className="min-h-screen bg-black text-white pt-[100px] pb-10 px-5">
      <div className="container mx-auto max-w-7xl">

        {/* PAGE HEADER */}
        {!selectedPost && (
          <>
            <h1 className="text-3xl md:text-4xl font-bold text-center mb-4">Tech & Appliance Blog</h1>
            <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
              Stay updated with the latest reviews, buying guides, and tech news for your home and lifestyle.
            </p>
          </>
        )}

        <div className="flex flex-col lg:flex-row gap-10">

          {/* SIDEBAR - CATEGORIES */}
          <div className="lg:w-1/4 w-full">
            <div className="bg-[#111] p-4 rounded-lg border border-gray-800 sticky top-24">
              <h3 className="text-lg font-bold mb-4 text-gray-300 px-3">Categories</h3>
              <ul className="flex flex-col gap-1">
                {categories.map((category) => (
                  <li key={category}>
                    <button
                      onClick={() => handleCategoryChange(category)}
                      className={`w-full flex justify-between items-center px-4 py-3 rounded transition-all duration-200 ${
                        activeCategory === category
                          ? "bg-[#34d399] text-black font-semibold shadow-md"
                          : "text-gray-300 hover:bg-gray-800 hover:text-white"
                      }`}
                    >
                      <span>{category}</span>
                      <FaChevronRight className={`text-xs ${activeCategory === category ? "text-black" : "text-gray-500"}`} />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* MAIN CONTENT AREA */}
          <div className="lg:w-3/4 w-full">

            {/* CONDITIONAL RENDER: Full Post OR List of Posts */}
            {selectedPost ? (

              /* --- FULL ARTICLE VIEW --- */
              <div className="bg-[#111] rounded-lg p-6 md:p-10 border border-gray-800">
                <button
                  onClick={() => setSelectedPost(null)}
                  className="flex items-center gap-2 text-emerald-400 font-semibold mb-8 hover:text-emerald-300 transition-colors"
                >
                  <FaArrowLeft /> Back to Articles
                </button>

                <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  {selectedPost.title}
                </h1>

                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 mb-8 border-b border-gray-800 pb-6">
                  <span className="flex items-center gap-2"><FaCalendarAlt className="text-emerald-400"/> {selectedPost.date}</span>
                  <span className="flex items-center gap-2"><FaUser className="text-emerald-400"/> By {selectedPost.author}</span>
                  <span className="bg-emerald-900/50 text-emerald-400 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                    {selectedPost.category}
                  </span>
                </div>

                {/* Main Header Image */}
                <img
                  src={selectedPost.imageUrl}
                  alt={selectedPost.title}
                  className="w-full h-[300px] md:h-[450px] object-cover rounded-xl mb-10 shadow-lg border border-gray-800"
                />

                {/* Article Content Paragraphs */}
                <div className="space-y-6 text-gray-300 text-lg leading-relaxed whitespace-pre-line">
                  {selectedPost.fullContent.map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>

                {/* Inline Content Image */}
                {selectedPost.contentImage && (
                  <div className="my-10">
                    <img
                      src={selectedPost.contentImage}
                      alt="Article related content"
                      className="w-full h-[300px] md:h-[400px] object-cover rounded-xl shadow-lg border border-gray-800"
                    />
                  </div>
                )}

                <div className="mt-12 pt-8 border-t border-gray-800 flex justify-end">
                  <button
                    onClick={() => setSelectedPost(null)}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-6 rounded transition-all"
                  >
                    Done Reading
                  </button>
                </div>
              </div>

            ) : (

              /* --- LIST OF ARTICLES VIEW --- */
              <>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-emerald-400">
                    {activeCategory} {activeCategory !== "All Categories" && "Articles"}
                  </h2>
                  <span className="text-sm text-gray-500">{filteredPosts.length} posts found</span>
                </div>

                {filteredPosts.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredPosts.map((post) => (
                      <article
                        key={post.id}
                        className="bg-[#111] rounded-lg overflow-hidden border border-gray-800 hover:border-emerald-500/50 transition-all duration-300 group flex flex-col cursor-pointer"
                        onClick={() => setSelectedPost(post)} 
                      >
                        {/* Blog Image Placeholder */}
                        <div className="h-48 overflow-hidden relative">
                          <img
                            src={post.imageUrl}
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-300"></div>
                        </div>

                        {/* Blog Content */}
                        <div className="p-6 flex flex-col flex-grow">
                          <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                            <span className="flex items-center gap-1"><FaCalendarAlt /> {post.date}</span>
                            <span className="flex items-center gap-1"><FaUser /> {post.author}</span>
                          </div>

                          <h3 className="text-xl font-bold mb-3 text-white group-hover:text-emerald-400 transition-colors">
                            {post.title}
                          </h3>

                          <p className="text-gray-400 text-sm mb-6 flex-grow">
                            {post.excerpt}
                          </p>

                          {/* Read Full Article Button */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation(); 
                              setSelectedPost(post);
                            }}
                            className="text-emerald-400 text-sm font-bold flex items-center gap-2 hover:text-emerald-300 transition-colors w-max mt-auto"
                          >
                            Read Full Article <FaArrowRight className="text-xs" />
                          </button>
                        </div>
                      </article>
                    ))}
                  </div>
                ) : (
                  <div className="bg-[#111] border border-gray-800 rounded-lg p-10 text-center">
                    <p className="text-gray-400">No articles found in {activeCategory} right now. Check back soon!</p>
                  </div>
                )}
              </>
            )}

          </div>

        </div>
      </div>
    </div>
  );
};

export default Blog;
