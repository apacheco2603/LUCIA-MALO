import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://fkxemmvrokhrlhlbjana.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_dXixKQ5Xoz-wbAXmRGGg2g_e53fZevF";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: { persistSession: false },
});
