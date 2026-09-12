export interface ParentProfile {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  profilePhoto: string;
}

export interface Child {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  admissionNumber: string;
  classLevel: string;
  section: string;
  profilePhoto: string;
  status: "Active" | "Inactive";
}

export interface ChildProgress {
  childId: string;
  currentTermAverage: number;
  classPosition: number;
  totalStudents: number;
  attendanceRate: number;
  conductGrade: string;
  recentGrades: {
    subject: string;
    score: number;
    grade: string;
    trend: "up" | "down" | "stable";
  }[];
}

export interface ChildLeaveRequest {
  id: string;
  childName: string;
  reason: string;
  fromDate: string;
  toDate: string;
  days: number;
  status: "approved" | "pending" | "declined";
}

export interface ParentMessage {
  id: string;
  from: string;
  role: string;
  subject: string;
  time: string;
  unread: boolean;
}

export interface PaymentHistoryItem {
  id: string;
  description: string;
  amount: number;
  date: string;
  status: "completed";
  child: string;
}

export type EventType = "academic" | "sports" | "cultural" | "meeting" | "holiday" | "examination";
export type EventStatus = "upcoming" | "ongoing" | "completed" | "cancelled";

export interface ParentEvent {
  id: string;
  title: string;
  description?: string;
  date: string;
  endDate?: string;
  time?: string;
  duration: "Half Day" | "Full Day";
  image: string;
  type?: EventType;
  status?: EventStatus;
  location?: string;
  isImportant?: boolean;
  childId?: string;
  childName?: string;
  classLevel?: string;
}

export interface HomeworkItem {
  id: string;
  childId: string;
  subject: string;
  color: "purple" | "green" | "blue";
  description: string;
  teacher: string;
  dueDate: string;
}

export interface FeeReminderItem {
  id: string;
  childName: string;
  feeType: string;
  amount: number;
  dueDate: string;
  status: "due" | "overdue";
}

export interface ExamResultItem {
  id: string;
  childId: string;
  studentName: string;
  studentPhoto: string;
  class: string;
  section: string;
  percentage: number;
  examType: string;
  status: "pass" | "fail";
}

export interface NoticeItem {
  id: string;
  title: string;
  date: string;
  isNew?: boolean;
}

export type MeetingPlatform = "zoom" | "google-meet" | "whatsapp-video" | "whatsapp-voice" | "educo-meet";
export type MeetingStatus = "scheduled" | "in-progress" | "completed" | "cancelled";

export interface UpcomingMeeting {
  id: string;
  title: string;
  platform: MeetingPlatform;
  hostName: string;
  hostRole: string;
  hostPhoto: string;
  scheduledDate: string;
  scheduledTime: string;
  duration: number;
  status: MeetingStatus;
  meetingLink?: string;
  childName?: string;
}


