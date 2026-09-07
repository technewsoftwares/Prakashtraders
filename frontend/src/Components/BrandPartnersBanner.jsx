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

const BrandPartnersBanner = () => {
  const repeatedBrands = [...brands, ...brands];

  return (
    <section
      className="w-full bg-neutral-900 py-1 px-3 md:py-2 md:px-4 rounded-lg"
      aria-label="Brand partners"
    >
      <style>{`
        @keyframes brand-marquee {
          from {
            transform: translateX(0);
          }

          to {
            transform: translateX(-50%);
          }
        }

        .brand-marquee-track {
          display: flex;
          width: max-content;
          animation: brand-marquee 25s linear infinite;
          will-change: transform;
        }

        .brand-marquee-track:hover {
          animation-play-state: paused;
        }

        @media (prefers-reduced-motion: reduce) {
          .brand-marquee-track {
            animation: none;
            transform: translateX(0);
          }
        }
      `}</style>

      <div className="relative flex items-center h-12 md:h-20 overflow-hidden rounded-xl border-4 border-white bg-white">
        <div className="z-10 flex h-full items-center justify-center rounded-l-xl bg-black px-3 py-1 text-sm font-semibold text-white whitespace-nowrap md:px-6 md:py-6 md:text-base">
          BRAND PARTNERS
        </div>

        <div className="flex-1 overflow-hidden">
          <div className="brand-marquee-track">
            {repeatedBrands.map((logo, index) => (
              <img
                key={`${logo}-${index}`}
                src={logo}
                alt=""
                width="120"
                height="48"
                loading={index < brands.length ? "eager" : "lazy"}
                decoding="async"
                aria-hidden="true"
                className="mx-4 h-8 w-auto flex-shrink-0 object-contain md:mx-10 md:h-12"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BrandPartnersBanner;
