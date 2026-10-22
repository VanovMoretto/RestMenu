// src/lib/supabase.ts
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Defina VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY no arquivo .env.local"
  );
}

// Só a chave pública (publishable/anon) pode ficar no front.
// O que ela pode ler ou escrever é decidido pelo RLS no banco.
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
