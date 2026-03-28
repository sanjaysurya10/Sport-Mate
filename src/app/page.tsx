"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import NotificationBell from "@/components/NotificationBell";
import { useAuth } from "@/lib/authContext";
import { X, Menu } from "lucide-react";

// Navigation Component
function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled ? "nav-glass" : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/">
              <img 
                src="/logo.png" 
                alt="Sport Mate Logo" 
                className="w-11 h-11 rounded-full object-cover hover:opacity-80 transition-opacity border border-white/10"
              />
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/games" className="text-white/70 hover:text-white transition-colors text-sm font-medium tracking-wide">
              Games
            </Link>
            <Link href="/venues" className="text-white/70 hover:text-white transition-colors text-sm font-medium tracking-wide">
              Venues
            </Link>
            <Link href="/coaches" className="text-white/70 hover:text-white transition-colors text-sm font-medium tracking-wide">
              Coaches
            </Link>
            <Link href="/tournaments" className="text-white/70 hover:text-white transition-colors text-sm font-medium tracking-wide">
              Tournaments
            </Link>
            {user ? (
              <div className="flex items-center gap-4">
                <NotificationBell />
                <Link
                  href={
                    user.role === "admin"
                      ? "/admin"
                      : user.role === "owner"
                      ? "/owner/dashboard"
                      : "/dashboard"
                  }
                  className="text-white/70 hover:text-white transition-colors text-sm font-medium tracking-wide"
                >
                  Dashboard
                </Link>
              </div>
            ) : (
              <Link href="/login" className="text-white/70 hover:text-white transition-colors text-sm font-medium tracking-wide">
                Login
              </Link>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-4 md:hidden">
            {user && <NotificationBell />}
            <button className="text-white" onClick={() => setMenuOpen(true)}>
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {menuOpen && (
        <div className="fixed inset-0 bg-[#141414] z-50 flex flex-col p-8">
          <div className="flex justify-end">
            <button className="text-white" onClick={() => setMenuOpen(false)}>
              <X className="w-8 h-8" />
            </button>
          </div>
          <nav className="flex flex-col gap-6 mt-12">
            <Link href="/games" onClick={() => setMenuOpen(false)} className="text-2xl font-bold">Games</Link>
            <Link href="/venues" onClick={() => setMenuOpen(false)} className="text-2xl font-bold">Venues</Link>
            <Link href="/coaches" onClick={() => setMenuOpen(false)} className="text-2xl font-bold">Coaches</Link>
            <Link href="/tournaments" onClick={() => setMenuOpen(false)} className="text-2xl font-bold">Tournaments</Link>
            {user ? (
              <Link
                href={
                  user.role === "admin"
                    ? "/admin"
                    : user.role === "owner"
                    ? "/owner/dashboard"
                    : "/dashboard"
                }
                onClick={() => setMenuOpen(false)}
                className="text-2xl font-bold"
              >
                Dashboard
              </Link>
            ) : (
              <Link href="/login" onClick={() => setMenuOpen(false)} className="text-2xl font-bold">Login</Link>
            )}
          </nav>
        </div>
      )}
    </>
  );
}

