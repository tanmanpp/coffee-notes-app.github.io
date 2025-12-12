import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

// 安全檢查：若沒設定好就直接丟錯，避免 debug 半天
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase env: VITE_SUPABASE_URL 或 VITE_SUPABASE_ANON_KEY 沒設定好");
}

// ✅ 明確指定 auth.storage = window.localStorage
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: window.localStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});