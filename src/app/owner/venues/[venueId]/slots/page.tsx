"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { format, startOfWeek, addDays, subWeeks, addWeeks } from "date-fns";
import { MOCK_VENUES } from "@/lib/mockData";

type SlotStatus = "available" | "booked" | "blocked";

export default function SlotsManagerPage() {
  const params = useParams();
  const venueId = params.venueId as string;
  const venue = MOCK_VENUES.find((v) => v.id === venueId);

  const [currentWeekStart, setCurrentWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [slotData, setSlotData] = useState<Map<string, SlotStatus>>(new Map());

  // Initialize mock data when week changes
  useEffect(() => {
    const newSlotData = new Map<string, SlotStatus>(slotData);
    
    // Generate 7 days
    for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
      const date = addDays(currentWeekStart, dayOffset);
      const dateString = format(date, "yyyy-MM-dd");
      
      // For each day, 14 hours
      for (let hour = 8; hour <= 21; hour++) {
        const key = `${dateString}-${hour}`;
        
        // Only set if not already present in state
        if (!newSlotData.has(key)) {
          // Hardcode some defaults based on completely arbitrary rules for demo
          if (dayOffset === 2 && (hour === 10 || hour === 14)) {
            newSlotData.set(key, "booked");
          } else if (dayOffset === 4 && (hour === 18 || hour === 19)) {
            newSlotData.set(key, "booked");
          } else if (dayOffset === 0 && (hour === 8 || hour === 9)) {
            newSlotData.set(key, "blocked");
          } else if (dayOffset === 6 && hour >= 18) {
             newSlotData.set(key, "blocked"); // Saturday evening blocked
          } else {
            newSlotData.set(key, "available");
          }
        }
      }
    }
    
    setSlotData(newSlotData);
  }, [currentWeekStart]);

  if (!venue) return <div className="p-10 text-center">Venue not found</div>;

  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(currentWeekStart, i));

  const toggleSlot = (dateString: string, hour: number) => {
    const key = `${dateString}-${hour}`;
    const currentStatus = slotData.get(key);
    
    if (currentStatus === "booked") return; // cannot toggle booked slots
    
    const newSlotData = new Map(slotData);
    newSlotData.set(key, currentStatus === "blocked" ? "available" : "blocked");
    setSlotData(newSlotData);
  };

  const blockDay = (dateString: string) => {
    const newSlotData = new Map(slotData);
    for (let hour = 8; hour <= 21; hour++) {
      const key = `${dateString}-${hour}`;
      if (newSlotData.get(key) !== "booked") {
        newSlotData.set(key, "blocked");
      }
    }
    setSlotData(newSlotData);
  };

  return (
    <div className="min-h-screen pt-24 pb-20 px-6 max-w-7xl mx-auto">
      
      <div className="mb-6">
        <Link href="/owner/dashboard" className="text-gray-400 hover:text-white transition-colors text-sm flex items-center gap-1">
          ← Back to dashboard
        </Link>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Manage slots</h1>
        <p className="text-[#888888]">{venue.name} • {venue.city}</p>
      </div>

      {/* Controls & Legend */}
      <div className="flex flex-col md:flex-row justify-between items-center bg-[#1a1a1a] border border-[#2a2a2a] p-4 rounded-2xl mb-8 gap-4 shadow-sm">
        
        <div className="flex items-center gap-4 w-full md:w-auto overflow-x-auto">
          <button 
            onClick={() => setCurrentWeekStart(subWeeks(currentWeekStart, 1))}
            className="shrink-0 border border-[#2a2a2a] hover:border-[#4a6cf7] text-white rounded-xl px-4 py-2 text-sm transition-colors"
          >
            ← Prev week
          </button>
          
          <div className="shrink-0 text-center font-bold px-4">
            {format(weekDays[0], "dd MMM")} – {format(weekDays[6], "dd MMM yyyy")}
          </div>

          <button 
            onClick={() => setCurrentWeekStart(addWeeks(currentWeekStart, 1))}
            className="shrink-0 border border-[#2a2a2a] hover:border-[#4a6cf7] text-white rounded-xl px-4 py-2 text-sm transition-colors"
          >
            Next week →
          </button>
        </div>

        <div className="flex gap-6 text-sm shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#22c55e]"></span> Available
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-gray-500"></span> Booked
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#f97316]"></span> Blocked
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-7 gap-4">
        {weekDays.map((date) => {
          const dateString = format(date, "yyyy-MM-dd");
          
          return (
            <div key={dateString} className="flex flex-col">
              {/* Day Header */}
              <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-t-2xl p-4 text-center sticky top-20 z-10 shadow-md">
                <div className="font-bold text-lg">{format(date, "EEE")}</div>
                <div className="text-gray-400 text-sm mb-3">{format(date, "dd MMM")}</div>
                <button
                  onClick={() => blockDay(dateString)}
                  className="w-full border border-[#2a2a2a] hover:bg-[#2a2a2a] text-white rounded-lg py-1.5 text-xs font-medium transition-colors"
                >
                  Block day
                </button>
              </div>

              {/* Slots Column */}
              <div className="bg-[#1a1a1a]/50 border-x border-b border-[#2a2a2a] rounded-b-2xl p-2 flex flex-col gap-2">
                {Array.from({ length: 14 }, (_, i) => i + 8).map((hour) => {
                  const key = `${dateString}-${hour}`;
                  const status = slotData.get(key) || "available";
                  const displayHour = `${hour > 12 ? hour - 12 : hour} ${hour >= 12 ? 'PM' : 'AM'}`;
                  
                  if (status === "booked") {
                    return (
                      <div key={hour} className="bg-[#2a2a2a] text-gray-500 text-xs font-medium text-center py-3 rounded-lg cursor-not-allowed">
                        {displayHour}
                      </div>
                    );
                  }

                   if (status === "blocked") {
                    return (
                      <button 
                        key={hour}
                        onClick={() => toggleSlot(dateString, hour)}
                        className="bg-[#f97316]/10 border border-[#f97316]/30 text-[#f97316] text-xs font-medium text-center py-3 rounded-lg cursor-pointer hover:bg-[#f97316]/20 transition-colors"
                      >
                        {displayHour}
                      </button>
                    );
                  }

                  // Default available
                  return (
                    <button 
                      key={hour}
                      onClick={() => toggleSlot(dateString, hour)}
                      className="bg-[#22c55e]/5 border border-[#22c55e]/20 text-[#22c55e] text-xs font-medium text-center py-3 rounded-lg cursor-pointer hover:bg-[#22c55e]/15 hover:border-[#22c55e]/40 transition-colors"
                    >
                      {displayHour}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
