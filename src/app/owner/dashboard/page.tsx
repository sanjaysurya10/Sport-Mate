"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/authContext";
import { MOCK_VENUES, MOCK_ADMIN_BOOKINGS, SPORT_ICONS } from "@/lib/mockData";

export default function OwnerDashboardPage() {
  const { user, logout } = useAuth();
  const router = useRouter();

  if (!user || user.role !== "owner") {
    return (
      <div className="min-h-screen pt-32 px-6 max-w-7xl mx-auto text-center bg-[#28282B]">
        <h1 className="text-3xl font-bold mb-4">Access Denied</h1>
        <p className="text-gray-400 mb-8">You need an owner account to view this dashboard.</p>
        <button onClick={() => router.push("/login")} className="btn-primary">
          Sign In as Owner
        </button>
      </div>
    );
  }

  const myVenues = MOCK_VENUES.slice(0, 2);
  const upcomingBookings = MOCK_ADMIN_BOOKINGS.slice(0, 5);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const metricCards = [
    { value: "23", label: "Bookings this month", borderClass: "border-l-2 border-[#4a6cf7]", valueClass: "" },
    { value: "€ 1,840", label: "Revenue this month", borderClass: "border-l-2 border-[#22c55e]", valueClass: "text-[#22c55e]" },
    { value: "4", label: "Today's bookings", borderClass: "border-l-2 border-[#f97316]", valueClass: "text-[#f97316]" },
    { value: "2", label: "Your venues", borderClass: "border-l-2 border-[#8b5cf6]", valueClass: "text-[#8b5cf6]" },
  ];

  return (
    <div className="min-h-screen pt-24 pb-20 px-6 max-w-7xl mx-auto bg-[#28282B] relative">
      {/* Ambient glow */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full
                      bg-[#8b5cf6]/6 blur-[120px] pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6 relative z-10">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#4a6cf7] mb-3">Owner Portal</p>
          <h1 className="text-5xl md:text-6xl font-black tracking-tight leading-none mb-2">Owner dashboard</h1>
          <p className="text-gray-400">Welcome back, {user.name}</p>
        </div>
        <button onClick={handleLogout} className="border border-red-500/50 text-red-500 hover:bg-red-500/10 rounded-full px-6 py-2 text-sm font-medium transition-colors">
          Log out
        </button>
      </div>

      {/* Overview Metrics */}
      <div className="stagger-children grid grid-cols-2 lg:grid-cols-4 gap-4 mb-16 relative z-10">
        {metricCards.map((card, i) => (
          <div
            key={i}
            className={`bg-[#141414] border border-white/[0.06] rounded-2xl p-6 ${card.borderClass}`}
            style={{ boxShadow: "inset 1px 1px 0 rgba(255,255,255,0.05)" }}
          >
            <div className={`text-3xl font-black mb-1 ${card.valueClass || "text-white"}`}>{card.value}</div>
            <div className="text-sm text-gray-400">{card.label}</div>
          </div>
        ))}
      </div>

      {/* My Venues */}
      <div className="mb-16 relative z-10">
        <div className="flex justify-between items-end mb-6">
          <h2 className="text-3xl font-bold tracking-tight">My venues</h2>
          <button className="border border-white/[0.08] hover:bg-white/[0.04] rounded-full px-4 py-2 text-sm font-medium transition-colors text-white">
            + Add venue
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {myVenues.map((venue) => (
            <div
              key={venue.id}
              className="bg-[#141414] border border-white/[0.06] rounded-3xl p-6 flex flex-col xl:flex-row gap-6 feature-card"
              style={{ boxShadow: "inset 1px 1px 0 rgba(255,255,255,0.05)" }}
            >
              <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 relative">
                <Image src={venue.photos[0]} alt={venue.name} fill className="object-cover" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg leading-tight mb-1">{venue.name}</h3>
                <p className="text-gray-400 text-sm mb-3">{venue.city} • €{venue.pricePerHour}/hr</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {venue.sports.slice(0, 3).map(s => (
                    <span key={s} className="bg-white/[0.05] border border-white/[0.06] text-gray-300 text-xs px-2 py-1 rounded-md">
                      {SPORT_ICONS[s] || ""} {s}
                    </span>
                  ))}
                  {venue.sports.length > 3 && (
                    <span className="bg-white/[0.05] border border-white/[0.06] text-gray-300 text-xs px-2 py-1 rounded-md">
                      +{venue.sports.length - 3}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-2 shrink-0 xl:min-w-[140px] xl:border-l xl:border-white/[0.06] xl:pl-6 justify-center">
                <Link
                  href={`/owner/venues/${venue.id}/edit`}
                  className="w-full text-center border border-white/[0.08] hover:bg-white/[0.04] text-white rounded-full py-2 text-sm font-medium transition-colors"
                >
                  Edit details
                </Link>
                <Link
                  href={`/owner/venues/${venue.id}/slots`}
                  className="btn-primary text-xs py-2 px-4 w-full"
                >
                  Manage slots
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming Bookings Table */}
      <div className="relative z-10">
        <h2 className="text-3xl font-bold tracking-tight mb-6">Upcoming bookings</h2>
        <div
          className="bg-[#141414] border border-white/[0.06] rounded-3xl overflow-hidden overflow-x-auto"
          style={{ boxShadow: "inset 1px 1px 0 rgba(255,255,255,0.05)" }}
        >
          <table className="w-full border-collapse min-w-[800px]">
            <thead>
              <tr>
                {["Player", "Venue", "Date", "Time", "Sport", "Amount", "Status"].map((h) => (
                  <th key={h} className="text-left text-gray-400 text-sm font-normal py-4 px-6 border-b border-white/[0.06]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {upcomingBookings.map((booking, index) => (
                <tr key={booking.id} className={`border-b border-white/[0.06] last:border-0 ${index % 2 === 1 ? "bg-white/[0.02]" : ""}`}>
                  <td className="py-4 px-6 text-sm font-medium">{booking.player}</td>
                  <td className="py-4 px-6 text-sm text-gray-300">{booking.venue}</td>
                  <td className="py-4 px-6 text-sm text-gray-300">{booking.date}</td>
                  <td className="py-4 px-6 text-sm text-gray-300">{booking.time}</td>
                  <td className="py-4 px-6 text-sm text-gray-300">{booking.sport}</td>
                  <td className="py-4 px-6 text-sm font-bold text-[#4a6cf7]">€{booking.amount}</td>
                  <td className="py-4 px-6 text-sm">
                    {booking.status === "confirmed" ? (
                      <span className="badge-confirmed font-bold uppercase tracking-wide text-xs">Paid</span>
                    ) : (
                      <span className="badge-pending font-bold uppercase tracking-wide text-xs">Pending</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
