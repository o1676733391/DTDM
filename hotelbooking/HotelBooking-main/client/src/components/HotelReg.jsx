import React from "react";
import { assets, cities } from "../assets/assets";

const HotelReg = () => {
  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/70">
      <form className="flex bg-white rounded-xl max-w-4xl mx-2">
        <img
          src={assets.regImage}
          alt="reg-image"
          className="hidden md:block w-1/2 rounded-xl"
        />
        <div className="relative flex flex-col items-center w-full md:w-1/2 p-8 md:p-10">
          <img
            src={assets.closeIcon}
            alt="close-icon"
            className="absolute top-4 right-4 h-4 w-4 cursor-pointer"
          />
          <p className="text-2xl font-semibold mt-6">Register Your Hotel</p>
          {/* Hotel Name */}
          <div className="w-full mt-4">
            <label htmlFor="name" className="block text-gray-500 font-medium">
              Hotel Name
            </label>
            <input
              id="name"
              type="text"
              placeholder="Type here"
              required
              className="w-full mt-1 px-3 py-2.5 border border-gray-200 rounded outline-indigo-500 font-light"
            />
          </div>
          {/* Phone Number */}
          <div className="w-full mt-4">
            <label
              htmlFor="contact"
              className="block text-gray-500 font-medium"
            >
              Phone
            </label>
            <input
              id="contact"
              type="text"
              placeholder="Type here"
              required
              className="w-full mt-1 px-3 py-2.5 border border-gray-200 rounded outline-indigo-500 font-light"
            />
          </div>
          {/* Address */}
          <div className="w-full mt-4">
            <label
              htmlFor="address"
              className="block text-gray-500 font-medium"
            >
              Address
            </label>
            <input
              id="address"
              type="text"
              placeholder="Type here"
              required
              className="w-full mt-1 px-3 py-2.5 border border-gray-200 rounded outline-indigo-500 font-light"
            />
          </div>
          {/* Select City Dropdown */}
          <div className="w-full mt-4 max-w-60 mx-auto">
            <label htmlFor="city" className="block text-gray-500 font-medium">
              City
            </label>

            <select
              id="city"
              required
              className="w-full mt-1 px-3 py-2.5 border border-gray-200 rounded outline-indigo-500 font-light"
            >
              <option value="">Select City</option>
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          {/* Submit button */}
          <button
            className="mt-6 px-6 py-2 mx-auto text-white bg-indigo-500 hover:bg-indigo-600 
             rounded cursor-pointer transition-all"
          >
            Register
          </button>
        </div>
      </form>
    </div>
  );
};
export default HotelReg;
