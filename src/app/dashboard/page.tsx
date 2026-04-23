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
  isAvailable: boolean;
};

type BookingFormState = {
  [turfId: string]: {
    bookingDate: string;
    timeSlot: string;
  };
};

type WeatherState = {
  [turfId: string]: {
    temperature: number;
    condition: string;
    description: string;
    humidity: number;
    windSpeed: number;
  };
};

export default function DashboardPage() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [turfs, setTurfs] = useState<Turf[]>([]);
  const [loading, setLoading] = useState(true);
  const [authChecking, setAuthChecking] = useState(true);
  const [error, setError] = useState("");
  const [bookingMessage, setBookingMessage] = useState("");
  const [bookingError, setBookingError] = useState("");
  const [bookingLoading, setBookingLoading] = useState<string | null>(null);
  const [bookingForm, setBookingForm] = useState<BookingFormState>({});
  const [weatherData, setWeatherData] = useState<WeatherState>({});
  const [weatherLoading, setWeatherLoading] = useState(false);

  const timeSlots = [
    "8:00 AM - 9:00 AM",
    "9:00 AM - 10:00 AM",
    "10:00 AM - 11:00 AM",
    "11:00 AM - 12:00 PM",
    "12:00 PM - 1:00 PM",
    "1:00 PM - 2:00 PM",
    "2:00 PM - 3:00 PM",
    "3:00 PM - 4:00 PM",
    "4:00 PM - 5:00 PM",
    "5:00 PM - 6:00 PM",
  ];

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (!savedUser || !token) {
      router.push("/login");
      return;
    }

    try {
      const parsedUser: User = JSON.parse(savedUser);

      if (parsedUser.role === "owner") {
        router.push("/owner/dashboard");
        return;
      }

      if (parsedUser.role === "admin") {
        router.push("/admin");
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
    fetchTurfs();
  }, [user]);

  const fetchTurfs = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("http://localhost:5000/api/turfs");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch turfs");
      }

      setTurfs(data);

      const initialFormState: BookingFormState = {};
      data.forEach((turf: Turf) => {
        initialFormState[turf._id] = {
          bookingDate: "",
          timeSlot: "",
        };
      });

      setBookingForm(initialFormState);
      fetchWeatherForTurfs(data);
    } catch {
      setError("Could not load turfs");
    } finally {
      setLoading(false);
    }
  };

  const fetchWeatherForTurfs = async (turfList: Turf[]) => {
    try {
      setWeatherLoading(true);

      const weatherResults: WeatherState = {};

      for (const turf of turfList) {
        try {
          const response = await fetch(
            `http://localhost:5000/api/weather?city=${encodeURIComponent(
              turf.location
            )}`
          );
          const data = await response.json();

          if (response.ok) {
            weatherResults[turf._id] = {
              temperature: data.temperature,
              condition: data.condition,
              description: data.description,
              humidity: data.humidity,
              windSpeed: data.windSpeed,
            };
          }
        } catch {
          // ignore single weather failure
        }
      }

      setWeatherData(weatherResults);
    } finally {
      setWeatherLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  const handleBookingInputChange = (
    turfId: string,
    field: "bookingDate" | "timeSlot",
    value: string
  ) => {
    setBookingForm((prev) => ({
      ...prev,
      [turfId]: {
        ...prev[turfId],
        [field]: value,
      },
    }));
  };

  const handleBookTurf = async (turfId: string) => {
    try {
      setBookingMessage("");
      setBookingError("");
      setBookingLoading(turfId);

      const token = localStorage.getItem("token");

      if (!token) {
        router.push("/login");
        return;
      }

      const selectedDate = bookingForm[turfId]?.bookingDate;
      const selectedTime = bookingForm[turfId]?.timeSlot;

      if (!selectedDate || !selectedTime) {
        setBookingError("Please select both booking date and time slot");
        setBookingLoading(null);
        return;
      }

      const response = await fetch("http://localhost:5000/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          turfId,
          bookingDate: selectedDate,
          timeSlot: selectedTime,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setBookingError(data.message || "Booking failed");
        setBookingLoading(null);
        return;
      }

      setBookingMessage("Booking created successfully");

      setBookingForm((prev) => ({
        ...prev,
        [turfId]: {
          bookingDate: "",
          timeSlot: "",
        },
      }));
    } catch {
      setBookingError("Something went wrong while booking");
    } finally {
      setBookingLoading(null);
    }
  };

  if (authChecking) {
    return (
      <div className="min-h-screen bg-[#28282B] text-white px-6 py-10">
        <div className="max-w-6xl mx-auto">
          <p className="text-gray-400">Checking login...</p>
        </div>
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
            <h1 className="text-3xl font-bold">Player Dashboard</h1>
            <p className="text-gray-400 mt-2">
              Welcome, {user.name} ({user.role})
            </p>
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
        {bookingError && (
          <p className="text-red-400 mb-4 text-sm">{bookingError}</p>
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

                <div className="mt-3 text-sm text-gray-300 bg-[#2c2c31] rounded-lg p-3">
                  <p className="font-medium mb-1">🌤 Weather</p>
                  {weatherLoading ? (
                    <p>Loading weather...</p>
                  ) : weatherData[turf._id] ? (
                    <>
                      <p>Temp: {weatherData[turf._id].temperature}°C</p>
                      <p>Condition: {weatherData[turf._id].condition}</p>
                      <p>Description: {weatherData[turf._id].description}</p>
                      <p>Humidity: {weatherData[turf._id].humidity}%</p>
                      <p>Wind: {weatherData[turf._id].windSpeed} m/s</p>
                    </>
                  ) : (
                    <p>Weather not available</p>
                  )}
                </div>

                <div className="mt-4 space-y-3">
                  <input
                    type="date"
                    value={bookingForm[turf._id]?.bookingDate || ""}
                    onChange={(e) =>
                      handleBookingInputChange(
                        turf._id,
                        "bookingDate",
                        e.target.value
                      )
                    }
                    className="w-full bg-[#2c2c31] border border-white/10 rounded-lg px-3 py-2 text-white"
                  />

                  <select
                    value={bookingForm[turf._id]?.timeSlot || ""}
                    onChange={(e) =>
                      handleBookingInputChange(
                        turf._id,
                        "timeSlot",
                        e.target.value
                      )
                    }
                    className="w-full bg-[#2c2c31] border border-white/10 rounded-lg px-3 py-2 text-white"
                  >
                    <option value="">Select time slot</option>
                    {timeSlots.map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={() => handleBookTurf(turf._id)}
                  className="mt-5 w-full bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg disabled:opacity-60"
                  disabled={bookingLoading === turf._id}
                >
                  {bookingLoading === turf._id ? "Booking..." : "Book Turf"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}