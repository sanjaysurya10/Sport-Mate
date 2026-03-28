"use client";

import { useState } from "react";
import { MOCK_ADMIN_BOOKINGS, SPORT_ICONS } from "@/lib/mockData";

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState(MOCK_ADMIN_BOOKINGS);
  const [statusFilter, setStatusFilter] = useState("all");
  const [toast, setToast] = useState({ show: false, message: "" });

  const filteredBookings = bookings.filter((b) => {
    return statusFilter === "all" || b.status === statusFilter;
  });

  const cancelBooking = (id: string) => {
    setBookings(bookings.map(b => b.id === id ? { ...b, status: "cancelled" } : b));
    setToast({ show: true, message: "Booking cancelled by admin." });
    setTimeout(() => setToast({ show: false, message: "" }), 3000);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      
      {/* Toast */}
      {toast.show && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-[#22c55e] text-white px-6 py-3 rounded-full shadow-2xl z-50 flex items-center gap-2 border border-green-400 transition-all">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          {toast.message}
        </div>
      )}

      <div>
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
          Bookings
          <span className="bg-[#22c55e]/20 text-[#22c55e] text-sm px-3 py-1 rounded-full font-medium">
            {bookings.length} total
          </span>
        </h1>
        <p className="text-gray-400">View and manage platform transactions.</p>
      </div>

      {/* Controls */}
      <div className="flex overflow-x-auto pb-2 scrollbar-hide">
        <div className="flex bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-1 shrink-0">
          {["all", "confirmed", "cancelled"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-5 py-2 text-sm rounded-lg capitalize font-medium transition-colors ${
                statusFilter === status ? "bg-[#2a2a2a] text-white shadow-sm" : "text-gray-500 hover:text-white"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-3xl overflow-hidden overflow-x-auto shadow-sm">
        <table className="w-full border-collapse min-w-[900px]">
          <thead className="bg-[#111111]">
            <tr>
              <th className="text-left text-gray-400 text-sm font-medium py-4 px-6 border-b border-[#2a2a2a]">ID</th>
              <th className="text-left text-gray-400 text-sm font-medium py-4 px-6 border-b border-[#2a2a2a]">Player & Venue</th>
              <th className="text-left text-gray-400 text-sm font-medium py-4 px-6 border-b border-[#2a2a2a]">Schedule</th>
              <th className="text-left text-gray-400 text-sm font-medium py-4 px-6 border-b border-[#2a2a2a]">Amount</th>
              <th className="text-left text-gray-400 text-sm font-medium py-4 px-6 border-b border-[#2a2a2a]">Status</th>
              <th className="text-right text-gray-400 text-sm font-medium py-4 px-6 border-b border-[#2a2a2a]">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredBookings.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-gray-500">No bookings found</td>
              </tr>
            ) : (
              filteredBookings.map((b, i) => (
                <tr key={b.id} className={`border-b border-[#2a2a2a] last:border-0 hover:bg-[#141414] transition-colors`}>
                  <td className="py-4 px-6 text-sm text-gray-500 font-mono">#{b.id.toUpperCase()}</td>
                  <td className="py-4 px-6">
                    <div className="font-bold text-sm text-white mb-0.5">{b.player}</div>
                    <div className="text-xs text-gray-400">{b.venue}</div>
                  </td>
                  <td className="py-4 px-6">
                     <div className="text-sm text-white mb-0.5">{b.date}</div>
                     <div className="text-xs text-gray-400 flex items-center gap-1">
                       {SPORT_ICONS[b.sport]} {b.sport} • {b.time}
                     </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="font-bold text-[#4a6cf7]">€{b.amount}</span>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide inline-block ${
                      b.status === "confirmed" ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
                    }`}>
                      {b.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    {b.status === "confirmed" && (
                       <button
                        onClick={() => cancelBooking(b.id)}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium border border-red-500/50 text-red-500 hover:bg-red-500/10 transition-colors"
                      >
                        Force Cancel
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
