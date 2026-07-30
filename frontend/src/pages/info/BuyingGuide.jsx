import { PiTelevisionBold, PiSnowflakeBold, PiDropBold } from "react-icons/pi";

const BuyingGuide = () => {
  return (
    <div className="min-h-screen bg-black text-white pt-[100px] pb-10 px-5">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold mb-6">Appliance Buying Guide</h1>
        <p className="text-gray-400 mb-10">Not sure what to buy? Here are some quick tips to help you choose the right appliance for your home.</p>

        {/* SECTION 1 */}
        <div className="mb-12 border-b border-gray-800 pb-8">
          <div className="flex items-center gap-3 mb-4">
            <PiSnowflakeBold className="w-8 h-8 text-emerald-400" />
            <h2 className="text-2xl font-bold">Air Conditioners</h2>
          </div>
          <ul className="list-disc pl-5 space-y-3 text-gray-300">
            <li><strong>Room Size:</strong> For rooms up to 120 sq.ft, choose 1 Ton. For 120-180 sq.ft, go for 1.5 Ton.</li>
            <li><strong>Inverter vs Non-Inverter:</strong> Inverter ACs save more power but are slightly more expensive upfront.</li>
            <li><strong>Star Rating:</strong> Higher star ratings (4 or 5) mean lower electricity bills.</li>
          </ul>
        </div>

        {/* SECTION 2 */}
        <div className="mb-12 border-b border-gray-800 pb-8">
          <div className="flex items-center gap-3 mb-4">
            <PiDropBold className="w-8 h-8 text-blue-400" />
            <h2 className="text-2xl font-bold">Washing Machines</h2>
          </div>
          <ul className="list-disc pl-5 space-y-3 text-gray-300">
            <li><strong>Front Load vs Top Load:</strong> Front loads use less water and give a better wash. Top loads are more convenient to load.</li>
            <li><strong>Capacity:</strong> 6-7kg is good for couples. 8kg+ is better for families of 4 or more.</li>
            <li><strong>RPM:</strong> Higher RPM means faster drying. Look for 1000 RPM or more.</li>
          </ul>
        </div>

        {/* SECTION 3 */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <PiTelevisionBold className="w-8 h-8 text-purple-400" />
            <h2 className="text-2xl font-bold">Televisions</h2>
          </div>
          <ul className="list-disc pl-5 space-y-3 text-gray-300">
            <li><strong>Resolution:</strong> 4K is standard now. Only buy HD Ready for screens smaller than 32 inches.</li>
            <li><strong>Smart Features:</strong> Look for Android TV or Google TV for best app support.</li>
            <li><strong>Sound:</strong> Thin TVs have weak sound. Consider buying a Soundbar for a better experience.</li>
          </ul>
        </div>

      </div>
    </div>
  );
};

export default BuyingGuide;