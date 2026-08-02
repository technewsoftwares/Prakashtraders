import React from "react";

const Disclaimer = () => {
  return (
    <div className="bg-[#121212] min-h-screen text-white">
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-16">

        {/* Heading */}
        <h1 className="text-5xl font-bold text-emerald-400 mb-10">
          Disclaimer
        </h1>

        {/* Content */}
        <div className="space-y-8 text-lg leading-9 text-gray-300">

          <p>
            Welcome to <strong className="text-white">Prakash Traders</strong>.
            The information, images, specifications, pricing, and other content
            available on this website are provided solely for general
            informational purposes. Although we make every effort to ensure that
            all information is accurate and up to date, we do not guarantee the
            completeness, accuracy, reliability, or availability of any
            information displayed on this website.
          </p>

          <p>
            Product specifications, prices, offers, discounts, availability,
            warranty terms, and other details may change at any time without
            prior notice. We reserve the right to modify, update, or discontinue
            any product or service without any obligation to notify users in
            advance.
          </p>

          <p>
            Product photographs and images displayed on this website are for
            illustrative purposes only. Actual products may vary in colour,
            design, dimensions, packaging, features, or appearance due to
            manufacturer updates or production variations.
          </p>

          <p>
            While every effort is made to provide correct information, Prakash
            Traders shall not be responsible or liable for any direct,
            indirect, incidental, consequential, or special loss or damage
            arising from the use of, or reliance upon, the information
            available on this website.
          </p>

          <p>
            Customers are advised to verify product specifications,
            compatibility, pricing, warranty information, and availability
            before placing an order. If you require clarification regarding any
            product, our sales team will be happy to assist you.
          </p>

          <p>
            This website may include links to external or third-party websites
            for your convenience. Prakash Traders has no control over the
            content, policies, security, or practices of these external
            websites and assumes no responsibility for them. Visiting such
            websites is entirely at your own discretion and risk.
          </p>

          <p>
            Under no circumstances shall Prakash Traders be liable for any
            interruption of service, technical issues, website downtime, data
            loss, or any damages resulting from the use or inability to use
            this website.
          </p>

          <p>
            By accessing and using this website, you acknowledge that you have
            read, understood, and agreed to this Disclaimer and all other
            applicable website policies and terms.
          </p>

          <p>
            For the most accurate and current information regarding products,
            pricing, warranties, or ongoing offers, we encourage you to visit
            our showroom or contact our sales team directly before making a
            purchase.
          </p>

          <div className="pt-6 border-t border-gray-700">
            <p className="text-white font-semibold">
              Thank you for choosing Prakash Traders.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Disclaimer;