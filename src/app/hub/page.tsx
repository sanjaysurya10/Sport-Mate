"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import BackButton from "@/components/BackButton";

type User = {
  name: string;
  email: string;
  role: string;
};

const DASHBOARDS = [
  {
    label: "Player Dashboard",
    description: "Browse venues, join games, and manage your bookings.",
    icon: "⚽",
    href: "/dashboard",
    color: "#22c55e",
  },
  {
    label: "Owner Dashboard",
    description: "Manage your turfs, view bookings, and track revenue.",
    icon: "🏟️",
    href: "/owner/dashboard",
    color: "#f59e0b",
  },
  {
    label: "Admin Dashboard",
    description: "Full platform control — users, venues, and analytics.",
    icon: "🛡️",
    href: "/admin",
    color: "#4a6cf7",
  },
];

export default function HubPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    if (!stored || !token) {
      router.push("/login");
      return;
    }
    setUser(JSON.parse(stored));
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#28282B] flex flex-col items-center justify-center px-6 py-16">
      {/* Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full bg-[#4a6cf7]/8 blur-[140px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-3xl">
        {/* Header */}
        <div className="mb-6"><BackButton /></div>
        <div className="flex items-center justify-between mb-12">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#4a6cf7] mb-1">
              Sport Mate Hub
            </p>
            <h1 className="geo-sans glass-text-chrome text-4xl font-black pb-1">
              Welcome, {user.name}
            </h1>
            <p className="text-[#888] text-sm mt-1">{user.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="border border-red-500/40 text-red-400 hover:bg-red-500/10 rounded-full px-5 py-2 text-sm font-medium transition-colors"
          >
            Logout
          </button>
        </div>

        {/* Dashboard cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {DASHBOARDS.map((dash) => (
            <button
              key={dash.href}
              onClick={() => router.push(dash.href)}
              className="glass-box p-8 text-left hover:border-[#4a6cf7]/50 transition-all group hover:-translate-y-1 duration-200"
            >
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl mb-6"
                style={{ backgroundColor: `${dash.color}18`, border: `1px solid ${dash.color}30` }}
              >
                {dash.icon}
              </div>
              <h2 className="text-lg font-bold mb-2 group-hover:text-white transition-colors">
                {dash.label}
              </h2>
              <p className="text-[#888] text-sm leading-relaxed">{dash.description}</p>
              <div
                className="mt-6 text-xs font-bold uppercase tracking-widest flex items-center gap-1"
                style={{ color: dash.color }}
              >
                Open <span className="group-hover:translate-x-1 transition-transform inline-block">→</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
