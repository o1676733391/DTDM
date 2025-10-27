import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { assets, facilityIcons, roomCommonData } from "../assets/assets";
import StarRating from "../components/StarRating";
import { getRoomById, createBooking } from "../services/api";
import { useSupabaseUser } from "../utils/auth-clerk.jsx";

const RoomDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSupabaseUser();
  
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [guests, setGuests] = useState(1);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState(null);

  useEffect(() => {
    const fetchRoom = async () => {
      if (!id) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const result = await getRoomById(id);
        
        if (result.success) {
          setRoom(result.data);
        } else {
          setError(result.error);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRoom();
  }, [id]);

  // Calculate total price
  const calculateTotalPrice = () => {
    if (!checkInDate || !checkOutDate || !room) return 0;
    
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
    
    return nights > 0 ? nights * room.price_per_night : 0;
  };

  // Handle booking submission
  const handleBooking = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      alert('Please sign in to make a booking');
      return;
    }

    if (!checkInDate || !checkOutDate || guests < 1) {
      alert('Please fill in all booking details');
      return;
    }

    const totalPrice = calculateTotalPrice();
    if (totalPrice <= 0) {
      alert('Please select valid dates');
      return;
    }

    setBookingLoading(true);
    setBookingError(null);

    try {
      const bookingData = {
        userId: user.id,
        roomId: room.id,
        checkInDate,
        checkOutDate,
        totalPrice,
        numberOfGuests: guests,
        isPaid: false
      };

      const result = await createBooking(bookingData);
      
      if (result.success) {
        alert('Booking created successfully!');
        navigate('/my-bookings');
      } else {
        setBookingError(result.error || result.message);
      }
    } catch (err) {
      setBookingError(err.message);
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="py-28 md:py-35 px-4 md:px-16 lg:px-24 xl:px-32">
        <div className="flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading room details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-28 md:py-35 px-4 md:px-16 lg:px-24 xl:px-32">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error loading room: {error}</p>
          <button 
            onClick={() => navigate('/rooms')}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Back to Rooms
          </button>
        </div>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="py-28 md:py-35 px-4 md:px-16 lg:px-24 xl:px-32">
        <div className="text-center">
          <p className="text-gray-600">Room not found</p>
          <button 
            onClick={() => navigate('/rooms')}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Back to Rooms
          </button>
        </div>
      </div>
    );
  }

  const mainImage = room.images && room.images.length > 0 
    ? room.images[selectedImageIndex] 
    : assets.roomImg1;

  return (
    <div className="py-28 md:py-35 px-4 md:px-16 lg:px-24 xl:px-32">
      {/* Room Details */}
      <div className="flex items-center gap-4">
        <h1 className="text-3xl md:text-4xl font-playfair">
          {room.hotels?.name || 'Hotel Name'}{" "}
          <span className="font-inter text-sm">{room.room_type}</span>
        </h1>
        <span className="text-xs font-inter py-1.5 px-3 text-white bg-orange-500 rounded-full inline-block whitespace-nowrap">
          20% OFF
        </span>
      </div>
      {/* Room Rating */}
      <div className="flex items-center gap-1 mt-2">
        <StarRating />
        <p className="ml-2">200+ reviews</p>
      </div>
      {/* Location */}
      <div className="flex items-center gap-1 text-gray-500 mt-2">
        <img src={assets.locationIcon} alt="location-icon" />
        <span>{room.hotels?.address || 'Address'}</span>
      </div>
      {/* Room Images */}
      <div className="flex flex-col lg:flex-row mt-6 gap-6">
        <div className="lg:w-1/2 w-full">
          <img
            src={mainImage}
            alt="Room Image"
            className="w-full rounded-xl shadow-lg object-cover"
          />
        </div>
        <div className="grid grid-cols-2 gap-4 lg:w-1/2 w-full">
          {room?.images && room.images.length > 1 &&
            room.images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt="Room Image"
                onClick={() => setSelectedImageIndex(index)}
                className={`w-full rounded-xl shadow-md object-cover cursor-pointer 
          ${selectedImageIndex === index && "outline-3 outline-orange-500"}`}
              />
            ))}
        </div>
      </div>
      {/* Room Highlights */}
      <div className="flex flex-col md:flex-row md:justify-between mt-10">
        <div className="flex flex-col">
          <h1 className="text-3xl md:text-4xl font-playfair">
            Experience Luxury Like Never Before
          </h1>
          <div className="flex flex-wrap items-center mt-3 mb-6 gap-4">
            {(room.amenities || []).map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100"
              >
                <img src={facilityIcons[item] || assets.freeWifiIcon} alt={item} className="w-5 h-5" />
                <p className="text-xs">{item}</p>
              </div>
            ))}
          </div>
        </div>
        {/* Room Price */}
        <div className="flex flex-col items-end">
          <p className="text-2xl font-medium"> ${room.price_per_night} / night </p>
          {calculateTotalPrice() > 0 && (
            <p className="text-lg text-gray-600 mt-2">
              Total: ${calculateTotalPrice()} for {Math.ceil((new Date(checkOutDate) - new Date(checkInDate)) / (1000 * 60 * 60 * 24))} nights
            </p>
          )}
        </div>
      </div>
      {/* CheckIn CheckOut Form */}
      <form
        onSubmit={handleBooking}
        className="flex flex-col md:flex-row items-start md:items-center justify-between 
             bg-white shadow-[0px_0px_20px_rgba(0,0,0,0.15)] p-6 rounded-xl 
             mx-auto mt-16 max-w-6xl"
      >
        <div
          className="flex flex-col flex-wrap md:flex-row items-start md:items-center 
                  gap-4 md:gap-10 text-gray-500"
        >
          <div className="flex flex-col">
            <label htmlFor="checkInDate" className="font-medium">
              Check-In
            </label>
            <input
              type="date"
              id="checkInDate"
              value={checkInDate}
              onChange={(e) => setCheckInDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="w-full rounded border border-gray-300 px-3 py-2 mt-1.5 outline-none"
              required
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="checkOutDate" className="font-medium">
              Check-Out
            </label>
            <input
              type="date"
              id="checkOutDate"
              value={checkOutDate}
              onChange={(e) => setCheckOutDate(e.target.value)}
              min={checkInDate || new Date().toISOString().split('T')[0]}
              className="w-full rounded border border-gray-300 px-3 py-2 mt-1.5 outline-none"
              required
            />
          </div>

          <div className="w-px h-15 bg-gray-300/70 max-md:hidden"></div>

          <div className="flex flex-col">
            <label htmlFor="guests" className="font-medium">
              Guests
            </label>
            <input
              type="number"
              id="guests"
              value={guests}
              onChange={(e) => setGuests(parseInt(e.target.value) || 1)}
              min="1"
              max="10"
              className="max-w-20 rounded border border-gray-300 px-3 py-2 mt-1.5 outline-none"
              required
            />
          </div>
        </div>
        
        {bookingError && (
          <div className="text-red-600 text-sm mb-4">
            {bookingError}
          </div>
        )}
        
        <button
          type="submit"
          disabled={bookingLoading || !room.is_available}
          className={`${
            bookingLoading || !room.is_available
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-primary hover:bg-primary-dull active:scale-95'
          } transition-all text-white rounded-md max-md:w-full max-md:mt-6 md:px-25 py-3 md:py-4 text-base cursor-pointer`}
        >
          {bookingLoading ? 'Booking...' : !room.is_available ? 'Not Available' : 'Book Now'}
        </button>
      </form>

      {/* Common Specifications */}
      <div className="mt-25 space-y-4">
        {roomCommonData.map((spec, index) => (
          <div key={index} className="flex items-start gap-2">
            <img src={spec.icon} alt={`${spec.title}-icon`} className="w-6.5" />
            <div>
              <p className="text-base">{spec.title}</p>
              <p className="text-gray-500">{spec.description}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="max-w-3x1 border-y border-gray-300 my-15 py-10 text-gray-500">
        <p>
          Guests will be allocated on the ground floor according to
          availability. You get a comfortable Two bedroom apartment has a true
          city feeling. The price quoted is for two guest, at the guest slot
          please mark the number of guests to get the exact price for groups.
          The Guests will be allocated ground floor according to availability.
          You get the comfortable two bedroom apartment that has a true city
          feeling.
        </p>
      </div>

      {/* Hosted by */}
      <div className="flex flex-col items-start gap-4">
        {/* Hotel information */}
        <div className="flex gap-4">
          <div className="h-14 w-14 md:h-18 md:w-18 rounded-full bg-blue-100 flex items-center justify-center">
            <span className="text-xl font-bold text-blue-600">
              {room.hotels?.name?.charAt(0) || 'H'}
            </span>
          </div>
          <div>
            <p className="text-lg md:text-xl">Hosted by {room.hotels?.name || 'Hotel'}</p>
            <div className="flex items-center mt-1">
              <StarRating />
              <p className="ml-2">200+ reviews</p>
            </div>
            <p className="text-sm text-gray-600 mt-1">
              {room.hotels?.city}
            </p>
          </div>
        </div>
        <button
          className="px-6 py-2.5 mt-4 rounded text-white bg-primary 
               hover:bg-primary-dull transition-all cursor-pointer"
          onClick={() => alert('Contact feature coming soon!')}
        >
          Contact Hotel
        </button>
      </div>
    </div>
  );
};

export default RoomDetails;
