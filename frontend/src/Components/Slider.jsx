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

  return (
    <div className="relative overflow-hidden z-1">
      <Carousel
        responsive={responsive}
        showDots={true}
        infinite={true}
        arrows={false}
        autoPlay={true}
        swipeable={true}
        draggable={true}
        autoPlaySpeed={3000}
      >

        {/* SLIDE 1 */}
        <Link to="/products/all-products">
          <img
            src={slider1}
            alt="slider0"
            className="w-full h-auto object-cover block"
          />
        </Link>

        {/* SLIDE 2 */}
        <Link to="/products/kitchen-appliances">
          <img
            src={slider2}
            alt="slider1"
            className="w-full h-auto object-cover block"
          />
        </Link>

        {/* SLIDE 3 */}
        <Link to="/products/furnitures">
          <img
            src={slider4}
            alt="slider3"
            className="w-full h-auto object-cover block"
          />
        </Link>

        {/* WhatsApp */}
        <a
          href={`https://wa.me/${whatsappNumber}?text=Hi, I am interested in your Corporate gifting.`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src={slider5}
            alt="slider4"
            className="w-full h-auto object-cover block"
          />
        </a>

      </Carousel>
    </div>
  );
};

export default Slider;
