"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import BackButton from "@/components/BackButton";

type Booking = {
  _id: string;
  bookingDate: string;
  timeSlot: string;
  status: string;
  turfId: {
    name: string;
    location: string;
    sportType: string;
    pricePerHour: number;
  };
  userId: {
    _id: string;
    name: string;
    email: string;
    role: string;
  };
};

type User = {
  id?: string;
  _id?: string;
  name: string;
  email: string;
  role: string;
};

export default function MyBookingsPage() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (!savedUser || !token) {
      router.push("/login");
      return;
    }

    const parsedUser = JSON.parse(savedUser);
    setUser(parsedUser);
    fetchBookings(parsedUser);
  }, [router]);

  const fetchBookings = async (loggedInUser: User) => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("http://127.0.0.1:5000/api/bookings");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch bookings");
      }

      const currentUserId = loggedInUser.id || loggedInUser._id;

      const userBookings = data.filter(
        (booking: Booking) => booking.userId?._id === currentUserId
      );

      setBookings(userBookings);
    } catch (err) {
      setError("Could not load bookings");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        router.push("/login");
        return;
      }

      const response = await fetch(
        `http://127.0.0.1:5000/api/bookings/${bookingId}/cancel`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Cancel failed");
        return;
      }

      setMessage("Booking cancelled successfully");

      if (user) {
        fetchBookings(user);
      }
    } catch (err) {
      setMessage("Something went wrong");
    }
  };

  return (
    <div className="min-h-screen bg-[#28282B] text-white px-6 py-10">
      <div className="max-w-5xl mx-auto">
        <div className="mb-4"><BackButton /></div>
      <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">My Bookings</h1>
            <p className="text-gray-400 mt-2">
              View and manage your turf bookings
            </p>
          </div>

          <button
            onClick={() => router.push("/dashboard")}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg"
          >
            Back to Dashboard
          </button>
        </div>

        {error && <p className="text-red-400 mb-4">{error}</p>}
        {message && <p className="text-green-400 mb-4">{message}</p>}

        {loading ? (
          <p className="text-gray-400">Loading bookings...</p>
        ) : bookings.length === 0 ? (
          <p className="text-gray-400">No bookings found.</p>
        ) : (
          <div className="grid gap-6">
            {bookings.map((booking) => (
              <div
                key={booking._id}
                className="bg-[#1f1f22] border border-white/10 rounded-2xl p-5 shadow-lg"
              >
                <h2 className="text-xl font-semibold mb-2">
                  {booking.turfId?.name}
                </h2>
                <p className="text-gray-300">Location: {booking.turfId?.location}</p>
                <p className="text-gray-300">Sport: {booking.turfId?.sportType}</p>
                <p className="text-gray-300">
                  Price: €{booking.turfId?.pricePerHour} / hour
                </p>
                <p className="text-gray-300 mt-2">
                  Date: {booking.bookingDate}
                </p>
                <p className="text-gray-300">Time Slot: {booking.timeSlot}</p>
                <p className="text-gray-300">
                  Status:{" "}
                  <span
                    className={
                      booking.status === "booked"
                        ? "text-green-400"
                        : "text-red-400"
                    }
                  >
                    {booking.status}
                  </span>
                </p>

                {booking.status === "booked" && (
                  <button
                    onClick={() => handleCancelBooking(booking._id)}
                    className="mt-4 bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg"
                  >
                    Cancel Booking
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}