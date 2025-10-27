import React from "react";
import Title from "./Title";
import { assets, exclusiveOffers } from "../assets/assets";

const ExclusiveOffers = () => {
  return (
    <div className="flex flex-col items-center px-6 md:px-16 lg:px-24 bg-white py-20 w-full">
      <div className="flex flex-col md:flex-row items-start justify-between w-full">
        <div className="text-left">
          <h2 className="font-playfair text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Exclusive Offers
          </h2>
          <p className="text-gray-600 max-w-4xl text-base leading-relaxed">
            Take advantage of our limited-time offers and special packages to
            enhance your <br />
            stay and create unforgettable memories.
          </p>
        </div>
        <button className="group flex items-center gap-3 font-medium cursor-pointer max-md:mt-12">
          <span className="text-sm font-medium">View All Offers</span>
          <img
            src={assets.arrowIcon}
            alt="arrow-icon"
            className="w-4 h-4 group-hover:translate-x-1 transition-all"
          />
        </button>
      </div>

      {/* Offers Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
        {exclusiveOffers.map((item) => (
          <div
            key={item._id}
            className="group relative flex flex-col items-start justify-between gap-1 pt-12 md:pt-18 px-4 rounded-xl text-white bg-no-repeat bg-cover bg-center" style={{backgroundImage: `url(${item.image})`}}
          >
            <p className="px-3 py-1 absolute top-4 left-4 text-xs bg-white text-gray-800 font-medium rounded-full">{item.priceOff}% OFF</p>
            
            <div>
                <p className="text-2xl font-medium font-font-playfair">{item.title}</p>
                <p>{item.description}</p>
                <p className="text-xs text-white/70 mt-3">Expires {item.expiryDate}</p>
            </div>
            <button className="flex items-center gap-2 font-medium cursor-pointer mt-4 mb-5">
                View Offers
                <img className="invert group-hover:translate-x-1 transition-all"
                 src={assets.arrowIcon} alt="arrow-icon"/>
            </button>          
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExclusiveOffers;
