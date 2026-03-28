"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/authContext";
import { MOCK_BOOKINGS, SPORT_ICONS } from "@/lib/mockData";

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"upcoming" | "past" | "settings">("upcoming");
  const [bookings, setBookings] = useState(MOCK_BOOKINGS);
  const [toast, setToast] = useState({ show: false, message: "" });

  const [settings, setSettings] = useState({
    confirmations: true,
    reminders: true,
    newGames: false,
    news: true,
  });

  if (!user) {
    return (
      <div className="min-h-screen pt-32 px-6 max-w-7xl mx-auto text-center bg-[#28282B]">
        <h1 className="text-3xl font-bold mb-4">Please log in</h1>
        <p className="text-gray-400 mb-8">You need to be logged in to view your dashboard.</p>
        <Link href="/login" className="btn-primary">
          Go to Login
        </Link>
      </div>
    );
  }

  const upcomingBookings = bookings.filter(b => b.status === "confirmed" && b.id !== "b4" && b.id !== "b3");
  const pastBookings = bookings.filter(b => b.id === "b3" || b.status === "cancelled");

  const cancelBooking = (id: string) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status: "cancelled" } : b));
    setToast({ show: true, message: "Booking cancelled. Refund pending." });
    setTimeout(() => setToast({ show: false, message: "" }), 3000);
  };

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <div className="min-h-screen pt-24 pb-20 px-6 max-w-7xl mx-auto bg-[#28282B] relative">
      {/* Ambient glow */}
      <div className="absolute top-20 left-0 w-[400px] h-[400px] rounded-full
                      bg-[#22c55e]/5 blur-[120px] pointer-events-none" />

      {/* Toast */}
      {toast.show && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50
                        bg-[#141414] border border-[#22c55e]/40 text-[#22c55e]
                        px-6 py-4 rounded-2xl text-sm font-medium
                        flex items-center gap-3 backdrop-blur-md
                        shadow-[0_8px_32px_rgba(34,197,94,0.2)]
                        animate-enter">
          <span className="w-2 h-2 rounded-full bg-[#22c55e] glow-pulse" />
          {toast.message}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 pb-6 border-b border-white/[0.06]">
        <div>
          <h1 className="text-5xl md:text-6xl font-black tracking-tight leading-none mb-2">Welcome back, {user.name}</h1>
          <p className="text-gray-400">{user.city} • Regular Player</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-[#f97316]/10 border border-[#f97316]/30 text-[#f97316] rounded-full px-4 py-2 text-sm font-medium flex items-center gap-2">
            <span>🪙</span> {user.turfCoins || 0} Turf Coins
          </div>
          <button onClick={handleLogout} className="border border-red-500/50 text-red-500 hover:bg-red-500/10 rounded-full px-4 py-2 text-sm font-medium transition-colors">
            Log out
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide mb-8">
        {[
          { id: "upcoming", label: "Upcoming bookings" },
          { id: "past", label: "Past bookings" },
          { id: "settings", label: "Notification settings" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`shrink-0 rounded-full px-5 py-2.5 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? "bg-[#4a6cf7] text-white"
                : "bg-[#141414] border border-white/[0.06] text-gray-400 hover:text-white"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="max-w-4xl">

        {/* UPCOMING BOOKINGS */}
        {activeTab === "upcoming" && (
          <div className="animate-enter space-y-4">
            {upcomingBookings.length === 0 ? (
              <div className="text-center py-16 bg-[#141414] border border-white/[0.06] rounded-3xl"
                   style={{ boxShadow: "inset 1px 1px 0 rgba(255,255,255,0.05)" }}>
                <div className="text-5xl mb-4 opacity-50">📅</div>
                <h3 className="text-xl font-bold mb-2">No upcoming games</h3>
                <p className="text-gray-400 mb-6">You don&apos;t have any upcoming bookings.</p>
                <Link href="/venues" className="text-[#4a6cf7] hover:underline font-medium">Browse venues →</Link>
              </div>
            ) : (
              upcomingBookings.map((booking) => (
                <div key={booking.id} className="bg-[#141414] border border-white/[0.06] rounded-3xl p-6 flex flex-col sm:flex-row gap-6 justify-between items-center feature-card"
                     style={{ boxShadow: "inset 1px 1px 0 rgba(255,255,255,0.05)" }}>
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    <div className="w-14 h-14 rounded-full bg-[#4a6cf7]/10 flex justify-center items-center text-3xl shrink-0">
                      {SPORT_ICONS[booking.sport] || "🏅"}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg leading-tight mb-1">{booking.venueName}</h3>
                      <div className="flex gap-2 items-center">
                        <span className="text-[#4a6cf7] text-sm font-medium">{booking.sport}</span>
                        <span className="text-gray-400 text-sm">• {booking.displayDate}, {booking.displayTime}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end border-t border-white/[0.06] pt-4 sm:pt-0 sm:border-0 pl-14 sm:pl-0">
                    <span className="badge-confirmed font-bold uppercase tracking-wider text-xs">Confirmed</span>
                    <button
                      onClick={() => cancelBooking(booking.id)}
                      className="border border-red-500/50 text-red-500 hover:bg-red-500/10 rounded-full px-4 py-2 text-sm font-medium transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* PAST BOOKINGS */}
        {activeTab === "past" && (
          <div className="animate-enter space-y-4">
            {pastBookings.length === 0 ? (
              <p className="text-gray-400">No past bookings found.</p>
            ) : (
              pastBookings.map((booking) => (
                <div key={booking.id} className="bg-[#141414] border border-white/[0.06] rounded-3xl p-6 flex flex-col sm:flex-row gap-6 justify-between items-center opacity-80"
                     style={{ boxShadow: "inset 1px 1px 0 rgba(255,255,255,0.05)" }}>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-white/[0.05] flex justify-center items-center text-2xl shrink-0">
                      {SPORT_ICONS[booking.sport] || "🏅"}
                    </div>
                    <div>
                      <h3 className="font-bold leading-tight mb-1 text-gray-300">{booking.venueName}</h3>
                      <div className="flex gap-2 items-center">
                        <span className="text-gray-400 text-sm">{booking.sport}</span>
                        <span className="text-gray-500 text-sm">• {booking.displayDate}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    {booking.status === "cancelled" ? (
                      <span className="badge-cancelled font-bold uppercase tracking-wider text-xs">Cancelled</span>
                    ) : (
                      <span className="badge-blocked font-bold uppercase tracking-wider text-xs">Completed</span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* SETTINGS */}
        {activeTab === "settings" && (
          <div className="animate-enter bg-[#141414] border border-white/[0.06] rounded-3xl overflow-hidden"
               style={{ boxShadow: "inset 1px 1px 0 rgba(255,255,255,0.05)" }}>
            <div className="p-6 border-b border-white/[0.06]">
              <h3 className="text-lg font-bold">Email Preferences</h3>
              <p className="text-gray-400 text-sm">Control what emails you receive from SportMate.</p>
            </div>

            <div className="divide-y divide-white/[0.06]">
              {[
                { id: "confirmations", label: "Booking confirmations", desc: "Get an email when your booking is confirmed." },
                { id: "reminders", label: "Booking reminders (24h before)", desc: "We'll remind you the day before your game." },
                { id: "newGames", label: "New games near me", desc: "Alerts when open games are posted in your city." },
                { id: "news", label: "Sport Mate news & offers", desc: "Updates, promotions, and Turf Coin rewards." },
              ].map((item) => (
                <div key={item.id} className="p-6 flex justify-between items-center">
                  <div>
                    <h4 className="font-bold text-gray-200">{item.label}</h4>
                    <p className="text-xs text-gray-500 mt-1">{item.desc}</p>
                  </div>

                  <div
                    onClick={() => toggleSetting(item.id as any)}
                    className={`w-12 h-6 rounded-full cursor-pointer transition-colors relative flex items-center shrink-0 ${
                      settings[item.id as keyof typeof settings] ? "bg-[#4a6cf7]" : "bg-white/[0.08]"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-200 ${
                        settings[item.id as keyof typeof settings] ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
