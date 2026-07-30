const BrandPartnersBanner = () => {
  const brands = [
    "/brands/samsung.png",
    "/brands/ifb.png",
    "/brands/lg.png",
    "/brands/preethi.png",
    "/brands/butterfly.png",
    "/brands/sony.png",
    "/brands/pigeon.png",
    "/brands/prestige.png",
    "/brands/bosch.png",
    "/brands/v-guard.png",
    "/brands/philips.png",
    "/brands/usha.png",
    "/brands/zebronics.png",
    "/brands/daikin.png",
    "/brands/haier.png",
    "/brands/vivo.png",
  ];

  return (
    <div className="w-full bg-neutral-900 py-1 px-3 md:py-2 md:px-4 rounded-lg">

      {/*  Animation CSS */}
      <style>
        {`
          @keyframes marquee {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(-50%);
            }
          }

          .marquee-track {
            display: flex;
            width: max-content;
            animation: marquee 25s linear infinite;
          }
        `}
      </style>

      {/*  Banner Wrapper */}
      <div className="relative bg-white border-4 border-white-200 rounded-xl overflow-hidden flex items-center h-12 md:h-20">

        {/* Fixed Text (OUTSIDE animation) */}
        <div className="bg-black text-white px-3 py-1 md:px-6 md:py-6 font-semibold whitespace-nowrap z-10 h-full flex items-center justify-center rounded-l-xl text-sm md:text-base">
          BRAND PARTNERS
        </div>

        {/* ➡ Marquee Area */}
        <div className="overflow-hidden flex-1">
          <div className="marquee-track">

            {/*  DUPLICATE ONCE – KEY PART */}
            {[...brands, ...brands].map((logo, index) => (
              <img
                key={index}
                src={logo}
                alt="Brand Partner"
                className="h-8 md:h-12 w-auto mx-4 md:mx-10 object-contain flex-shrink-0"
              />
            ))}

          </div>
        </div>

      </div>
    </div>
  );
};

export default BrandPartnersBanner;
