
// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Note: This project primarily uses local post-quantum cryptography implementations
// (SPHINCS+ and Kyber) rather than relying on Supabase as the backend
// See src/services/cryptography/ for the real implementations

const SUPABASE_URL = "https://crzilfcxqvwtlhnlovkc.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNyemlsZmN4cXZ3dGxobmxvdmtjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ1NTA0NTEsImV4cCI6MjA2MDEyNjQ1MX0.h9A1P9qel_GN_mKcq3h49703j5mrnJsANYegvWSPdPY";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
