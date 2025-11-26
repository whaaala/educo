"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import MainLayout from "@/components/layout/MainLayout";
import PageHeader from "@/components/shared/PageHeader";
import PageActions from "@/components/shared/PageActions";
import PageLoader from "@/components/shared/PageLoader";
import PageSpinner from "@/components/shared/PageSpinner";
import StatCard from "@/components/shared/StatCard";
import ViewToggle from "@/components/shared/ViewToggle";
import SortButton from "@/components/shared/SortButton";
import FilterButton, { FilterField, FilterValues } from "@/components/shared/FilterButton";
import DeleteAllButton from "@/components/shared/DeleteAllButton";
import BulkDeleteModal, { BulkDeleteItem } from "@/components/shared/BulkDeleteModal";
import LoadMoreButton from "@/components/shared/LoadMoreButton";
import { usePageLoad } from "@/hooks/usePageLoad";
import { useSchoolSettings } from "@/contexts/SchoolSettingsContext";
import {
  BookOpen,
  Users,
  GraduationCap,
  MapPin,
  UserCheck,
  ChevronRight,
  TrendingUp,
  Sparkles,
  Award,
  Target,
  Calendar,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import ClassCard from "@/components/classes/ClassCard";
import ClassTable from "@/components/classes/ClassTable";

// Mock data - In production, this would come from API
// Following African Education Structure: Level + Section or Level-Track-Section or Programme-Dept-Level-Semester
const mockClasses = [
  {
    id: "SSS1-SCI-A", // Senior Secondary 1, Science track, Section A
    name: "SSS 1A",
    level: "Secondary" as const,
    section: "A",
    subjects: [
      { name: "Mathematics", teacher: { id: "TCH-001", name: "John Adebayo", image: "https://randomuser.me/api/portraits/men/1.jpg" } },
      { name: "English", teacher: { id: "TCH-006", name: "Sarah Johnson", image: "https://randomuser.me/api/portraits/women/6.jpg" } },
      { name: "Physics", teacher: { id: "TCH-007", name: "David Obi", image: "https://randomuser.me/api/portraits/men/7.jpg" } },
      { name: "Chemistry", teacher: { id: "TCH-008", name: "Janet Musa", image: "https://randomuser.me/api/portraits/women/8.jpg" } },
    ],
    teachers: [
      { id: "TCH-001", name: "John Adebayo", image: "https://randomuser.me/api/portraits/men/1.jpg", subject: "Mathematics" },
    ],
    classTeacher: { id: "TCH-001", name: "John Adebayo", image: "https://randomuser.me/api/portraits/men/1.jpg" },
    students: 35,
    capacity: 40,
    room: "Room 204",
    schedule: "Mon-Fri, 8:00 AM - 2:00 PM",
    academicYear: "2024/2025",
    term: "First Term",
    status: "Active",
    averageGrade: 78,
    attendanceRate: 92,
    stream: "Science",
    branch: "Main Campus",
    maxStudents: 40,
    enabledFeatures: {
      lms: true,
      digitalDiary: true,
      transport: false,
      hostel: false,
      rfid: true,
      onlineClasses: false,
      library: true,
      gradebook: true,
    },
  },
  {
    id: "SSS2-ART-B", // Senior Secondary 2, Arts track, Section B
    name: "SSS 2B",
    level: "Secondary" as const,
    section: "B",
    subjects: [
      { name: "Mathematics", teacher: { id: "TCH-002", name: "Mary Okonkwo", image: "https://randomuser.me/api/portraits/women/2.jpg" } },
      { name: "Literature", teacher: { id: "TCH-009", name: "Peter Adamu", image: "https://randomuser.me/api/portraits/men/9.jpg" } },
      { name: "Government", teacher: { id: "TCH-010", name: "Ruth Kamau", image: "https://randomuser.me/api/portraits/women/10.jpg" } },
      { name: "History", teacher: { id: "TCH-011", name: "James Okoro", image: "https://randomuser.me/api/portraits/men/11.jpg" } },
    ],
    teachers: [
      { id: "TCH-002", name: "Mary Okonkwo", image: "https://randomuser.me/api/portraits/women/2.jpg" },
      { id: "TCH-009", name: "Peter Adamu", image: "https://randomuser.me/api/portraits/men/9.jpg" },
      { id: "TCH-010", name: "Ruth Kamau", image: "https://randomuser.me/api/portraits/women/10.jpg" },
    ],
    classTeacher: { id: "TCH-002", name: "Mary Okonkwo", image: "https://randomuser.me/api/portraits/women/2.jpg" },
    students: 28,
    capacity: 40,
    room: "Room 205",
    schedule: "Mon-Fri, 8:00 AM - 2:00 PM",
    academicYear: "2024/2025",
    term: "First Term",
    status: "Active",
    averageGrade: 85,
    attendanceRate: 88,
    stream: "Arts",
    branch: "Main Campus",
    maxStudents: 40,
    enabledFeatures: {
      lms: true,
      digitalDiary: false,
      transport: true,
      hostel: false,
      rfid: false,
      onlineClasses: true,
      library: true,
      gradebook: false,
    },
    transportZone: "Zone A",
  },
  {
    id: "SSS3-SCI-A", // Senior Secondary 3, Science track, Section A
    name: "SSS 3A",
    level: "Secondary" as const,
    section: "A",
    subjects: [
      { name: "Mathematics", teacher: { id: "TCH-003", name: "Ahmed Yusuf", image: "https://randomuser.me/api/portraits/men/3.jpg" } },
      { name: "Further Mathematics", teacher: { id: "TCH-003", name: "Ahmed Yusuf", image: "https://randomuser.me/api/portraits/men/3.jpg" } },
      { name: "Physics", teacher: { id: "TCH-011", name: "James Okoro", image: "https://randomuser.me/api/portraits/men/11.jpg" } },
      { name: "Chemistry", teacher: { id: "TCH-010", name: "Ruth Kamau", image: "https://randomuser.me/api/portraits/women/10.jpg" } },
    ],
    teachers: [
      { id: "TCH-003", name: "Ahmed Yusuf", image: "https://randomuser.me/api/portraits/men/3.jpg", subject: "Mathematics" },
    ],
    students: 32,
    capacity: 40,
    room: "Room 301",
    schedule: "Mon-Fri, 8:00 AM - 2:00 PM",
    academicYear: "2024/2025",
    term: "First Term",
    status: "Active",
    averageGrade: 91,
    attendanceRate: 95,
    stream: "Science",
  },
  {
    id: "JSS3-B", // Junior Secondary 3, Section B
    name: "JSS 3B",
    level: "Junior Secondary" as const,
    section: "B",
    subjects: [
      { name: "Mathematics", teacher: { id: "TCH-004", name: "Grace Nkrumah", image: "https://randomuser.me/api/portraits/women/4.jpg" } },
      { name: "English", teacher: { id: "TCH-004", name: "Grace Nkrumah", image: "https://randomuser.me/api/portraits/women/4.jpg" } },
      { name: "Basic Science", teacher: { id: "TCH-012", name: "Daniel Owusu", image: "https://randomuser.me/api/portraits/men/12.jpg" } },
      { name: "Basic Technology", teacher: { id: "TCH-013", name: "Emmanuel Chukwu", image: "https://randomuser.me/api/portraits/men/13.jpg" } },
    ],
    teachers: [
      { id: "TCH-004", name: "Grace Nkrumah", image: "https://randomuser.me/api/portraits/women/4.jpg" },
    ],
    students: 40,
    capacity: 45,
    room: "Room 103",
    schedule: "Mon-Fri, 8:00 AM - 2:00 PM",
    academicYear: "2024/2025",
    term: "First Term",
    status: "Active",
    averageGrade: 73,
    attendanceRate: 90,
  },
  {
    id: "PRY5-A", // Primary 5, Section A
    name: "Primary 5A",
    level: "Primary" as const,
    section: "A",
    subjects: [
      { name: "Mathematics", teacher: { id: "TCH-005", name: "Fatima Ibrahim", image: "https://randomuser.me/api/portraits/women/5.jpg" } },
      { name: "English", teacher: { id: "TCH-005", name: "Fatima Ibrahim", image: "https://randomuser.me/api/portraits/women/5.jpg" } },
      { name: "Science", teacher: { id: "TCH-014", name: "Chinedu Okeke", image: "https://randomuser.me/api/portraits/men/14.jpg" } },
      { name: "Social Studies", teacher: { id: "TCH-015", name: "Amina Bello", image: "https://randomuser.me/api/portraits/women/15.jpg" } },
      { name: "Arts", teacher: { id: "TCH-016", name: "Kofi Mensah", image: "https://randomuser.me/api/portraits/men/16.jpg" } },
    ],
    teachers: [
      { id: "TCH-005", name: "Fatima Ibrahim", image: "https://randomuser.me/api/portraits/women/5.jpg" },
      { id: "TCH-014", name: "Chinedu Okeke", image: "https://randomuser.me/api/portraits/men/14.jpg" },
    ],
    students: 30,
    capacity: 35,
    room: "Room 15",
    schedule: "Mon-Fri, 8:00 AM - 1:00 PM",
    academicYear: "2024/2025",
    term: "First Term",
    status: "Active",
    averageGrade: 80,
    attendanceRate: 94,
  },
  {
    id: "PRY1-A", // Primary 1, Section A
    name: "Primary 1A",
    level: "Primary" as const,
    section: "A",
    subjects: [
      { name: "Mathematics", teacher: { id: "TCH-020", name: "Mrs. Blessing Eze", image: "https://randomuser.me/api/portraits/women/20.jpg" } },
      { name: "English", teacher: { id: "TCH-020", name: "Mrs. Blessing Eze", image: "https://randomuser.me/api/portraits/women/20.jpg" } },
      { name: "Basic Science", teacher: { id: "TCH-021", name: "Mr. Joshua Alabi", image: "https://randomuser.me/api/portraits/men/21.jpg" } },
    ],
    teachers: [
      { id: "TCH-020", name: "Mrs. Blessing Eze", image: "https://randomuser.me/api/portraits/women/20.jpg" },
    ],
    students: 25,
    capacity: 30,
    room: "Room 5",
    schedule: "Mon-Fri, 8:00 AM - 12:00 PM",
    academicYear: "2024/2025",
    term: "First Term",
    status: "Active",
    averageGrade: 75,
    attendanceRate: 96,
  },
  {
    id: "JSS1-A", // Junior Secondary 1, Section A
    name: "JSS 1A",
    level: "Junior Secondary" as const,
    section: "A",
    subjects: [
      { name: "Mathematics", teacher: { id: "TCH-022", name: "Mr. Tunde Ajayi", image: "https://randomuser.me/api/portraits/men/22.jpg" } },
      { name: "English", teacher: { id: "TCH-023", name: "Mrs. Ngozi Obi", image: "https://randomuser.me/api/portraits/women/22.jpg" } },
      { name: "Basic Science", teacher: { id: "TCH-024", name: "Mr. Samuel Okeke", image: "https://randomuser.me/api/portraits/men/23.jpg" } },
      { name: "Social Studies", teacher: { id: "TCH-025", name: "Mrs. Aisha Bello", image: "https://randomuser.me/api/portraits/women/23.jpg" } },
    ],
    teachers: [
      { id: "TCH-022", name: "Mr. Tunde Ajayi", image: "https://randomuser.me/api/portraits/men/22.jpg" },
    ],
    students: 38,
    capacity: 45,
    room: "Room 101",
    schedule: "Mon-Fri, 8:00 AM - 2:00 PM",
    academicYear: "2024/2025",
    term: "First Term",
    status: "Active",
    averageGrade: 70,
    attendanceRate: 88,
  },
  {
    id: "SSS2-COM-A", // Senior Secondary 2, Commercial track, Section A
    name: "SSS 2A",
    level: "Secondary" as const,
    section: "A",
    subjects: [
      { name: "Accounting", teacher: { id: "TCH-026", name: "Mr. Ibrahim Sule", image: "https://randomuser.me/api/portraits/men/24.jpg" } },
      { name: "Commerce", teacher: { id: "TCH-027", name: "Mrs. Funmi Adeleke", image: "https://randomuser.me/api/portraits/women/24.jpg" } },
      { name: "Economics", teacher: { id: "TCH-028", name: "Mr. Chidi Okafor", image: "https://randomuser.me/api/portraits/men/25.jpg" } },
      { name: "Mathematics", teacher: { id: "TCH-029", name: "Mrs. Zainab Usman", image: "https://randomuser.me/api/portraits/women/25.jpg" } },
    ],
    teachers: [
      { id: "TCH-026", name: "Mr. Ibrahim Sule", image: "https://randomuser.me/api/portraits/men/24.jpg" },
    ],
    students: 30,
    capacity: 40,
    room: "Room 208",
    schedule: "Mon-Fri, 8:00 AM - 2:00 PM",
    academicYear: "2024/2025",
    term: "First Term",
    status: "Active",
    averageGrade: 82,
    attendanceRate: 91,
    stream: "Commercial",
  },
  {
    id: "SSS3-TEC-A", // Senior Secondary 3, Technical track, Section A
    name: "SSS 3A",
    level: "Secondary" as const,
    section: "A",
    subjects: [
      { name: "Technical Drawing", teacher: { id: "TCH-030", name: "Engr. Bode Ajayi", image: "https://randomuser.me/api/portraits/men/34.jpg" } },
      { name: "Building Technology", teacher: { id: "TCH-031", name: "Mr. Kunle Badmus", image: "https://randomuser.me/api/portraits/men/35.jpg" } },
      { name: "Basic Electricity", teacher: { id: "TCH-032", name: "Mr. Solomon Adewale", image: "https://randomuser.me/api/portraits/men/36.jpg" } },
      { name: "Mathematics", teacher: { id: "TCH-033", name: "Mrs. Folake Oni", image: "https://randomuser.me/api/portraits/women/30.jpg" } },
    ],
    teachers: [
      { id: "TCH-030", name: "Engr. Bode Ajayi", image: "https://randomuser.me/api/portraits/men/34.jpg" },
    ],
    students: 26,
    capacity: 35,
    room: "Workshop 1",
    schedule: "Mon-Fri, 8:00 AM - 2:00 PM",
    academicYear: "2024/2025",
    term: "First Term",
    status: "Active",
    averageGrade: 77,
    attendanceRate: 89,
    stream: "Technical",
  },
  {
    id: "200L-CSC-SEM1", // 200 Level (University), Computer Science, Semester 1
    name: "Computer Science 201",
    level: "Tertiary" as const,
    section: "A",
    subjects: [
      { name: "CSC 201 - Data Structures", teacher: { id: "LEC-001", name: "Dr. Kwame Nkrumah", image: "https://randomuser.me/api/portraits/men/20.jpg" } },
      { name: "CSC 203 - Algorithms", teacher: { id: "LEC-002", name: "Dr. Amara Diop", image: "https://randomuser.me/api/portraits/women/20.jpg" } },
      { name: "CSC 205 - Database Systems", teacher: { id: "LEC-003", name: "Prof. Babatunde Olowo", image: "https://randomuser.me/api/portraits/men/21.jpg" } },
      { name: "CSC 207 - Web Development", teacher: { id: "LEC-004", name: "Dr. Zainab Ahmed", image: "https://randomuser.me/api/portraits/women/21.jpg" } },
    ],
    teachers: [
      { id: "LEC-001", name: "Dr. Kwame Nkrumah", image: "https://randomuser.me/api/portraits/men/20.jpg" },
      { id: "LEC-002", name: "Dr. Amara Diop", image: "https://randomuser.me/api/portraits/women/20.jpg" },
      { id: "LEC-003", name: "Prof. Babatunde Olowo", image: "https://randomuser.me/api/portraits/men/21.jpg" },
      { id: "LEC-004", name: "Dr. Zainab Ahmed", image: "https://randomuser.me/api/portraits/women/21.jpg" },
    ],
    students: 45,
    capacity: 50,
    room: "LT 102",
    schedule: "Mon, Wed, Fri",
    academicYear: "2024/2025",
    term: "First Semester",
    status: "Active",
    averageGrade: 72,
    attendanceRate: 85,
    // Tertiary-specific fields
    faculty: "Engineering",
    department: "Computer Science",
    programme: "B.Sc",
    courseLevel: "200 Level",
    semester: "First Semester",
    branch: "Main Campus",
    maxStudents: 50,
    enabledFeatures: {
      lms: true,
      digitalDiary: true,
      transport: false,
      hostel: true,
      rfid: true,
      onlineClasses: true,
      library: true,
      gradebook: true,
    },
    hostelEligibility: true,
  },
  {
    id: "ND2-CS-SEM2", // ND2 (Polytechnic), Computer Science, Semester 2
    name: "ND 2 Computer Science",
    level: "Tertiary" as const,
    section: "A",
    subjects: [
      { name: "COM 213 - Software Engineering", teacher: { id: "LEC-005", name: "Mr. Adekunle Taiwo", image: "https://randomuser.me/api/portraits/men/26.jpg" } },
      { name: "COM 215 - Network Administration", teacher: { id: "LEC-006", name: "Mrs. Chioma Nnadi", image: "https://randomuser.me/api/portraits/women/26.jpg" } },
      { name: "MTH 211 - Statistics", teacher: { id: "LEC-007", name: "Dr. Emeka Okonkwo", image: "https://randomuser.me/api/portraits/men/27.jpg" } },
      { name: "COM 217 - Mobile Development", teacher: { id: "LEC-008", name: "Mr. Yusuf Mohammed", image: "https://randomuser.me/api/portraits/men/28.jpg" } },
    ],
    teachers: [],
    students: 52,
    capacity: 60,
    room: "Lab 201",
    schedule: "Tue, Thu",
    academicYear: "2024/2025",
    term: "Second Semester",
    status: "Active",
    averageGrade: 68,
    attendanceRate: 80,
    // Tertiary-specific fields
    faculty: "School of Technology",
    department: "Computer Science",
    programme: "ND",
    courseLevel: "ND 2",
    semester: "Second Semester",
  },
  {
    id: "300L-EEE-SEM1", // 300 Level (University), Electrical Engineering, Semester 1
    name: "Electrical Engineering 301",
    level: "Tertiary" as const,
    section: "A",
    subjects: [
      { name: "EEE 301 - Control Systems", teacher: { id: "LEC-009", name: "Prof. Adewale Ogunleye", image: "https://randomuser.me/api/portraits/men/29.jpg" } },
      { name: "EEE 303 - Power Systems", teacher: { id: "LEC-010", name: "Dr. Fatima Lawal", image: "https://randomuser.me/api/portraits/women/27.jpg" } },
      { name: "EEE 305 - Digital Electronics", teacher: { id: "LEC-011", name: "Engr. Chukwuma Obi", image: "https://randomuser.me/api/portraits/men/30.jpg" } },
      { name: "MEE 311 - Engineering Mathematics", teacher: { id: "LEC-012", name: "Dr. Kehinde Alabi", image: "https://randomuser.me/api/portraits/men/31.jpg" } },
    ],
    teachers: [],
    students: 38,
    capacity: 45,
    room: "ENG 301",
    schedule: "Mon, Tue, Thu",
    academicYear: "2024/2025",
    term: "First Semester",
    status: "Active",
    averageGrade: 75,
    attendanceRate: 87,
    // Tertiary-specific fields
    faculty: "Engineering",
    department: "Electrical & Electronics Engineering",
    programme: "B.Eng",
    courseLevel: "300 Level",
    semester: "First Semester",
  },
  {
    id: "HND1-BA-SEM1", // HND1 (Polytechnic), Business Administration, Semester 1
    name: "HND 1 Business Admin",
    level: "Tertiary" as const,
    section: "A",
    subjects: [
      { name: "BUS 311 - Strategic Management", teacher: { id: "LEC-013", name: "Dr. Olufemi Adeyemi", image: "https://randomuser.me/api/portraits/men/32.jpg" } },
      { name: "BUS 313 - Marketing Management", teacher: { id: "LEC-014", name: "Mrs. Amina Sanni", image: "https://randomuser.me/api/portraits/women/28.jpg" } },
      { name: "BUS 315 - Financial Management", teacher: { id: "LEC-015", name: "Mr. Kenneth Eze", image: "https://randomuser.me/api/portraits/men/33.jpg" } },
      { name: "BUS 317 - Operations Management", teacher: { id: "LEC-016", name: "Dr. Grace Nnamani", image: "https://randomuser.me/api/portraits/women/29.jpg" } },
    ],
    teachers: [],
    students: 48,
    capacity: 55,
    room: "BUS 105",
    schedule: "Mon, Wed, Fri",
    academicYear: "2024/2025",
    term: "First Semester",
    status: "Active",
    averageGrade: 70,
    attendanceRate: 83,
    // Tertiary-specific fields
    faculty: "School of Business Studies",
    department: "Business Administration",
    programme: "HND",
    courseLevel: "HND 1",
    semester: "First Semester",
  },
  {
    id: "ND2-SIWES", // ND2 SIWES (Student Industrial Work Experience Scheme)
    name: "ND 2 SIWES Program",
    level: "Tertiary" as const,
    section: "A",
    subjects: [
      { name: "Industrial Attachment", teacher: { id: "LEC-017", name: "Coord. Musa Abubakar", image: "https://randomuser.me/api/portraits/men/37.jpg" } },
      { name: "SIWES Report Writing", teacher: { id: "LEC-018", name: "Dr. Victoria Obi", image: "https://randomuser.me/api/portraits/women/31.jpg" } },
    ],
    teachers: [],
    students: 120,
    capacity: 150,
    room: "Various Industries",
    schedule: "6 Months Attachment",
    academicYear: "2024/2025",
    term: "SIWES Program",
    status: "Active",
    averageGrade: 75,
    attendanceRate: 92,
    // Tertiary-specific fields
    faculty: "School of Technology",
    department: "All Departments",
    programme: "ND",
    courseLevel: "ND 2",
    semester: "SIWES (6 Months)",
  },
  {
    id: "400L-MED-SEM2", // 400 Level (University), Medicine, Semester 2
    name: "Medicine 401",
    level: "Tertiary" as const,
    section: "A",
    subjects: [
      { name: "MED 401 - Clinical Medicine", teacher: { id: "LEC-019", name: "Prof. Adebayo Adeleke", image: "https://randomuser.me/api/portraits/men/38.jpg" } },
      { name: "MED 403 - Surgery", teacher: { id: "LEC-020", name: "Dr. Chinwe Okafor", image: "https://randomuser.me/api/portraits/women/32.jpg" } },
      { name: "MED 405 - Pediatrics", teacher: { id: "LEC-021", name: "Prof. Yusuf Ibrahim", image: "https://randomuser.me/api/portraits/men/39.jpg" } },
      { name: "MED 407 - Obstetrics", teacher: { id: "LEC-022", name: "Dr. Blessing Okoro", image: "https://randomuser.me/api/portraits/women/33.jpg" } },
    ],
    teachers: [],
    students: 42,
    capacity: 50,
    room: "Teaching Hospital",
    schedule: "Mon-Fri",
    academicYear: "2024/2025",
    term: "Second Semester",
    status: "Active",
    averageGrade: 78,
    attendanceRate: 94,
    // Tertiary-specific fields
    faculty: "Medicine",
    department: "Medicine & Surgery",
    programme: "MBBS",
    courseLevel: "400 Level",
    semester: "Second Semester",
  },
];

export default function ClassesPage() {
  const basePageLoading = usePageLoad(600);
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlView = searchParams.get("view");
  const initialView = urlView === "list" ? "list" : "grid";
  const { settings, currentTenant } = useSchoolSettings();

  const [classes] = useState(mockClasses);
  const [viewMode, setViewMode] = useState<"grid" | "list">(initialView);
  const [displayedCount, setDisplayedCount] = useState(8);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSwitchingView, setIsSwitchingView] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [filters, setFilters] = useState<FilterValues>({});
  const [sortOption, setSortOption] = useState<string>("ascending");
  const [isSorting, setIsSorting] = useState(false);
  const [isFiltering, setIsFiltering] = useState(false);
  const [resetKey, setResetKey] = useState(0);
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);
  const [itemsToDelete, setItemsToDelete] = useState<BulkDeleteItem[]>([]);
  const gridRef = useRef<HTMLDivElement>(null);

  // Only show full-screen loader if not switching view with toggle button
  const isPageLoading = basePageLoading && !isSwitchingView;

  // Filter fields - dynamically set based on tenant's supported levels
  const filterFields: FilterField[] = [
    {
      id: "level",
      label: "Education Level",
      options: settings.supportedLevels.includes("Primary")
        ? ["Primary", "Junior Secondary", "Secondary", "Tertiary"]
        : settings.supportedLevels, // Only show supported levels
      width: "half",
    },
    {
      id: "section",
      label: "Section",
      options: ["A", "B", "C"],
      width: "half",
    },
    {
      id: "academicYear",
      label: "Academic Year",
      options: ["2024/2025", "2023/2024", "2022/2023"],
      width: "half",
    },
    {
      id: "term",
      label: "Term/Semester",
      options: settings.supportedLevels.includes("Tertiary")
        ? ["First Term", "Second Term", "Third Term", "First Semester", "Second Semester", "SIWES"]
        : ["First Term", "Second Term", "Third Term"],
      width: "half",
    },
    {
      id: "status",
      label: "Status",
      options: ["Active", "Inactive", "Archived"],
      width: "full",
    },
  ];

  // Sort options
  const sortOptions = [
    { label: "Ascending", value: "ascending" },
    { label: "Descending", value: "descending" },
    { label: "Recently Added", value: "recently_added" },
  ];

  // Filter classes by tenant's supported education levels first
  const tenantClasses = useMemo(() => {
    // Don't filter until settings are loaded
    if (!settings.supportedLevels || settings.supportedLevels.length === 0) {
      return [];
    }

    return classes.filter((cls) => {
      // Exact string match for education level
      return settings.supportedLevels.some(level => level === cls.level);
    });
  }, [classes, settings.supportedLevels]);

  // Calculate stats from tenant-filtered classes only
  const stats = useMemo(() => {
    return {
      total: tenantClasses.length,
      students: tenantClasses.reduce((sum, cls) => sum + cls.students, 0),
      capacity: tenantClasses.reduce((sum, cls) => sum + cls.capacity, 0),
      active: tenantClasses.filter((cls) => cls.status === "Active").length,
    };
  }, [tenantClasses]);

  // Handle view mode change
  const handleViewModeChange = (newMode: "grid" | "list") => {
    setIsSwitchingView(true);
    setViewMode(newMode);
    router.push(`/classes?view=${newMode}`);

    // Keep isSwitchingView true for longer to prevent PageLoader from showing
    setTimeout(() => {
      setIsSwitchingView(false);
    }, 700); // Longer than PageLoader delay (600ms)
  };

  // Sync view mode with URL
  useEffect(() => {
    const urlView = searchParams.get("view");
    const newViewMode = urlView === "list" ? "list" : "grid";
    setViewMode(newViewMode);
  }, [searchParams]);

  // Handle filter change
  const handleFilterChange = (updatedFilters: FilterValues) => {
    setIsFiltering(true);
    setTimeout(() => {
      setFilters(updatedFilters);
      const initialCount = viewMode === "grid" ? 8 : 10;
      setDisplayedCount(initialCount);
      setTimeout(() => {
        setIsFiltering(false);
      }, 100);
    }, 300);
  };

  // Handle sort change
  const handleSortChange = (option: string) => {
    setIsSorting(true);
    setTimeout(() => {
      setSortOption(option);
      setTimeout(() => {
        setIsSorting(false);
      }, 100);
    }, 300);
  };

  // Handle refresh
  const handleRefresh = () => {
    setIsRefreshing(true);
    setSelectedIds(new Set());
    setFilters({});
    setSortOption("ascending");
    setResetKey((prev) => prev + 1);
    setTimeout(() => {
      const initialCount = viewMode === "grid" ? 8 : 10;
      setDisplayedCount(initialCount);
      setTimeout(() => {
        setIsRefreshing(false);
      }, 100);
    }, 300);
  };

  // Handle load more
  const handleLoadMore = () => {
    setIsLoadingMore(true);
    setTimeout(() => {
      setDisplayedCount((prev) => prev + (viewMode === "grid" ? 8 : 10));
      setIsLoadingMore(false);
    }, 500);
  };

  // Handle delete all
  const handleDeleteAll = () => {
    if (selectedIds.size > 0) {
      const selectedClasses = filteredClasses.filter((cls) =>
        selectedIds.has(cls.id)
      );

      const items: BulkDeleteItem[] = selectedClasses.map((cls) => ({
        id: cls.id,
        name: cls.name,
        subtitle: `${cls.students} students • ${cls.classTeacher}`,
      }));

      setItemsToDelete(items);
      setIsBulkDeleteModalOpen(true);
    }
  };

  // Apply sorting to tenant-filtered classes
  const sortedClasses = [...tenantClasses].sort((a, b) => {
    switch (sortOption) {
      case "ascending":
        return a.name.localeCompare(b.name);
      case "descending":
        return b.name.localeCompare(a.name);
      case "recently_added":
        return b.id.localeCompare(a.id);
      default:
        return 0;
    }
  });

  // Apply user filters (tenant filtering already done in tenantClasses)
  const filteredClasses = sortedClasses.filter((cls) => {
    const hasFilters = Object.values(filters).some((values) => values && values.length > 0);
    if (!hasFilters) return true;

    const matchesLevel = !filters.level || filters.level.length === 0 || filters.level.includes(cls.level);
    const matchesSection = !filters.section || filters.section.length === 0 || filters.section.includes(cls.section);
    const matchesStatus = !filters.status || filters.status.length === 0 || filters.status.includes(cls.status);
    const matchesAcademicYear = !filters.academicYear || filters.academicYear.length === 0 || filters.academicYear.includes(cls.academicYear);

    // For term/semester, check both term and semester fields
    const matchesTerm = !filters.term || filters.term.length === 0 ||
      filters.term.includes(cls.term || "") ||
      filters.term.includes(cls.semester || "");

    return matchesLevel && matchesSection && matchesStatus && matchesAcademicYear && matchesTerm;
  });

  const displayedClasses = filteredClasses.slice(0, displayedCount);
  const hasMore = displayedCount < filteredClasses.length;

  // Determine terminology based on education level
  const classLabel = settings.supportedLevels.includes("Tertiary") ? "Courses" : "Classes";
  const singleClassLabel = settings.supportedLevels.includes("Tertiary") ? "Course" : "Class";

  return (
    <MainLayout>
      <PageLoader isLoading={isPageLoading} loadingText={`Loading ${classLabel}`} />

      <div className={`transition-opacity duration-500 ${isPageLoading ? "opacity-0" : "opacity-100"}`}>
        {/* Header with Tenant Info */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center lg:justify-between py-4 mb-0 gap-4 animate-in fade-in slide-in-from-top-2 duration-700 ease-out">
          <div>
            <PageHeader
              title={`${classLabel} Management`}
              breadcrumbs={[
                { label: "Dashboard", href: "/" },
                { label: "Academic" },
                { label: viewMode === "grid" ? `${classLabel} Grid` : `${classLabel} Table`, isActive: true },
              ]}
            />
          </div>

          <PageActions
            addButtonLabel={`Add ${singleClassLabel}`}
            exportDescription={`Download ${classLabel.toLowerCase()} data`}
            onAdd={() => router.push("/classes/add")}
            onRefresh={handleRefresh}
            onPrint={() => console.log(`Print ${classLabel.toLowerCase()}`)}
            onExportPDF={() => console.log("Export PDF")}
            onExportExcel={() => console.log("Export Excel")}
          />
        </div>

        {/* Filters Bar */}
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-[800ms] delay-150 ease-out mb-6 mt-6">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3 w-full">
            {/* Left Section - Filter */}
            <div className="flex items-center gap-2 sm:gap-3 lg:flex-1">
              <FilterButton fields={filterFields} onFilterChange={handleFilterChange} resetKey={resetKey} />

              {viewMode === "list" && selectedIds.size > 0 && (
                <DeleteAllButton selectedCount={selectedIds.size} onDeleteAll={handleDeleteAll} />
              )}

              {viewMode === "grid" && (
                <div className="flex items-center px-3 lg:px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900">
                  <span className="text-xs lg:text-sm text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 whitespace-nowrap">
                    1 to {Math.min(displayedCount, filteredClasses.length)} of {filteredClasses.length}
                  </span>
                </div>
              )}

              {viewMode === "grid" && selectedIds.size > 0 && (
                <div className="hidden sm:block">
                  <DeleteAllButton selectedCount={selectedIds.size} onDeleteAll={handleDeleteAll} />
                </div>
              )}
            </div>

            {/* Right Section - View Toggle and Sort */}
            <div className="flex items-center justify-end gap-3 lg:flex-1">
              {viewMode === "grid" && selectedIds.size > 0 && (
                <div className="block sm:hidden">
                  <DeleteAllButton selectedCount={selectedIds.size} onDeleteAll={handleDeleteAll} />
                </div>
              )}

              {viewMode === "grid" && (
                <div className="flex items-center gap-2 px-2 sm:px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 shadow-sm">
                  <input
                    type="checkbox"
                    ref={(el) => {
                      if (el) {
                        const isSomeSelected = selectedIds.size > 0 && selectedIds.size < displayedClasses.length;
                        el.indeterminate = isSomeSelected;
                      }
                    }}
                    checked={selectedIds.size === displayedClasses.length && displayedClasses.length > 0}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedIds(new Set(displayedClasses.map((c) => c.id)));
                      } else {
                        setSelectedIds(new Set());
                      }
                    }}
                    className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded border-2 border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 text-blue-600 focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
                  />
                  <span className="hidden sm:inline text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300">
                    Select All
                  </span>
                </div>
              )}

              <ViewToggle viewMode={viewMode} onViewModeChange={handleViewModeChange} />
              <SortButton options={sortOptions} defaultOption="ascending" onSortChange={handleSortChange} resetKey={resetKey} />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-[800ms] delay-150 ease-out">
          <div className="relative min-h-[400px]">
            {/* Grid View */}
            {viewMode === "grid" && (
              <div
                key={`grid-view-${isFiltering ? "filtering" : "filtered"}-${isSorting ? "sorting" : "sorted"}-${isRefreshing ? "refreshing" : "refreshed"}-${sortOption}`}
                className="opacity-100 scale-100 translate-y-0 animate-in fade-in zoom-in-95 slide-in-from-bottom-3 duration-[450ms] ease-[cubic-bezier(0.34,1.56,0.64,1)]"
              >
                {isFiltering || isSorting || isRefreshing || isSwitchingView ? (
                  <PageSpinner
                    message={
                      isSwitchingView
                        ? "Switching view..."
                        : isRefreshing
                        ? "Refreshing..."
                        : isSorting
                        ? "Sorting..."
                        : "Filtering..."
                    }
                    size="md"
                  />
                ) : displayedClasses.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16">
                    <BookOpen className="w-16 h-16 text-gray-400 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      No {classLabel} Found
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Try adjusting your filters or add a new {singleClassLabel.toLowerCase()}
                    </p>
                  </div>
                ) : (
                  <>
                    <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                      {displayedClasses.map((cls, index) => (
                        <ClassCard
                          key={cls.id}
                          classData={cls}
                          educationLevel={
                            cls.level === "Tertiary" ? "Tertiary" :
                            cls.level === "Primary" ? "Primary" : "Secondary"
                          }
                          isSelected={selectedIds.has(cls.id)}
                          onSelectionChange={(id, selected) => {
                            setSelectedIds((prev) => {
                              const newIds = new Set(prev);
                              if (selected) {
                                newIds.add(id);
                              } else {
                                newIds.delete(id);
                              }
                              return newIds;
                            });
                          }}
                          adviserImage={cls.classTeacher?.image || cls.teachers?.[0]?.image}
                        />
                      ))}
                    </div>

                    {hasMore && (
                      <div className="flex justify-center pt-4">
                        <LoadMoreButton onClick={handleLoadMore} isLoading={isLoadingMore} />
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {/* List View - Table */}
            {viewMode === "list" && (
              <div
                key={`list-view-${isFiltering ? "filtering" : "filtered"}-${isSorting ? "sorting" : "sorted"}-${isRefreshing ? "refreshing" : "refreshed"}-${sortOption}`}
                className="opacity-100 scale-100 translate-y-0 animate-in fade-in zoom-in-95 slide-in-from-bottom-3 duration-[450ms] ease-[cubic-bezier(0.34,1.56,0.64,1)]"
              >
                {isFiltering || isSorting || isRefreshing || isSwitchingView ? (
                  <PageSpinner
                    message={
                      isSwitchingView
                        ? "Switching view..."
                        : isRefreshing
                        ? "Refreshing..."
                        : isSorting
                        ? "Sorting..."
                        : "Filtering..."
                    }
                    size="md"
                  />
                ) : (
                  <ClassTable
                    classes={filteredClasses}
                    isLoading={false}
                    loadingMessage="Loading classes..."
                    hasActiveFilters={Object.values(filters).some((values) => values && values.length > 0)}
                    onClearFilters={handleRefresh}
                    totalClassesCount={tenantClasses.length}
                    selectedIds={selectedIds}
                    onSelectionChange={setSelectedIds}
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bulk Delete Modal */}
      <BulkDeleteModal
        isOpen={isBulkDeleteModalOpen}
        onClose={() => setIsBulkDeleteModalOpen(false)}
        onConfirm={(itemIds) => {
          console.log("Deleting classes:", itemIds);
          setSelectedIds(new Set());
          setIsBulkDeleteModalOpen(false);
          setItemsToDelete([]);
        }}
        items={itemsToDelete}
        onRemoveItem={(itemId) => {
          setItemsToDelete((prev) => prev.filter((item) => item.id !== itemId));
          setSelectedIds((prev) => {
            const newIds = new Set(prev);
            newIds.delete(itemId);
            return newIds;
          });
        }}
        onRestoreItem={(item) => {
          setItemsToDelete((prev) => [...prev, item]);
          setSelectedIds((prev) => {
            const newIds = new Set(prev);
            newIds.add(item.id);
            return newIds;
          });
        }}
        onRestoreAll={(items) => {
          setItemsToDelete((prev) => [...prev, ...items]);
          setSelectedIds((prev) => {
            const newIds = new Set(prev);
            items.forEach((item) => newIds.add(item.id));
            return newIds;
          });
        }}
        title={`Delete ${classLabel}`}
        warningMessage={`This will permanently remove these ${classLabel.toLowerCase()} and all associated data. This action cannot be undone.`}
        confirmButtonText={`Delete ${classLabel}`}
      />
    </MainLayout>
  );
}
