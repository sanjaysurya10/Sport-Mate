"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import BackButton from "@/components/BackButton";

function Header() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-[#0d0d0d]/90 backdrop-blur-md" : "bg-[#0d0d0d]"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <img 
            src="/logo.png" 
            alt="Sport Mate Logo" 
            className="w-12 h-12 rounded-full object-cover hover:opacity-80 transition-opacity border border-white/10"
          />
          <span className="geo-sans font-black text-xl tracking-widest text-[#4a6cf7]">COACHES</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <Link href="/games" className="text-white/80 hover:text-white transition-colors text-sm font-medium pb-1">
            Games
          </Link>
          <Link href="/venues" className="text-white/80 hover:text-white transition-colors text-sm font-medium pb-1">
            Venues
          </Link>
          <Link href="/coaches" className="text-white transition-colors text-sm font-bold border-b-2 border-orange-500 pb-1">
            Coaches
          </Link>
          <Link href="/tournaments" className="text-white/80 hover:text-white transition-colors text-sm font-medium pb-1">
            Tournaments
          </Link>
          <Link href="/login" className="text-white/80 hover:text-white transition-colors text-sm font-medium pb-1">
            Login
          </Link>
        </nav>
      </div>
    </header>
  );
}

export default function CoachesPage() {
  const coaches = [
    { id: 1, name: "Liam O'Connor", sport: "Football", exp: "10 yrs", rate: "€40/hr" },
    { id: 2, name: "Emma Walsh", sport: "Tennis", exp: "7 yrs", rate: "€50/hr" },
    { id: 3, name: "Sean Murphy", sport: "Basketball", exp: "5 yrs", rate: "€35/hr" },
  ];

  return (
    <main className="min-h-screen pt-24 bg-[#28282B] relative">
      <div className="absolute top-0 left-0 w-[500px] h-[500px] rounded-full bg-orange-500/5 blur-[150px] pointer-events-none -z-0" />
      <Header />
      
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
