import React, { useState, useEffect } from "react";
import { assets } from "../../assets/assets";
import Title from "../../components/Title";
import { addRoom, uploadMultipleImages, getHotelsByOwner } from "../../services/api";
import { useSupabaseUser } from "../../utils/auth-clerk.jsx";

export const AddRoom = () => {
  const { user, isAuthenticated } = useSupabaseUser();
  
  const [images, setImages] = useState({
    1: null,
    2: null,
    3: null,
    4: null,
  });

  const [inputs, setInputs] = useState({
    hotelId: "",
    roomType: "",
    pricePerNight: 0,
    amenities: {
      "Free WiFi": false,
      "Free Breakfast": false,
      "Room Service": false,
      "Mountain View": false,
      "Pool Access": false,
    },
  });

  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch owner's hotels on component mount
  useEffect(() => {
    const fetchHotels = async () => {
      if (!isAuthenticated || !user) return;

      try {
        const result = await getHotelsByOwner(user.id);
        
        if (result.success) {
          setHotels(result.data);
          // Auto-select first hotel if only one exists
          if (result.data.length === 1) {
            setInputs(prev => ({ ...prev, hotelId: result.data[0].id }));
          }
        } else {
          setError('Failed to load hotels: ' + result.error);
        }
      } catch (err) {
        setError('Failed to load hotels: ' + err.message);
      }
    };

    fetchHotels();
  }, [user, isAuthenticated]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated || !user) {
      alert('Please sign in to add a room');
      return;
    }

    if (!inputs.hotelId) {
      alert('Please select a hotel');
      return;
    }

    if (!inputs.roomType || inputs.pricePerNight <= 0) {
      alert('Please fill in all required fields');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Upload images if any are selected
      let imageUrls = [];
      const imageFiles = Object.values(images).filter(img => img !== null);
      
      if (imageFiles.length > 0) {
        const uploadResult = await uploadMultipleImages(imageFiles, 'room-images');
        
        if (uploadResult.success) {
          imageUrls = uploadResult.data.map(item => item.url);
        } else {
          throw new Error('Failed to upload images: ' + uploadResult.error);
        }
      }

      // Get selected amenities
      const selectedAmenities = Object.keys(inputs.amenities).filter(
        amenity => inputs.amenities[amenity]
      );

      // Create room
      const roomData = {
        hotelId: inputs.hotelId,
        roomType: inputs.roomType,
        pricePerNight: parseFloat(inputs.pricePerNight),
        amenities: selectedAmenities,
        images: imageUrls
      };

      const result = await addRoom(roomData);
      
      if (result.success) {
        alert('Room added successfully!');
        // Reset form
        setImages({ 1: null, 2: null, 3: null, 4: null });
        setInputs({
          hotelId: hotels.length === 1 ? hotels[0].id : "",
          roomType: "",
          pricePerNight: 0,
          amenities: {
            "Free WiFi": false,
            "Free Breakfast": false,
            "Room Service": false,
            "Mountain View": false,
            "Pool Access": false,
          },
        });
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Please Sign In</h2>
        <p className="text-gray-600">You need to be signed in to add rooms.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <Title
        align="left"
        font="outfit"
        title="Add Room"
        subTitle="Fill in the details carefully and accurate room details, pricing, and amenities, to enhance the user booking experience."
      />

      {/* Upload Area For Images */}
      <p className="text-gray-800 mt-10">Images</p>
      <div className="grid grid-cols-2 sm:flex gap-4 my-2 flex-wrap">
        {Object.keys(images).map((key) => (
          <label htmlFor={`roomImage${key}`} key={key}>
            <img
              className="max-h-13 cursor-pointer opacity-80"
              src={
                images[key]
                  ? URL.createObjectURL(images[key])
                  : assets.uploadArea
              }
              alt=""
            />
            <input
              type="file"
              accept="image/*"
              id={`roomImage${key}`}
              hidden
              onChange={(e) =>
                setImages({ ...images, [key]: e.target.files[0] })
              }
            />
          </label>
        ))}
      </div>
      {/* Error display */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mt-4">
          {error}
        </div>
      )}

      <div className="w-full flex max-sm:flex-col sm:gap-4 mt-4">
        {/* Hotel Selection */}
        <div className="flex-1 max-w-48">
          <p className="text-gray-800 mt-4">Hotel *</p>
          <select
            value={inputs.hotelId}
            onChange={(e) => setInputs({ ...inputs, hotelId: e.target.value })}
            className="border opacity-70 border-gray-300 mt-1 rounded p-2 w-full"
            required
          >
            <option value="">Select Hotel</option>
            {hotels.map((hotel) => (
              <option key={hotel.id} value={hotel.id}>
                {hotel.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex-1 max-w-48">
          <p className="text-gray-800 mt-4">Room Type *</p>
          <select
            value={inputs.roomType}
            onChange={(e) => setInputs({ ...inputs, roomType: e.target.value })}
            className="border opacity-70 border-gray-300 mt-1 rounded p-2 w-full"
            required
          >
            <option value="">Select Room Type</option>
            <option value="Single Bed">Single Bed</option>
            <option value="Double Bed">Double Bed</option>
            <option value="Luxury Room">Luxury Room</option>
            <option value="Family Suite">Family Suite</option>
          </select>
        </div>
        <div>
          <p className="mt-4 text-gray-800">
            Price <span className="text-xs">/night *</span>
          </p>
          <input
            type="number"
            placeholder="0"
            min="1"
            className="border border-gray-300 mt-1 rounded p-2 w-24"
            value={inputs.pricePerNight}
            onChange={(e) =>
              setInputs({ ...inputs, pricePerNight: e.target.value })
            }
            required
          />
        </div>
      </div>
      <p className="text-gray-800 mt-4">Amenities</p>
      <div className="flex flex-col flex-wrap mt-1 text-gray-400 max-w-sm">
        {Object.keys(inputs.amenities).map((amenity, index) => (
          <div key={index}>
            <input
              type="checkbox"
              id={`amenities${index + 1}`}
              checked={inputs.amenities[amenity]}
              onChange={() =>
                setInputs({
                  ...inputs,
                  amenities: {
                    ...inputs.amenities,
                    [amenity]: !inputs.amenities[amenity],
                  },
                })
              }
            />
            <label htmlFor={`amenities${index + 1}`}>{amenity}</label>
          </div>
        ))}
      </div>
      <button 
        type="submit"
        disabled={loading}
        className={`${
          loading 
            ? 'bg-gray-400 cursor-not-allowed' 
            : 'bg-primary hover:bg-primary-dull'
        } text-white px-8 py-2 rounded mt-8 cursor-pointer transition-colors`}
      >
        {loading ? 'Adding Room...' : 'Add Room'}
      </button>
    </form>
  );
};
