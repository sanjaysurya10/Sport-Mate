"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <div className="fixed top-0 left-0 right-0 h-14 bg-[#141414] border-b border-white/[0.06] z-50 flex items-center px-6">
      <Link href="/">
        <svg width="70" height="36" viewBox="0 0 70 40" fill="none" className="text-white hover:opacity-80 transition-opacity">
          <rect x="2" y="2" width="66" height="36" rx="4" stroke="currentColor" strokeWidth="2" fill="none"/>
          <text x="10" y="20" fill="currentColor" fontSize="10" fontWeight="bold" fontFamily="sans-serif">SPORT</text>
          <text x="10" y="32" fill="currentColor" fontSize="10" fontWeight="bold" fontFamily="sans-serif">MATE</text>
        </svg>
      </Link>
    </div>
  );
}
