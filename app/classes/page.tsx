"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { DataManagementPage } from "@/components/pages";
import ClassCard from "@/components/classes/ClassCard";
import ActionModal from "@/components/shared/ActionModal";
import BulkDeleteModal, { BulkDeleteItem } from "@/components/shared/BulkDeleteModal";
import Tooltip from "@/components/shared/Tooltip";
import NameLabel from "@/components/shared/NameLabel";
import { useSchoolSettings } from "@/contexts/SchoolSettingsContext";
import { useSidebar } from "@/contexts/SidebarContext";
import { getEducationLevelColor } from "@/utils/educationLevel";
import {
  BookOpen,
  Users,
  MapPin,
  TrendingUp,
  UserPlus,
  Eye,
  Edit,
  Trash2,
  MoreVertical,
} from "lucide-react";
import type { ColumnConfig, GridCardProps } from "@/types/components";
import {
  type ClassData,
  getClassFilterFields,
  classSortOptions,
  sortClasses,
  filterClasses,
  filterByTenantLevels,
} from "./config";

// Mock data - In production, this would come from API
// Following African Education Structure: Level + Section or Level-Track-Section or Programme-Dept-Level-Semester
const mockClasses: ClassData[] = [
  {
    id: "SSS1-SCI-A",
    name: "SSS 1A",
    level: "Secondary",
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
    id: "SSS2-ART-B",
    name: "SSS 2B",
    level: "Secondary",
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
    id: "SSS3-SCI-A",
    name: "SSS 3A",
    level: "Secondary",
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
    id: "JSS3-B",
    name: "JSS 3B",
    level: "Junior Secondary",
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
    id: "PRY5-A",
    name: "Primary 5A",
    level: "Primary",
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
    id: "PRY1-A",
    name: "Primary 1A",
    level: "Primary",
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
    id: "JSS1-A",
    name: "JSS 1A",
    level: "Junior Secondary",
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
    id: "SSS2-COM-A",
    name: "SSS 2A",
    level: "Secondary",
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
    id: "SSS3-TEC-A",
    name: "SSS 3A",
    level: "Secondary",
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
    id: "200L-CSC-SEM1",
    name: "Computer Science 201",
    level: "Tertiary",
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
    id: "ND2-CS-SEM2",
    name: "ND 2 Computer Science",
    level: "Tertiary",
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
    faculty: "School of Technology",
    department: "Computer Science",
    programme: "ND",
    courseLevel: "ND 2",
    semester: "Second Semester",
  },
  {
    id: "300L-EEE-SEM1",
    name: "Electrical Engineering 301",
    level: "Tertiary",
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
    faculty: "Engineering",
    department: "Electrical & Electronics Engineering",
    programme: "B.Eng",
    courseLevel: "300 Level",
    semester: "First Semester",
  },
  {
    id: "HND1-BA-SEM1",
    name: "HND 1 Business Admin",
    level: "Tertiary",
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
    faculty: "School of Business Studies",
    department: "Business Administration",
    programme: "HND",
    courseLevel: "HND 1",
    semester: "First Semester",
  },
  {
    id: "ND2-SIWES",
    name: "ND 2 SIWES Program",
    level: "Tertiary",
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
    faculty: "School of Technology",
    department: "All Departments",
    programme: "ND",
    courseLevel: "ND 2",
    semester: "SIWES (6 Months)",
  },
  {
    id: "400L-MED-SEM2",
    name: "Medicine 401",
    level: "Tertiary",
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
    faculty: "Medicine",
    department: "Medicine & Surgery",
    programme: "MBBS",
    courseLevel: "400 Level",
    semester: "Second Semester",
  },
];

