"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type User = {
  id?: string;
  _id?: string;
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
  ownerId?: {
    _id: string;
    name: string;
    email: string;
    role: string;
  };
  isAvailable: boolean;
};

export default function OwnerDashboardPage() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [turfs, setTurfs] = useState<Turf[]>([]);
  const [loading, setLoading] = useState(true);
  const [authChecking, setAuthChecking] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [sportType, setSportType] = useState("");
  const [pricePerHour, setPricePerHour] = useState("");
  const [facilities, setFacilities] = useState("");
  const [addingTurf, setAddingTurf] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (!savedUser || !token) {
      router.push("/login");
      return;
    }

    try {
      const parsedUser: User = JSON.parse(savedUser);

      if (parsedUser.role !== "owner") {
        router.push("/login");
        return;
      }

      setUser(parsedUser);
    } catch {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      router.push("/login");
      return;
    } finally {
      setAuthChecking(false);
    }
  }, [router]);

  useEffect(() => {
    if (!user) return;
    fetchTurfs(user);
  }, [user]);

  const fetchTurfs = async (loggedInUser: User) => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("http://localhost:5000/api/turfs");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch turfs");
      }

      const ownerId = loggedInUser.id || loggedInUser._id;

      const ownerTurfs = data.filter((turf: Turf) => {
        const turfOwnerId =
          typeof turf.ownerId === "object" ? turf.ownerId?._id : turf.ownerId;
        return turfOwnerId === ownerId;
      });

      setTurfs(ownerTurfs);
    } catch {
      setError("Could not load your turfs");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  const handleAddTurf = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) return;

    setError("");
    setSuccessMessage("");
    setAddingTurf(true);

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        router.push("/login");
        return;
      }

      const response = await fetch("http://localhost:5000/api/turfs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          location,
          sportType,
          pricePerHour: Number(pricePerHour),
          facilities: facilities
            .split(",")
            .map((item) => item.trim())
            .filter((item) => item !== ""),
          ownerId: user.id || user._id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to add turf");
        setAddingTurf(false);
        return;
      }

      setSuccessMessage("Turf added successfully");

      setName("");
      setLocation("");
      setSportType("");
      setPricePerHour("");
      setFacilities("");

      fetchTurfs(user);
    } catch {
      setError("Something went wrong while adding turf");
    } finally {
      setAddingTurf(false);
    }
  };

  if (authChecking) {
    return (
      <div className="min-h-screen bg-[#28282B] text-white p-8">
        <p className="text-gray-400">Checking owner login...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#28282B] text-white px-6 py-10">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Owner Dashboard</h1>
            <p className="text-gray-400 mt-2">
              Welcome, {user.name} ({user.role})
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => router.push("/")}
              className="bg-gray-700 hover:bg-gray-800 px-4 py-2 rounded-lg"
            >
              Home
            </button>

            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg"
            >
              Logout
            </button>
          </div>
        </div>

        {error && <p className="text-red-400 mb-4">{error}</p>}
        {successMessage && <p className="text-green-400 mb-4">{successMessage}</p>}

        <div className="bg-[#1f1f22] border border-white/10 rounded-2xl p-6 mb-10">
          <h2 className="text-2xl font-semibold mb-6">Add New Turf</h2>

          <form onSubmit={handleAddTurf} className="grid md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Turf name"
              className="w-full bg-[#2c2c31] border border-white/10 rounded-lg px-3 py-2 text-white"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <input
              type="text"
              placeholder="Location"
              className="w-full bg-[#2c2c31] border border-white/10 rounded-lg px-3 py-2 text-white"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />

            <input
              type="text"
              placeholder="Sport type (e.g. Football)"
              className="w-full bg-[#2c2c31] border border-white/10 rounded-lg px-3 py-2 text-white"
              value={sportType}
              onChange={(e) => setSportType(e.target.value)}
              required
            />

            <input
              type="number"
              placeholder="Price per hour"
              className="w-full bg-[#2c2c31] border border-white/10 rounded-lg px-3 py-2 text-white"
              value={pricePerHour}
              onChange={(e) => setPricePerHour(e.target.value)}
              required
            />

            <input
              type="text"
              placeholder="Facilities (comma separated)"
              className="w-full bg-[#2c2c31] border border-white/10 rounded-lg px-3 py-2 text-white md:col-span-2"
              value={facilities}
              onChange={(e) => setFacilities(e.target.value)}
            />

            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg md:col-span-2"
              disabled={addingTurf}
            >
              {addingTurf ? "Adding turf..." : "Add Turf"}
            </button>
          </form>
        </div>

        <h2 className="text-2xl font-semibold mb-6">My Turfs</h2>

        {loading ? (
          <p className="text-gray-400">Loading your turfs...</p>
        ) : turfs.length === 0 ? (
          <p className="text-gray-400">No turfs found. Add your first turf above.</p>
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

                {turf.facilities?.length > 0 && (
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
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}