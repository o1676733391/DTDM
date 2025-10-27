import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

const connectDB = async () => {
  try {
    // Test the connection with a simple query
    const { data, error } = await supabase.from('users').select('count').limit(1);
    if (error && error.code !== 'PGRST116') { // PGRST116 is "relation does not exist" which is fine for initial setup
      throw error;
    }
    console.log("Database Connected via Supabase Client");
  } catch (error) {
    console.log("Database connection failed:", error.message);
    // Don't exit process, as tables might not exist yet
  }
};

export default connectDB;
export { supabase };
