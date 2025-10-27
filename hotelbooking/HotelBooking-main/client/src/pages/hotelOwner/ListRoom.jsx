import React, { useState, useEffect } from "react";
import Title from "../../components/Title";
import { getRoomsByHotel, getHotelsByOwner, updateRoomAvailability } from "../../services/api";
import { useSupabaseUser } from "../../utils/auth-clerk.jsx";

export const ListRoom = () => {
  const { user, isAuthenticated, isLoading: authLoading } = useSupabaseUser();
  const [rooms, setRooms] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [selectedHotel, setSelectedHotel] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toggleLoading, setToggleLoading] = useState({});

  // Fetch owner's hotels on component mount
  useEffect(() => {
    const fetchHotels = async () => {
      if (!isAuthenticated || !user) {
        setLoading(false);
        return;
      }

      try {
        const result = await getHotelsByOwner(user.id);
        
        if (result.success) {
          setHotels(result.data);
          // Auto-select first hotel if only one exists
          if (result.data.length === 1) {
            setSelectedHotel(result.data[0].id);
          }
        } else {
          setError('Failed to load hotels: ' + result.error);
        }
      } catch (err) {
        setError('Failed to load hotels: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) {
      fetchHotels();
    }
  }, [user, isAuthenticated, authLoading]);

  // Fetch rooms when hotel is selected
  useEffect(() => {
    const fetchRooms = async () => {
      if (!selectedHotel) {
        setRooms([]);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const result = await getRoomsByHotel(selectedHotel);
        
        if (result.success) {
          setRooms(result.data);
        } else {
          setError('Failed to load rooms: ' + result.error);
        }
      } catch (err) {
        setError('Failed to load rooms: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, [selectedHotel]);

  const handleAvailabilityToggle = async (roomId, currentStatus) => {
    setToggleLoading(prev => ({ ...prev, [roomId]: true }));
    
    try {
      const result = await updateRoomAvailability(roomId, !currentStatus);
      
      if (result.success) {
        // Update local state
        setRooms(prevRooms => 
          prevRooms.map(room => 
            room.id === roomId 
              ? { ...room, is_available: !currentStatus }
              : room
          )
        );
      } else {
        alert('Failed to update room availability: ' + result.error);
      }
    } catch (err) {
      alert('Failed to update room availability: ' + err.message);
    } finally {
      setToggleLoading(prev => ({ ...prev, [roomId]: false }));
    }
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Please Sign In</h2>
        <p className="text-gray-600">You need to be signed in to manage rooms.</p>
      </div>
    );
  }

  return (
    <div>
      <Title
        align="left"
        font="outfit"
        title="Room Listings"
        subTitle="View, edit, or manage all listed rooms. Keep the information up-to-date to provide the best experience for users."
      />
      {/* Hotel Selection */}
      {hotels.length > 1 && (
        <div className="mt-6 mb-4">
          <label className="block text-gray-700 text-sm font-medium mb-2">
            Select Hotel
          </label>
          <select
            value={selectedHotel}
            onChange={(e) => setSelectedHotel(e.target.value)}
            className="border border-gray-300 rounded p-2 w-64"
          >
            <option value="">Select a hotel</option>
            {hotels.map((hotel) => (
              <option key={hotel.id} value={hotel.id}>
                {hotel.name}
              </option>
            ))}
          </select>
        </div>
      )}

      <p className="text-gray-500 mt-8">
        {selectedHotel && hotels.length > 0 
          ? `Rooms for ${hotels.find(h => h.id === selectedHotel)?.name || 'Selected Hotel'}`
          : 'All Rooms'
        }
      </p>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mt-4">
          {error}
        </div>
      )}

      <div className="w-full max-w-3xl text-left border border-gray-300 rounded-lg max-h-80 overflow-y-scroll mt-3">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-3 px-4 text-gray-800 font-medium">Room Type</th>
              <th className="py-3 px-4 text-gray-800 font-medium max-sm:hidden">
                Amenities
              </th>
              <th className="py-3 px-4 text-gray-800 font-medium">
                Price / night
              </th>
              <th className="py-3 px-4 text-gray-800 font-medium text-center">
                Available
              </th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {loading ? (
              <tr>
                <td colSpan="4" className="py-8 text-center text-gray-500">
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-2"></div>
                    Loading rooms...
                  </div>
                </td>
              </tr>
            ) : rooms.length === 0 ? (
              <tr>
                <td colSpan="4" className="py-8 text-center text-gray-500">
                  {selectedHotel ? 'No rooms found for this hotel' : 'Select a hotel to view rooms'}
                </td>
              </tr>
            ) : (
              rooms.map((item, index) => (
                <tr key={item.id || index}>
                  <td className="py-3 px-4 text-gray-700 border-t border-gray-300">
                    {item.room_type}
                  </td>
                  <td className="py-3 px-4 text-gray-700 border-t border-gray-300 max-sm:hidden">
                    {item.amenities?.join(", ") || 'No amenities'}
                  </td>
                  <td className="py-3 px-4 text-gray-700 border-t border-gray-300">
                    ${item.price_per_night}
                  </td>
                  <td className="py-3 px-4 border-t border-gray-300 text-center">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={item.is_available}
                        onChange={() => handleAvailabilityToggle(item.id, item.is_available)}
                        disabled={toggleLoading[item.id]}
                      />
                      <div className={`w-12 h-7 rounded-full transition-colors duration-200 ${
                        item.is_available ? 'bg-blue-600' : 'bg-slate-300'
                      } ${toggleLoading[item.id] ? 'opacity-50' : ''}`}>
                        <span className={`block w-5 h-5 bg-white rounded-full transition-transform duration-200 ease-in-out ${
                          item.is_available ? 'translate-x-6 mt-1 ml-1' : 'translate-x-1 mt-1'
                        }`}></span>
                      </div>
                      {toggleLoading[item.id] && (
                        <div className="ml-2 animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                      )}
                    </label>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
