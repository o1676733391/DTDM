import { supabase } from "../configs/db.js";

export const registerHotel = async (req, res) => {
  try {
    const { name, address, contact, city } = req.body;
    const ownerId = req.user.id;

    // Check if User Already Registered a Hotel
    const { data: existingHotel, error: fetchError } = await supabase
      .from('hotels')
      .select('id')
      .eq('owner_id', ownerId)
      .single();

    if (existingHotel) {
      return res.json({ success: false, message: "Hotel Already Registered" });
    }

    // Create hotel
    const { error: hotelError } = await supabase
      .from('hotels')
      .insert({
        name,
        address,
        contact,
        city,
        owner_id: ownerId
      });

    if (hotelError) {
      return res.json({ success: false, message: hotelError.message });
    }

    // Update user role to HOTEL_OWNER
    const { error: userError } = await supabase
      .from('users')
      .update({ role: 'HOTEL_OWNER' })
      .eq('id', ownerId);

    if (userError) {
      return res.json({ success: false, message: userError.message });
    }

    res.json({ success: true, message: "Hotel registered successfully" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
