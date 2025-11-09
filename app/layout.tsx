"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AcademicYearProvider } from "@/contexts/AcademicYearContext";
import { SidebarProvider } from "@/contexts/SidebarContext";
import { CountryProvider } from "@/contexts/CountryContext";
import { SchoolSettingsProvider } from "@/contexts/SchoolSettingsContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-full bg-gray-50 dark:bg-[#0f1115] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e] transition-colors duration-300`}
      >
        <ThemeProvider>
          <CountryProvider>
            <AcademicYearProvider>
              <SchoolSettingsProvider>
                <SidebarProvider>
                  {children}
                </SidebarProvider>
              </SchoolSettingsProvider>
            </AcademicYearProvider>
          </CountryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
