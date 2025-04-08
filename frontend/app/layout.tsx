import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { LocationProvider } from "@/context/locationContext";
import { ToastContainer, Slide } from "react-toastify";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Cesi Eat",
  description: "CESI EAT",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div id="__next"></div>
        <LocationProvider>
          <ToastContainer
            position="top-right"
            autoClose={3000}
            transition={Slide}
          />{" "}
          {children}
        </LocationProvider>
      </body>
    </html>
  );
}
