"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

// Meeting types
export type MeetingType = "scheduled" | "requested" | "follow_up" | "emergency" | "custom";
export type MeetingFormat = "in_person" | "virtual";
export type VirtualType = "video" | "audio";
export type MeetingStatus = "scheduled" | "in-progress" | "completed" | "cancelled" | "pending_approval";
export type MeetingPlatform = "zoom" | "google-meet" | "whatsapp-video" | "whatsapp-voice" | "educo-meet" | "in-person";

// Unified Meeting interface used across all portals
export interface Meeting {
  id: string;
  // Meeting details
  title: string;
  description?: string;
  meetingType: MeetingType;
  customMeetingType?: string;
  meetingFormat: MeetingFormat;
  virtualType?: VirtualType;
  platform: MeetingPlatform;
  // Schedule
  scheduledDate: string;
  scheduledTime: string;
  duration: number; // in minutes
  status: MeetingStatus;
  // Location
  location: string;
  meetingLink?: string;
  meetingId?: string;
  passcode?: string;
  // Participants
  parentId: string;
  parentName: string;
  childId?: string;
  childName?: string;
  childClass?: string;
  teacherId: string;
  teacherName: string;
  teacherRole?: string;
  teacherPhoto?: string;
  // Metadata
  requestedBy: "parent" | "teacher" | "admin";
  requestedByName: string;
  notes?: string;
  outcome?: string;
  followUpRequired?: boolean;
  followUpDate?: string;
  createdAt: string;
  updatedAt: string;
}

// Data for creating a new meeting
export interface CreateMeetingData {
  title: string;
  description?: string;
  meetingType: MeetingType;
  customMeetingType?: string;
  meetingFormat: MeetingFormat;
  virtualType?: VirtualType;
  platform?: MeetingPlatform;
  scheduledDate: string;
  scheduledTime: string;
  duration: number;
  location: string;
  meetingLink?: string;
  parentId: string;
  parentName: string;
  childId?: string;
  childName?: string;
  childClass?: string;
  teacherId: string;
  teacherName: string;
  teacherRole?: string;
  teacherPhoto?: string;
  requestedBy: "parent" | "teacher" | "admin";
  requestedByName: string;
  notes?: string;
}

interface MeetingsContextType {
  meetings: Meeting[];
  addMeeting: (meetingData: CreateMeetingData) => Meeting;
  updateMeeting: (id: string, updates: Partial<Meeting>) => void;
  deleteMeeting: (id: string) => void;
  getMeetingsByParent: (parentId: string) => Meeting[];
  getMeetingsByTeacher: (teacherId: string) => Meeting[];
  getMeetingsByChild: (childId: string) => Meeting[];
  getUpcomingMeetings: () => Meeting[];
  getPastMeetings: () => Meeting[];
}

const MeetingsContext = createContext<MeetingsContextType | undefined>(undefined);

const STORAGE_KEY = "educo_meetings";
const VERSION_KEY = "educo_meetings_version";
const CURRENT_VERSION = "1";

