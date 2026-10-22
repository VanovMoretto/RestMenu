/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
  // "true" só em ambiente de testes: mostra o simulador de PIX/cartão
  readonly VITE_PAYMENT_SIMULATOR?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
