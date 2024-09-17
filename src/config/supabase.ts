import { Database } from "@/types/database.types";
import { createClient } from "@supabase/supabase-js";

const supabaseProjectUrl = process.env.SUPABASE_PROJECT_URL
const supabasePublicAnonKey = process.env.SUPABASE_PUBLIC_ANON_KEY

const supabase = createClient<Database>(
  supabaseProjectUrl,
  supabasePublicAnonKey
)

export default supabase;