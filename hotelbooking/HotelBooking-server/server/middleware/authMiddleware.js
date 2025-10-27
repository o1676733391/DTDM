import { supabase } from "../configs/db.js";

// Middleware to check if user is authenticated
export const protect = async (req, res, next) => {
  try {
    const { userId } = req.auth;

    if (!userId) {
      return res.json({ success: false, message: "not authenticated" });
    }

    // Try to get user from database, if not found, that's okay for some operations
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching user:', error);
      return res.json({ success: false, message: "Database error" });
    }

    // Set user data if found, otherwise just set the userId
    req.user = user || { id: userId };
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.json({ success: false, message: "Authentication error" });
  }
};
