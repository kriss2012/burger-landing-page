import React from "react";
import "./Section1.css";
import Navbar from "./Navbar";
const Section1 = () => {
  return (
    <div className="">
      <Navbar />
      <div className="section1-content">
        <div className="left-text">
          <img src="./images/basil1.png" alt="" className="basil1" />
          <h2>Organic Seasme Seed Bun</h2>
          <h2>Juicy and wine ripened tomatoes</h2>
          <h2>Smoky Flame-Grilled Patty</h2>
          <img src="./images/to.png" alt="" className="tomato1" />
        </div>
        <div className="middle-text">
          <img
            src="./images/bun1.png"
            alt=""
            className="h-[80px] w-[200px] image1"
          />
          <img
            src="./images/let.png"
            alt=""
            className="h-[60px] w-[200px] image2"
          />
          <img
            src="./images/cheese.png"
            alt=""
            className="h-[60px] w-[200px] image3"
          />
          <img
            src="./images/tomato.png"
            alt=""
            className="h-[60px] w-[200px] image4"
          />
          <img
            src="./images/meat.png"
            alt=""
            className="h-[60px] w-[200px] image5"
          />
          <img
            src="./images/let.png"
            alt=""
            className="h-[60px] w-[200px] image6"
          />
          <img
            src="./images/bunn2.png"
            alt=""
            className="h-[90px] w-[200px] image7 "
          />
        </div>
        <div className="right-text">
          <img src="./images/to.png" alt="" className="tomato1" />

          <h2>Melted Cheddar Cheese Slice</h2>
          <h2>Fresh Crisp Romaine Lettuce</h2>
          <h2>Toasted Bottom Bun with Garlic </h2>

          <img src="./images/basil1.png" alt="" className="basil1" />
        </div>
      </div>
    </div>
  );
};

export default Section1;
