"use client";

import { useState } from "react";
import BackButton from "@/components/BackButton";

export default function AdminReportsPage() {
  const [showReport, setShowReport] = useState(false);

  const handleExport = () => {
    const csvData = "Date,Metric,Value\n2026-03-01,Revenue,450\n2026-03-02,Revenue,520\n2026-03-03,Revenue,380";
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sportmate_report.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div><BackButton /></div>
      <div>
        <h1 className="text-3xl font-bold mb-2">Reports & Analytics</h1>
        <p className="text-gray-400">Generate insights on platform performance.</p>
      </div>

      {/* Generator Controls */}
      <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-3xl p-6 lg:p-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-400 mb-2">Report Type</label>
            <select className="bg-[#0d0d0d] border border-[#2a2a2a] rounded-xl px-4 py-3 text-white w-full focus:outline-none focus:border-[#4a6cf7] appearance-none">
              <option>Bookings Summary</option>
              <option>Revenue by Venue</option>
              <option>New Registrations</option>
              <option>Cancellation Rate</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Date Range</label>
            <div className="flex gap-2">
               <input 
                 type="date" 
                 defaultValue="2026-03-01"
                 className="bg-[#0d0d0d] border border-[#2a2a2a] rounded-xl px-2 sm:px-4 py-3 text-white w-full focus:outline-none focus:border-[#4a6cf7] text-sm"
               />
               <input 
                 type="date" 
                 defaultValue="2026-03-31"
                 className="bg-[#0d0d0d] border border-[#2a2a2a] rounded-xl px-2 sm:px-4 py-3 text-white w-full focus:outline-none focus:border-[#4a6cf7] text-sm"
               />
            </div>
          </div>
          
          <div>
            <button
              onClick={() => setShowReport(true)}
              className="w-full bg-[#4a6cf7] hover:bg-[#3b5de7] text-white rounded-xl px-6 py-3 font-medium transition-colors shadow-lg"
            >
              Generate
            </button>
          </div>
          
        </div>
      </div>

      {/* Mock Generated Report View */}
      {showReport && (
        <div className="animate-in fade-in slide-in-from-bottom-8 duration-500 space-y-8">
          
          <div className="flex justify-between items-center bg-[#4a6cf7]/10 border border-[#4a6cf7]/30 text-[#4a6cf7] rounded-xl p-4">
            <span className="font-medium">Report generated successfully</span>
            <button 
              onClick={handleExport}
              className="border border-[#4a6cf7] text-[#4a6cf7] hover:bg-[#4a6cf7] hover:text-white px-4 py-1.5 rounded-lg text-sm font-medium transition-colors"
            >
              Export CSV
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-6">
              <div className="text-gray-400 text-sm mb-1">Total Volume</div>
              <div className="text-3xl font-bold">4,128</div>
              <div className="text-xs text-green-500 mt-2">↑ +12.5% vs last period</div>
            </div>
            <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-6">
              <div className="text-gray-400 text-sm mb-1">Average Order Value</div>
              <div className="text-3xl font-bold">€38.50</div>
              <div className="text-xs text-green-500 mt-2">↑ +2.1% vs last period</div>
            </div>
            <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-6">
              <div className="text-gray-400 text-sm mb-1">Peak Booking Time</div>
              <div className="text-3xl font-bold">18:00 - 20:00</div>
              <div className="text-xs text-blue-400 mt-2">Consistent</div>
            </div>
          </div>

          {/* Abstract SVG Chart representing trends */}
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-3xl p-6 lg:p-8">
            <h3 className="font-bold text-lg mb-6">Trend Analysis</h3>
            <div className="h-64 w-full flex items-end justify-between gap-1 sm:gap-4 group">
              {[3, 5, 4, 7, 5, 8, 6, 9, 7, 10, 8, 12].map((val, i) => (
                <div key={i} className="flex-1 bg-gradient-to-t from-[#4a6cf7]/80 to-[#8b5cf6]/80 rounded-t-lg transition-all duration-500 group-hover:opacity-80 hover:opacity-100! cursor-pointer relative" style={{ height: `${val * 8}%` }}>
                   <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 hover:opacity-100 bg-white text-black text-xs font-bold px-2 py-1 rounded transition-opacity">
                     {val * 120}
                   </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-3xl overflow-hidden">
             <table className="w-full border-collapse">
               <thead>
                 <tr className="bg-[#111111]">
                   <th className="py-4 px-6 text-left text-sm font-medium text-gray-400">Date Range</th>
                   <th className="py-4 px-6 text-left text-sm font-medium text-gray-400">Top Venue</th>
                   <th className="py-4 px-6 text-right text-sm font-medium text-gray-400">Transactions</th>
                   <th className="py-4 px-6 text-right text-sm font-medium text-gray-400">Total Value</th>
                 </tr>
               </thead>
               <tbody>
                 <tr className="border-t border-[#2a2a2a]">
                   <td className="py-4 px-6 text-sm">Mar 01 - Mar 07</td>
                   <td className="py-4 px-6 text-sm">UL Sports Arena</td>
                   <td className="py-4 px-6 text-sm text-right">342</td>
                   <td className="py-4 px-6 text-sm text-right font-medium text-[#22c55e]">€12,450</td>
                 </tr>
                 <tr className="border-t border-[#2a2a2a] bg-[#141414]">
                   <td className="py-4 px-6 text-sm">Mar 08 - Mar 14</td>
                   <td className="py-4 px-6 text-sm">UCD Bowl</td>
                   <td className="py-4 px-6 text-sm text-right">412</td>
                   <td className="py-4 px-6 text-sm text-right font-medium text-[#22c55e]">€15,200</td>
                 </tr>
                 <tr className="border-t border-[#2a2a2a]">
                   <td className="py-4 px-6 text-sm">Mar 15 - Mar 21</td>
                   <td className="py-4 px-6 text-sm">MTU Sports Arena</td>
                   <td className="py-4 px-6 text-sm text-right">389</td>
                   <td className="py-4 px-6 text-sm text-right font-medium text-[#22c55e]">€13,800</td>
                 </tr>
               </tbody>
             </table>
          </div>
        </div>
      )}
    </div>
  );
}
