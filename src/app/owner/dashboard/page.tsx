"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import BackButton from "@/components/BackButton";

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
  unavailableDates?: string[];
  ownerId?: {
    _id: string;
    name: string;
    email: string;
    role: string;
  };
  isAvailable: boolean;
};

type ClosedDateState = {
  [turfId: string]: string;
};

export default function OwnerDashboardPage() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [turfs, setTurfs] = useState<Turf[]>([]);
  const [loading, setLoading] = useState(true);
  const [authChecking, setAuthChecking] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [closedDateForm, setClosedDateForm] = useState<ClosedDateState>({});

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

      if (parsedUser.role !== "owner" && parsedUser.role !== "admin") {
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

  const handleClosedDateChange = (turfId: string, date: string) => {
    setClosedDateForm((prev) => ({
      ...prev,
      [turfId]: date,
    }));
  };

  const handleAddClosedDate = async (turfId: string) => {
    try {
      setError("");
      setSuccessMessage("");

      const token = localStorage.getItem("token");
      const selectedDate = closedDateForm[turfId];

      if (!token) {
        router.push("/login");
        return;
      }

      if (!selectedDate) {
        setError("Please select a date to close this turf");
        return;
      }

      const response = await fetch(
        `http://localhost:5000/api/turfs/${turfId}/unavailable`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            date: selectedDate,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to add closed date");
        return;
      }

      setSuccessMessage("Closed date added successfully");
      setClosedDateForm((prev) => ({
        ...prev,
        [turfId]: "",
      }));

      if (user) fetchTurfs(user);
    } catch {
      setError("Something went wrong while adding closed date");
    }
  };

  const handleRemoveClosedDate = async (turfId: string, date: string) => {
    try {
      setError("");
      setSuccessMessage("");

      const token = localStorage.getItem("token");

      if (!token) {
        router.push("/login");
        return;
      }

      const response = await fetch(
        `http://localhost:5000/api/turfs/${turfId}/unavailable`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            date,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to remove closed date");
        return;
      }

      setSuccessMessage("Closed date removed successfully");

      if (user) fetchTurfs(user);
    } catch {
      setError("Something went wrong while removing closed date");
    }
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

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#28282B] text-white px-6 py-10">
      <div className="max-w-6xl mx-auto">
        <div className="mb-4"><BackButton /></div>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Owner Dashboard</h1>
            <p className="text-gray-400 mt-2">
              Welcome, Sanjay Surya
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
        {successMessage && (
          <p className="text-green-400 mb-4">{successMessage}</p>
        )}

        <h2 className="text-2xl font-semibold mb-6">My Turfs</h2>

        {loading ? (
          <p className="text-gray-400">Loading your turfs...</p>
        ) : turfs.length === 0 ? (
          <p className="text-gray-400">
            No turfs found. Add your first turf below.
          </p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
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

                <div className="mt-5 bg-[#2c2c31] rounded-xl p-4">
                  <h4 className="font-semibold mb-3">Close turf on a date</h4>

                  <input
                    type="date"
                    value={closedDateForm[turf._id] || ""}
                    onChange={(e) =>
                      handleClosedDateChange(turf._id, e.target.value)
                    }
                    className="w-full bg-[#1f1f22] border border-white/10 rounded-lg px-3 py-2 text-white mb-3"
                  />

                  <button
                    onClick={() => handleAddClosedDate(turf._id)}
                    className="w-full bg-orange-600 hover:bg-orange-700 px-4 py-2 rounded-lg"
                  >
                    Mark as Closed
                  </button>

                  <div className="mt-4">
                    <p className="text-sm text-gray-400 mb-2">Closed dates:</p>

                    {turf.unavailableDates &&
                    turf.unavailableDates.length > 0 ? (
                      <div className="space-y-2">
                        {turf.unavailableDates.map((date) => (
                          <div
                            key={date}
                            className="flex items-center justify-between bg-[#1f1f22] border border-white/10 rounded-lg px-3 py-2"
                          >
                            <span className="text-sm">{date}</span>
                            <button
                              onClick={() =>
                                handleRemoveClosedDate(turf._id, date)
                              }
                              className="text-xs text-red-400 hover:text-red-300"
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">
                        No closed dates added.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="bg-[#1f1f22] border border-white/10 rounded-2xl p-6">
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
      </div>
    </div>
  );
}