"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { MOCK_VENUES } from "@/lib/mockData";
import BackButton from "@/components/BackButton";

const ALL_SPORTS = ["Football", "Basketball", "Tennis", "Badminton", "Cricket", "Rugby", "GAA", "Athletics"];
const ALL_FACILITIES = ["Floodlights", "Changing rooms", "Parking", "Café", "Equipment hire", "Lockers"];
const CITIES = ["Dublin", "Cork", "Galway", "Limerick", "Waterford", "Belfast"];

export default function EditVenuePage() {
  const params = useParams();
  const router = useRouter();
  const venueId = params.venueId as string;
  const initialVenue = MOCK_VENUES.find((v) => v.id === venueId);

  const [toast, setToast] = useState({ show: false, message: "" });
  
  // State for form
  const [name, setName] = useState(initialVenue?.name || "");
  const [address, setAddress] = useState(initialVenue?.address || "");
  const [city, setCity] = useState(initialVenue?.city || "Dublin");
  const [description, setDescription] = useState(initialVenue?.description || "");
  const [pricePerHour, setPricePerHour] = useState(initialVenue?.pricePerHour || 0);
  
  const [sports, setSports] = useState<string[]>(initialVenue?.sports || []);
  const [facilities, setFacilities] = useState<string[]>(initialVenue?.facilities || []);

  if (!initialVenue) return <div className="p-10 text-center">Venue not found</div>;

  const handleToggle = (item: string, list: string[], setList: (v: string[]) => void) => {
    if (list.includes(item)) {
      setList(list.filter(i => i !== item));
    } else {
      setList([...list, item]);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setToast({ show: true, message: "Venue updated successfully ✓" });
    setTimeout(() => {
      setToast({ show: false, message: "" });
      router.push("/owner/dashboard");
    }, 2000);
  };

  return (
    <div className="min-h-screen pt-24 pb-20 px-6 max-w-3xl mx-auto">
      <div className="mb-6"><BackButton /></div>
      {/* Toast */}
      {toast.show && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-[#22c55e] text-white px-6 py-3 rounded-full shadow-2xl z-50 flex items-center gap-2 animate-in slide-in-from-bottom border border-green-400">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          {toast.message}
        </div>
      )}

      <div className="mb-8">
        <Link href="/owner/dashboard" className="text-gray-400 hover:text-white transition-colors text-sm flex items-center gap-1 mb-6">
          ← Back to dashboard
        </Link>
        <h1 className="text-3xl font-bold mb-2">Edit Venue Details</h1>
        <p className="text-[#888888]">Update information for {initialVenue.name}</p>
      </div>

      <form onSubmit={handleSave} className="space-y-10 bg-[#1a1a1a] border border-[#2a2a2a] rounded-3xl p-8">
        
        {/* Basic Info */}
        <div className="space-y-5">
          <h2 className="text-xl font-bold border-b border-[#2a2a2a] pb-3 mb-5">Basic Information</h2>
          
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Venue name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-[#0d0d0d] border border-[#2a2a2a] rounded-xl px-4 py-3 text-white w-full focus:outline-none focus:border-[#4a6cf7] transition-colors"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Address</label>
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="bg-[#0d0d0d] border border-[#2a2a2a] rounded-xl px-4 py-3 text-white w-full focus:outline-none focus:border-[#4a6cf7]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">City</label>
              <select
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="bg-[#0d0d0d] border border-[#2a2a2a] rounded-xl px-4 py-3 text-white w-full focus:outline-none focus:border-[#4a6cf7] appearance-none"
              >
                {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Description</label>
            <textarea
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-[#0d0d0d] border border-[#2a2a2a] rounded-xl px-4 py-3 text-white w-full h-32 resize-none focus:outline-none focus:border-[#4a6cf7]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Price per hour (€)</label>
            <input
              type="number"
              required
              min="0"
              value={pricePerHour}
              onChange={(e) => setPricePerHour(Number(e.target.value))}
              className="bg-[#0d0d0d] border border-[#2a2a2a] rounded-xl px-4 py-3 text-white w-full focus:outline-none focus:border-[#4a6cf7]"
            />
          </div>
        </div>

        {/* Sports */}
        <div>
          <h2 className="text-xl font-bold border-b border-[#2a2a2a] pb-3 mb-5">Sports Available</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {ALL_SPORTS.map(sport => {
              const isSelected = sports.includes(sport);
              return (
                <div 
                  key={sport}
                  onClick={() => handleToggle(sport, sports, setSports)}
                  className={`border rounded-xl p-3 cursor-pointer text-center text-sm transition-all ${
                    isSelected 
                      ? "border-[#4a6cf7] bg-[#4a6cf7]/10 text-[#4a6cf7] font-bold" 
                      : "border-[#2a2a2a] bg-[#0d0d0d] text-gray-400 hover:border-gray-600"
                  }`}
                >
                  {sport}
                </div>
              );
            })}
          </div>
        </div>

        {/* Facilities */}
        <div>
          <h2 className="text-xl font-bold border-b border-[#2a2a2a] pb-3 mb-5">Facilities</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {ALL_FACILITIES.map(facility => {
              const isSelected = facilities.includes(facility);
              return (
                <div 
                  key={facility}
                  onClick={() => handleToggle(facility, facilities, setFacilities)}
                  className={`border rounded-xl p-3 cursor-pointer text-center text-sm transition-all ${
                    isSelected 
                      ? "border-[#22c55e] bg-[#22c55e]/10 text-[#22c55e] font-bold" 
                      : "border-[#2a2a2a] bg-[#0d0d0d] text-gray-400 hover:border-gray-600"
                  }`}
                >
                  {facility}
                </div>
              );
            })}
          </div>
        </div>

        <div className="pt-6 border-t border-[#2a2a2a]">
           <button
            type="submit"
            className="w-full bg-[#4a6cf7] hover:bg-[#3b5de7] text-white rounded-full px-6 py-4 font-bold text-lg transition-colors shadow-lg"
          >
            Save changes
          </button>
        </div>
      </form>
    </div>
  );
}
