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
      const parsedUser = JSON.parse(savedUser);

      if (parsedUser.role !== "owner") {
        router.push("/login");
        return;
      }

      setUser(parsedUser);
      fetchTurfs(parsedUser);
    } catch {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      router.push("/login");
    }
  }, [router]);

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

  if (!user) {
    return (
      <div className="min-h-screen pt-32 px-6 max-w-7xl mx-auto text-center bg-[#28282B] text-white">
        <h1 className="text-3xl font-bold mb-4">Loading owner dashboard...</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-20 px-6 max-w-7xl mx-auto bg-[#28282B] relative text-white">
      <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-[#8b5cf6]/6 blur-[120px] pointer-events-none" />

      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6 relative z-10">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#4a6cf7] mb-3">
            Owner Portal
          </p>
          <h1 className="text-5xl md:text-6xl font-black tracking-tight leading-none mb-2">
            Owner dashboard
          </h1>
          <p className="text-gray-400">Welcome back, {user.name}</p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => router.push("/")}
            className="border border-white/[0.08] hover:bg-white/[0.04] rounded-full px-6 py-2 text-sm font-medium transition-colors text-white"
          >
            Home
          </button>

          <button
            onClick={handleLogout}
            className="border border-red-500/50 text-red-500 hover:bg-red-500/10 rounded-full px-6 py-2 text-sm font-medium transition-colors"
          >
            Log out
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-16 relative z-10">
        <div className="bg-[#141414] border border-white/[0.06] rounded-2xl p-6 border-l-2 border-[#4a6cf7]">
          <div className="text-3xl font-black mb-1">{turfs.length}</div>
          <div className="text-sm text-gray-400">Your venues</div>
        </div>

        <div className="bg-[#141414] border border-white/[0.06] rounded-2xl p-6 border-l-2 border-[#22c55e]">
          <div className="text-3xl font-black mb-1 text-[#22c55e]">
            {turfs.filter((turf) => turf.isAvailable).length}
          </div>
          <div className="text-sm text-gray-400">Available venues</div>
        </div>

        <div className="bg-[#141414] border border-white/[0.06] rounded-2xl p-6 border-l-2 border-[#f97316]">
          <div className="text-3xl font-black mb-1 text-[#f97316]">
            {turfs.filter((turf) => !turf.isAvailable).length}
          </div>
          <div className="text-sm text-gray-400">Unavailable venues</div>
        </div>

        <div className="bg-[#141414] border border-white/[0.06] rounded-2xl p-6 border-l-2 border-[#8b5cf6]">
          <div className="text-3xl font-black mb-1 text-[#8b5cf6]">
            Owner
          </div>
          <div className="text-sm text-gray-400">Account type</div>
        </div>
      </div>

      <div className="bg-[#141414] border border-white/[0.06] rounded-3xl p-6 mb-12 relative z-10">
        <h2 className="text-2xl font-bold mb-6">Add New Turf</h2>

        {error && <p className="text-red-400 mb-4">{error}</p>}
        {successMessage && <p className="text-green-400 mb-4">{successMessage}</p>}

        <form onSubmit={handleAddTurf} className="grid md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Turf name"
            className="input-dark"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <input
            type="text"
            placeholder="Location"
            className="input-dark"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />

          <input
            type="text"
            placeholder="Sport type (e.g. Football)"
            className="input-dark"
            value={sportType}
            onChange={(e) => setSportType(e.target.value)}
            required
          />

          <input
            type="number"
            placeholder="Price per hour"
            className="input-dark"
            value={pricePerHour}
            onChange={(e) => setPricePerHour(e.target.value)}
            required
          />

          <input
            type="text"
            placeholder="Facilities (comma separated)"
            className="input-dark md:col-span-2"
            value={facilities}
            onChange={(e) => setFacilities(e.target.value)}
          />

          <button
            type="submit"
            className="btn-primary md:col-span-2"
            disabled={addingTurf}
          >
            {addingTurf ? "Adding turf..." : "Add Turf"}
          </button>
        </form>
      </div>

      <div className="relative z-10">
        <h2 className="text-3xl font-bold tracking-tight mb-6">My Venues</h2>

        {loading ? (
          <p className="text-gray-400">Loading your turfs...</p>
        ) : turfs.length === 0 ? (
          <div className="bg-[#141414] border border-white/[0.06] rounded-3xl p-6">
            <p className="text-gray-400">No turfs found. Add your first turf above.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {turfs.map((turf) => (
              <div
                key={turf._id}
                className="bg-[#141414] border border-white/[0.06] rounded-3xl p-6"
              >
                <h3 className="font-bold text-xl mb-2">{turf.name}</h3>
                <p className="text-gray-400 mb-1">{turf.location}</p>
                <p className="text-gray-300 mb-1">Sport: {turf.sportType}</p>
                <p className="text-gray-300 mb-1">€{turf.pricePerHour} / hour</p>
                <p className="text-gray-300 mb-3">
                  Status:{" "}
                  <span className={turf.isAvailable ? "text-green-400" : "text-red-400"}>
                    {turf.isAvailable ? "Available" : "Unavailable"}
                  </span>
                </p>

                {turf.facilities?.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {turf.facilities.map((facility, index) => (
                      <span
                        key={index}
                        className="bg-white/[0.05] border border-white/[0.06] text-gray-300 text-xs px-2 py-1 rounded-md"
                      >
                        {facility}
                      </span>
                    ))}
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