// Initial mock meetings data
const INITIAL_MEETINGS: Meeting[] = [
  {
    id: "meet-001",
    title: "Parent-Teacher Conference",
    description: "Discuss Adaeze's academic progress and areas for improvement",
    meetingType: "scheduled",
    meetingFormat: "virtual",
    virtualType: "video",
    platform: "zoom",
    scheduledDate: "2026-01-25",
    scheduledTime: "10:00",
    duration: 30,
    status: "scheduled",
    location: "Zoom",
    meetingLink: "https://zoom.us/j/1234567890",
    meetingId: "123 456 7890",
    passcode: "abc123",
    parentId: "parent-001",
    parentName: "Mr. & Mrs. Okonkwo",
    childId: "std-001",
    childName: "Adaeze Okonkwo",
    childClass: "SS 2",
    teacherId: "tch-001",
    teacherName: "Mrs. Nkechi Eze",
    teacherRole: "Class Teacher",
    teacherPhoto: "https://i.pravatar.cc/150?u=teacher-nkechi",
    requestedBy: "teacher",
    requestedByName: "Mrs. Nkechi Eze",
    createdAt: "2026-01-20T10:00:00Z",
    updatedAt: "2026-01-20T10:00:00Z",
  },
  {
    id: "meet-002",
    title: "Chemistry Lab Discussion",
    description: "Review lab safety and upcoming experiments",
    meetingType: "scheduled",
    meetingFormat: "virtual",
    virtualType: "video",
    platform: "google-meet",
    scheduledDate: "2026-01-26",
    scheduledTime: "14:00",
    duration: 45,
    status: "scheduled",
    location: "Google Meet",
    meetingLink: "https://meet.google.com/abc-defg-hij",
    parentId: "parent-001",
    parentName: "Mr. & Mrs. Okonkwo",
    childId: "std-002",
    childName: "Chukwuemeka Okonkwo",
    childClass: "JSS 3",
    teacherId: "tch-002",
    teacherName: "Mr. Chidi Okoro",
    teacherRole: "Chemistry Teacher",
    teacherPhoto: "https://i.pravatar.cc/150?u=teacher-chidi",
    requestedBy: "teacher",
    requestedByName: "Mr. Chidi Okoro",
    createdAt: "2026-01-21T09:00:00Z",
    updatedAt: "2026-01-21T09:00:00Z",
  },
  {
    id: "meet-003",
    title: "Quick Check-in Call",
    description: "Follow up on homework submission",
    meetingType: "follow_up",
    meetingFormat: "virtual",
    virtualType: "audio",
    platform: "whatsapp-voice",
    scheduledDate: "2026-01-24",
    scheduledTime: "16:30",
    duration: 15,
    status: "completed",
    location: "WhatsApp",
    parentId: "parent-001",
    parentName: "Mr. & Mrs. Okonkwo",
    childId: "std-001",
    childName: "Adaeze Okonkwo",
    childClass: "SS 2",
    teacherId: "tch-003",
    teacherName: "Mr. Tunde Adeyemi",
    teacherRole: "Mathematics Teacher",
    teacherPhoto: "https://i.pravatar.cc/150?u=teacher-tunde",
    requestedBy: "teacher",
    requestedByName: "Mr. Tunde Adeyemi",
    createdAt: "2026-01-22T08:00:00Z",
    updatedAt: "2026-01-24T17:00:00Z",
  },
  {
    id: "meet-004",
    title: "Sports Day Planning",
    description: "Discuss student participation in upcoming sports day",
    meetingType: "scheduled",
    meetingFormat: "virtual",
    virtualType: "video",
    platform: "whatsapp-video",
    scheduledDate: "2026-01-27",
    scheduledTime: "11:00",
    duration: 20,
    status: "scheduled",
    location: "WhatsApp Video",
    parentId: "parent-001",
    parentName: "Mr. & Mrs. Okonkwo",
    childId: "std-002",
    childName: "Chukwuemeka Okonkwo",
    childClass: "JSS 3",
    teacherId: "tch-004",
    teacherName: "Coach Emeka",
    teacherRole: "Physical Education",
    teacherPhoto: "https://i.pravatar.cc/150?u=coach-emeka",
    requestedBy: "parent",
    requestedByName: "Mr. Okonkwo",
    createdAt: "2026-01-23T14:00:00Z",
    updatedAt: "2026-01-23T14:00:00Z",
  },
  {
    id: "meet-005",
    title: "Term Review Meeting",
    description: "End of term performance review with principal",
    meetingType: "scheduled",
    meetingFormat: "virtual",
    virtualType: "video",
    platform: "zoom",
    scheduledDate: "2026-01-20",
    scheduledTime: "09:00",
    duration: 60,
    status: "completed",
    location: "Zoom",
    meetingLink: "https://zoom.us/j/9876543210",
    meetingId: "987 654 3210",
    parentId: "parent-001",
    parentName: "Mr. & Mrs. Okonkwo",
    childId: "std-001",
    childName: "Adaeze Okonkwo",
    childClass: "SS 2",
    teacherId: "tch-005",
    teacherName: "Dr. Amaka Obi",
    teacherRole: "Principal",
    teacherPhoto: "https://i.pravatar.cc/150?u=principal",
    requestedBy: "admin",
    requestedByName: "School Admin",
    createdAt: "2026-01-15T10:00:00Z",
    updatedAt: "2026-01-20T10:30:00Z",
  },
  {
    id: "meet-006",
    title: "Cancelled - Science Fair Planning",
    description: "Was scheduled to discuss science fair project",
    meetingType: "scheduled",
    meetingFormat: "virtual",
    virtualType: "video",
    platform: "google-meet",
    scheduledDate: "2026-01-22",
    scheduledTime: "15:00",
    duration: 30,
    status: "cancelled",
    location: "Google Meet",
    parentId: "parent-001",
    parentName: "Mr. & Mrs. Okonkwo",
    childId: "std-001",
    childName: "Adaeze Okonkwo",
    childClass: "SS 2",
    teacherId: "tch-007",
    teacherName: "Mrs. Ada Nwosu",
    teacherRole: "Science Teacher",
    teacherPhoto: "https://i.pravatar.cc/150?u=teacher-ada",
    requestedBy: "teacher",
    requestedByName: "Mrs. Ada Nwosu",
    createdAt: "2026-01-18T11:00:00Z",
    updatedAt: "2026-01-21T09:00:00Z",
  },
  {
    id: "meet-007",
    title: "Academic Counseling Session",
    description: "Discuss career guidance and subject selection for next term",
    meetingType: "scheduled",
    meetingFormat: "virtual",
    virtualType: "video",
    platform: "educo-meet",
    scheduledDate: "2026-01-28",
    scheduledTime: "15:00",
    duration: 40,
    status: "scheduled",
    location: "Educo Meet",
    meetingLink: "/meetings/room/educo-meet-abc123",
    parentId: "parent-001",
    parentName: "Mr. & Mrs. Okonkwo",
    childId: "std-001",
    childName: "Adaeze Okonkwo",
    childClass: "SS 2",
    teacherId: "tch-006",
    teacherName: "Mrs. Funke Adeleke",
    teacherRole: "Academic Counselor",
    teacherPhoto: "https://i.pravatar.cc/150?u=counselor-funke",
    requestedBy: "parent",
    requestedByName: "Mrs. Okonkwo",
    createdAt: "2026-01-24T16:00:00Z",
    updatedAt: "2026-01-24T16:00:00Z",
  },
];

