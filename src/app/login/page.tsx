"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/authContext";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();

  const handleDemoLogin = (role: "player" | "owner" | "admin") => {
    login(role);
    if (role === "admin") {
      router.push("/admin");
    } else if (role === "owner") {
      router.push("/owner/dashboard");
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-[#28282B] relative flex items-center justify-center px-6 py-12">
      {/* Ambient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px]
                      rounded-full bg-[#4a6cf7]/5 blur-[120px] pointer-events-none" />

      <div className="animate-enter card p-10 max-w-md w-full">
        <div className="text-center mb-8">
          <Link href="/">
            <img 
              src="/logo.png" 
              alt="Sport Mate Logo" 
              className="w-16 h-16 mx-auto mb-6 rounded-full object-cover shadow-xl border border-white/10 hover:opacity-80 transition-opacity"
            />
          </Link>
          <h1 className="geo-sans glass-text-chrome text-3xl font-black pb-2">Welcome back</h1>
          <p className="text-gray-400 text-sm mt-2">Sign in to your SportMate account</p>
        </div>

        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleDemoLogin("player"); }}>
          <div>
            <input
              type="email"
              placeholder="Email address"
              className="input-dark"
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Password"
              className="input-dark"
            />
          </div>

          <button
            type="submit"
            className="btn-primary w-full mt-2"
          >
            Log in
          </button>
        </form>

        <div className="mt-8 border-t border-white/[0.06] pt-8">
          <p className="text-center text-xs font-bold uppercase tracking-[0.15em] text-[#4a6cf7] mb-4">Demo access — no password needed</p>
          <div className="space-y-3">
            <button
              onClick={() => handleDemoLogin("player")}
              className="w-full border border-white/[0.08] text-white hover:bg-white/[0.04] rounded-full px-6 py-3 text-sm font-medium transition-colors"
            >
              Continue as Player
            </button>
            <button
              onClick={() => handleDemoLogin("owner")}
              className="w-full border border-white/[0.08] text-white hover:bg-white/[0.04] rounded-full px-6 py-3 text-sm font-medium transition-colors"
            >
              Continue as Owner
            </button>
            <button
              onClick={() => handleDemoLogin("admin")}
              className="w-full border border-white/[0.08] text-white hover:bg-white/[0.04] rounded-full px-6 py-3 text-sm font-medium transition-colors"
            >
              Continue as Admin
            </button>
          </div>
        </div>

        <p className="text-center text-sm text-gray-400 mt-8">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-[#4a6cf7] hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
