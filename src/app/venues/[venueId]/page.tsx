"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { addDays, format } from "date-fns";
import { useAuth } from "@/lib/authContext";
import { MOCK_VENUES, MOCK_WEATHER, SPORT_ICONS } from "@/lib/mockData";

const CITY_COORDS: Record<string, {lat: number, lon: number}> = {
  "Dublin": { lat: 53.3498, lon: -6.2603 },
  "Cork": { lat: 51.8985, lon: -8.4756 },
  "Galway": { lat: 53.2707, lon: -9.0568 },
  "Limerick": { lat: 52.6638, lon: -8.6267 },
  "Waterford": { lat: 52.2593, lon: -7.1101 },
  "Belfast": { lat: 54.5973, lon: -5.9301 },
};

function generateSlots(dateString: string) {
  // Hardcode a few as booked for realism based on the date
  const baseBooked = [9, 14, 18];
  // Slightly randomize booked slots
  const d = new Date(dateString);
  const extraBooked = d.getDay() % 2 === 0 ? [10, 19] : [17, 20];
  const bookedHours = [...baseBooked, ...extraBooked];
  
  return Array.from({ length: 14 }, (_, i) => {
    const hour = i + 8;
    return { 
      hour, 
      status: bookedHours.includes(hour) ? "booked" : "available",
      label: `${hour > 12 ? hour - 12 : hour} ${hour >= 12 ? 'PM' : 'AM'}`
    };
  });
}

