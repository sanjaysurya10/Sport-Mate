"use client";

import Image from "next/image";
import BackButton from "@/components/BackButton";
import Navbar from "@/components/Navbar";

export default function CoachesPage() {
  const coaches = [
    { id: 1, name: "Liam O'Connor", sport: "Football", exp: "10 yrs", rate: "€40/hr" },
    { id: 2, name: "Emma Walsh", sport: "Tennis", exp: "7 yrs", rate: "€50/hr" },
    { id: 3, name: "Sean Murphy", sport: "Basketball", exp: "5 yrs", rate: "€35/hr" },
  ];

  return (
    <main className="min-h-screen pt-20 relative">
      <div className="absolute top-0 left-0 w-[500px] h-[500px] rounded-full bg-orange-500/5 blur-[150px] pointer-events-none -z-0" />
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-12 relative z-10">
        <div className="mb-6"><BackButton /></div>
        <div className="mb-12">
          <h1 className="geo-sans glass-text-chrome text-4xl md:text-5xl font-black mb-4 pb-2">Expert Coaches</h1>
          <p className="text-gray-400">Elevate your game with professional training.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {coaches.map(coach => (
            <div key={coach.id} className="glass-box p-6 hover:border-orange-500/50 transition-colors group">
              <div className="flex items-center gap-6 mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-gray-700 to-gray-900 rounded-full flex items-center justify-center text-2xl">
                  👤
                </div>
                <div>
                  <h3 className="text-xl font-bold">{coach.name}</h3>
                  <p className="text-orange-500 text-sm font-medium">{coach.sport} Coach</p>
                </div>
              </div>
              <div className="flex justify-between items-center mb-6 text-sm">
                <div className="text-gray-400"><strong className="text-white">{coach.exp}</strong> experience</div>
                <div className="text-gray-400"><strong className="text-white">{coach.rate}</strong></div>
              </div>
              <button className="w-full bg-orange-500 hover:bg-orange-600 text-white px-4 py-3 rounded-xl text-sm font-medium transition-colors">
                Book Session
              </button>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
