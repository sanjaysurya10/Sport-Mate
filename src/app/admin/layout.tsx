"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Users, CalendarCheck, BarChart3, LogOut, Menu, X } from "lucide-react";

type AuthUser = { name: string; email: string; role: string };

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    if (stored && token) {
      try {
        const parsed: AuthUser = JSON.parse(stored);
        if (parsed.role === "admin") {
          setUser(parsed);
          setChecking(false);
          return;
        }
      } catch { /* fall through */ }
    }
    setChecking(false);
  }, []);

  if (checking) return null;

  if (!user) {
    return (
      <div className="min-h-screen pt-32 px-6 text-center bg-[#28282B]">
        <h1 className="text-3xl font-bold mb-4">Admin Access Required</h1>
        <Link href="/login" className="text-[#4a6cf7] hover:underline">Go to Login</Link>
      </div>
    );
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  const navLinks = [
    { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/admin/users", icon: Users, label: "Users" },
    { href: "/admin/bookings", icon: CalendarCheck, label: "Bookings" },
    { href: "/admin/reports", icon: BarChart3, label: "Reports" },
  ];

  return (
    <div className="min-h-screen bg-[#28282B]">

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-[#141414] border-b border-white/[0.06] z-50 flex items-center justify-between px-6">
        <Link href="/">
          <svg width="60" height="30" viewBox="0 0 70 40" fill="none" className="text-white">
            <rect x="2" y="2" width="66" height="36" rx="4" stroke="currentColor" strokeWidth="2" fill="none"/>
            <text x="10" y="20" fill="currentColor" fontSize="10" fontWeight="bold" fontFamily="sans-serif">SPORT</text>
            <text x="10" y="32" fill="currentColor" fontSize="10" fontWeight="bold" fontFamily="sans-serif">MATE</text>
          </svg>
        </Link>
        <button onClick={() => setMobileMenuOpen(true)} className="text-white">
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed top-0 left-0 bottom-0 w-64 bg-[#141414] border-r border-white/[0.06] z-50 flex flex-col p-6 transition-transform duration-300 lg:translate-x-0 ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{ boxShadow: "1px 0 0 rgba(255,255,255,0.04)" }}
      >
        <div className="flex items-center justify-between mb-12 lg:mb-16">
          <Link href="/">
            <svg width="70" height="40" viewBox="0 0 70 40" fill="none" className="text-white hover:opacity-80 transition-opacity">
              <rect x="2" y="2" width="66" height="36" rx="4" stroke="currentColor" strokeWidth="2" fill="none"/>
              <text x="10" y="20" fill="currentColor" fontSize="10" fontWeight="bold" fontFamily="sans-serif">SPORT</text>
              <text x="10" y="32" fill="currentColor" fontSize="10" fontWeight="bold" fontFamily="sans-serif">MATE</text>
            </svg>
          </Link>
          <button onClick={() => setMobileMenuOpen(false)} className="lg:hidden text-gray-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 px-3">Main Menu</div>
        <nav className="flex-1 space-y-2">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 py-3 rounded-xl transition-colors font-medium ${
                  isActive
                    ? "bg-[#4a6cf7]/10 text-[#4a6cf7] border-l-2 border-[#4a6cf7] pl-5"
                    : "text-gray-500 hover:text-white hover:bg-white/[0.03] rounded-lg px-3"
                }`}
              >
                <Icon className="w-5 h-5" />
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto border-t border-white/[0.06] pt-6 flex flex-col gap-4">
          <div className="px-3 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-sm font-bold shadow-md">
              A
            </div>
            <div>
              <div className="text-sm font-bold">Admin User</div>
              <div className="text-xs text-green-500 inline-flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500" /> Online
              </div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-colors text-sm font-medium"
          >
            <LogOut className="w-5 h-5" />
            Log out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64 p-6 pt-24 lg:pt-8 min-h-screen relative">
        {/* Ambient glow */}
        <div className="absolute bottom-0 left-60 w-[300px] h-[300px] rounded-full
                        bg-[#4a6cf7]/5 blur-[100px] pointer-events-none" />
        {children}
      </main>

      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </div>
  );
}
