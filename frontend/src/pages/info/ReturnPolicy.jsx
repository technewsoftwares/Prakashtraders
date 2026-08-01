const ReturnPolicy = () => {
  return (
    <div className="min-h-screen bg-black text-white pt-[100px] pb-10 px-5">
      <div className="container mx-auto max-w-4xl bg-[#111] p-8 rounded-lg border border-gray-800">
        <h1 className="text-3xl font-bold mb-6 text-emerald-400">Return & Refund Policy</h1>

        <div className="space-y-6 text-gray-300 leading-relaxed">
        <p>At Prakash Traders, we sincerely value every order placed with us and strive to provide a smooth and reliable shopping experience.</p>
        
        <p>Due to the nature of our business and operational limitations as a growing enterprise, we maintain a strict <strong>*no return and no exchange policy*</strong>. Once an order has been successfully placed, it cannot be cancelled, returned, or exchanged.</p>
        
        <p>We understand that this may feel restrictive; however, this policy has been implemented thoughtfully to ensure fairness and sustainability.  In the past, we have experienced instances where return policies were misused, making it challenging for us to continue offering flexible returns while maintaining product quality and pricing standards for all our customers.</p>

          <section>
            <h2 className="text-xl font-bold text-white mb-2"> Refund Policy</h2>
            <p>Refunds will be processed only under the following circumstances:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>If the ordered product is <strong>out of stock</strong>, or</li>
              <li>If the order has <strong>not been shipped</strong> from our end.</li>
            </ul>
          </section>
          
         <p>In such cases, the full amount paid will be refunded to the original mode of payment within a reasonable timeframe.</p>
        <p>We kindly request our customers to review product details carefully before placing an order. For any queries or clarifications, our team is always happy to assist you prior to purchase.</p>
        <p>Thank you for your understanding and continued support.</p>
          <section>
            <h2 className="text-xl font-bold text-white mb-2"> Contact Us</h2>
            <p>To initiate a return, please contact us at <span className="text-emerald-400">ptindsupplier@gmail.com</span> within 3 days of receiving the product, along with your order details and reason for return.</p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ReturnPolicy;
