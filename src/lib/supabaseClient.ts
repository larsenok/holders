import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://pzjtakgixcvcrkkixzsw.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB6anRha2dpeGN2Y3Jra2l4enN3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE5MTc1MTAsImV4cCI6MjA2NzQ5MzUxMH0.hjTdWoHeczjoeYxDqERRLj4-JnkpSBIUXB0w1JPmCEA';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
