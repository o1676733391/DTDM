// Test file to debug Supabase connection
// Run this in your browser console on the deployed site

console.log('Testing Supabase connection...');

// Check if environment variables are loaded
console.log('VITE_SUPABASE_URL:', import.meta.env.VITE_SUPABASE_URL);
console.log('VITE_SUPABASE_ANON_KEY:', import.meta.env.VITE_SUPABASE_ANON_KEY ? 'Set' : 'Not set');

// Test Supabase client
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
} else {
  console.log('Environment variables found, testing connection...');
  
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  // Test a simple query
  supabase
    .from('rooms')
    .select('id, room_type')
    .limit(1)
    .then(({ data, error }) => {
      if (error) {
        console.error('Supabase connection error:', error);
      } else {
        console.log('Supabase connection successful:', data);
      }
    });
}
