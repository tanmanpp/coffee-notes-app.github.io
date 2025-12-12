// src/screens/LoginScreen.tsx
import { useState } from "react";
import { supabase } from "../lib/supabase";

type LoginScreenProps = {
  onLogin: () => void;
};

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const handleSubmit = async () => {
    console.log("[Auth] submit clicked", { mode, email });

    if (!email || !password) {
      setMsg("請輸入 email 和密碼");
      return;
    }

    setLoading(true);
    setMsg(null);

    try {
      if (mode === "login") {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        console.log("[Auth] login result", { data, error });

        if (error) {
          setMsg(`登入失敗：${error.message}`);
          return;
        }

        setMsg("登入成功！");
        onLogin();
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });

        console.log("[Auth] signup result", { data, error });

        if (error) {
          setMsg(`註冊失敗：${error.message}`);
          return;
        }

        setMsg("註冊成功，如有開啟信箱驗證請去收信。");
      }
    } catch (err: any) {
      console.error("[Auth] unexpected error", err);
      setMsg(`發生錯誤：${err?.message ?? "未知錯誤"}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-amber-50">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-sm">
        <h1 className="text-xl font-semibold mb-4 text-center">
          {mode === "login" ? "登入咖啡紀錄帳號" : "註冊新帳號"}
        </h1>

        <label className="block text-sm mb-1 text-gray-700">Email</label>
        <input
          className="w-full p-2 border rounded mb-3"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label className="block text-sm mb-1 text-gray-700">密碼</label>
        <input
          type="password"
          className="w-full p-2 border rounded mb-4"
          placeholder="至少 6 碼密碼"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {msg && (
          <div className="mb-3 text-sm text-red-600 whitespace-pre-line">
            {msg}
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-amber-600 text-white p-2 rounded hover:bg-amber-700 disabled:opacity-60"
        >
          {loading
            ? "處理中..."
            : mode === "login"
            ? "登入"
            : "註冊"}
        </button>

        <button
          type="button"
          className="w-full text-blue-600 text-sm mt-4"
          onClick={() =>
            setMode((m) => (m === "login" ? "signup" : "login"))
          }
        >
          {mode === "login"
            ? "還沒有帳號？點此註冊"
            : "已經有帳號？點此登入"}
        </button>
      </div>
    </div>
  );
}
