import { createClient, SupabaseClient } from "@supabase/supabase-js";

/**
 * Checks whether a valid JWT format service_role key is available.
 * Supabase Storage strictly requires a Compact JWS (3 dot-separated base64 parts starting with eyJ...).
 * Opaque keys starting with 'sb_secret_' cannot be used with the Storage microservice.
 */
export function hasValidServiceRoleJwt(): boolean {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  return Boolean(key && key.startsWith("eyJ") && key.split(".").length === 3);
}

export function createAdminClient(): SupabaseClient | null {
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    "https://yrjulcwnabnhgtqebrtn.supabase.co";
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!serviceRoleKey || !hasValidServiceRoleJwt()) {
    return null;
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
