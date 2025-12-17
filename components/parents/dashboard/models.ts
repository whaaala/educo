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

export interface ParentEvent {
  id: string;
  title: string;
  date: string;
  duration: "Half Day" | "Full Day";
  image: string;
}

export interface HomeworkItem {
  id: string;
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


