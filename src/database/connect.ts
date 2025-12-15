import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
console.log("URLL", process.env.NEXT_PUBLIC_SUPABASE_URL);
if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
        'Supabase credentials not found. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local'
    );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
