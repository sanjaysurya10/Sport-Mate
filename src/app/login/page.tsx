"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigateAfterLogin = (role: string, email: string) => {
    if (email === "dragonfruit@test.com") {
      router.push("/hub");
    } else if (redirectTo) {
      router.push(redirectTo);
    } else if (role === "admin") {
      router.push("/admin");
    } else if (role === "owner") {
      router.push("/owner/dashboard");
    } else {
      router.push("/dashboard");
    }
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Login failed");
        setLoading(false);
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigateAfterLogin(data.user.role, data.user.email);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };


  const handleDemoLogin = async (role: "player" | "owner" | "admin") => {
    let demoEmail = "";
    const demoPassword = "123456";

    if (role === "player") {
      demoEmail = "dhanus@test.com";
    } else if (role === "owner") {
      demoEmail = "owner@test.com";
    } else {
      demoEmail = "sanjay@test.com";
    }

    setEmail(demoEmail);
    setPassword(demoPassword);
    setError("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: demoEmail, password: demoPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Demo login failed");
        setLoading(false);
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigateAfterLogin(data.user.role, data.user.email);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#28282B] relative flex items-center justify-center px-6 py-12">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-[#4a6cf7]/5 blur-[120px] pointer-events-none" />

      <div className="animate-enter card p-10 max-w-md w-full">
        <div className="text-center mb-8">
          <Link href="/">
            <img
              src="/logo.png"
              alt="Sport Mate Logo"
              className="w-16 h-16 mx-auto mb-6 rounded-full object-cover shadow-xl border border-white/10"
            />
          </Link>
          <h1 className="geo-sans glass-text-chrome text-3xl font-black pb-2">
            Welcome back
          </h1>
          <p className="text-gray-400 text-sm mt-2">
            Sign in to your SportMate account
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleLogin}>
          <div>
            <input
              type="email"
              placeholder="Email address"
              className="input-dark"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <input
              type="password"
              placeholder="Password"
              className="input-dark"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && (
            <p className="text-red-400 text-sm text-center">{error}</p>
          )}

          <button
            type="submit"
            className="btn-primary w-full mt-2"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Log in"}
          </button>
        </form>

        <div className="mt-8 border-t border-white/[0.06] pt-8">
          <p className="text-center text-xs font-bold uppercase tracking-[0.15em] text-[#4a6cf7] mb-4">
            Quick demo access
          </p>

          <div className="space-y-3">
            <button
              onClick={() => handleDemoLogin("player")}
              className="w-full border border-white/[0.08] text-white hover:bg-white/[0.04] rounded-full px-6 py-3"
              disabled={loading}
            >
              Continue as Player
            </button>

            <button
              onClick={() => handleDemoLogin("owner")}
              className="w-full border border-white/[0.08] text-white hover:bg-white/[0.04] rounded-full px-6 py-3"
              disabled={loading}
            >
              Continue as Owner
            </button>

            <button
              onClick={() => handleDemoLogin("admin")}
              className="w-full border border-white/[0.08] text-white hover:bg-white/[0.04] rounded-full px-6 py-3"
              disabled={loading}
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

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
