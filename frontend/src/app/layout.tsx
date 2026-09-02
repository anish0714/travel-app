import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";
import Nav from "@/components/Nav";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Waypoint — Canadian Travel Booking",
  description: "Search and book flights and hotels across Canada.",
};

const RootLayout = ({ children }: { children: ReactNode }) => (
  <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
    <body className="min-h-full flex flex-col bg-paper">
      <AuthProvider>
        <Nav />
        <main className="flex-1">{children}</main>
      </AuthProvider>
    </body>
  </html>
);

export default RootLayout;
