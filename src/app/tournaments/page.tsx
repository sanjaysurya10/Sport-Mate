"use client";

import BackButton from "@/components/BackButton";
import Navbar from "@/components/Navbar";

export default function TournamentsPage() {
  const tournaments = [
    { id: 1, title: "Summer Football Cup", sport: "Football", date: "Aug 15 - Aug 20", prize: "€1000", status: "Open" },
    { id: 2, title: "City Tennis Open", sport: "Tennis", date: "Sep 5 - Sep 10", prize: "€500", status: "Closing Soon" },
  ];

  return (
    <main className="min-h-screen pt-20 relative">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-purple-500/10 blur-[150px] pointer-events-none -z-0" />
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-12 relative z-10">
        <div className="mb-6"><BackButton /></div>
        <div className="flex justify-between items-end mb-12 flex-wrap gap-6">
          <div>
            <h1 className="geo-sans glass-text-chrome text-4xl md:text-5xl font-black mb-4 pb-2">Tournaments</h1>
            <p className="text-gray-400">Compete for glory and awesome prizes.</p>
          </div>
          <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-full text-sm font-medium transition-colors">
            Register Team
          </button>
        </div>

        <div className="space-y-6">
          {tournaments.map(tournament => (
            <div key={tournament.id} className="glass-box p-6 flex flex-col md:flex-row justify-between items-center gap-6 hover:border-purple-500/50 transition-colors">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="px-3 py-1 bg-purple-500/20 text-purple-400 text-xs font-bold rounded-full uppercase tracking-wider">{tournament.sport}</span>
                  <span className={`text-xs font-bold ${tournament.status === 'Open' ? 'text-green-500' : 'text-orange-500'}`}>{tournament.status}</span>
                </div>
                <h3 className="text-2xl font-bold mb-2">{tournament.title}</h3>
                <p className="text-gray-400 flex items-center gap-4">
                  <span>📅 {tournament.date}</span>
                  <span>🏆 Prize Pool: {tournament.prize}</span>
                </p>
              </div>
              <button className="w-full md:w-auto bg-white/10 hover:bg-white text-white hover:text-black px-8 py-3 rounded-xl text-sm font-bold transition-colors">
                View Details
              </button>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
