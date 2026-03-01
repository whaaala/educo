"use client";

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
import { ChildLeaveProvider } from "@/contexts/ChildLeaveContext";
import { PerformanceProvider } from "@/contexts/PerformanceContext";
import { DisciplineProvider } from "@/contexts/DisciplineContext";
import { UserProvider } from "@/contexts/UserContext";
import { MeetingsProvider } from "@/contexts/MeetingsContext";
import { CommunicationProvider } from "@/contexts/CommunicationContext";
import { StorageProvider } from "@/contexts/StorageContext";
import { CallProvider } from "@/hooks/useCall";
import { NotificationProvider } from "@/contexts/NotificationContext";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <CountryProvider>
        <AcademicYearProvider>
          <SchoolSettingsProvider>
            <UserProvider>
              <GradingProvider>
                <TransferProvider>
                  <LeaveProvider>
                    <ChildLeaveProvider>
                      <PerformanceProvider>
                        <DisciplineProvider>
                          <TranscriptProvider>
                            <AttendanceProvider>
                              <MeetingsProvider>
                                <NotificationProvider>
                                  <CommunicationProvider>
                                    <StorageProvider>
                                      <SidebarProvider>
                                        <CallProvider
                                        currentUser={{
                                          id: "current-user-id",
                                          name: "School Staff",
                                          role: "Staff",
                                        }}
                                      >
                                          {children}
                                        </CallProvider>
                                      </SidebarProvider>
                                    </StorageProvider>
                                  </CommunicationProvider>
                                </NotificationProvider>
                              </MeetingsProvider>
                            </AttendanceProvider>
                          </TranscriptProvider>
                        </DisciplineProvider>
                      </PerformanceProvider>
                    </ChildLeaveProvider>
                  </LeaveProvider>
                </TransferProvider>
              </GradingProvider>
            </UserProvider>
          </SchoolSettingsProvider>
        </AcademicYearProvider>
      </CountryProvider>
    </ThemeProvider>
  );
}
