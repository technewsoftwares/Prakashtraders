import { useEffect } from "react";


const GoogleReviews = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://elfsightcdn.com/platform.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">

        <h2 className="text-4xl font-bold text-center mb-10">
          What Our Customers Say
        </h2>

        <div
          className="elfsight-app-5fb4cbd2-9173-4c11-aa2b-71eb9e22c56a"
          data-elfsight-app-lazy
        ></div>

      </div>
    </section>
  );
};

export default GoogleReviews;