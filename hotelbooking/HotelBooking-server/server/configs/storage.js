import { supabase } from './db.js';

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
