import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const connectSupabaseStorage = async () => {
  try {
    // Test connection
    const { data, error } = await supabase.storage.listBuckets();
    if (error) {
      console.log('Supabase Storage connection failed:', error.message);
    } else {
      console.log('Supabase Storage connected');
    }
  } catch (error) {
    console.log('Supabase Storage connection error:', error.message);
  }
};

export default connectSupabaseStorage;
export { supabase };
