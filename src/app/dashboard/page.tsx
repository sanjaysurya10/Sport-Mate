"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Owner = {
  _id: string;
  name: string;
  email: string;
  role: string;
};

type Turf = {
  _id: string;
  name: string;
  location: string;
  sportType: string;
  pricePerHour: number;
  facilities: string[];
  ownerId?: Owner;
  isAvailable: boolean;
};

type User = {
  id?: string;
  _id?: string;
  name: string;
  email: string;
  role: string;
};

export default function DashboardPage() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [turfs, setTurfs] = useState<Turf[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [bookingMessage, setBookingMessage] = useState("");

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (!savedUser || !token) {
      router.push("/login");
      return;
    }

    try {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
    } catch {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      router.push("/login");
      return;
    }

    fetchTurfs();
  }, [router]);

  const fetchTurfs = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("http://127.0.0.1:5000/api/turfs");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch turfs");
      }

      setTurfs(data);
    } catch {
      setError("Could not load turfs");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  const handleBookTurf = async (turfId: string) => {
    try {
      setBookingMessage("");

      const token = localStorage.getItem("token");

      if (!token) {
        router.push("/login");
        return;
      }

      const response = await fetch("http://127.0.0.1:5000/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          turfId,
          bookingDate: "2026-04-14",
          timeSlot: "1:00 PM - 2:00 PM",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setBookingMessage(data.message || "Booking failed");
        return;
      }

      setBookingMessage("Booking created successfully");
    } catch {
      setBookingMessage("Something went wrong while booking");
    }
  };

  return (
    <div className="min-h-screen bg-[#28282B] text-white px-6 py-10">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Player Dashboard</h1>
            {user && (
              <p className="text-gray-400 mt-2">
                Welcome, {user.name} ({user.role})
              </p>
            )}
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => router.push("/my-bookings")}
              className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg"
            >
              My Bookings
            </button>

            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg"
            >
              Logout
            </button>
          </div>
        </div>

        {error && <p className="text-red-400 mb-4 text-sm">{error}</p>}

        {bookingMessage && (
          <p className="text-green-400 mb-4 text-sm">{bookingMessage}</p>
        )}

        <h2 className="text-2xl font-semibold mb-6">Available Turfs</h2>

        {loading ? (
          <p className="text-gray-400">Loading turfs...</p>
        ) : turfs.length === 0 ? (
          <p className="text-gray-400">No turfs found.</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {turfs.map((turf) => (
              <div
                key={turf._id}
                className="bg-[#1f1f22] border border-white/10 rounded-2xl p-5 shadow-lg"
              >
                <h3 className="text-xl font-semibold mb-2">{turf.name}</h3>
                <p className="text-gray-300 mb-1">Location: {turf.location}</p>
                <p className="text-gray-300 mb-1">Sport: {turf.sportType}</p>
                <p className="text-gray-300 mb-1">
                  Price: €{turf.pricePerHour} / hour
                </p>
                <p className="text-gray-300 mb-1">
                  Available: {turf.isAvailable ? "Yes" : "No"}
                </p>

                {turf.facilities && turf.facilities.length > 0 && (
                  <div className="mt-3">
                    <p className="text-sm text-gray-400 mb-2">Facilities:</p>
                    <div className="flex flex-wrap gap-2">
                      {turf.facilities.map((facility, index) => (
                        <span
                          key={index}
                          className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded-full"
                        >
                          {facility}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <button
                  onClick={() => handleBookTurf(turf._id)}
                  className="mt-5 w-full bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg"
                >
                  Book Turf
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}