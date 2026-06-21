import React, { useEffect, useRef, useState } from "react";
import "./Hero.css";
import Navbar from "./Navbar";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
  const [scrolledDown, setScrolledDown] = useState(false);
  const middleTextRef = useRef(null);
  const imageRefs = useRef([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setScrolledDown(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!scrolledDown) return;

    const imgs = imageRefs.current;

    imgs.forEach((img) => {
      const x = parseFloat(img.dataset.x);
      const y = parseFloat(img.dataset.y);

      gsap.set(img, { opacity: 1, visibility: "visible" });

      gsap.to(img, {
        scrollTrigger: {
          trigger: ".section2",
          start: "top center",
          end: "bottom center",
          scrub: true,
        },
        x,
        y,
        ease: "power2.out",
      });
    });
  }, [scrolledDown]);

  return (
    <>
      <div className="hero">
        <Navbar />

        <div className="hero-content">
          <div className={`hero-left ${scrolledDown ? "fade-out-left" : ""}`}>
            <div className="hero-left-content">
              <p className="hero-subtitle">ONLY AT BURGER KING</p>
              <h1 className="hero-title">FLAME-GRILLED </h1>
              <p className="hero-description w-[500px] ml-[60px]">
                Real ingredients. Iconic flavor. Welcome to the home of the
                Whopper — where every bite is fit for a king.
              </p>
            </div>
          </div>

          <div
            className={`left-text ${
              scrolledDown ? "fade-in-left-text" : "hidden-left-text"
            }`}
          >
            <img src="./images/basil1.png" alt="" className="basil1" />
            <h2>Handcrafted Sesame Bun</h2>
            <h2>Juicy tomatoes</h2>
            <h2>Grill-Fired Patty</h2>
            <img src="./images/to.png" alt="" className="tomato1" />
          </div>

          <div
            className={`right-text ${
              scrolledDown ? "fade-in-right-text" : "hidden-right-text"
            }`}
          >
            <img src="./images/to.png" alt="" className="tomato1" />
            <h2>Oozy Cheddar Goodness</h2>
            <h2>Garden-Fresh Romaine</h2>
            <h2>Toasted Garlic Brioche </h2>
            <img src="./images/basil1.png" alt="" className="basil1" />
          </div>


          <div
            className={`hero-right absolute ${
              scrolledDown ? "fade-out-right" : ""
            }`}
          >
            <img
              src="./images/bun1.png"
              alt=""
              className="h-[80px] w-[200px] img1"
            />
            <img
              src="./images/let1.png"
              alt=""
              className="h-[60px] w-[200px] img2"
            />
            <img
              src="./images/cheese.png"
              alt=""
              className="h-[60px] w-[200px] img3"
            />
            <img
              src="./images/tomato.png"
              alt=""
              className="h-[60px] w-[200px] img4"
            />
            <img
              src="./images/meat.png"
              alt=""
              className="h-[60px] w-[200px] img5"
            />
            <img
              src="./images/let.png"
              alt=""
              className="h-[60px] w-[200px] img6"
            />
            <img
              src="./images/bunn2.png"
              alt=""
              className="h-[90px] w-[200px] img7"
            />
          </div>
        </div>

  
        <div
          ref={middleTextRef}
          className={`middle-text ${scrolledDown ? "slide-up" : ""}`}
        >
          {[
            { src: "./images/bun1.png", x: 500, y: 60 },
            { src: "./images/let.png", x: 500, y: -60 },
            { src: "./images/cheese.png", x: 500, y: -120 },
            { src: "./images/tomato.png", x: 500, y: -180 },
            { src: "./images/meat.png", x: 500, y: -260 },
            { src: "./images/let.png", x: 520, y: -310 },
            { src: "./images/bunn2.png", x: 500, y: -390 },
          ].map((item, i) => (
            <img
              key={i}
              ref={(el) => (imageRefs.current[i] = el)}
              src={item.src}
              alt=""
              data-x={item.x}
              data-y={item.y}
              style={{ opacity: 0, visibility: "hidden" }}
              className={`h-[150px] image${i + 1}`}
            />
          ))}
        </div>
      </div>

      <div className="section2 bg-[#4B1E1E]  h-[800px] flex items-center justify-center">
        <div className="section2-left w-[900px] text-white mr-[400px]">
          <div className="hero-left-content">
            <h1>WHEN YOU'RE HUNGRY FOR A KING.</h1>
            <p>
              Crafted with real ingredients and fired up with flavor — because
              great taste should never come with compromises. At Burger King,
              every bite is made to rule your cravings.
            </p>
            <div className="buttons">
              <button className="order-btn">Hungry?</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Hero;
