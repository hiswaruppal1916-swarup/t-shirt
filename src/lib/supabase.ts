import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://yoftyrwdeyywjejrihcc.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlvZnR5cndkZXl5d2planJpaGNjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI0MTg4OTMsImV4cCI6MjEwNzk5NDg5M30.Wv8JrFrhmHMyYQTECgstBn_CiYpODyiu3k-SYZAQZ50';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
