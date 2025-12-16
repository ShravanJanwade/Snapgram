
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
export const storageBucket = import.meta.env.VITE_SUPABASE_STORAGE_BUCKET || 'media';

if (!supabaseUrl || !supabaseKey) {
  console.warn('Supabase credentials missing in environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseKey);
