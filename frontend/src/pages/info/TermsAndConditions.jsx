import { useEffect } from "react";

const TermsAndConditions = () => {
  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white pt-[100px] pb-10 px-5">
      <div className="container mx-auto max-w-4xl bg-[#111] p-8 rounded-lg border border-gray-800">
        <h1 className="text-3xl font-bold mb-6 text-emerald-400">Terms & Conditions</h1>

        <div className="space-y-8 text-gray-300 leading-relaxed">
          
          {/* 1. General Terms */}
          <section>
            <h2 className="text-xl font-bold text-white mb-3">1. General Terms</h2>
            <p className="mb-2">Welcome to Prakash Traders. By accessing or using our website, you agree to comply with and be bound by the following Terms & Conditions.</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>All products listed on the website are subject to availability.</li>
              <li>Prices are subject to change without prior notice.</li>
              <li>We reserve the right to cancel or refuse any order due to pricing errors, stock unavailability, or suspected fraudulent activity.</li>
              <li>Product images are for representation purposes only; actual products may vary slightly.</li>
              <li>Prakash Traders shall not be liable for any indirect, incidental, or consequential damages arising from the use of our products or website.</li>
              <li>By placing an order, you agree to provide accurate and complete information.</li>
            </ul>
          </section>

          {/* 2. Privacy Policy */}
          <section>
            <h2 className="text-xl font-bold text-white mb-3">2. Privacy Policy</h2>
            <p className="mb-2">At Prakash Traders, your privacy is important to us.</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>We collect personal information such as name, contact details, and delivery address solely for order processing and customer service.</li>
              <li>Payment details are processed securely through trusted third-party payment gateways. We do not store card or banking information.</li>
              <li>Customer data is not shared, sold, or rented to any third party except where required for order fulfillment or legal compliance.</li>
              <li>We use reasonable security measures to protect customer information.</li>
              <li>By using our website, you consent to the collection and use of information as outlined in this policy.</li>
            </ul>
          </section>

          {/* 3. Return & Refund Policy */}
          <section>
            <h2 className="text-xl font-bold text-white mb-3">3. Return & Refund Policy</h2>
            <p className="mb-2">At Prakash Traders, we strive to ensure that every product delivered meets the highest quality standards.</p>
            
            <div className="pl-2 space-y-4">
              <div>
                <strong className="text-emerald-400 block mb-1">Return Eligibility:</strong>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Returns are accepted within <strong>3 days</strong> from the date of delivery.</li>
                  <li>The product must be unused, in its original condition, with original packaging, accessories, and invoice.</li>
                  <li>Products showing signs of use, damage, or tampering will not be eligible.</li>
                  <li><strong>Personal hygiene products</strong> (trimmers, grooming devices, personal care appliances) are <strong>not eligible</strong> for return or replacement due to hygiene reasons, even if unopened.</li>
                </ul>
              </div>

              <div>
                <strong className="text-emerald-400 block mb-1">Inspection & Refunds:</strong>
                <ul className="list-disc pl-5 space-y-1">
                  <li>All returns are subject to a quality inspection. Refunds or replacements will be processed only after inspection approval.</li>
                  <li>Approved refunds will be processed to the <strong>original payment method</strong> within <strong>7–10 business days</strong>.</li>
                </ul>
              </div>

              <div>
                <strong className="text-emerald-400 block mb-1">Replacements & Non-Returnables:</strong>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Replacement is subject to stock availability. If unavailable, a refund will be issued post-inspection.</li>
                  <li>Non-returnable items include: Personal hygiene items, customized products, items returned after 3 days, and products damaged due to misuse.</li>
                </ul>
              </div>
            </div>
          </section>

          {/* 4. Cancellation Policy */}
          <section>
            <h2 className="text-xl font-bold text-white mb-3">4. Cancellation Policy</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Orders can be cancelled only <strong>before dispatch</strong>. Once shipped, it cannot be cancelled.</li>
              <li>Refunds for eligible cancellations will be processed within <strong>7–10 business days</strong> to the original payment method.</li>
              <li>Prakash Traders reserves the right to cancel any order due to unforeseen circumstances or operational issues.</li>
            </ul>
          </section>

          {/* 5. Shipping & Delivery Policy */}
          <section>
            <h2 className="text-xl font-bold text-white mb-3">5. Shipping & Delivery Policy</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Delivery timelines vary based on location, product type, and availability.</li>
              <li>Orders may be shipped from multiple warehouses, resulting in partial deliveries.</li>
              <li>Shipping delays due to logistics issues, weather conditions, or festivals are beyond our control.</li>
              <li>Any additional delivery charges (if applicable) will be communicated at the time of order confirmation.</li>
            </ul>
          </section>

          {/* 6. Warranty Policy */}
          <section>
            <h2 className="text-xl font-bold text-white mb-3">6. Warranty Policy</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>All electronics and appliances are covered under manufacturer warranty, unless stated otherwise.</li>
              <li>Warranty claims must be raised directly with the brand’s authorized service centers.</li>
              <li>Physical damage, mishandling, or unauthorized repairs are <strong>not covered</strong> under warranty.</li>
              <li>Warranty duration and terms vary by brand and product.</li>
            </ul>
          </section>

          {/* 7. Corporate / Bulk Order Policy */}
          <section>
            <h2 className="text-xl font-bold text-white mb-3">7. Corporate / Bulk Order Policy</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Corporate and bulk orders are subject to minimum order quantities.</li>
              <li>Customized or branded products are <strong>non-returnable and non-refundable</strong>.</li>
              <li>Delivery timelines for bulk orders may vary based on customization and quantity.</li>
              <li>Pricing and availability for corporate orders are subject to confirmation.</li>
            </ul>
          </section>

          {/* 8. Payment Policy */}
          <section>
            <h2 className="text-xl font-bold text-white mb-3">8. Payment Policy</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>We accept payments via secure online payment gateways.</li>
              <li>Available payment methods may include UPI, credit/debit cards, net banking, and other supported options.</li>
              <li>In case of payment failure, the order will not be confirmed. Any payment disputes must be reported immediately for resolution.</li>
            </ul>
          </section>

          {/* 9. Damage & Transit Policy */}
          <section>
            <h2 className="text-xl font-bold text-white mb-3">9. Damage & Transit Policy</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Customers are advised to inspect products at the time of delivery.</li>
              <li>Any transit damage must be reported within <strong>24 hours</strong> of delivery with proper evidence.</li>
              <li>Claims raised after this period may not be accepted.</li>
            </ul>
          </section>

        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;
