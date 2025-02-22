import { createBrowserClient } from "@supabase/ssr";
import { supabaseAnonKey, supabaseUrl } from "./constants";

export const createClient = () =>
  createBrowserClient(supabaseUrl, supabaseAnonKey);
