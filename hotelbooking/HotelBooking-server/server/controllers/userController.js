import { supabase } from "../configs/db.js";

//Get /api/users
export const getUserData = async (req, res) => {
  try {
    const role = req.user.role;
    const recentSearchedCities = req.user.recent_searched_cities;

    res.json({ success: true, role, recentSearchedCities });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Create or update user from Clerk authentication
export const createOrUpdateUser = async (req, res) => {
  try {
    const { clerkUserId, email, username, imageUrl, isHotelOwner } = req.body;

    if (!clerkUserId || !email) {
      return res.json({ success: false, message: "Missing required fields" });
    }

    const { data, error } = await supabase
      .from('users')
      .upsert({
        id: clerkUserId,
        username: username || email.split('@')[0],
        email: email,
        image: imageUrl || '',
        role: isHotelOwner ? 'OWNER' : 'USER',
        recent_searched_cities: []
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating/updating user:', error);
      return res.json({ success: false, message: error.message });
    }

    res.json({ success: true, data });
  } catch (error) {
    console.error('Error in createOrUpdateUser:', error);
    res.json({ success: false, message: error.message });
  }
};

// Update user role
export const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    const userId = req.user.id;

    if (!['USER', 'OWNER'].includes(role)) {
      return res.json({ success: false, message: "Invalid role" });
    }

    const { data, error } = await supabase
      .from('users')
      .update({ role })
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      return res.json({ success: false, message: error.message });
    }

    res.json({ success: true, data });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Store user recent searched cities
export const storeRecentSearchedCities = async (req, res) => {
  try {
    const { recentSearchedCity } = req.body;
    const userId = req.user.id;

    // Get current user data
    const { data: user, error: fetchError } = await supabase
      .from('users')
      .select('recent_searched_cities')
      .eq('id', userId)
      .single();

    if (fetchError) {
      return res.json({ success: false, message: "User not found" });
    }

    let updatedCities = user.recent_searched_cities || [];

    if (updatedCities.length < 3) {
      updatedCities.push(recentSearchedCity);
    } else {
      updatedCities.shift();
      updatedCities.push(recentSearchedCity);
    }

    const { error: updateError } = await supabase
      .from('users')
      .update({ recent_searched_cities: updatedCities })
      .eq('id', userId);

    if (updateError) {
      return res.json({ success: false, message: updateError.message });
    }

    res.json({ success: true, message: "City added" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
