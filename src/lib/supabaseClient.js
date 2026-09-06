// Supabase Client - using proper ES Module import
import { createClient } from '@supabase/supabase-js';

const defaultUrl = 'https://ayczqldyvautvddysfkm.supabase.co';
const defaultAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF5Y3pxbGR5dmF1dHZkZHlzZmttIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYxOTMxNjQsImV4cCI6MjEwMTc2OTE2NH0.TFTfdeqINGJHNFWo9VjUvn1WQW4V2VHA8rno30KrRfE';

const supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || defaultUrl).trim();
const supabaseAnonKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || defaultAnonKey).trim();

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

