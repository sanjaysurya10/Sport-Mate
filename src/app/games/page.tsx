"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { MOCK_GAMES, SPORT_ICONS } from "@/lib/mockData";

const SPORTS = ["Football", "Basketball", "Tennis", "Badminton", "Cricket", "Rugby", "GAA"];

export default function GamesPage() {
  const [selectedSports, setSelectedSports] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fake loading delay
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const toggleSport = (sport: string) => {
    setSelectedSports((prev) =>
      prev.includes(sport) ? prev.filter((s) => s !== sport) : [...prev, sport]
    );
  };

  const filteredGames = useMemo(() => {
    return MOCK_GAMES.filter((game) => {
      // Sport filter: game sport must match selected
      return selectedSports.length === 0 || selectedSports.includes(game.sport);
    });
  }, [selectedSports]);

  return (
    <div className="min-h-screen pt-24 pb-20 px-6 max-w-7xl mx-auto">
      <div className="mb-8 flex items-center gap-3">
        <Link href="/">
          <img 
            src="/logo.png" 
            alt="Sport Mate Logo" 
            className="w-12 h-12 rounded-full object-cover hover:opacity-80 transition-opacity border border-white/10"
          />
        </Link>
        <span className="geo-sans font-black text-xl tracking-widest text-[#4a6cf7]">GAMES</span>
      </div>
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
          <h1 className="geo-sans glass-text-chrome text-5xl md:text-6xl font-black mb-4 pb-2">Open games near you</h1>
          <p className="text-[#888888]">Join a local game or find players for your own session.</p>
        </div>
        <button className="border border-[#4a6cf7] text-[#4a6cf7] hover:bg-[#4a6cf7] hover:text-white rounded-full px-6 py-3 font-medium transition-colors shrink-0">
          Host a game
        </button>
      </div>

      <div className="space-y-6 mb-12">
        {/* Sport Filter */}
        <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
          <span className="text-sm font-medium text-gray-400 mr-2 shrink-0">Filter by Sport:</span>
          {SPORTS.map((sport) => {
            const isSelected = selectedSports.includes(sport);
            return (
              <button
                key={sport}
                onClick={() => toggleSport(sport)}
                className={`shrink-0 border rounded-full px-5 py-2 text-sm transition-colors flex items-center gap-2 ${
                  isSelected
                    ? "bg-[#4a6cf7] border-[#4a6cf7] text-white"
                    : "border-[#2a2a2a] text-gray-300 hover:border-gray-500 bg-[#1a1a1a]"
                }`}
              >
                <span>{SPORT_ICONS[sport] || "🏅"}</span>
                {sport}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mb-6">
        <p className="text-[#888888] text-sm">Showing {filteredGames.length} open {filteredGames.length === 1 ? 'game' : 'games'}</p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-6 h-40 animate-pulse flex gap-4">
              <div className="w-14 h-14 rounded-full bg-[#2a2a2a] shrink-0"></div>
              <div className="flex-1 space-y-3 pt-2">
                <div className="h-4 w-3/4 bg-[#2a2a2a] rounded-md"></div>
                <div className="h-3 w-1/2 bg-[#2a2a2a] rounded-md"></div>
                <div className="h-5 w-1/3 bg-[#2a2a2a] rounded-full mt-2"></div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredGames.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredGames.map((game) => {
            const isFull = game.spotsFilled === game.spotsTotal;
            const percentageFilled = (game.spotsFilled / game.spotsTotal) * 100;
            
            return (
              <div
                key={game.id}
                className="glass-box p-6 flex flex-col sm:flex-row gap-6 hover:border-[#4a6cf7]/50 transition-colors"
              >
                {/* Left: Icon */}
                <div className="w-14 h-14 rounded-full bg-[#4a6cf7]/20 flex justify-center items-center text-3xl shrink-0 self-start">
                  {SPORT_ICONS[game.sport] || "🏅"}
                </div>

                {/* Middle: Details */}
                <div className="flex-1">
                  <h3 className="font-bold text-lg mb-1 leading-tight">
                    {game.sport} at <span className="text-[#4a6cf7]">{game.venueName}</span>
                  </h3>
                  <p className="text-[#888888] text-sm mb-4">Hosted by {game.hostName}</p>
                  
                  <div className="flex flex-wrap gap-2 items-center">
                    <span className="bg-[#2a2a2a] text-gray-300 rounded-full px-3 py-1 text-sm inline-flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#4a6cf7]"></span> 
                      {game.date} • {game.time}
                    </span>
                    <span className="bg-[#2a2a2a] text-gray-300 rounded-full px-3 py-1 text-sm">
                      {game.city}
                    </span>
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="sm:text-right flex flex-col justify-end min-w-[120px] shrink-0 pt-4 sm:pt-0 sm:border-l sm:border-[#2a2a2a] sm:pl-6">
                  <div className="mb-4">
                    <p className="text-sm font-medium mb-1 flex justify-between sm:justify-end gap-3">
                      <span>{game.spotsFilled} / {game.spotsTotal} players</span>
                    </p>
                    <div className="h-1.5 w-full bg-[#2a2a2a] rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${isFull ? "bg-red-500" : "bg-[#22c55e]"}`} 
                        style={{ width: `${percentageFilled}%` }} 
                      />
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <p className="text-sm text-[#888888]">Cost per player</p>
                    <p className="text-xl font-bold text-[#4a6cf7]">€{game.costPerPlayer}</p>
                  </div>
                  
                  {isFull ? (
                    <div className="bg-[#2a2a2a] text-gray-400 rounded-full px-4 py-2 text-sm font-medium text-center cursor-not-allowed">
                      Game Full
                    </div>
                  ) : (
                    <button className="bg-[#4a6cf7] hover:bg-[#3b5de7] text-white rounded-full px-4 py-2 text-sm font-medium transition-colors w-full">
                      Join game
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-20 glass-box mt-8">
          <div className="text-6xl mb-4">🏸</div>
          <h3 className="text-2xl font-bold mb-2">No games found</h3>
          <p className="text-[#888888] mb-6">Try selecting a different sport or host your own game.</p>
          <button
            onClick={() => setSelectedSports([])}
            className="bg-[#2a2a2a] hover:bg-[#333] text-white rounded-full px-6 py-3 transition-colors"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}