// Hero Section — Cinematic Video Background
function HeroSection() {
  const [currentWord, setCurrentWord] = useState(0);
  const words = ["games", "sports"];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWord((prev) => (prev + 1) % words.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      className="matte-grain relative min-h-screen overflow-hidden"
      style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1459865264687-595d652de67e?w=800&q=80')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Cinematic Video Background */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="hero-video absolute inset-0 w-full h-full object-cover z-0"
        style={{ filter: "brightness(0.6) saturate(0.8)" }}
      >
        <source
          src="https://assets.mixkit.co/videos/preview/mixkit-football-field-at-night-with-bright-lights-4582-large.mp4"
          type="video/mp4"
        />
        <img
          src="https://images.unsplash.com/photo-1459865264687-595d652de67e?w=1600&q=80"
          alt="Sports venue"
          className="absolute inset-0 w-full h-full object-cover"
        />
      </video>

      {/* Dark Scrim */}
      <div className="video-scrim" />

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 relative z-10 pt-24 pb-20 min-h-screen flex items-center">
        <div className="grid lg:grid-cols-2 gap-12 items-center w-full">

          {/* Left Content */}
          <div className="stagger-children space-y-8">
            {/* Eyebrow label */}
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#4a6cf7] glow-pulse inline-block" />
              <span className="text-xs font-bold uppercase tracking-[0.15em] text-[#4a6cf7]">
                Ireland&apos;s #1 Sports Booking Platform
              </span>
            </div>

            <h1
              className="geo-sans text-6xl md:text-7xl font-black leading-tight"
              style={{
                WebkitTextStroke: '1px rgba(255,255,255,0.85)',
                backgroundImage: `linear-gradient(
                  160deg,
                  rgba(255,255,255,0.0)  0%,
                  rgba(255,255,255,0.40) 20%,
                  rgba(255,255,255,0.0) 38%,
                  rgba(255,255,255,0.25) 55%,
                  rgba(255,255,255,0.0) 72%,
                  rgba(255,255,255,0.30) 88%,
                  rgba(255,255,255,0.0) 100%
                )`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              The easiest way
              <br />
              to host{" "}
              <span
                key={currentWord}
                style={{
                  WebkitTextStroke: '1px rgba(140,170,255,0.9)',
                  backgroundImage: `linear-gradient(
                    160deg,
                    rgba(120,160,255,0.0)  0%,
                    rgba(160,190,255,0.40) 22%,
                    rgba(100,140,255,0.0) 42%,
                    rgba(150,185,255,0.30) 60%,
                    rgba(100,140,255,0.0) 78%,
                    rgba(140,175,255,0.45) 100%
                  )`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  display: 'inline-block',
                  minWidth: '200px',
                  animation: 'wordFadeIn 0.4s cubic-bezier(0.25,0.46,0.45,0.94) both',
                }}
              >
                {words[currentWord]}
              </span>
            </h1>

            <p
              className="text-gray-300 text-lg max-w-md leading-relaxed"
              style={{ textShadow: "0 2px 12px rgba(0,0,0,0.9)" }}
            >
              Explore your neighbourhood and find a game in no time.
            </p>

            <Link
              href="/register"
              className="geo-sans inline-block rounded-3xl px-8 py-4 font-bold text-sm tracking-[0.12em] uppercase transition-all duration-300 hover:-translate-y-1"
              style={{
                background: 'rgba(255, 255, 255, 0.15)',
                color: '#ffffff',
                border: '1px solid rgba(255,255,255,0.4)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                boxShadow: '0 2px 8px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.2)',
              }}
            >
              SECURE YOUR SPOT
            </Link>
          </div>

          {/* Right Content */}
          <div className="relative flex flex-col items-center justify-center gap-8">
            <h2
              className="geo-sans text-[80px] md:text-[120px] font-black uppercase leading-none text-center"
              style={{
                WebkitTextStroke: '1.5px rgba(255,255,255,0.9)',
                backgroundImage: `linear-gradient(
                  155deg,
                  rgba(255,255,255,0.0)  0%,
                  rgba(255,255,255,0.50) 18%,
                  rgba(255,255,255,0.0) 34%,
                  rgba(255,255,255,0.40) 50%,
                  rgba(255,255,255,0.0) 66%,
                  rgba(255,255,255,0.55) 82%,
                  rgba(255,255,255,0.0) 100%
                )`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              SPORT
              <br />
              MATE
            </h2>

            {/* Floating Stat Cards */}
            <div className="flex flex-wrap gap-4 justify-center">
              {[
                { number: "500+", label: "Venues", sub: "Across Ireland" },
                { number: "12K+", label: "Players", sub: "Active this month" },
                { number: "4.9★", label: "Rating", sub: "Average venue score" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-3xl px-5 py-4 text-center min-w-[110px]"
                  style={{
                    background: 'rgba(255,255,255,0.08)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    backdropFilter: 'blur(12px)',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.15)'
                  }}
                >
                  <div className="text-2xl font-black text-white">{stat.number}</div>
                  <div className="text-xs text-gray-300 mt-1">{stat.sub}</div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

// Features Section (How it works)
function FeaturesSection() {
  const features = [
    {
      title: "A game always ready for you",
      description: "Whether its an evening of intense football or a casual round of badminton, youll always find a game to join.",
      color: "green",
      image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&q=80"
    },
    {
      title: "Make new friends on court",
      description: "Meet interesting players who share your love for the game and grow your sports circle!",
      color: "purple",
      image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80"
    },
    {
      title: "Win rewards as you play",
      description: "Earn Turf Coins by playing games and redeem them for more play time.",
      color: "orange",
      image: "https://images.unsplash.com/photo-1551958219-acbc608c6377?w=800&q=80"
    }
  ];

  return (
    <section className="py-24 relative overflow-hidden bg-[#1B1B1B]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#4a6cf7] mb-3">How It Works</p>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            The easiest way to play sports
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="relative group">
              <div className={`absolute inset-0 bg-gradient-to-b from-${feature.color}-500/20 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity`} />
              <div
                className="bg-[#141414] border border-white/[0.06] rounded-3xl p-8 relative overflow-hidden h-full feature-card"
                style={{ boxShadow: "inset 1px 1px 0 rgba(255,255,255,0.05)" }}
              >
                <div className={`absolute top-0 left-0 w-24 h-24 bg-${feature.color}-500/30 rounded-full gradient-blur`} />
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                  <p className="text-gray-400 text-base leading-relaxed">
                    {feature.description}
                  </p>
                </div>
                <div className="mt-8 relative h-48 rounded-2xl overflow-hidden">
                  <Image
                    src={feature.image}
                    alt={feature.title}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Host Features Bento Grid
function HostFeaturesSection() {
  return (
    <section className="py-24 relative bg-[#28282B]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#4a6cf7] mb-3">Made for the host in you</p>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            Organising a game has never been this easy!
          </h2>
        </div>

        {/* Bento Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Large Card */}
          <div className="lg:col-span-4 bg-[#141414] border border-white/[0.06] rounded-3xl p-8 feature-card">
            <h3 className="text-2xl font-bold mb-3">Discover the best places to play</h3>
            <p className="text-gray-400 text-base leading-relaxed max-w-md">
              Browse through the hottest venues in Ireland. Look up photos, read reviews, and start hosting with a tap.
            </p>
            <div className="mt-8 relative h-64 rounded-2xl overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1459865264687-595d652de67e?w=1200&q=80"
                alt="Sports venues"
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Never run short of players */}
          <div className="lg:col-span-2 bg-[#141414] border border-white/[0.06] rounded-3xl p-8 feature-card">
            <h3 className="text-xl font-bold mb-3">Never run short of players</h3>
            <p className="text-gray-400 text-base leading-relaxed">
              Post your game on Sport Mate and get players from across your neighbourhood to join in and make your game happen.
            </p>
            <div className="mt-6 relative h-40 rounded-2xl overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=800&q=80"
                alt="Players"
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Split the bill */}
          <div className="lg:col-span-2 bg-[#141414] border border-white/[0.06] rounded-3xl p-8 feature-card">
            <h3 className="text-xl font-bold mb-3">Split the bill effortlessly</h3>
            <p className="text-gray-400 text-base leading-relaxed">
              Get everyone to pay their share directly on the app and prevent chaos at the payment desk.
            </p>
            <div className="mt-6 relative h-40 rounded-2xl overflow-hidden bg-gradient-to-br from-[#1a1a1a] to-[#141414] flex items-center justify-center">
              <div className="flex items-center gap-4">
                <div className="flex -space-x-2">
                  {['#4a6cf7', '#22c55e', '#f97316', '#8b5cf6'].map((color, i) => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-[#141414]" style={{ backgroundColor: color }} />
                  ))}
                </div>
                <div className="text-2xl font-bold text-green-500">= Euro. 50</div>
              </div>
            </div>
          </div>

          {/* Share links */}
          <div className="lg:col-span-2 bg-[#141414] border border-white/[0.06] rounded-3xl p-8 feature-card">
            <h3 className="text-xl font-bold mb-3">Share Universal Game links</h3>
            <p className="text-gray-400 text-base leading-relaxed">
              You never have to copy-paste the player list again. Share a game link and let Sport Mate keep track for you.
            </p>
            <div className="mt-6 relative h-40 rounded-2xl overflow-hidden bg-gradient-to-br from-[#1a1a1a] to-[#141414] flex items-center justify-center">
              <div className="flex items-center gap-2 bg-[#28282B] px-4 py-3 rounded-xl border border-white/[0.06]">
                <svg className="w-5 h-5 text-[#4a6cf7]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
                <span className="text-sm text-gray-300">sportmate.in/g/abc123</span>
                <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Avoid dropouts */}
          <div className="lg:col-span-2 bg-[#141414] border border-white/[0.06] rounded-3xl p-8 feature-card">
            <h3 className="text-xl font-bold mb-3">Avoid last minute dropouts</h3>
            <p className="text-gray-400 text-base leading-relaxed">
              Worried of players bailing at the last second? Turn on{" "}
              <span className="text-[#4a6cf7]">Pay-to-join</span> and get them to pay their share before joining.
            </p>
            <div className="mt-6 relative h-40 rounded-2xl overflow-hidden bg-gradient-to-br from-[#1a1a1a] to-[#141414] flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto bg-green-500/20 rounded-full flex items-center justify-center mb-3">
                  <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <p className="text-gray-400 text-sm">Pay-to-join enabled</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Venues Section
function VenuesSection() {
  const venueImages = [
    "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600&q=80",
    "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=600&q=80",
    "https://images.unsplash.com/photo-1551958219-acbc608c6377?w=600&q=80",
    "https://images.unsplash.com/photo-1459865264687-595d652de67e?w=600&q=80",
    "https://images.unsplash.com/photo-1584810359583-96fc3448beaa?w=600&q=80",
    "https://images.unsplash.com/photo-1521412644187-c49fa049e84d?w=600&q=80",
  ];

  return (
    <section className="py-24 relative overflow-hidden bg-[#1B1B1B]">
      {/* Blue curved line */}
      <svg
        className="absolute top-0 left-0 w-full h-full pointer-events-none"
        viewBox="0 0 1440 600"
        preserveAspectRatio="none"
      >
        <path
          d="M0,100 Q400,300 700,200 T1200,400 T1440,200"
          className="blue-curve"
          strokeWidth="3"
        />
      </svg>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#4a6cf7] mb-3">Our Network</p>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            Home to some of the<br />biggest venues in Ireland.
          </h2>
        </div>

        {/* Venue Logos */}
        <div className="flex flex-wrap justify-center items-center gap-8 mb-16">
          {[' UL Sports Arena', 'MTU Sports Arena', 'UCD Bowl', 'Irishtown Stadium', 'Eamonn Deacy Park', 'The valley'].map((name, i) => (
            <div key={i} className="px-6 py-3 bg-[#141414] rounded-lg border border-white/[0.06]">
              <span className="text-sm text-gray-400 font-medium">{name}</span>
            </div>
          ))}
        </div>

        {/* Venue Images Marquee */}
        <div className="pause-on-hover overflow-hidden">
          <div className="flex gap-4 animate-marquee-slow">
            {[...venueImages, ...venueImages].map((img, index) => (
              <div
                key={index}
                className="flex-shrink-0 w-64 h-40 relative rounded-2xl overflow-hidden"
              >
                <Image
                  src={img}
                  alt={`Venue ${index + 1}`}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Second row - reverse */}
        <div className="pause-on-hover overflow-hidden mt-4">
          <div className="flex gap-4 animate-marquee-reverse">
            {[...venueImages].reverse().map((img, index) => (
              <div
                key={index}
                className="flex-shrink-0 w-64 h-40 relative rounded-2xl overflow-hidden"
              >
                <Image
                  src={img}
                  alt={`Venue ${index + 1}`}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// CTA Section
function CTASection() {
  return (
    <section className="py-24 relative overflow-hidden bg-[#28282B]">
      {/* Background gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#4a6cf7]/10 to-transparent" />

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-8">
              Let&apos;s get a game going
            </h2>
            <Link href="/venues" className="btn-primary">
              Start playing
            </Link>
          </div>

          {/* Right Content - Football Illustration */}
          <div className="relative h-[400px] hidden lg:flex items-center justify-center">
            <div className="relative">
              {/* Football Player Body */}
              <div className="w-44 h-80 bg-gradient-to-br from-blue-500 to-indigo-700 rounded-t-full relative">
                {/* Head */}
                <div className="absolute top-6 left-1/2 -translate-x-1/2 w-16 h-16 bg-gradient-to-br from-amber-700 to-amber-900 rounded-full" />
                {/* Jersey */}
                <div className="absolute top-24 left-0 w-full h-32 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg" />
                {/* Shorts */}
                <div className="absolute bottom-16 left-0 w-full h-20 bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-lg" />
                {/* Left Leg */}
                <div className="absolute bottom-0 left-6 w-8 h-20 bg-gradient-to-b from-gray-200 to-gray-400 rounded-full" />
                {/* Right Leg */}
                <div className="absolute bottom-0 right-6 w-8 h-20 bg-gradient-to-b from-gray-200 to-gray-400 rounded-full" />
                {/* Football */}
                <div className="absolute bottom-4 -right-14 w-14 h-14 bg-white rounded-full border-4 border-gray-300 flex items-center justify-center shadow-lg">
                  <div
                    className="w-8 h-8 bg-black opacity-80"
                    style={{ clipPath: "polygon(50% 0%, 95% 35%, 80% 90%, 20% 90%, 5% 35%)" }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Cities Section
function CitiesSection() {
  const cities = [
    {
      name: "Dublin",
      venues: [
        "5-a-side football pitches",
        "Full-size football grounds",
        "GAA pitches",
        "Rugby training grounds",
        "Indoor sports halls",
        "Tennis courts",
        "Basketball courts",
        "Astro turf pitches",
      ],
    },
    {
      name: "Cork",
      venues: [
        "5-a-side football pitches",
        "GAA grounds",
        "Rugby pitches",
        "Indoor soccer arenas",
        "Tennis courts",
        "Community sports centres",
      ],
    },
    {
      name: "Galway",
      venues: [
        "Football pitches",
        "GAA pitches",
        "Astro turf grounds",
        "Rugby training fields",
        "Indoor sports halls",
      ],
    },
    {
      name: "Limerick",
      venues: [
        "5-a-side football pitches",
        "Rugby grounds",
        "University sports arenas",
        "Astro turf facilities",
        "Basketball courts",
      ],
    },
    {
      name: "Waterford",
      venues: [
        "Football grounds",
        "GAA pitches",
        "Community sports centres",
        "Indoor courts",
      ],
    },
    {
      name: "Belfast",
      venues: [
        "Football stadiums",
        "Astro turf pitches",
        "Rugby grounds",
        "Indoor sports arenas",
        "Training facilities",
      ],
    },
  ];

  return (
    <section className="py-16 bg-[#1B1B1B] border-t border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-6">
        <h3 className="text-lg font-bold mb-8">Counties we operate in</h3>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-8">
          {cities.map((city) => (
            <div key={city.name}>
              <h4 className="font-bold mb-3">{city.name}</h4>
              <div className="flex flex-wrap gap-x-4 gap-y-2">
                {city.venues.map((venue) => (
                  <a
                    key={venue}
                    href={`/${city.name.toLowerCase()}/${venue.toLowerCase().replace(/ /g, "-")}`}
                    className="text-gray-400 text-sm hover:text-white transition-colors"
                  >
                    {venue} in {city.name}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Footer
function Footer() {
  return (
    <footer className="py-12 bg-[#141414] border-t border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-12">
          {/* Logo & tagline */}
          <div className="md:col-span-2">
            <Link href="/">
              <svg width="70" height="40" viewBox="0 0 70 40" fill="none" className="text-white mb-4 hover:opacity-80 transition-opacity">
                <rect x="2" y="2" width="66" height="36" rx="4" stroke="currentColor" strokeWidth="2" fill="none"/>
                <text x="10" y="20" fill="currentColor" fontSize="10" fontWeight="bold" fontFamily="sans-serif">SPORT</text>
                <text x="10" y="32" fill="currentColor" fontSize="10" fontWeight="bold" fontFamily="sans-serif">MATE</text>
              </svg>
            </Link>
            <p className="text-gray-400 text-sm">
              Designed for sports &amp; made by Dragonfruit Maynooth
            </p>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-bold mb-4">Company</h4>
            <ul className="space-y-3">
              <li><a href="/contact" className="text-gray-400 text-sm hover:text-white transition-colors">Contact Us</a></li>
              <li><a href="/blog" className="text-gray-400 text-sm hover:text-white transition-colors">Blog</a></li>
              <li><a href="/terms" className="text-gray-400 text-sm hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="/privacy" className="text-gray-400 text-sm hover:text-white transition-colors">Privacy Policy</a></li>
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h4 className="font-bold mb-4">Social</h4>
            <ul className="space-y-3">
              <li><a href="https://instagram.com" className="text-gray-400 text-sm hover:text-white transition-colors">Instagram</a></li>
              <li><a href="https://twitter.com" className="text-gray-400 text-sm hover:text-white transition-colors">X</a></li>
              <li><a href="https://linkedin.com" className="text-gray-400 text-sm hover:text-white transition-colors">LinkedIn</a></li>
              <li><a href="https://facebook.com" className="text-gray-400 text-sm hover:text-white transition-colors">Facebook</a></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}

// Main Page Component
export default function Home() {
  return (
    <main className="min-h-screen bg-[#28282B]">
      <Header />
      <HeroSection />
      <FeaturesSection />
      <HostFeaturesSection />
      <VenuesSection />
      <CTASection />
      <CitiesSection />
      <Footer />
    </main>
  );
}
