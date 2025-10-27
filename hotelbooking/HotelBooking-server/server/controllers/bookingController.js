import { supabase } from "../configs/db.js";

// Function to check availability of a room
const checkAvailability = async ({ checkInDate, checkOutDate, roomId }) => {
  try {
    const { data: bookings, error } = await supabase
      .from('bookings')
      .select('id')
      .eq('room_id', roomId)
      .lte('check_in_date', checkOutDate)
      .gte('check_out_date', checkInDate)
      .neq('status', 'CANCELLED');

    if (error) {
      console.error(error.message);
      return false;
    }

    const isAvailable = bookings.length === 0;
    return isAvailable;
  } catch (error) {
    console.error(error.message);
    return false;
  }
};

// API to check availability of room
// POST /api/bookings/check-availability
export const checkAvailabilityAPI = async (req, res) => {
  try {
    const { room, checkInDate, checkOutDate } = req.body;
    const isAvailable = await checkAvailability({
      checkInDate,
      checkOutDate,
      roomId: room,
    });

    res.json({ success: true, isAvailable });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// API to create a new booking
// POST /api/bookings/book
export const createBooking = async (req, res) => {
  try {
    const { room, checkInDate, checkOutDate, guests } = req.body;
    const userId = req.user.id;

    // Before Booking Check Availability
    const isAvailable = await checkAvailability({
      checkInDate,
      checkOutDate,
      roomId: room,
    });

    if (!isAvailable) {
      return res.json({ success: false, message: "Room not available" });
    }

    // Get room data with hotel info
    const { data: roomData, error: roomError } = await supabase
      .from('rooms')
      .select(`
        *,
        hotel:hotels (*)
      `)
      .eq('id', room)
      .single();

    if (roomError || !roomData) {
      return res.json({ success: false, message: "Room not found" });
    }

    let totalPrice = roomData.price_per_night;

    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const timeDiff = checkOut.getTime() - checkIn.getTime();
    const nights = Math.ceil(timeDiff / (1000 * 3600 * 24));

    totalPrice *= nights;

    const { error: bookingError } = await supabase
      .from('bookings')
      .insert({
        user_id: userId,
        room_id: room,
        hotel_id: roomData.hotel.id,
        check_in_date: checkInDate,
        check_out_date: checkOutDate,
        total_price: totalPrice,
        number_of_guests: guests,
        guests: guests, // Keep for backward compatibility
        status: 'PENDING',
        payment_method: 'Pay At Hotel',
        is_paid: false
      });

    if (bookingError) {
      return res.json({ success: false, message: bookingError.message });
    }

    res.json({ success: true, message: "Booking created successfully" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// API to get all bookings of a user
// GET /api/bookings/user
export const getUserBookings = async (req, res) => {
  try {
    const userId = req.user.id;
    const { data: bookings, error } = await supabase
      .from('bookings')
      .select(`
        *,
        room:rooms (*),
        hotel:hotels (*)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      return res.json({ success: false, message: "Failed to fetch bookings" });
    }

    res.json({ success: true, bookings });
  } catch (error) {
    res.json({ success: false, message: "Failed to fetch bookings" });
  }
};

export const getHotelBookings = async (req, res) => {
  try {
    const { data: hotel, error: hotelError } = await supabase
      .from('hotels')
      .select('id')
      .eq('owner_id', req.auth.userId)
      .single();

    if (hotelError || !hotel) {
      return res.json({ success: false, message: "No Hotel found" });
    }

    const { data: bookings, error: bookingsError } = await supabase
      .from('bookings')
      .select(`
        *,
        room:rooms (*),
        hotel:hotels (*),
        user:users (*)
      `)
      .eq('hotel_id', hotel.id)
      .order('created_at', { ascending: false });

    if (bookingsError) {
      return res.json({
        success: false,
        message: "Failed to fetch hotel bookings",
        error: bookingsError.message,
      });
    }

    const totalBookings = bookings.length;
    const totalRevenue = bookings.reduce(
      (acc, booking) => acc + booking.total_price,
      0
    );

    res.json({
      success: true,
      dashboardData: { totalBookings, totalRevenue, bookings },
    });
  } catch (error) {
    res.json({
      success: false,
      message: "Failed to fetch hotel bookings",
      error: error.message,
    });
  }
};
