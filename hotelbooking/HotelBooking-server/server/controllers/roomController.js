import { supabase } from "../configs/db.js";
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';

//api to create, get, delete rooms

export const createRoom = async (req, res) => {
  try {
    const { roomType, pricePerNight, amenities } = req.body;
    
    // Find hotel owned by the authenticated user
    const { data: hotel, error: hotelError } = await supabase
      .from('hotels')
      .select('id')
      .eq('owner_id', req.auth.userId)
      .single();

    if (hotelError || !hotel) {
      return res.json({ success: false, message: "No Hotel found" });
    }

    // Upload images to Supabase Storage
    const uploadImages = req.files.map(async (file) => {
      const fileExt = file.originalname.split('.').pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = `room-images/${fileName}`;

      // Read file buffer
      const fileBuffer = fs.readFileSync(file.path);

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('hotel-images')
        .upload(filePath, fileBuffer, {
          contentType: file.mimetype,
          upsert: false
        });

      if (error) {
        throw new Error(`Upload failed: ${error.message}`);
      }

      // Get public URL
      const { data: publicData } = supabase.storage
        .from('hotel-images')
        .getPublicUrl(filePath);

      return publicData.publicUrl;
    });
    
    // Wait for all images to be uploaded
    const images = await Promise.all(uploadImages);

    const { error: roomError } = await supabase
      .from('rooms')
      .insert({
        hotel_id: hotel.id,
        room_type: roomType,
        price_per_night: parseFloat(pricePerNight),
        amenities: JSON.parse(amenities),
        images: images,
        is_available: true
      });

    if (roomError) {
      return res.json({ success: false, message: roomError.message });
    }

    res.json({ success: true, message: "Room created successfully" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const getRooms = async (req, res) => {
  try {
    const { data: rooms, error } = await supabase
      .from('rooms')
      .select(`
        *,
        hotel:hotels (
          *,
          owner:users!hotels_owner_id_fkey (
            image
          )
        )
      `)
      .eq('is_available', true)
      .order('created_at', { ascending: false });

    if (error) {
      return res.json({ success: false, message: error.message });
    }

    res.json({ success: true, rooms });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// API to get all rooms for a specific hotel
export const getOwnerRooms = async (req, res) => {
  try {
    const { data: hotel, error: hotelError } = await supabase
      .from('hotels')
      .select('id')
      .eq('owner_id', req.auth.userId)
      .single();

    if (hotelError || !hotel) {
      return res.json({ success: false, message: "No Hotel found" });
    }

    const { data: rooms, error: roomsError } = await supabase
      .from('rooms')
      .select(`
        *,
        hotel:hotels (*)
      `)
      .eq('hotel_id', hotel.id);

    if (roomsError) {
      return res.json({ success: false, message: roomsError.message });
    }

    res.json({ success: true, rooms });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// API to toggle availability of a room
export const toggleRoomAvailability = async (req, res) => {
  try {
    const { roomId } = req.body;
    
    const { data: room, error: fetchError } = await supabase
      .from('rooms')
      .select('is_available')
      .eq('id', roomId)
      .single();

    if (fetchError || !room) {
      return res.json({ success: false, message: "Room not found" });
    }

    const { error: updateError } = await supabase
      .from('rooms')
      .update({ is_available: !room.is_available })
      .eq('id', roomId);

    if (updateError) {
      return res.json({ success: false, message: updateError.message });
    }

    res.json({ success: true, message: "Room availability updated" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

