import React from "react";
import { Link } from "react-router-dom";
import Carousel from "react-multi-carousel";

import "react-multi-carousel/lib/styles.css";

import slider1 from "../assets/images/slider0.jpeg";
import slider2 from "../assets/images/slider1.jpeg";
import slider4 from "../assets/images/slider3.jpeg";
import slider5 from "../assets/images/slider4.jpeg";

const Slider = () => {
  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 1,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 1,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    },
  };

  const whatsappNumber = "919663418188";

  const slides = [
    {
      image: slider1,
      alt: "Mobile deals",
      link: "/products/all-products",
      external: false,
    },
    {
      image: slider2,
      alt: "Kitchen appliances",
      link: "/products/kitchen-appliances",
      external: false,
    },
    {
      image: slider4,
      alt: "Furniture",
      link: "/products/furnitures",
      external: false,
    },
    {
      image: slider5,
      alt: "Corporate gifting",
      link: `https://wa.me/${whatsappNumber}?text=Hi, I am interested in your Corporate gifting.`,
      external: true,
    },
  ];

  return (
    <div className="relative z-0 w-full overflow-hidden">
      <Carousel
        responsive={responsive}
        showDots={true}
        infinite={true}
        arrows={false}
        autoPlay={true}
        swipeable={true}
        draggable={true}
        autoPlaySpeed={3000}
        removeArrowOnDeviceType={["tablet", "mobile"]}
      >
        {slides.map((slide, index) => {
          const slideContent = (
            <div className="relative aspect-video w-full overflow-hidden">
              <img
                src={slide.image}
                alt={slide.alt}
                width="1920"
                height="1080"
                loading={index === 0 ? "eager" : "lazy"}
                fetchPriority={index === 0 ? "high" : "low"}
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover"
              />
            </div>
          );

          return slide.external ? (
            <a
              key={slide.alt}
              href={slide.link}
              target="_blank"
              rel="noopener noreferrer"
            >
              {slideContent}
            </a>
          ) : (
            <Link key={slide.alt} to={slide.link}>
              {slideContent}
            </Link>
          );
        })}
      </Carousel>
    </div>
  );
};

export default Slider;
