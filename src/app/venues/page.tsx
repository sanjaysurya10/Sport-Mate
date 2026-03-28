"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search } from "lucide-react";
import { MOCK_VENUES, SPORT_ICONS } from "@/lib/mockData";

const SPORTS = ["Football", "Basketball", "Tennis", "Badminton", "Cricket", "Rugby", "GAA"];
const CITIES = ["All", "Dublin", "Cork", "Galway", "Limerick", "Waterford", "Belfast"];

export default function VenuesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSports, setSelectedSports] = useState<string[]>([]);
  const [selectedCity, setSelectedCity] = useState("All");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const toggleSport = (sport: string) => {
    setSelectedSports((prev) =>
      prev.includes(sport) ? prev.filter((s) => s !== sport) : [...prev, sport]
    );
  };

  const filteredVenues = useMemo(() => {
    return MOCK_VENUES.filter((venue) => {
      const matchesSearch =
        searchQuery === "" ||
        venue.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        venue.address.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCity = selectedCity === "All" || venue.city === selectedCity;
      const matchesSport =
        selectedSports.length === 0 ||
        selectedSports.some((sport) => venue.sports.includes(sport));
      return matchesSearch && matchesCity && matchesSport;
    });
  }, [searchQuery, selectedCity, selectedSports]);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedSports([]);
    setSelectedCity("All");
  };

  return (
    <div className="min-h-screen pt-24 pb-20 px-6 max-w-7xl mx-auto bg-[#28282B] relative">
      {/* Ambient glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full
                      bg-[#4a6cf7]/8 blur-[150px] pointer-events-none -z-0" />

      <div className="mb-8 relative z-10 flex items-center gap-3">
        <Link href="/">
          <img 
            src="/logo.png" 
            alt="Sport Mate Logo" 
            className="w-12 h-12 rounded-full object-cover hover:opacity-80 transition-opacity border border-white/10"
          />
        </Link>
        <span className="geo-sans font-black text-xl tracking-widest text-[#4a6cf7]">VENUES</span>
      </div>

      <div className="mb-12 relative z-10">
        <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#4a6cf7] mb-3">Browse</p>
        <h1 className="geo-sans glass-text-chrome text-5xl md:text-6xl font-black mb-2 pb-2">Find a venue near you</h1>
        <p className="text-gray-400 text-base leading-relaxed">Discover and book the best sports facilities in Ireland.</p>
      </div>

      <div className="space-y-6 mb-12 relative z-10">
        {/* Search Bar */}
        <div className="relative max-w-2xl">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="text-gray-400 w-5 h-5" />
          </div>
          <input
            type="text"
            placeholder="Search venue name or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-dark pl-12"
          />
        </div>

        {/* City Filter */}
        <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
          <span className="text-sm font-medium text-gray-400 mr-2 shrink-0">City:</span>
          {CITIES.map((city) => (
            <button
              key={city}
              onClick={() => setSelectedCity(city)}
              className={`shrink-0 border rounded-full px-5 py-2 text-sm transition-colors ${
                selectedCity === city
                  ? "bg-[#4a6cf7] border-[#4a6cf7] text-white"
                  : "border-white/[0.06] text-gray-300 hover:border-gray-500 bg-[#141414]"
              }`}
            >
              {city}
            </button>
          ))}
        </div>

        {/* Sport Filter */}
        <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
          <span className="text-sm font-medium text-gray-400 mr-2 shrink-0">Sport:</span>
          {SPORTS.map((sport) => {
            const isSelected = selectedSports.includes(sport);
            return (
              <button
                key={sport}
                onClick={() => toggleSport(sport)}
                className={`shrink-0 border rounded-full px-5 py-2 text-sm transition-colors flex items-center gap-2 ${
                  isSelected
                    ? "bg-[#4a6cf7] border-[#4a6cf7] text-white"
                    : "border-white/[0.06] text-gray-300 hover:border-gray-500 bg-[#141414]"
                }`}
              >
                <span>{SPORT_ICONS[sport] || "🏅"}</span>
                {sport}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mb-6 relative z-10">
        <p className="text-gray-400 text-sm">Showing {filteredVenues.length} {filteredVenues.length === 1 ? "venue" : "venues"}</p>
      </div>

      {isLoading ? (
        <div className="stagger-children grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="glass-box overflow-hidden h-[420px] animate-pulse">
              <div className="h-48 bg-white/[0.04]" />
              <div className="p-6 space-y-4">
                <div className="h-6 w-3/4 bg-white/[0.04] rounded-md" />
                <div className="flex gap-2">
                  <div className="h-6 w-16 bg-white/[0.04] rounded-full" />
                  <div className="h-6 w-16 bg-white/[0.04] rounded-full" />
                </div>
                <div className="h-4 w-1/2 bg-white/[0.04] rounded-md" />
                <div className="h-10 w-full bg-white/[0.04] rounded-full mt-4" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredVenues.length > 0 ? (
        <div className="stagger-children grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
          {filteredVenues.map((venue) => (
            <div
              key={venue.id}
              className="glass-box overflow-hidden feature-card flex flex-col"
            >
              <div className="h-48 w-full relative">
                <Image
                  src={venue.photos[0]}
                  alt={venue.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-bold truncate pr-3">{venue.name}</h3>
                  <span className="bg-white/[0.05] border border-white/[0.06] text-gray-300 px-3 py-1 rounded-full text-xs shrink-0 mt-1">
                    {venue.city}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {venue.sports.map((s) => (
                    <span
                      key={s}
                      className="bg-[#22c55e]/10 text-[#22c55e] border border-[#22c55e]/30 px-2 py-1 rounded-full text-xs flex items-center gap-1"
                    >
                      {SPORT_ICONS[s] || "🏅"} {s}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-2 mb-4 mt-auto">
                  <div className="flex text-[#f97316] text-sm">
                    {"★".repeat(Math.round(venue.rating))}
                    <span className="text-gray-600">{"★".repeat(5 - Math.round(venue.rating))}</span>
                  </div>
                  <span className="text-white text-sm font-medium">{venue.rating}</span>
                  <span className="text-gray-400 text-sm">({venue.reviewCount} reviews)</span>
                </div>

                <div className="mb-6">
                  <div className="text-2xl font-black text-[#4a6cf7]">
                    €{venue.pricePerHour} <span className="text-sm font-normal text-gray-400">/ hour</span>
                  </div>
                </div>

                <Link
                  href={`/venues/${venue.id}`}
                  className="w-full block text-center border text-[#4a6cf7] border-[#4a6cf7]/40 hover:bg-[#4a6cf7] hover:text-white rounded-full py-3 font-medium transition-all duration-200"
                >
                  View availability →
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-[#141414] border border-white/[0.06] rounded-3xl relative z-10"
             style={{ boxShadow: "inset 1px 1px 0 rgba(255,255,255,0.05)" }}>
          <div className="text-6xl mb-4">🏜️</div>
          <h3 className="text-2xl font-bold mb-2">No venues found</h3>
          <p className="text-gray-400 mb-6">Try adjusting your filters to see more results.</p>
          <button
            onClick={clearFilters}
            className="btn-primary"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
}
