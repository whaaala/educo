"use client";

import { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { DashboardPage } from "@/components/pages";
import {
  ArrowLeft,
  Edit,
  Trash2,
  Users,
  UserPlus,
  MapPin,
  TrendingUp,
  Target,
  BookOpen,
  MoreVertical,
  Download,
  Mail,
  Phone,
} from "lucide-react";

interface Teacher {
  id: string;
  name: string;
  email: string;
  phone: string;
  image: string;
  subject?: string;
}

interface Student {
  id: string;
  name: string;
  email: string;
  image: string;
  attendanceRate: number;
  averageGrade: number;
}

interface Subject {
  name: string;
  code: string;
  teacher: Teacher;
  credits?: number;
}

interface ClassData {
  id: string;
  name: string;
  level: "Primary" | "Secondary" | "Junior Secondary" | "Tertiary";
  status: "Active" | "Inactive";
  teachers?: Teacher[];
  subjects?: Subject[];
  students: Student[];
  capacity: number;
  room: string;
  averageGrade: number;
  attendanceRate: number;
  term: string;
  academicYear: string;
  stream?: string;
  academicTrack?: string;
  // Tertiary-specific fields
  faculty?: string;
  department?: string;
  programme?: string;
  courseLevel?: string;
  semester?: string;
  schedule?: string;
}

export default function ClassDetailsPage() {
  const params = useParams();  const classId = params.id as string;

  const [activeTab, setActiveTab] = useState<"overview" | "students" | "subjects" | "performance">("overview");
  const [showActions, setShowActions] = useState(false);

  // Mock data - In production, this would be fetched from API
  const classData: ClassData = useMemo(() => {
    // This is mock data - should be replaced with API call
    return {
      id: classId,
      name: classId.startsWith("SSS") ? "SSS 1A - Science" : classId.startsWith("200L") ? "Computer Science 201" : "Class",
      level: classId.startsWith("200L") ? "Tertiary" : "Secondary",
      status: "Active",
      students: Array.from({ length: 45 }, (_, i) => ({
        id: `STU-${String(i + 1).padStart(3, "0")}`,
        name: `Student ${i + 1}`,
        email: `student${i + 1}@school.edu`,
        image: `https://api.dicebear.com/7.x/avataaars/svg?seed=student${i + 1}`,
        attendanceRate: 85 + Math.floor(Math.random() * 15),
        averageGrade: 70 + Math.floor(Math.random() * 30),
      })),
      capacity: 50,
      room: classId.startsWith("200L") ? "LT 201" : "Room 101",
      averageGrade: 78,
      attendanceRate: 92,
      term: "First Term",
      academicYear: "2024/2025",
      academicTrack: classId.includes("SCI") ? "Science" : undefined,
      faculty: classId.startsWith("200L") ? "Engineering" : undefined,
      department: classId.startsWith("200L") ? "Computer Science" : undefined,
      programme: classId.startsWith("200L") ? "B.Sc" : undefined,
      courseLevel: classId.startsWith("200L") ? "200 Level" : undefined,
      semester: classId.startsWith("200L") ? "First Semester" : undefined,
      subjects: classId.startsWith("200L")
        ? [
            {
              name: "Data Structures & Algorithms",
              code: "CSC 201",
              credits: 3,
              teacher: {
                id: "TCH-001",
                name: "Dr. Adewale Johnson",
                email: "adewale@school.edu",
                phone: "+234 801 234 5678",
                image: "https://api.dicebear.com/7.x/avataaars/svg?seed=adewale",
              },
            },
            {
              name: "Database Management Systems",
              code: "CSC 203",
              credits: 3,
              teacher: {
                id: "TCH-002",
                name: "Prof. Chiamaka Okonkwo",
                email: "chiamaka@school.edu",
                phone: "+234 802 345 6789",
                image: "https://api.dicebear.com/7.x/avataaars/svg?seed=chiamaka",
              },
            },
          ]
        : [
            {
              name: "Physics",
              code: "PHY",
              teacher: {
                id: "TCH-003",
                name: "Mr. Ibrahim Musa",
                email: "ibrahim@school.edu",
                phone: "+234 803 456 7890",
                image: "https://api.dicebear.com/7.x/avataaars/svg?seed=ibrahim",
              },
            },
            {
              name: "Chemistry",
              code: "CHM",
              teacher: {
                id: "TCH-004",
                name: "Mrs. Fatima Bello",
                email: "fatima@school.edu",
                phone: "+234 804 567 8901",
                image: "https://api.dicebear.com/7.x/avataaars/svg?seed=fatima",
              },
            },
          ],
      teachers: [
        {
          id: "TCH-001",
          name: "Dr. Adewale Johnson",
          email: "adewale@school.edu",
          phone: "+234 801 234 5678",
          image: "https://api.dicebear.com/7.x/avataaars/svg?seed=adewale",
          subject: "Data Structures",
        },
      ],
    };
  }, [classId]);

  const isTertiary = classData.level === "Tertiary";

  return (
    <DashboardPage
      title={classData.name}
      breadcrumbs={[
        { label: "Dashboard", href: "/" },
        { label: "Classes", href: "/classes" },
        { label: classData.name, isActive: true },
      ]}
      loadingText="Loading Class Details"
      afterStats={
        <div className="mt-6 min-h-screen bg-gray-50 dark:bg-[#0f1115] midnight:bg-gray-950 purple:bg-gray-950">
      {/* Header */}
      <div className="bg-surface border-b border-line">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Link
                href="/classes"
                className="p-2 hover:bg-gray-100 dark:hover:bg-[#22262e] midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300" />
              </Link>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white midnight:text-cyan-100 purple:text-pink-100">
                    {classData.name}
                  </h1>
                  <span className="text-sm font-medium text-muted bg-surface-2 px-2 py-1 rounded">
                    {classData.id}
                  </span>
                  <div
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full ${
                      classData.status === "Active"
                        ? "bg-green-100 dark:bg-green-900/30"
                        : "bg-red-100 dark:bg-red-900/30 midnight:bg-red-900/30 purple:bg-red-900/30"
                    }`}
                  >
                    <span
                      className={`relative inline-flex rounded-full h-2 w-2 ${
                        classData.status === "Active" ? "bg-green-500" : "bg-red-500"
                      }`}
                    />
                    <span
                      className={`text-xs font-bold ${
                        classData.status === "Active"
                          ? "text-green-700 dark:text-green-400 midnight:text-emerald-400 purple:text-emerald-400"
                          : "text-red-700 dark:text-red-400 midnight:text-red-400 purple:text-red-400"
                      }`}
                    >
                      {classData.status}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-muted mt-1">
                  {isTertiary && classData.faculty && classData.department
                    ? `${classData.faculty} • ${classData.department}`
                    : `${classData.term} • ${classData.academicYear}`}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                <UserPlus className="w-4 h-4" />
                Add Students
              </button>
              <div className="relative">
                <button
                  onClick={() => setShowActions(!showActions)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-[#22262e] midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10 rounded-lg transition-colors"
                >
                  <MoreVertical className="w-5 h-5 text-gray-600 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300" />
                </button>
                {showActions && (
                  <div className="absolute right-0 mt-2 w-48 bg-surface rounded-lg shadow-lg border border-line z-10">
                    <Link
                      href={`/classes/${classId}/edit`}
                      className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 dark:hover:bg-[#22262e] midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10 text-gray-700 dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200"
                    >
                      <Edit className="w-4 h-4" />
                      Edit Class
                    </Link>
                    <button className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 dark:hover:bg-[#22262e] midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10 text-gray-700 dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200 w-full">
                      <Download className="w-4 h-4" />
                      Export Data
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 dark:hover:bg-[#22262e] midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10 text-red-600 dark:text-red-400 midnight:text-red-400 purple:text-red-400 w-full">
                      <Trash2 className="w-4 h-4" />
                      Delete Class
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 midnight:bg-cyan-500/10 purple:bg-pink-500/10 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 midnight:bg-cyan-900/30 purple:bg-pink-900/30 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400" />
                </div>
                <div>
                  <p className="text-xs text-muted">
                    {isTertiary ? "Enrolled Students" : "Students"}
                  </p>
                  <p className="text-xl font-bold text-ink">
                    {classData.students.length}
                    {!isTertiary && `/${classData.capacity}`}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-xs text-muted">
                    {isTertiary ? "Hall/Lab" : "Room"}
                  </p>
                  <p className="text-xl font-bold text-ink">
                    {classData.room}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400 midnight:text-emerald-400 purple:text-emerald-400" />
                </div>
                <div>
                  <p className="text-xs text-muted">Average Grade</p>
                  <p className="text-xl font-bold text-ink">
                    {classData.averageGrade}%
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-cyan-50 dark:bg-cyan-900/20 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-cyan-100 dark:bg-cyan-900/30 rounded-lg flex items-center justify-center">
                  <Target className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
                </div>
                <div>
                  <p className="text-xs text-muted">Attendance Rate</p>
                  <p className="text-xl font-bold text-ink">
                    {classData.attendanceRate}%
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-4 mt-6 border-b border-line">
            <button
              onClick={() => setActiveTab("overview")}
              className={`px-4 py-2 border-b-2 transition-colors ${
                activeTab === "overview"
                  ? "border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400"
                  : "border-transparent text-gray-600 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300 hover:text-gray-900 dark:hover:text-white midnight:hover:text-cyan-50 purple:hover:text-pink-50"
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab("students")}
              className={`px-4 py-2 border-b-2 transition-colors ${
                activeTab === "students"
                  ? "border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400"
                  : "border-transparent text-gray-600 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300 hover:text-gray-900 dark:hover:text-white midnight:hover:text-cyan-50 purple:hover:text-pink-50"
              }`}
            >
              Students ({classData.students.length})
            </button>
            <button
              onClick={() => setActiveTab("subjects")}
              className={`px-4 py-2 border-b-2 transition-colors ${
                activeTab === "subjects"
                  ? "border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400"
                  : "border-transparent text-gray-600 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300 hover:text-gray-900 dark:hover:text-white midnight:hover:text-cyan-50 purple:hover:text-pink-50"
              }`}
            >
              Subjects ({classData.subjects?.length || 0})
            </button>
            <button
              onClick={() => setActiveTab("performance")}
              className={`px-4 py-2 border-b-2 transition-colors ${
                activeTab === "performance"
                  ? "border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400"
                  : "border-transparent text-gray-600 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300 hover:text-gray-900 dark:hover:text-white midnight:hover:text-cyan-50 purple:hover:text-pink-50"
              }`}
            >
              Performance
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Class Information */}
            <div className="bg-surface rounded-xl shadow-sm border border-line p-6">
              <h3 className="text-lg font-semibold text-ink mb-4">
                Class Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted">Class Code</p>
                  <p className="text-base font-medium text-ink">
                    {classData.id}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted">Education Level</p>
                  <p className="text-base font-medium text-ink">
                    {classData.level}
                  </p>
                </div>
                {isTertiary ? (
                  <>
                    <div>
                      <p className="text-sm text-muted">Faculty</p>
                      <p className="text-base font-medium text-ink">
                        {classData.faculty}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted">Department</p>
                      <p className="text-base font-medium text-ink">
                        {classData.department}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted">Programme</p>
                      <p className="text-base font-medium text-ink">
                        {classData.programme}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted">Semester</p>
                      <p className="text-base font-medium text-ink">
                        {classData.semester}
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <p className="text-sm text-muted">Term</p>
                      <p className="text-base font-medium text-ink">
                        {classData.term}
                      </p>
                    </div>
                    {classData.academicTrack && (
                      <div>
                        <p className="text-sm text-muted">Academic Track</p>
                        <p className="text-base font-medium text-ink">
                          {classData.academicTrack}
                        </p>
                      </div>
                    )}
                  </>
                )}
                <div>
                  <p className="text-sm text-muted">Academic Year</p>
                  <p className="text-base font-medium text-ink">
                    {classData.academicYear}
                  </p>
                </div>
              </div>
            </div>

            {/* Subjects */}
            {classData.subjects && classData.subjects.length > 0 && (
              <div className="bg-surface rounded-xl shadow-sm border border-line p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-ink">
                    Subjects
                  </h3>
                  <Link
                    href={`/classes/${classId}/subjects`}
                    className="text-sm text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400 hover:underline"
                  >
                    Manage Subjects
                  </Link>
                </div>
                <div className="space-y-3">
                  {classData.subjects.map((subject) => (
                    <div
                      key={subject.code}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-[#22262e] midnight:bg-[#0f1330] purple:bg-[#251340]/30 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 midnight:bg-cyan-900/30 purple:bg-pink-900/30 rounded-lg flex items-center justify-center">
                          <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-ink">
                            {subject.name}
                          </p>
                          <p className="text-xs text-muted">
                            {subject.code}
                            {subject.credits && ` • ${subject.credits} Credits`}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <img
                          src={subject.teacher.image}
                          alt={subject.teacher.name}
                          className="w-8 h-8 rounded-full"
                        />
                        <span className="text-sm text-gray-600 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300">
                          {subject.teacher.name}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "students" && (
          <div className="bg-surface rounded-xl shadow-sm border border-line">
            <div className="p-6 border-b border-line">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-ink">
                  Students List
                </h3>
                <input
                  type="search"
                  placeholder="Search students..."
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-[#22262e] midnight:bg-[#0f1330] purple:bg-[#251340] dark:text-white midnight:text-cyan-50 purple:text-pink-50"
                />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-[#22262e] midnight:bg-[#0f1330] purple:bg-[#251340]/30">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">
                      Student
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">
                      Attendance
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">
                      Avg Grade
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {classData.students.slice(0, 10).map((student) => (
                    <tr key={student.id} className="hover:bg-gray-50 dark:hover:bg-[#22262e] midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <img
                            src={student.image}
                            alt={student.name}
                            className="w-10 h-10 rounded-full"
                          />
                          <div>
                            <p className="text-sm font-medium text-ink">
                              {student.name}
                            </p>
                            <p className="text-xs text-muted">
                              {student.id}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300">
                        {student.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-ink">
                          {student.attendanceRate}%
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-ink">
                          {student.averageGrade}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "subjects" && (
          <div className="space-y-4">
            {classData.subjects?.map((subject) => (
              <div
                key={subject.code}
                className="bg-surface rounded-xl shadow-sm border border-line p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-ink">
                      {subject.name}
                    </h3>
                    <p className="text-sm text-muted">
                      {subject.code}
                      {subject.credits && ` • ${subject.credits} Credits`}
                    </p>
                  </div>
                  <button className="p-2 hover:bg-gray-100 dark:hover:bg-[#22262e] midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10 rounded-lg">
                    <MoreVertical className="w-5 h-5 text-gray-600 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300" />
                  </button>
                </div>
                <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-[#22262e] midnight:bg-[#0f1330] purple:bg-[#251340]/30 rounded-lg">
                  <img
                    src={subject.teacher.image}
                    alt={subject.teacher.name}
                    className="w-12 h-12 rounded-full"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-ink">
                      {subject.teacher.name}
                    </p>
                    <div className="flex items-center gap-4 mt-1">
                      <span className="flex items-center gap-1 text-xs text-muted">
                        <Mail className="w-3 h-3" />
                        {subject.teacher.email}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-muted">
                        <Phone className="w-3 h-3" />
                        {subject.teacher.phone}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "performance" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-surface rounded-xl shadow-sm border border-line p-6">
                <h3 className="text-lg font-semibold text-ink mb-4">
                  Grade Distribution
                </h3>
                <div className="h-64 flex items-center justify-center text-gray-400">
                  Chart placeholder
                </div>
              </div>
              <div className="bg-surface rounded-xl shadow-sm border border-line p-6">
                <h3 className="text-lg font-semibold text-ink mb-4">
                  Attendance Trends
                </h3>
                <div className="h-64 flex items-center justify-center text-gray-400">
                  Chart placeholder
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
      }
    />
  );
}
