import { useEffect } from "react";

const Terms = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white pt-[100px] pb-10 px-5">
      <div className="container mx-auto max-w-4xl bg-[#111] p-8 rounded-lg border border-gray-800">
        <h1 className="text-3xl font-bold mb-6 text-emerald-400">Terms of Use</h1>

        <div className="space-y-6 text-gray-300 leading-relaxed">
          <p>Welcome to the Prakash Traders website. By accessing or using our website, you agree to comply with and be bound by the following Terms of Use. Please read them carefully before using our site.</p>

          <section>
            <h2 className="text-xl font-bold text-white mb-2">1. Acceptance of Terms</h2>
            <p>By accessing, browsing, or using this website, you acknowledge that you have read, understood, and agree to be bound by these Terms of Use, along with our Privacy Policy and any other applicable policies.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-2">2. Use of the Website</h2>
            <p>You agree to use this website only for lawful purposes and in a manner that does not infringe the rights of, restrict, or inhibit the use of this site by any third party.</p>
            <p className="mt-2">You agree not to:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Copy, reproduce, distribute, or exploit any content from this website without prior written permission.</li>
              <li>Misuse the website, its content, or its contact details.</li>
              <li>Attempt to gain unauthorized access to any portion of the website.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-2">3. Product Information & Pricing</h2>
            <p>All product descriptions, images, specifications, and prices displayed on the website are for informational purposes only.</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Prices, availability, and offers are subject to change without prior notice.</li>
              <li>Product images are for representation purposes and may differ from actual products.</li>
              <li>Prakash Traders reserves the right to correct any errors or inaccuracies at any time.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-2">4. Intellectual Property</h2>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>All content on this website, including but not limited to text, images, logos, graphics, and design, is the property of Prakash Traders and is protected under applicable intellectual property laws.</li>
              <li>Unauthorized use of any content may result in legal action.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-2">5. Third-Party Links</h2>
            <p>This website may contain links to third-party websites for convenience or additional information. Prakash Traders does not endorse or take responsibility for the content, policies, or practices of any third-party websites.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-2">6. Limitation of Liability</h2>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Prakash Traders shall not be liable for any direct, indirect, incidental, or consequential damages arising out of the use or inability to use this website.</li>
              <li>The website is provided on an “as is” and “as available” basis without warranties of any kind.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-2">7. User Submissions</h2>
            <p>Any information submitted through forms, email, or contact details provided on the website must be accurate and lawful. Prakash Traders reserves the right to use such information for business communication purposes.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-2">8. Changes to Terms</h2>
            <p>Prakash Traders reserves the right to modify or update these Terms of Use at any time without prior notice. Continued use of the website after changes indicates acceptance of the updated terms.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-2">9. Governing Law</h2>
            <p>These Terms of Use shall be governed and interpreted in accordance with the laws of India. Any disputes shall be subject to the jurisdiction of the courts in India.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-2">10. Contact Information</h2>
            <p>If you have any questions regarding these Terms of Use, please contact us at:</p>
            <p className="mt-2">
              <strong>Prakash Traders</strong><br />
              Email: <span className="text-emerald-400">ptindsupplier@gmail.com</span>
            </p>
          </section>

        </div>
      </div>
    </div>
  );
};

export default Terms;
