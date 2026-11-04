import { createClient } from "@supabase/supabase-js";
import fs from "fs";

// Load from .env.local
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !key) {
  console.log("Missing env vars. Please provide them.");
  process.exit(1);
}

const supabase = createClient(url, key);

async function run() {
  const token = "b2536a88-0e6d-4a83-9f4a-42e71f4cd06a";
  const { data, error } = await supabase
    .from("shared_links")
    .select("form_data")
    .eq("token", token)
    .single();
    
  if (error) {
    console.error("Error:", error);
  } else {
    fs.writeFileSync("db_payload.json", JSON.stringify(data.form_data, null, 2));
    console.log("Saved to db_payload.json");
  }
}

run();
