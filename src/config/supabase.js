import.meta.env
import { createClient } from '@supabase/supabase-js';

const supabaseUrl =  "https://dhffrmhgmchnjmfxyybg.supabase.co";
const supabaseAnonKey =  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRoZmZybWhnbWNobmptZnh5eWJnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY5MjQxMjksImV4cCI6MjA1MjUwMDEyOX0.mPCxDgurz54xTcdDcBmxGfniJJ7j6dojQz9jvtPiCpY";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
