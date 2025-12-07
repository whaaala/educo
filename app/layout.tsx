"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AcademicYearProvider } from "@/contexts/AcademicYearContext";
import { SidebarProvider } from "@/contexts/SidebarContext";
import { CountryProvider } from "@/contexts/CountryContext";
import { SchoolSettingsProvider } from "@/contexts/SchoolSettingsContext";
import { TransferProvider } from "@/contexts/TransferContext";
import { TranscriptProvider } from "@/contexts/TranscriptContext";
import { AttendanceProvider } from "@/contexts/AttendanceContext";
import { GradingProvider } from "@/contexts/GradingContext";
import { LeaveProvider } from "@/contexts/LeaveContext";
import { PerformanceProvider } from "@/contexts/PerformanceContext";
import { DisciplineProvider } from "@/contexts/DisciplineContext";
import { UserProvider } from "@/contexts/UserContext";

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
                <UserProvider>
                  <GradingProvider>
                    <TransferProvider>
                      <LeaveProvider>
                        <PerformanceProvider>
                          <DisciplineProvider>
                            <TranscriptProvider>
                              <AttendanceProvider>
                                <SidebarProvider>
                                  {children}
                                </SidebarProvider>
                              </AttendanceProvider>
                            </TranscriptProvider>
                          </DisciplineProvider>
                        </PerformanceProvider>
                      </LeaveProvider>
                    </TransferProvider>
                  </GradingProvider>
                </UserProvider>
              </SchoolSettingsProvider>
            </AcademicYearProvider>
          </CountryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
