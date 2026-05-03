"use client";

import { MOCK_ADMIN_STATS, MOCK_BOOKINGS_CHART } from "@/lib/mockData";
import BackButton from "@/components/BackButton";

export default function AdminDashboardPage() {
  const maxCount = Math.max(...MOCK_BOOKINGS_CHART.map((d) => d.count));
  const chartHeight = 160;

  const metricCards = [
    {
      label: "Total Users",
      value: MOCK_ADMIN_STATS.totalUsers.toLocaleString(),
      accentColor: "#4a6cf7",
      borderClass: "border-l-2 border-[#4a6cf7]",
      bgGlow: "bg-[#4a6cf7]/10",
    },
    {
      label: "Total Bookings",
      value: MOCK_ADMIN_STATS.totalBookings.toLocaleString(),
      accentColor: "#22c55e",
      borderClass: "border-l-2 border-[#22c55e]",
      bgGlow: "bg-[#22c55e]/10",
      valueClass: "text-[#22c55e]",
    },
    {
      label: "Active Venues",
      value: String(MOCK_ADMIN_STATS.activeVenues),
      accentColor: "#f97316",
      borderClass: "border-l-2 border-[#f97316]",
      bgGlow: "bg-[#f97316]/10",
      valueClass: "text-[#f97316]",
    },
    {
      label: "Revenue (30d)",
      value: `€${MOCK_ADMIN_STATS.revenueThisMonth.toLocaleString()}`,
      accentColor: "#8b5cf6",
      borderClass: "border-l-2 border-[#8b5cf6]",
      bgGlow: "bg-[#8b5cf6]/10",
      valueClass: "text-[#8b5cf6]",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div><BackButton /></div>
      <div>
        <h1 className="text-5xl md:text-6xl font-black tracking-tight leading-none mb-2">Platform Overview</h1>
        <p className="text-gray-400 text-base leading-relaxed">Welcome to the SportMate administration panel.</p>
      </div>

      {/* Metrics Row */}
      <div className="stagger-children grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {metricCards.map((card, i) => (
          <div
            key={i}
            className={`bg-[#141414] border border-white/[0.06] rounded-2xl p-6 relative overflow-hidden group ${card.borderClass}`}
            style={{ boxShadow: "inset 1px 1px 0 rgba(255,255,255,0.05)" }}
          >
            <div className="relative z-10">
              <div className="text-sm text-gray-400 mb-2 font-medium">{card.label}</div>
              <div className={`text-3xl font-black text-white ${card.valueClass || ""}`}>{card.value}</div>
            </div>
            <div className={`absolute -right-4 -bottom-4 w-24 h-24 ${card.bgGlow} rounded-full group-hover:scale-150 transition-transform duration-500`} />
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid lg:grid-cols-3 gap-6">

        {/* Bookings Bar Chart */}
        <div
          className="lg:col-span-2 bg-[#141414] border border-white/[0.06] rounded-2xl p-6"
          style={{ boxShadow: "inset 1px 1px 0 rgba(255,255,255,0.05)" }}
        >
          <h2 className="text-3xl font-bold tracking-tight mb-8">Bookings — Last 7 Days</h2>

          <div className="h-48 w-full flex items-end justify-between gap-2 relative">
            {/* Y-Axis lines */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20">
              <div className="border-t border-gray-500 w-full h-0" />
              <div className="border-t border-gray-500 w-full h-0" />
              <div className="border-t border-gray-500 w-full h-0" />
            </div>

            {MOCK_BOOKINGS_CHART.map((data, i) => {
              const height = (data.count / maxCount) * chartHeight;
              return (
                <div key={i} className="flex-1 flex flex-col items-center group relative z-10">
                  <div className="opacity-0 group-hover:opacity-100 absolute -top-10 bg-[#28282B] border border-white/[0.06] text-white text-xs px-2 py-1 rounded transition-opacity">
                    {data.count}
                  </div>
                  <div
                    className="w-full max-w-[40px] bg-[#4a6cf7] hover:bg-[#5b7bf7] rounded-t-md transition-all duration-300"
                    style={{ height: `${height}px` }}
                  />
                  <div className="text-gray-400 text-sm mt-3">{data.day}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Actions */}
        <div
          className="bg-[#141414] border border-white/[0.06] rounded-2xl p-6"
          style={{ boxShadow: "inset 1px 1px 0 rgba(255,255,255,0.05)" }}
        >
          <h2 className="text-3xl font-bold tracking-tight mb-6">Quick Actions</h2>
          <div className="space-y-3">
            <button className="w-full bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] text-left px-4 py-3 rounded-xl transition-colors text-sm font-medium">
              Verify new venue listings (2 pending)
            </button>
            <button className="w-full bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] text-left px-4 py-3 rounded-xl transition-colors text-sm font-medium">
              Review player reports
            </button>
            <button className="w-full bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] text-left px-4 py-3 rounded-xl transition-colors text-sm font-medium">
              System settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
