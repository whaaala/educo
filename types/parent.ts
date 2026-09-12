// Parent/Guardian Types for Parent Portal

export interface ParentChild {
  id: string;
  studentId: string;
  firstName: string;
  lastName: string;
  fullName: string;
  admissionNumber: string;
  classLevel: string;
  section?: string;
  profilePhoto?: string;
  dateOfBirth: string;
  gender: "Male" | "Female";
  status: "Active" | "Inactive" | "Graduated" | "Transferred";
  relationship: "Father" | "Mother" | "Guardian" | "Sponsor";
}

export interface ParentFeeRecord {
  id: string;
  childId: string;
  childName: string;
  feeType: string;
  term: string;
  academicYear: string;
  amount: number;
  paidAmount: number;
  balance: number;
  dueDate: string;
  status: "paid" | "partial" | "pending" | "overdue";
  paymentHistory: ParentPayment[];
}

export interface ParentPayment {
  id: string;
  date: string;
  amount: number;
  method: "Cash" | "Card" | "Bank Transfer" | "Mobile Money";
  reference: string;
  receiptNumber: string;
}

export interface ParentAttendanceRecord {
  childId: string;
  childName: string;
  date: string;
  status: "present" | "absent" | "late" | "excused";
  checkInTime?: string;
  checkOutTime?: string;
  remarks?: string;
}

export interface ParentMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: "Teacher" | "Admin" | "Principal" | "System";
  senderAvatar?: string;
  subject: string;
  content: string;
  timestamp: string;
  isRead: boolean;
  attachments?: {
    name: string;
    url: string;
    type: string;
  }[];
  childId?: string;
  childName?: string;
}

export interface MessageThread {
  id: string;
  participants: {
    id: string;
    name: string;
    role: "Parent" | "Teacher" | "Admin" | "Principal";
    avatar?: string;
  }[];
  childId?: string;
  childName?: string;
  subject: string;
  category?: "academic" | "behavior" | "attendance" | "homework" | "general" | "meeting" | "other";
  lastMessage: {
    content: string;
    senderId: string;
    timestamp: string;
  };
  unreadCount: number;
  messages: ThreadMessage[];
  createdAt: string;
  updatedAt: string;
}

export interface ThreadMessage {
  id: string;
  threadId: string;
  senderId: string;
  senderName: string;
  senderRole: "Parent" | "Teacher" | "Admin" | "Principal";
  senderAvatar?: string;
  content: string;
  timestamp: string;
  isRead: boolean;
  attachments?: {
    name: string;
    url: string;
    type: string;
    size?: number;
  }[];
}

export interface Teacher {
  id: string;
  name: string;
  subject: string;
  email: string;
  phone?: string;
  photo?: string;
  isClassTeacher?: boolean;
}

export interface ParentAnnouncement {
  id: string;
  title: string;
  content: string;
  date: string;
  priority: "low" | "normal" | "high" | "urgent";
  category: "general" | "academic" | "event" | "fee" | "emergency";
  targetClasses?: string[];
  attachments?: {
    name: string;
    url: string;
  }[];
}

export interface ParentEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  type: "meeting" | "event" | "exam" | "holiday" | "activity";
  childId?: string;
  childName?: string;
  isRequired?: boolean;
}

export interface ParentProfile {
  id: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  email: string;
  phone: string;
  alternatePhone?: string;
  occupation?: string;
  address: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postalCode?: string;
    country: string;
  };
  profilePhoto?: string;
  relationship: "Father" | "Mother" | "Guardian" | "Sponsor";
  isPrimaryContact: boolean;
  children: ParentChild[];
  createdAt: string;
  updatedAt: string;
}

export interface ParentDashboardStats {
  totalChildren: number;
  upcomingEvents: number;
  unreadMessages: number;
  pendingFees: number;
  totalFeesBalance: number;
  attendanceRate: number;
}

export interface ChildAcademicSummary {
  childId: string;
  childName: string;
  classLevel: string;
  currentTermAverage?: number;
  classPosition?: number;
  totalStudents?: number;
  subjectPerformance: {
    subject: string;
    score: number;
    grade: string;
    teacherRemarks?: string;
  }[];
  overallRemarks?: string;
  conductGrade?: string;
}
