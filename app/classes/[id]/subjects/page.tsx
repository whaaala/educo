"use client";

import { useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSchoolSettings } from "@/contexts/SchoolSettingsContext";
import Link from "next/link";
import {
  ArrowLeft,
  Plus,
  Edit,
  Trash2,
  BookOpen,
  GraduationCap,
  Search,
  MoreVertical,
  Mail,
  Phone,
  Users,
} from "lucide-react";

interface Teacher {
  id: string;
  name: string;
  email: string;
  phone: string;
  image: string;
}

interface Subject {
  id: string;
  name: string;
  code: string;
  teacher: Teacher;
  credits?: number;
  hoursPerWeek?: number;
  description?: string;
}

export default function SubjectsManagementPage() {
  const params = useParams();
  const router = useRouter();
  const { settings } = useSchoolSettings();
  const classId = params.id as string;

  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [showActionsMenu, setShowActionsMenu] = useState<string | null>(null);

  // Mock data - In production, fetch from API
  const mockSubjects: Subject[] = useMemo(() => {
    const isTertiary = classId.startsWith("200L") || classId.startsWith("ND");

    if (isTertiary) {
      return [
        {
          id: "SUB-001",
          name: "Data Structures & Algorithms",
          code: "CSC 201",
          credits: 3,
          hoursPerWeek: 4,
          description: "Introduction to fundamental data structures and algorithms",
          teacher: {
            id: "TCH-001",
            name: "Dr. Adewale Johnson",
            email: "adewale@school.edu",
            phone: "+234 801 234 5678",
            image: "https://api.dicebear.com/7.x/avataaars/svg?seed=adewale",
          },
        },
        {
          id: "SUB-002",
          name: "Database Management Systems",
          code: "CSC 203",
          credits: 3,
          hoursPerWeek: 4,
          description: "Design and implementation of database systems",
          teacher: {
            id: "TCH-002",
            name: "Prof. Chiamaka Okonkwo",
            email: "chiamaka@school.edu",
            phone: "+234 802 345 6789",
            image: "https://api.dicebear.com/7.x/avataaars/svg?seed=chiamaka",
          },
        },
        {
          id: "SUB-003",
          name: "Web Development",
          code: "CSC 205",
          credits: 2,
          hoursPerWeek: 3,
          description: "Modern web application development techniques",
          teacher: {
            id: "TCH-003",
            name: "Mr. Ibrahim Musa",
            email: "ibrahim@school.edu",
            phone: "+234 803 456 7890",
            image: "https://api.dicebear.com/7.x/avataaars/svg?seed=ibrahim",
          },
        },
        {
          id: "SUB-004",
          name: "Computer Networks",
          code: "CSC 207",
          credits: 3,
          hoursPerWeek: 4,
          description: "Fundamentals of computer networking and protocols",
          teacher: {
            id: "TCH-004",
            name: "Dr. Fatima Bello",
            email: "fatima@school.edu",
            phone: "+234 804 567 8901",
            image: "https://api.dicebear.com/7.x/avataaars/svg?seed=fatima",
          },
        },
      ];
    } else {
      return [
        {
          id: "SUB-005",
          name: "Physics",
          code: "PHY",
          hoursPerWeek: 5,
          description: "Senior Secondary Physics curriculum",
          teacher: {
            id: "TCH-003",
            name: "Mr. Ibrahim Musa",
            email: "ibrahim@school.edu",
            phone: "+234 803 456 7890",
            image: "https://api.dicebear.com/7.x/avataaars/svg?seed=ibrahim",
          },
        },
        {
          id: "SUB-006",
          name: "Chemistry",
          code: "CHM",
          hoursPerWeek: 5,
          description: "Senior Secondary Chemistry curriculum",
          teacher: {
            id: "TCH-004",
            name: "Mrs. Fatima Bello",
            email: "fatima@school.edu",
            phone: "+234 804 567 8901",
            image: "https://api.dicebear.com/7.x/avataaars/svg?seed=fatima",
          },
        },
        {
          id: "SUB-007",
          name: "Biology",
          code: "BIO",
          hoursPerWeek: 5,
          description: "Senior Secondary Biology curriculum",
          teacher: {
            id: "TCH-005",
            name: "Dr. Chinwe Okafor",
            email: "chinwe@school.edu",
            phone: "+234 805 678 9012",
            image: "https://api.dicebear.com/7.x/avataaars/svg?seed=chinwe",
          },
        },
        {
          id: "SUB-008",
          name: "Mathematics",
          code: "MTH",
          hoursPerWeek: 6,
          description: "Senior Secondary Mathematics curriculum",
          teacher: {
            id: "TCH-006",
            name: "Mr. Oluwaseun Adeleke",
            email: "oluwaseun@school.edu",
            phone: "+234 806 789 0123",
            image: "https://api.dicebear.com/7.x/avataaars/svg?seed=oluwaseun",
          },
        },
        {
          id: "SUB-009",
          name: "English Language",
          code: "ENG",
          hoursPerWeek: 4,
          description: "Senior Secondary English Language curriculum",
          teacher: {
            id: "TCH-007",
            name: "Mrs. Amaka Nwankwo",
            email: "amaka@school.edu",
            phone: "+234 807 890 1234",
            image: "https://api.dicebear.com/7.x/avataaars/svg?seed=amaka",
          },
        },
      ];
    }
  }, [classId]);

  const filteredSubjects = useMemo(() => {
    if (!searchQuery) return mockSubjects;

    return mockSubjects.filter(
      (subject) =>
        subject.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        subject.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        subject.teacher.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [mockSubjects, searchQuery]);

  const isTertiary = classId.startsWith("200L") || classId.startsWith("ND");
  const totalCredits = mockSubjects.reduce((sum, subject) => sum + (subject.credits || 0), 0);
  const totalHours = mockSubjects.reduce((sum, subject) => sum + (subject.hoursPerWeek || 0), 0);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 midnight:bg-gray-950 purple:bg-gray-950">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 border-b border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Link
                href={`/classes/${classId}`}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white midnight:text-cyan-100 purple:text-pink-100">
                  Subjects Management
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Manage subjects and teachers for {classId}
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Subject
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 midnight:bg-cyan-500/10 purple:bg-pink-500/10 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Total Subjects</p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">
                    {mockSubjects.length}
                  </p>
                </div>
              </div>
            </div>

            {isTertiary && (
              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                    <GraduationCap className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Total Credits</p>
                    <p className="text-xl font-bold text-gray-900 dark:text-white">
                      {totalCredits}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Weekly Hours</p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">
                    {totalHours}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search subjects, codes, or teachers..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
            />
          </div>
        </div>

        {/* Subjects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredSubjects.map((subject) => (
            <div
              key={subject.id}
              className="bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Subject Header */}
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <BookOpen className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {subject.name}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {subject.code}
                        {subject.credits && ` • ${subject.credits} Credits`}
                      </p>
                    </div>
                  </div>
                  <div className="relative">
                    <button
                      onClick={() =>
                        setShowActionsMenu(
                          showActionsMenu === subject.id ? null : subject.id
                        )
                      }
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      <MoreVertical className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    </button>
                    {showActionsMenu === subject.id && (
                      <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10">
                        <button className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 w-full text-left">
                          <Edit className="w-4 h-4" />
                          Edit Subject
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 text-red-600 dark:text-red-400 w-full text-left">
                          <Trash2 className="w-4 h-4" />
                          Remove Subject
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {subject.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    {subject.description}
                  </p>
                )}

                {/* Subject Info */}
                <div className="flex items-center gap-4">
                  {subject.credits && (
                    <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                      <GraduationCap className="w-4 h-4" />
                      <span>{subject.credits} Credits</span>
                    </div>
                  )}
                  {subject.hoursPerWeek && (
                    <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                      <BookOpen className="w-4 h-4" />
                      <span>{subject.hoursPerWeek} hrs/week</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Teacher Info */}
              <div className="p-6 bg-gray-50 dark:bg-gray-700/30 midnight:bg-gray-800/50 purple:bg-gray-800/50">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                  {isTertiary ? "Lecturer" : "Teacher"}
                </p>
                <div className="flex items-center gap-3">
                  <img
                    src={subject.teacher.image}
                    alt={subject.teacher.name}
                    className="w-12 h-12 rounded-full ring-2 ring-white dark:ring-gray-800 shadow-md object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {subject.teacher.name}
                    </p>
                    <div className="flex flex-col gap-1 mt-1">
                      <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 truncate">
                        <Mail className="w-3 h-3 flex-shrink-0" />
                        {subject.teacher.email}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                        <Phone className="w-3 h-3 flex-shrink-0" />
                        {subject.teacher.phone}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredSubjects.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No subjects found
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              {searchQuery
                ? "Try adjusting your search query"
                : "Get started by adding your first subject"}
            </p>
            {!searchQuery && (
              <button
                onClick={() => setShowAddModal(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Subject
              </button>
            )}
          </div>
        )}
      </div>

      {/* Add Subject Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Add New Subject
              </h2>
            </div>
            <div className="p-6">
              <form 
                className="space-y-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  // Handle form submission here
                  console.log("Form submitted");
                  setShowAddModal(false);
                }}
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Subject Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Data Structures & Algorithms"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Subject Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., CSC 201"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>

                {isTertiary && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Credits <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      placeholder="e.g., 3"
                      min="1"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      required
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Hours per Week
                  </label>
                  <input
                    type="number"
                    placeholder="e.g., 4"
                    min="1"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Brief description of the subject"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Assign {isTertiary ? "Lecturer" : "Teacher"} <span className="text-red-500">*</span>
                  </label>
                  <select
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    required
                  >
                    <option value="">Select {isTertiary ? "lecturer" : "teacher"}</option>
                    <option value="TCH-001">Dr. Adewale Johnson</option>
                    <option value="TCH-002">Prof. Chiamaka Okonkwo</option>
                    <option value="TCH-003">Mr. Ibrahim Musa</option>
                  </select>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  >
                    Add Subject
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