export function MeetingsProvider({ children }: { children: ReactNode }) {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load meetings from localStorage on mount
  useEffect(() => {
    try {
      const version = localStorage.getItem(VERSION_KEY);

      // Clear old data if version mismatch or initialize with mock data
      if (version !== CURRENT_VERSION) {
        console.log("MeetingsContext: Initializing with default meetings");
        localStorage.removeItem(STORAGE_KEY);
        localStorage.setItem(VERSION_KEY, CURRENT_VERSION);
        setMeetings(INITIAL_MEETINGS);
      } else {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          console.log("MeetingsContext: Loaded meetings from localStorage", parsed.length);
          setMeetings(parsed);
        } else {
          setMeetings(INITIAL_MEETINGS);
        }
      }
    } catch (error) {
      console.error("MeetingsContext: Error loading from localStorage", error);
      localStorage.removeItem(STORAGE_KEY);
      setMeetings(INITIAL_MEETINGS);
    }
    setIsHydrated(true);
  }, []);

  // Save meetings to localStorage whenever they change
  useEffect(() => {
    if (isHydrated) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(meetings));
        console.log("MeetingsContext: Saved meetings to localStorage", meetings.length);
      } catch (error) {
        console.error("MeetingsContext: Error saving to localStorage", error);
      }
    }
  }, [meetings, isHydrated]);

  // Helper to determine platform from meeting data
  const determinePlatform = (data: CreateMeetingData): MeetingPlatform => {
    if (data.platform) return data.platform;

    if (data.meetingFormat === "in_person") return "in-person";

    const location = data.location.toLowerCase();
    if (location.includes("zoom")) return "zoom";
    if (location.includes("google")) return "google-meet";
    if (location.includes("whatsapp")) {
      return data.virtualType === "video" ? "whatsapp-video" : "whatsapp-voice";
    }
    return "educo-meet";
  };

  const addMeeting = (meetingData: CreateMeetingData): Meeting => {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    const uniqueId = `meet-${timestamp}-${random}`;

    const newMeeting: Meeting = {
      id: uniqueId,
      title: meetingData.title,
      description: meetingData.description,
      meetingType: meetingData.meetingType,
      customMeetingType: meetingData.customMeetingType,
      meetingFormat: meetingData.meetingFormat,
      virtualType: meetingData.virtualType,
      platform: determinePlatform(meetingData),
      scheduledDate: meetingData.scheduledDate,
      scheduledTime: meetingData.scheduledTime,
      duration: meetingData.duration,
      status: "scheduled",
      location: meetingData.location,
      meetingLink: meetingData.meetingLink,
      parentId: meetingData.parentId,
      parentName: meetingData.parentName,
      childId: meetingData.childId,
      childName: meetingData.childName,
      childClass: meetingData.childClass,
      teacherId: meetingData.teacherId,
      teacherName: meetingData.teacherName,
      teacherRole: meetingData.teacherRole,
      teacherPhoto: meetingData.teacherPhoto,
      requestedBy: meetingData.requestedBy,
      requestedByName: meetingData.requestedByName,
      notes: meetingData.notes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    console.log("MeetingsContext: Adding new meeting", newMeeting);
    setMeetings((prev) => [newMeeting, ...prev]);
    return newMeeting;
  };

  const updateMeeting = (id: string, updates: Partial<Meeting>) => {
    setMeetings((prev) =>
      prev.map((meeting) =>
        meeting.id === id
          ? { ...meeting, ...updates, updatedAt: new Date().toISOString() }
          : meeting
      )
    );
  };

  const deleteMeeting = (id: string) => {
    setMeetings((prev) => prev.filter((meeting) => meeting.id !== id));
  };

  const getMeetingsByParent = (parentId: string) => {
    return meetings.filter((meeting) => meeting.parentId === parentId);
  };

  const getMeetingsByTeacher = (teacherId: string) => {
    return meetings.filter((meeting) => meeting.teacherId === teacherId);
  };

  const getMeetingsByChild = (childId: string) => {
    return meetings.filter((meeting) => meeting.childId === childId);
  };

  const getUpcomingMeetings = () => {
    return meetings.filter(
      (meeting) => meeting.status === "scheduled" || meeting.status === "in-progress" || meeting.status === "pending_approval"
    );
  };

  const getPastMeetings = () => {
    return meetings.filter(
      (meeting) => meeting.status === "completed" || meeting.status === "cancelled"
    );
  };

  return (
    <MeetingsContext.Provider
      value={{
        meetings,
        addMeeting,
        updateMeeting,
        deleteMeeting,
        getMeetingsByParent,
        getMeetingsByTeacher,
        getMeetingsByChild,
        getUpcomingMeetings,
        getPastMeetings,
      }}
    >
      {children}
    </MeetingsContext.Provider>
  );
}

export function useMeetings() {
  const context = useContext(MeetingsContext);
  if (context === undefined) {
    throw new Error("useMeetings must be used within a MeetingsProvider");
  }
  return context;
}
