import { Award, CheckCircle2, TrendingUp, Users } from "lucide-react";
import type { StatCardConfig } from "@/types/components";
import type { ChildAcademicSummary, ParentChild } from "@/types/parent";

export const MOCK_CHILDREN: ParentChild[] = [
  {
    id: "child-001",
    studentId: "STU-2024-001",
    firstName: "Adaeze",
    lastName: "Okonkwo",
    fullName: "Adaeze Okonkwo",
    admissionNumber: "ADM-2024-0145",
    classLevel: "JSS 2",
    section: "A",
    profilePhoto: "https://i.pravatar.cc/150?u=adaeze",
    dateOfBirth: "2012-03-15",
    gender: "Female",
    status: "Active",
    relationship: "Father",
  },
  {
    id: "child-002",
    studentId: "STU-2024-002",
    firstName: "Chukwuemeka",
    lastName: "Okonkwo",
    fullName: "Chukwuemeka Okonkwo",
    admissionNumber: "ADM-2024-0089",
    classLevel: "SS 1",
    section: "B",
    profilePhoto: "https://i.pravatar.cc/150?u=chukwuemeka",
    dateOfBirth: "2009-07-22",
    gender: "Male",
    status: "Active",
    relationship: "Father",
  },
];

export const MOCK_ACADEMIC_SUMMARY: ChildAcademicSummary[] = [
  {
    childId: "child-001",
    childName: "Adaeze Okonkwo",
    classLevel: "JSS 2",
    currentTermAverage: 78.5,
    classPosition: 5,
    totalStudents: 45,
    subjectPerformance: [
      { subject: "Mathematics", score: 85, grade: "A" },
      { subject: "English", score: 78, grade: "B" },
      { subject: "Science", score: 72, grade: "B" },
      { subject: "Social Studies", score: 80, grade: "A" },
      { subject: "Civic Education", score: 75, grade: "B" },
    ],
    overallRemarks: "Good performance. Keep it up!",
    conductGrade: "A",
  },
  {
    childId: "child-002",
    childName: "Chukwuemeka Okonkwo",
    classLevel: "SS 1",
    currentTermAverage: 82.3,
    classPosition: 3,
    totalStudents: 52,
    subjectPerformance: [
      { subject: "Mathematics", score: 88, grade: "A" },
      { subject: "Physics", score: 80, grade: "A" },
      { subject: "Chemistry", score: 79, grade: "B" },
      { subject: "Biology", score: 85, grade: "A" },
      { subject: "English", score: 78, grade: "B" },
    ],
    overallRemarks: "Excellent performance!",
    conductGrade: "A",
  },
];

export const MOCK_ATTENDANCE = {
  "child-001": { present: 42, absent: 3, late: 2, total: 47, rate: 89.4 },
  "child-002": { present: 45, absent: 1, late: 1, total: 47, rate: 95.7 },
};

export const MOCK_TRANSPORT = {
  "child-001": {
    routeName: "Route A - Ikeja",
    busNumber: "BUS-001",
    driverName: "Mr. Adebayo",
    driverPhone: "+234 801 234 5678",
    pickupTime: "6:45 AM",
    dropoffTime: "3:30 PM",
    pickupLocation: "Victoria Island Junction",
    status: "On Route",
  },
  "child-002": {
    routeName: "Route A - Ikeja",
    busNumber: "BUS-001",
    driverName: "Mr. Adebayo",
    driverPhone: "+234 801 234 5678",
    pickupTime: "6:45 AM",
    dropoffTime: "3:30 PM",
    pickupLocation: "Victoria Island Junction",
    status: "At School",
  },
};

export const MOCK_NOTIFICATIONS = {
  "child-001": [
    { id: 1, type: "info", message: "Parent-Teacher meeting scheduled for Dec 20th", time: "2 hours ago", read: false },
    { id: 2, type: "success", message: "Mathematics test score uploaded: 85%", time: "1 day ago", read: false },
    { id: 3, type: "warning", message: "Library book due in 3 days", time: "2 days ago", read: true },
  ],
  "child-002": [
    { id: 1, type: "success", message: "Selected for Science Olympiad team", time: "3 hours ago", read: false },
    { id: 2, type: "info", message: "Chemistry lab session tomorrow", time: "1 day ago", read: true },
  ],
};

export const parentChildrenPrimaryStats: StatCardConfig<ParentChild>[] = [
  {
    icon: Users,
    label: "Total Children",
    color: "blue",
    getValue: (data) => data.length.toString(),
  },
  {
    icon: CheckCircle2,
    label: "Active",
    color: "green",
    getValue: (data) => data.filter((c) => c.status === "Active").length.toString(),
  },
  {
    icon: TrendingUp,
    label: "Avg. Performance",
    color: "purple",
    getValue: () => {
      const avg =
        MOCK_ACADEMIC_SUMMARY.reduce((sum, a) => sum + (a.currentTermAverage || 0), 0) /
        Math.max(1, MOCK_ACADEMIC_SUMMARY.length);
      return `${avg.toFixed(1)}%`;
    },
  },
  {
    icon: Award,
    label: "Best Position",
    color: "orange",
    getValue: () => {
      const best = Math.min(...MOCK_ACADEMIC_SUMMARY.map((a) => a.classPosition || 999));
      return `#${best}`;
    },
  },
];

