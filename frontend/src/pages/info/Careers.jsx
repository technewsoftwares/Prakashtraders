import React, { useEffect } from 'react';

const Careers = () => {
  // Ensures the page starts at the top when opened from the footer
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const email = "Ptindsupplier@gmail.com";

  return (
    <div className="min-h-screen bg-black text-white pt-[80px] md:pt-[100px] pb-10 px-4 md:px-5">
      <div className="container mx-auto max-w-4xl bg-[#111] p-5 md:p-8 rounded-lg border border-gray-800">
        <h1 className="text-2xl md:text-3xl font-bold mb-2 text-emerald-400">Careers at Prakash Traders</h1>
        <p className="text-gray-400 mb-8 italic">Grow Your Career with a Name Trusted for Over Four Decades.</p>

        <div className="space-y-8 text-gray-300 leading-relaxed">
          <section>
            <p>
              At Prakash Traders, we believe our people are the foundation of our success. For over 40 years, we have built trust with our customers through quality products, honest service, and strong relationships. Now, we’re looking for passionate professionals who want to grow with us, lead from the front, and be part of a legacy that continues to evolve.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4 flex items-center">
              Why Work With Us?
            </h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>A trusted retail brand with 40+ years of legacy.</li>
              <li>Growth opportunities in a stable and expanding business.</li>
              <li>Leadership-driven, people-first work culture.</li>
              <li>Hands-on learning and real responsibility.</li>
              <li>Respect, transparency, and long-term career prospects.</li>
            </ul>
          </section>

          <h2 className="text-2xl md:text-3xl font-bold mb-2 text-emerald-400">Open Positions</h2>

          {/* Job Role 1 */}
          <section className="bg-[#1a1a1a] p-6 rounded-md border border-gray-800">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center">
              <span className="w-2 h-2 bg-emerald-400 rounded-full mr-3"></span>
              Store Manager
            </h2>
            <div className="space-y-4">
              <p><strong>Location:</strong> Hosur, Tamil Nadu</p>
              <p><strong>Experience:</strong> 3–7 years in retail operations (electronics/home appliances preferred)</p>
              
              <div>
                <h3 className="text-sm font-semibold text-emerald-400 uppercase tracking-wider mb-2">Role Overview:</h3>
                <p>The Store Manager will be responsible for overall showroom performance, team leadership, and delivering an exceptional customer experience while meeting sales and operational goals.</p>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-emerald-400 uppercase tracking-wider mb-2">Key Responsibilities:</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Manage day-to-day store operations and staff.</li>
                  <li>Drive sales performance and achieve targets.</li>
                  <li>Monitor inventory, displays, and store standards.</li>
                  <li>Train, motivate, and lead the sales team.</li>
                </ul>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-emerald-400 uppercase tracking-wider mb-2">Key Requirements:</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Proven leadership and retail management experience.</li>
                  <li>Strong customer-handling skills.</li>
                  <li>Ability to manage teams and operations effectively.</li>
                  <li>Fluency in Tamil is mandatory.</li>
                  <li>Basic knowledge of English/Hindi is an added advantage.</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Job Role 2 */}
          <section className="bg-[#1a1a1a] p-6 rounded-md border border-gray-800">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center">
              <span className="w-2 h-2 bg-emerald-400 rounded-full mr-3"></span>
              Sales Executive
            </h2>
            <div className="space-y-4">
              <p><strong>Location:</strong> Hosur, Tamil Nadu</p>
              <p><strong>Experience:</strong> 2–6 years in retail sales (electronics/home appliances preferred)</p>
              
              <div>
                <h3 className="text-sm font-semibold text-emerald-400 uppercase tracking-wider mb-2">Role Overview:</h3>
                <p>The Sales Executive will focus on driving sales growth, improving team performance, and building strong customer relationships.</p>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-emerald-400 uppercase tracking-wider mb-2">Key Responsibilities:</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Lead and support the sales team.</li>
                  <li>Achieve sales targets and improve conversions.</li>
                  <li>Build long-term customer relationships.</li>
                  <li>Ensure strong product knowledge across the team.</li>
                  <li>Support in-store promotions and offers.</li>
                </ul>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-emerald-400 uppercase tracking-wider mb-2">Requirements:</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Experience in retail sales and team handling.</li>
                  <li>Strong communication and negotiation skills.</li>
                  <li>Target-driven mindset.</li>
                  <li>Fluency in Tamil is mandatory.</li>
                  <li>Ability to interact confidently with walk-in customers.</li>
                </ul>
              </div>
            </div>
          </section>

          {/* How to Apply Section */}
          <section className="border-t border-gray-800 pt-8 mt-10">
            <h2 className="text-2xl font-bold text-white mb-4">Ready to Join Us?</h2>
            <p className="mb-6">
              If you’re looking for a long-term career with a trusted retail brand, we’d love to hear from you. 
              Please mention the job role you are applying for in the subject line of your email.
            </p>

            <div className="flex flex-col sm:flex-row items-start gap-4">
              <a
                href={`mailto:${email}?subject=Application for Job Role - Prakash Traders&body=Hello Prakash Traders Team, %0D%0A%0D%0AI am interested in applying for a position at your company. Please find my resume attached.`}
                className="inline-block bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg shadow-emerald-900/20"
              >
                Apply via Email
              </a>
              <span className="text-gray-500 text-sm mt-2 sm:mt-4">
                Recruiter: {email}
              </span>
            </div>
            
            <p className="mt-6 text-xs text-gray-500 uppercase tracking-widest">
              * Prakash Traders is an equal opportunity employer.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Careers;
