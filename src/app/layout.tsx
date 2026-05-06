import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/authContext";

export const metadata: Metadata = {
  title: "Sport Mate | Turf Booking in Ireland",
  description: "Book venues, find players and discover games in your neighbourhood. Join today and start playing!",
  icons: {
    icon: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased text-white">
        {/* Global background */}
        <div className="fixed inset-0 -z-10" style={{ background: "linear-gradient(135deg, #0f0f0f 0%, #1a1a2e 50%, #0f0f0f 100%)" }} />
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