export default function VenueDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  
  const venueId = params.venueId as string;
  const venue = MOCK_VENUES.find((v) => v.id === venueId);

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedSlot, setSelectedSlot] = useState<{hour: number, label: string} | null>(null);
  const [selectedSport, setSelectedSport] = useState<string>("");
  const [toast, setToast] = useState<{show: boolean, message: string}>({ show: false, message: "" });
  
  const [weather, setWeather] = useState(MOCK_WEATHER);
  const [loadingWeather, setLoadingWeather] = useState(false);

  // Fetch true weather from Open-Meteo
  useEffect(() => {
    if (!venue || !selectedSlot) return;

    const fetchWeather = async () => {
      setLoadingWeather(true);
      try {
        const coords = CITY_COORDS[venue.city] || { lat: 53.3498, lon: -6.2603 };
        const dateStr = format(selectedDate, "yyyy-MM-dd");
        
        const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&hourly=temperature_2m,weather_code&timezone=auto&start_date=${dateStr}&end_date=${dateStr}`);
        
        if (!res.ok) throw new Error("Failed to fetch weather");
        const data = await res.json();
        
        const targetTimeStr = `${dateStr}T${selectedSlot.hour.toString().padStart(2, '0')}:00`;
        const index = data.hourly.time.findIndex((t: string) => t === targetTimeStr);
        
        if (index !== -1) {
          const temp = Math.round(data.hourly.temperature_2m[index]);
          const code = data.hourly.weather_code[index];
          
          let condition = "Cloudy";
          let icon = "⛅";
          let label = "Good conditions";
          
          if (code === 0) { condition = "Clear sky"; icon = "☀️"; label = "Perfect conditions"; }
          else if (code <= 3) { condition = "Partly cloudy"; icon = "⛅"; label = "Good conditions"; }
          else if (code <= 48) { condition = "Fog"; icon = "🌫️"; label = "Visibility reduced"; }
          else if (code <= 57) { condition = "Drizzle"; icon = "🌧️"; label = "Slightly wet"; }
          else if (code <= 67) { condition = "Rain"; icon = "🌧️"; label = "Bring a jacket"; }
          else if (code <= 77) { condition = "Snow"; icon = "❄️"; label = "Cold conditions"; }
          else if (code <= 82) { condition = "Rain showers"; icon = "🌦️"; label = "Might be wet"; }
          else { condition = "Stormy"; icon = "⛈️"; label = "Check with venue"; }

          setWeather({ temp, condition, icon, label });
        } else {
          setWeather(MOCK_WEATHER);
        }
      } catch (err) {
        setWeather(MOCK_WEATHER);
      } finally {
        setLoadingWeather(false);
      }
    };

    fetchWeather();
  }, [selectedDate, selectedSlot, venue]);

  // Set default sport
  useEffect(() => {
    if (venue && venue.sports.length > 0) {
      setSelectedSport(venue.sports[0]);
    }
  }, [venue]);

  if (!venue) {
    return (
      <div className="min-h-screen pt-32 px-6 text-center">
        <h1 className="text-3xl font-bold">Venue not found</h1>
      </div>
    );
  }

  // Generate 7 days
  const next7Days = Array.from({ length: 7 }, (_, i) => addDays(new Date(), i));
  const dateString = format(selectedDate, "yyyy-MM-dd");
  const slots = generateSlots(dateString);

  const handleBooking = () => {
    if (!user) {
      // Just demo login message for now, normally we'd redirect
      router.push("/login");
      return;
    }

    setToast({ show: true, message: "Booking confirmed! 🎉" });
    setTimeout(() => {
      setToast({ show: false, message: "" });
      router.push("/dashboard");
    }, 1500);
  };

  return (
    <div className="min-h-screen pt-24 pb-20 px-6 max-w-7xl mx-auto">
      
      {/* Toast */}
      {toast.show && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-[#22c55e] text-white px-6 py-3 rounded-full shadow-2xl z-50 flex items-center gap-2 animate-in slide-in-from-bottom border border-green-400">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          {toast.message}
        </div>
      )}

      <div className="mb-6">
        <button onClick={() => router.back()} className="text-gray-400 hover:text-white transition-colors text-sm flex items-center gap-1">
          ← Back to venues
        </button>
      </div>

      <div className="grid lg:grid-cols-[1fr_400px] gap-8">
        
        {/* Left column: Venue Info */}
        <div className="space-y-8">
          <div className="w-full h-72 relative rounded-3xl overflow-hidden shadow-lg border border-[#2a2a2a]">
            <Image
              src={venue.photos[0]}
              alt={venue.name}
              fill
              className="object-cover"
            />
          </div>

          <div>
            <div className="flex justify-between items-start mb-2">
              <h1 className="text-3xl md:text-4xl font-bold">{venue.name}</h1>
              <div className="hidden sm:block">
                <span className="text-3xl font-bold text-[#4a6cf7]">
                  €{venue.pricePerHour} <span className="text-lg font-normal text-gray-400">/ hour</span>
                </span>
              </div>
            </div>
            
            <p className="text-[#888888] mb-6 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {venue.address}, {venue.city}
            </p>

            <div className="flex gap-4 flex-wrap mb-8">
              {/* Rating */}
              <div className="flex items-center gap-2 bg-[#1a1a1a] border border-[#2a2a2a] rounded-full px-4 py-2">
                <div className="flex text-[#f97316] text-sm">
                  {"★".repeat(Math.round(venue.rating))}
                  <span className="text-gray-600">{"★".repeat(5 - Math.round(venue.rating))}</span>
                </div>
                <span className="text-white text-sm font-medium">{venue.rating}</span>
                <span className="text-[#888888] text-sm">({venue.reviewCount} reviews)</span>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-lg font-bold mb-3">About this venue</h3>
              <p className="text-gray-400 leading-relaxed max-w-2xl">{venue.description}</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 pb-10 border-b border-[#2a2a2a] lg:border-0">
              <div>
                <h3 className="text-lg font-bold mb-4">Sports Supported</h3>
                <div className="flex flex-wrap gap-2">
                  {venue.sports.map((s) => (
                    <span key={s} className="bg-[#4a6cf7]/10 text-[#4a6cf7] border border-[#4a6cf7]/30 px-3 py-1.5 rounded-full text-sm flex items-center gap-2">
                      {SPORT_ICONS[s] || "🏅"} {s}
                    </span>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-bold mb-4">Facilities</h3>
                <div className="flex flex-wrap gap-2">
                  {venue.facilities.map((f) => (
                    <span key={f} className="bg-[#2a2a2a] text-gray-300 px-3 py-1.5 rounded-full text-sm">
                      ✓ {f}
                    </span>
                  ))}
                </div>
              </div>
            </div>

             <div className="block sm:hidden mb-4 mt-8">
                <span className="text-3xl font-bold text-[#4a6cf7]">
                  €{venue.pricePerHour} <span className="text-lg font-normal text-gray-400">/ hour</span>
                </span>
            </div>
          </div>
        </div>

        {/* Right column: Booking Panel */}
        <div className="lg:sticky lg:top-24 self-start">
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-3xl p-6 shadow-2xl">
            
            {/* Step 1: Date */}
            <div className="mb-6">
              <h3 className="font-bold mb-3 flex items-center justify-between">
                <span>Select a date</span>
                <span className="text-sm font-normal text-gray-400">{format(selectedDate, "MMMM yyyy")}</span>
              </h3>
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {next7Days.map((date, i) => {
                  const isSelected = selectedDate.getDate() === date.getDate();
                  return (
                    <button
                      key={i}
                      onClick={() => {
                        setSelectedDate(date);
                        setSelectedSlot(null); // reset time
                      }}
                      className={`shrink-0 flex flex-col items-center justify-center w-[54px] h-[64px] rounded-xl border transition-all ${
                        isSelected
                          ? "bg-[#4a6cf7] border-[#4a6cf7] text-white"
                          : "border-[#2a2a2a] text-gray-400 hover:border-gray-500"
                      }`}
                    >
                      <span className="text-[10px] uppercase font-bold tracking-wider mb-1">{format(date, "EEE")}</span>
                      <span className="text-lg font-bold">{format(date, "dd")}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Time Slots */}
            <div className="mb-6">
              <h3 className="font-bold mb-3">Select a time</h3>
              <div className="grid grid-cols-4 gap-2">
                {slots.map((slot) => {
                  const isSelected = selectedSlot?.hour === slot.hour;
                  
                  if (slot.status === "booked") {
                    return (
                      <div key={slot.hour} className="bg-[#2a2a2a] border border-[#2a2a2a] text-gray-500 rounded-xl py-2 text-center text-sm cursor-not-allowed">
                        {slot.label}
                      </div>
                    );
                  }
                  
                  return (
                    <button
                      key={slot.hour}
                      onClick={() => setSelectedSlot({ hour: slot.hour, label: slot.label })}
                      className={`rounded-xl py-2 text-center text-sm transition-all border ${
                        isSelected
                          ? "bg-[#22c55e] text-white border-[#22c55e]"
                          : "bg-[#22c55e]/5 border-[#22c55e]/20 text-[#22c55e] hover:bg-[#22c55e]/15 hover:border-[#22c55e]/40"
                      }`}
                    >
                      {slot.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 3: Booking Confirmation Panel */}
            {selectedSlot && (
              <div className="animate-in fade-in slide-in-from-top-4 duration-300">
                <hr className="border-[#2a2a2a] my-6" />
                
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Sport</label>
                    <select
                      value={selectedSport}
                      onChange={(e) => setSelectedSport(e.target.value)}
                      className="bg-[#0d0d0d] border border-[#2a2a2a] rounded-xl px-4 py-3 text-white w-full focus:outline-none focus:border-[#4a6cf7] appearance-none"
                    >
                      {venue.sports.map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>

                  {/* Weather Widget */}
                  <div className="bg-[#0d0d0d] border border-[#2a2a2a] rounded-2xl p-4 flex items-center justify-between h-20">
                    <div className="flex items-center gap-4 w-full">
                      {loadingWeather ? (
                         <div className="animate-pulse flex gap-4 items-center w-full">
                           <div className="w-8 h-8 bg-[#2a2a2a] rounded-full shrink-0"></div>
                           <div className="space-y-2 w-full">
                             <div className="w-1/3 h-3 bg-[#2a2a2a] rounded"></div>
                             <div className="w-1/2 h-2 bg-[#2a2a2a] rounded"></div>
                           </div>
                         </div>
                      ) : (
                        <>
                          <span className="text-3xl">{weather.icon}</span>
                          <div>
                            <p className="text-sm font-medium">{weather.temp}°C • {weather.condition}</p>
                            <p className="text-xs text-gray-500 mt-1">Forecast for {format(selectedDate, "dd MMM")}, {selectedSlot.label}</p>
                          </div>
                        </>
                      )}
                    </div>
                    {!loadingWeather && (
                      <span className="bg-orange-500/20 text-orange-500 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider shrink-0 ml-2">
                        {weather.label}
                      </span>
                    )}
                  </div>

                  {/* Cost breakdown */}
                  <div className="bg-[#0d0d0d] border border-[#2a2a2a] rounded-xl p-4">
                    <div className="flex justify-between items-center text-sm mb-2 text-gray-400">
                      <span>1 hour × €{venue.pricePerHour}</span>
                      <span>€{venue.pricePerHour}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm mb-3 pb-3 border-b border-[#2a2a2a] text-gray-400">
                      <span>Platform fee</span>
                      <span>€1</span>
                    </div>
                    <div className="flex justify-between items-center font-bold">
                      <span>Total</span>
                      <span className="text-[#4a6cf7]">€{venue.pricePerHour + 1}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleBooking}
                  className="w-full bg-[#4a6cf7] hover:bg-[#3b5de7] text-white rounded-full px-6 py-4 font-medium transition-colors shadow-lg shadow-[#4a6cf7]/20"
                >
                  {user ? "Confirm booking" : "Log in to book"}
                </button>
                <p className="text-center text-xs text-gray-500 mt-3">
                  You won't be charged yet.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
