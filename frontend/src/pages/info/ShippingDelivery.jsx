import { useEffect } from "react";

const ShippingDelivery = () => {
  // Automatically scroll to the top of the page when the component loads
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white pt-[100px] pb-10 px-5">
      <div className="container mx-auto max-w-4xl bg-[#111] p-8 rounded-lg border border-gray-800">
        <h1 className="text-3xl font-bold mb-6 text-emerald-400">Shipping & Delivery Policy</h1>

        <div className="space-y-6 text-gray-300 leading-relaxed">
          <p>
            At Prakash Traders, we are committed to ensuring that your orders reach you in a timely and secure manner. 
            Please review our shipping guidelines below.
          </p>

          <section>
            <h2 className="text-xl font-bold text-white mb-2">1. Delivery Timelines</h2>
            <p>
              Delivery timelines may <strong>vary based on your location, the product type, and stock availability.</strong> 
              While we aim for the fastest possible delivery, certain remote areas may require additional transit time.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-2">2. Dispatch Information</h2>
            <p>
              All orders are processed and <strong>dispatched from our designated dispatch location</strong> to maintain 
              strict quality control and efficient handling of your products.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-2">3. Estimated Timelines & Delays</h2>
            <p>
              Shipping timelines provided at the time of purchase are <strong>estimated</strong> and may be affected by 
              factors beyond our control, including:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Logistics or courier partner issues</li>
              <li>Unfavorable weather conditions</li>
              <li>Public holidays or regional festivals</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-2">4. Shipping Charges</h2>
            <p>
              Any applicable shipping or delivery charges will be <strong>clearly communicated</strong> at the time of 
              order confirmation. We ensure transparency in all our shipping costs.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-2">5. Liability Limitation</h2>
            <p>
              Prakash Traders shall <strong>not be held responsible</strong> for delays caused by circumstances 
              beyond our control, such as carrier strikes, natural disasters, or government-imposed restrictions.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-2">6. Customer Support</h2>
            <p>
              For any queries regarding your shipment or to track your order, please contact our support team at: 
              <span className="text-emerald-400 ml-1 font-medium italic">ptindsupplier@gmail.com</span>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ShippingDelivery;
