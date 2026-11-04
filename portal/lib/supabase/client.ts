import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    "https://yrjulcwnabnhgtqebrtn.supabase.co";
  const supabaseAnonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    "sb_publishable_REBvv8NOv8KPkDHw3mVnnQ_rzM2165H";

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
