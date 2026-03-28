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
      <body className="antialiased bg-[#0d0d0d] text-white">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
