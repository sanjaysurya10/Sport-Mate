"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [role, setRole] = useState<"player" | "owner">("player");
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [city, setCity] = useState("");
  const [venueName, setVenueName] = useState("");
  const [venueAddress, setVenueAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
          role,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Registration failed");
        setLoading(false);
        return;
      }

      setSuccess("Account created successfully! Redirecting to login...");

      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#28282B] relative flex items-center justify-center px-6 py-12">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-[#4a6cf7]/5 blur-[120px] pointer-events-none" />

      <div className="animate-enter card p-10 max-w-md w-full">
        <div className="text-center mb-8">
          <Link href="/">
            <img
              src="/logo.png"
              alt="Sport Mate Logo"
              className="w-16 h-16 mx-auto mb-6 rounded-full object-cover shadow-xl border border-white/10 hover:opacity-80 transition-opacity"
            />
          </Link>
          <h1 className="geo-sans glass-text-chrome text-3xl font-black pb-2">
            Create an account
          </h1>
          <p className="text-gray-400 text-sm mt-2">
            Join Ireland&apos;s #1 sports booking platform
          </p>
        </div>

        <div className="flex gap-4 mb-6">
          <button
            type="button"
            onClick={() => setRole("player")}
            className={`flex-1 py-2 rounded-full text-sm font-medium border transition-colors ${
              role === "player"
                ? "bg-[#4a6cf7] border-[#4a6cf7] text-white"
                : "border-white/[0.08] text-gray-400 hover:text-white"
            }`}
          >
            I&apos;m a Player
          </button>

          <button
            type="button"
            onClick={() => setRole("owner")}
            className={`flex-1 py-2 rounded-full text-sm font-medium border transition-colors ${
              role === "owner"
                ? "bg-[#4a6cf7] border-[#4a6cf7] text-white"
                : "border-white/[0.08] text-gray-400 hover:text-white"
            }`}
          >
            I&apos;m a Venue Owner
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Full name"
            required
            className="input-dark"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            type="email"
            placeholder="Email address"
            required
            className="input-dark"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            required
            className="input-dark"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <input
            type="password"
            placeholder="Confirm password"
            required
            className="input-dark"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <select
            className="input-dark appearance-none"
            required
            value={city}
            onChange={(e) => setCity(e.target.value)}
          >
            <option value="" disabled>
              Select City
            </option>
            <option value="Dublin">Dublin</option>
            <option value="Cork">Cork</option>
            <option value="Galway">Galway</option>
            <option value="Limerick">Limerick</option>
            <option value="Waterford">Waterford</option>
            <option value="Belfast">Belfast</option>
          </select>

          {role === "owner" && (
            <>
              <input
                type="text"
                placeholder="Venue name"
                required
                className="input-dark"
                value={venueName}
                onChange={(e) => setVenueName(e.target.value)}
              />

              <input
                type="text"
                placeholder="Venue address"
                required
                className="input-dark"
                value={venueAddress}
                onChange={(e) => setVenueAddress(e.target.value)}
              />

              <input
                type="tel"
                placeholder="Phone number"
                required
                className="input-dark"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </>
          )}

          {error && <p className="text-red-400 text-sm text-center">{error}</p>}
          {success && (
            <p className="text-green-400 text-sm text-center">{success}</p>
          )}

          <button type="submit" className="btn-primary w-full mt-4" disabled={loading}>
            {loading ? "Creating account..." : "Create my account"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-400 mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-[#4a6cf7] hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}