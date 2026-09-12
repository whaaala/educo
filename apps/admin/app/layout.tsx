"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { CountryProvider } from "@/contexts/CountryContext";
import { SchoolSettingsProvider } from "@/contexts/SchoolSettingsContext";
import { SidebarProvider } from "@/contexts/SidebarContext";
import { UserProvider } from "@/contexts/UserContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { StorageProvider } from "@/contexts/StorageContext";

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
            <SchoolSettingsProvider>
              <UserProvider>
                <NotificationProvider>
                  <StorageProvider>
                    <SidebarProvider>
                      {children}
                    </SidebarProvider>
                  </StorageProvider>
                </NotificationProvider>
              </UserProvider>
            </SchoolSettingsProvider>
          </CountryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