// Actions cell component for the table - encapsulates dropdown state
function ClassActionsCell({ classData }: { classData: ClassData }) {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState<'bottom' | 'top'>('bottom');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMenuToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isMenuOpen) {
      setIsMenuOpen(false);
      return;
    }
    const button = e.currentTarget as HTMLElement;
    const buttonRect = button.getBoundingClientRect();
    const menuHeight = 240;
    const spaceBelow = window.innerHeight - buttonRect.bottom;
    const spaceAbove = buttonRect.top;
    setMenuPosition(spaceBelow < menuHeight && spaceAbove > menuHeight ? 'top' : 'bottom');
    setIsMenuOpen(true);
  };

  return (
    <>
      <div className="flex items-center justify-start gap-0.5 md:gap-1 lg:gap-1.5 xl:gap-2 pr-0.5 md:pr-2">
        <div className="relative group/view flex-shrink-0">
          <button
            className="p-0.5 md:p-1 xl:p-1.5 rounded-md hover:bg-blue-50 dark:hover:bg-blue-500/20 midnight:hover:bg-cyan-500/20 purple:hover:bg-pink-500/20 transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
            onClick={(e) => { e.stopPropagation(); router.push(`/classes/${classData.id}`); }}
          >
            <Eye className="w-3.5 h-3.5 md:w-3 md:h-3 lg:w-3.5 lg:h-3.5 xl:w-4 xl:h-4 text-gray-600 dark:text-gray-400 midnight:text-cyan-400 purple:text-pink-400 group-hover/view:text-blue-600 dark:group-hover/view:text-blue-400 transition-colors" />
          </button>
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover/view:opacity-100 transition-opacity duration-200 pointer-events-none z-[99999]">
            <NameLabel name="View" variant="compact" />
          </div>
        </div>
        <div className="relative group/subjects flex-shrink-0">
          <button
            className="p-0.5 md:p-1 xl:p-1.5 rounded-md hover:bg-purple-50 dark:hover:bg-purple-500/20 midnight:hover:bg-cyan-500/20 purple:hover:bg-pink-500/20 transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
            onClick={(e) => { e.stopPropagation(); router.push(`/classes/${classData.id}/subjects`); }}
          >
            <BookOpen className="w-3.5 h-3.5 md:w-3 md:h-3 lg:w-3.5 lg:h-3.5 xl:w-4 xl:h-4 text-gray-600 dark:text-gray-400 midnight:text-cyan-400 purple:text-pink-400 group-hover/subjects:text-purple-600 dark:group-hover/subjects:text-purple-400 transition-colors" />
          </button>
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover/subjects:opacity-100 transition-opacity duration-200 pointer-events-none z-[99999]">
            <NameLabel name="Subjects" variant="compact" />
          </div>
        </div>
        <div className="relative group/students flex-shrink-0">
          <button
            className="p-0.5 md:p-1 xl:p-1.5 rounded-md hover:bg-green-50 dark:hover:bg-green-500/20 midnight:hover:bg-cyan-500/20 purple:hover:bg-pink-500/20 transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
            onClick={(e) => { e.stopPropagation(); router.push(`/classes/${classData.id}/students/add`); }}
          >
            <UserPlus className="w-3.5 h-3.5 md:w-3 md:h-3 lg:w-3.5 lg:h-3.5 xl:w-4 xl:h-4 text-gray-600 dark:text-gray-400 midnight:text-cyan-400 purple:text-pink-400 group-hover/students:text-green-600 dark:group-hover/students:text-green-400 transition-colors" />
          </button>
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover/students:opacity-100 transition-opacity duration-200 pointer-events-none z-[99999]">
            <NameLabel name="Add Students" variant="compact" />
          </div>
        </div>
        <div className="relative flex-shrink-0 overflow-visible group/more" ref={menuRef}>
          <button
            className={`p-0.5 md:p-1 xl:p-1.5 rounded-md transition-all duration-200 group hover:scale-105 active:scale-95 cursor-pointer ${
              isMenuOpen
                ? 'bg-gray-200 dark:bg-[#2a2d35] midnight:bg-cyan-500/30 purple:bg-pink-500/30'
                : 'hover:bg-gray-100 dark:hover:bg-gray-500/20 midnight:hover:bg-cyan-500/20 purple:hover:bg-pink-500/20'
            }`}
            title="More"
            onClick={handleMenuToggle}
          >
            <MoreVertical className="w-3.5 h-3.5 md:w-3 md:h-3 lg:w-3.5 lg:h-3.5 xl:w-4 xl:h-4 text-gray-600 dark:text-gray-400 midnight:text-cyan-400 purple:text-pink-400 group-hover:text-gray-800 dark:group-hover:text-gray-200 transition-colors" />
          </button>
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover/more:opacity-100 transition-opacity duration-200 pointer-events-none z-[99999]">
            <NameLabel name="More" variant="compact" />
          </div>

          {isMenuOpen && (
            <div
              className={`absolute right-0 w-52 bg-white dark:bg-[#1a1d24] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e] rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 z-[999999] py-1 animate-in fade-in duration-200 ${
                menuPosition === 'top'
                  ? 'bottom-full mb-1 slide-in-from-bottom-2'
                  : 'top-full mt-1 slide-in-from-top-2'
              }`}
            >
              <button onClick={() => { router.push(`/classes/${classData.id}`); setIsMenuOpen(false); }} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 midnight:text-cyan-100 purple:text-pink-100 hover:bg-gray-50 dark:hover:bg-[#22262e] midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10 transition-colors cursor-pointer">
                <Eye className="w-4 h-4" /><span>View Class</span>
              </button>
              <button onClick={() => { router.push(`/classes/${classData.id}/edit`); setIsMenuOpen(false); }} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 midnight:text-cyan-100 purple:text-pink-100 hover:bg-gray-50 dark:hover:bg-[#22262e] midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10 transition-colors cursor-pointer">
                <Edit className="w-4 h-4" /><span>Edit</span>
              </button>
              <button onClick={() => { router.push(`/classes/${classData.id}/subjects`); setIsMenuOpen(false); }} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 midnight:text-cyan-100 purple:text-pink-100 hover:bg-gray-50 dark:hover:bg-[#22262e] midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10 transition-colors cursor-pointer">
                <BookOpen className="w-4 h-4" /><span>Manage Subjects</span>
              </button>
              <button onClick={() => { router.push(`/classes/${classData.id}/students/add`); setIsMenuOpen(false); }} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 midnight:text-cyan-100 purple:text-pink-100 hover:bg-gray-50 dark:hover:bg-[#22262e] midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10 transition-colors cursor-pointer">
                <UserPlus className="w-4 h-4" /><span>Add Students</span>
              </button>
              <button onClick={() => { setIsDeleteModalOpen(true); setIsMenuOpen(false); }} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 midnight:hover:bg-red-500/10 purple:hover:bg-red-500/10 transition-colors cursor-pointer">
                <Trash2 className="w-4 h-4" /><span>Delete</span>
              </button>
            </div>
          )}
        </div>
      </div>

      <ActionModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Class"
        subtitle={`${classData.name} • ${classData.id}`}
        variant="danger"
        message="This will permanently remove this class and all associated data. This action cannot be undone."
        confirmLabel="Delete Class"
        cancelLabel="Cancel"
        onConfirm={() => {
          console.log("Deleting class:", classData.id);
          setIsDeleteModalOpen(false);
        }}
      />
    </>
  );
}

// Grid card wrapper - adapts ClassCard to GridCardProps interface
function ClassGridCard({ item, isSelected, onSelectionChange }: GridCardProps<ClassData>) {
  return (
    <ClassCard
      classData={item}
      educationLevel={
        item.level === "Tertiary" ? "Tertiary" :
        item.level === "Primary" ? "Primary" : "Secondary"
      }
      isSelected={isSelected}
      onSelectionChange={(_id, selected) => onSelectionChange(selected)}
      adviserImage={item.classTeacher?.image || item.teachers?.[0]?.image}
    />
  );
}

export default function ClassesPage() {
  const router = useRouter();
  const { settings } = useSchoolSettings();

  const [classes] = useState(mockClasses);
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);
  const [itemsToDelete, setItemsToDelete] = useState<BulkDeleteItem[]>([]);

  // Filter by tenant supported levels
  const tenantClasses = useMemo(() => {
    return filterByTenantLevels(classes, settings.supportedLevels);
  }, [classes, settings.supportedLevels]);

  // Dynamic filter fields based on tenant settings
  const filterFields = useMemo(() => {
    return getClassFilterFields(settings.supportedLevels);
  }, [settings.supportedLevels]);

  // Dynamic labels
  const classLabel = settings.supportedLevels.includes("Tertiary") ? "Courses" : "Classes";
  const singleClassLabel = settings.supportedLevels.includes("Tertiary") ? "Course" : "Class";

  // Column definitions - matching ClassTable exactly
  const classColumns: ColumnConfig<ClassData>[] = useMemo(() => [
    {
      key: "id",
      label: "Class Code",
      sortable: true,
      className: "text-left w-[15%] md:w-[12%]",
      render: (classData: ClassData) => (
        <span
          onClick={(e) => { e.stopPropagation(); router.push(`/classes/${classData.id}`); }}
          className="text-sm font-bold text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400 block cursor-pointer whitespace-nowrap hover:underline transition-all duration-200"
        >
          {classData.id}
        </span>
      ),
    },
    {
      key: "name",
      label: "Class Name",
      sortable: true,
      className: "text-left w-[20%] md:w-[15%]",
      render: (classData: ClassData) => (
        <Tooltip content={classData.name}>
          <span className="text-sm font-medium text-gray-900 dark:text-gray-100 midnight:text-cyan-100 purple:text-pink-100 truncate block">
            {classData.name}
          </span>
        </Tooltip>
      ),
    },
    {
      key: "branch",
      label: "Branch",
      sortable: true,
      hidden: { mobile: true, tablet: true },
      className: "text-left w-[12%]",
      render: (classData: ClassData) => (
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200">
          {classData.branch || "—"}
        </span>
      ),
    },
    {
      key: "classTeacher",
      label: "Class Teacher",
      sortable: true,
      hidden: { mobile: true, tablet: true },
      className: "text-left w-[15%]",
      render: (classData: ClassData) => {
        const isTertiary = classData.level === "Tertiary";
        const teacherCount = classData.teachers?.length || 0;
        if (isTertiary) {
          return (
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200">
              {teacherCount} Lecturer{teacherCount !== 1 ? "s" : ""}
            </span>
          );
        }
        if (classData.classTeacher) {
          return (
            <Tooltip content={classData.classTeacher.name}>
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100 midnight:text-cyan-100 purple:text-pink-100 truncate block">
                {classData.classTeacher.name}
              </span>
            </Tooltip>
          );
        }
        return <span className="text-sm text-gray-400 dark:text-gray-500">Not assigned</span>;
      },
    },
    {
      key: "level",
      label: "Level",
      sortable: true,
      hidden: { mobile: true },
      className: "text-left w-[12%] md:w-[10%]",
      render: (classData: ClassData) => {
        const colors = getEducationLevelColor(classData.level);
        return (
          <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold border ${colors.bg} ${colors.text} ${colors.border}`}>
            {classData.level}
          </span>
        );
      },
    },
    {
      key: "students",
      label: "Students",
      sortable: true,
      className: "text-left w-[12%] md:w-[10%]",
      render: (classData: ClassData) => {
        const isTertiary = classData.level === "Tertiary";
        return (
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-gray-400" />
            <span className="text-sm font-medium text-gray-900 dark:text-gray-100 midnight:text-cyan-100 purple:text-pink-100">
              {isTertiary ? classData.students : `${classData.students}/${classData.capacity}`}
            </span>
          </div>
        );
      },
    },
    {
      key: "subjects",
      label: "Subjects",
      sortable: true,
      hidden: { mobile: true, tablet: true },
      className: "text-left w-[10%]",
      render: (classData: ClassData) => {
        const isTertiary = classData.level === "Tertiary";
        const subjectCount = classData.subjects?.length || 0;
        return (
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-gray-400" />
            <span className="text-sm font-medium text-gray-900 dark:text-gray-100 midnight:text-cyan-100 purple:text-pink-100">
              {subjectCount} {isTertiary ? "Course" : "Subject"}{subjectCount !== 1 ? "s" : ""}
            </span>
          </div>
        );
      },
    },
    {
      key: "room",
      label: "Room",
      sortable: true,
      hidden: { mobile: true, tablet: true },
      className: "text-left w-[10%]",
      render: (classData: ClassData) => (
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-gray-400" />
          <span className="text-sm font-medium text-gray-900 dark:text-gray-100 midnight:text-cyan-100 purple:text-pink-100">
            {classData.room}
          </span>
        </div>
      ),
    },
    {
      key: "averageGrade",
      label: "Avg Grade",
      sortable: true,
      hidden: { mobile: true, tablet: true },
      className: "text-left w-[10%]",
      render: (classData: ClassData) => (
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-green-500" />
          <span className="text-sm font-medium text-gray-900 dark:text-gray-100 midnight:text-cyan-100 purple:text-pink-100">
            {classData.averageGrade}%
          </span>
        </div>
      ),
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      className: "text-left w-[15%] md:w-[10%]",
      render: (classData: ClassData) => (
        <div className="flex items-center justify-start">
          <span
            className={`inline-flex items-center justify-center px-2 md:px-3 xl:px-3.5 py-1 md:py-1.5 xl:py-2 rounded-full text-[10px] md:text-xs xl:text-sm font-semibold shadow-sm transition-all duration-300 whitespace-nowrap ${
              classData.status === "Active"
                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 midnight:bg-green-500/20 midnight:text-green-300 purple:bg-green-500/20 purple:text-green-300"
                : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 midnight:bg-red-500/20 midnight:text-red-300 purple:bg-red-500/20 purple:text-red-300"
            }`}
          >
            {classData.status}
          </span>
        </div>
      ),
    },
    {
      key: "actions",
      label: "Action",
      sortable: false,
      searchable: false,
      className: "text-left w-[20%] md:w-[15%] !overflow-visible",
      render: (classData: ClassData) => <ClassActionsCell classData={classData} />,
    },
  ], [router]);

  // Bulk delete handler
  const handleBulkDelete = (selectedIds: Set<string>) => {
    const selectedClasses = tenantClasses.filter((cls) => selectedIds.has(cls.id));
    const items: BulkDeleteItem[] = selectedClasses.map((cls) => {
      const teacherName = cls.classTeacher?.name ||
        (cls.teachers && cls.teachers.length > 0 ? cls.teachers[0]?.name : null) ||
        "No teacher assigned";
      return {
        id: cls.id,
        name: cls.name,
        subtitle: `${cls.students} students • ${teacherName}`,
      };
    });
    setItemsToDelete(items);
    setIsBulkDeleteModalOpen(true);
  };

  return (
    <DataManagementPage<ClassData>
      title={`${classLabel} Management`}
      breadcrumbs={[
        { label: "Dashboard", href: "/" },
        { label: "Academic" },
        { label: classLabel, isActive: true },
      ]}
      data={tenantClasses}
      getRowKey={(item) => item.id}
      columns={classColumns}
      filterFields={filterFields}
      filterFn={filterClasses}
      sortOptions={classSortOptions}
      sortFn={sortClasses}
      defaultSort="ascending"
      enableViewToggle
      gridCardComponent={ClassGridCard}
      gridColumns={{ sm: 1, md: 2, lg: 3, xl: 4 }}
      enableSelection
      bulkActions={[
        {
          id: "delete",
          label: `Delete ${classLabel}`,
          icon: Trash2,
          variant: "danger",
          onClick: handleBulkDelete,
        },
      ]}
      addButtonConfig={{
        label: `Add ${singleClassLabel}`,
        onClick: () => router.push("/classes/add"),
      }}
      enableExport
      exportConfig={{ filename: "classes" }}
      onExportPDF={() => console.log("Export PDF")}
      onExportExcel={() => console.log("Export Excel")}
      itemLabel={singleClassLabel.toLowerCase()}
      itemLabelPlural={classLabel.toLowerCase()}
      emptyStateConfig={{
        title: `No ${classLabel} Found`,
        description: `Try adjusting your filters or add a new ${singleClassLabel.toLowerCase()}`,
      }}
    >
      <BulkDeleteModal
        isOpen={isBulkDeleteModalOpen}
        onClose={() => setIsBulkDeleteModalOpen(false)}
        onConfirm={(itemIds) => {
          console.log("Deleting classes:", itemIds);
          setIsBulkDeleteModalOpen(false);
          setItemsToDelete([]);
        }}
        items={itemsToDelete}
        onRemoveItem={(itemId) => {
          setItemsToDelete((prev) => prev.filter((item) => item.id !== itemId));
        }}
        onRestoreItem={(item) => {
          setItemsToDelete((prev) => [...prev, item]);
        }}
        onRestoreAll={(items) => {
          setItemsToDelete((prev) => [...prev, ...items]);
        }}
        title={`Delete ${classLabel}`}
        warningMessage={`This will permanently remove these ${classLabel.toLowerCase()} and all associated data. This action cannot be undone.`}
        confirmButtonText={`Delete ${classLabel}`}
      />
    </DataManagementPage>
  );
}
