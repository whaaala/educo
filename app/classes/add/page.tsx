"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useSchoolSettings } from "@/contexts/SchoolSettingsContext";
import {
  ArrowLeft,
  Save,
  Users,
  MapPin,
  BookOpen,
  GraduationCap,
  Building2,
  Calendar,
} from "lucide-react";
import Link from "next/link";

type EducationLevel = "Primary" | "Junior Secondary" | "Secondary" | "Tertiary";
type AcademicTrack = "Science" | "Arts" | "Commercial" | "Technical";
type TertiaryProgramme = "B.Sc" | "B.Eng" | "B.A" | "ND" | "HND" | "NCE" | "MBBS";
type Semester = "First Semester" | "Second Semester" | "SIWES";

export default function AddClassPage() {
  const router = useRouter();
  const { settings } = useSchoolSettings();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [educationLevel, setEducationLevel] = useState<EducationLevel | "">("Secondary");
  const [className, setClassName] = useState("");
  const [level, setLevel] = useState("");
  const [section, setSection] = useState("A");
  const [stream, setStream] = useState("");

  // Secondary-specific
  const [academicTrack, setAcademicTrack] = useState<AcademicTrack | "">("");

  // Tertiary-specific
  const [faculty, setFaculty] = useState("");
  const [department, setDepartment] = useState("");
  const [programme, setProgramme] = useState<TertiaryProgramme | "">("");
  const [courseLevel, setCourseLevel] = useState("");
  const [semester, setSemester] = useState<Semester | "">("First Semester");

  // Common fields
  const [room, setRoom] = useState("");
  const [capacity, setCapacity] = useState("");
  const [term, setTerm] = useState("First Term");
  const [academicYear, setAcademicYear] = useState("2024/2025");

  const isTertiary = educationLevel === "Tertiary";
  const isSecondary = educationLevel === "Secondary";
  const isPrimary = educationLevel === "Primary";
  const isJuniorSecondary = educationLevel === "Junior Secondary";

  // Generate class code based on education level
  const generatedClassCode = useMemo(() => {
    if (!educationLevel || !level) return "";

    if (isPrimary) {
      // PRY1-A, PRY6-B
      return `PRY${level}-${section}`;
    }

    if (isJuniorSecondary) {
      // JSS1-A, JSS3-B
      return `JSS${level}-${section}`;
    }

    if (isSecondary) {
      // SSS1-SCI-A, SSS2-COM-B
      const trackCode = academicTrack
        ? academicTrack.substring(0, 3).toUpperCase()
        : "";
      return trackCode
        ? `SSS${level}-${trackCode}-${section}`
        : `SSS${level}-${section}`;
    }

    if (isTertiary && programme) {
      // 200L-CSC-SEM1, ND2-CS-SEM2
      const deptCode = department
        .split(" ")
        .map(w => w.charAt(0))
        .join("")
        .toUpperCase();

      const semCode = semester === "First Semester"
        ? "SEM1"
        : semester === "Second Semester"
        ? "SEM2"
        : "SIWES";

      if (programme === "ND" || programme === "HND") {
        return `${programme}${courseLevel}-${deptCode}-${semCode}`;
      }

      return `${courseLevel}-${deptCode}-${semCode}`;
    }

    return "";
  }, [
    educationLevel,
    level,
    section,
    academicTrack,
    department,
    programme,
    courseLevel,
    semester,
    isPrimary,
    isJuniorSecondary,
    isSecondary,
    isTertiary,
  ]);

  // Level options based on education level
  const levelOptions = useMemo(() => {
    if (isPrimary) return ["1", "2", "3", "4", "5", "6"];
    if (isJuniorSecondary) return ["1", "2", "3"];
    if (isSecondary) return ["1", "2", "3"];
    if (isTertiary && programme) {
      if (programme === "ND") return ["1", "2"];
      if (programme === "HND") return ["1", "2"];
      if (programme === "NCE") return ["1", "2", "3"];
      if (programme === "MBBS") return ["100L", "200L", "300L", "400L", "500L", "600L"];
      return ["100L", "200L", "300L", "400L", "500L"];
    }
    return [];
  }, [educationLevel, programme, isPrimary, isJuniorSecondary, isSecondary, isTertiary]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    const classData = {
      id: generatedClassCode,
      name: className,
      level: educationLevel,
      section,
      stream: !isTertiary ? stream : undefined,
      academicTrack: isSecondary ? academicTrack : undefined,
      faculty: isTertiary ? faculty : undefined,
      department: isTertiary ? department : undefined,
      programme: isTertiary ? programme : undefined,
      courseLevel: isTertiary ? courseLevel : undefined,
      semester: isTertiary ? semester : undefined,
      room,
      capacity: parseInt(capacity),
      term: !isTertiary ? term : undefined,
      academicYear,
      status: "Active",
    };

    console.log("Creating class:", classData);

    // TODO: Send to API
    router.push("/classes");
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 midnight:bg-gray-950 purple:bg-gray-950">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 border-b border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/classes"
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white midnight:text-cyan-100 purple:text-pink-100">
                  Add New Class
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Create a new class or course for {settings.tenantName}
                </p>
              </div>
            </div>
            {generatedClassCode && (
              <div className="bg-blue-50 dark:bg-blue-900/20 midnight:bg-cyan-500/10 purple:bg-pink-500/10 px-4 py-2 rounded-lg">
                <p className="text-xs text-gray-500 dark:text-gray-400">Class Code</p>
                <p className="text-lg font-bold text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400">
                  {generatedClassCode}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 midnight:bg-cyan-500/20 purple:bg-pink-500/20 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Basic Information
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Education Level */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Education Level <span className="text-red-500">*</span>
                </label>
                <select
                  value={educationLevel}
                  onChange={(e) => {
                    setEducationLevel(e.target.value as EducationLevel);
                    setLevel("");
                    setAcademicTrack("");
                    setFaculty("");
                    setDepartment("");
                    setProgramme("");
                  }}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  required
                >
                  <option value="">Select level</option>
                  {settings.supportedLevels.map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
              </div>

              {/* Class Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Class Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={className}
                  onChange={(e) => setClassName(e.target.value)}
                  placeholder={isTertiary ? "e.g., Computer Science 201" : "e.g., SSS 1A"}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>

              {/* Level/Year */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {isTertiary ? "Course Level" : "Level"} <span className="text-red-500">*</span>
                </label>
                <select
                  value={isTertiary ? courseLevel : level}
                  onChange={(e) => isTertiary ? setCourseLevel(e.target.value) : setLevel(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  required
                  disabled={!educationLevel || (isTertiary && !programme)}
                >
                  <option value="">Select level</option>
                  {levelOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              {/* Section */}
              {!isTertiary && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Section <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={section}
                    onChange={(e) => setSection(e.target.value.toUpperCase())}
                    placeholder="A, B, C..."
                    maxLength={1}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>
              )}

              {/* Stream (for Primary/Junior Secondary) */}
              {(isPrimary || isJuniorSecondary) && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Stream (Optional)
                  </label>
                  <input
                    type="text"
                    value={stream}
                    onChange={(e) => setStream(e.target.value)}
                    placeholder="e.g., Gold, Diamond"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Secondary-Specific Fields */}
          {isSecondary && (
            <div className="bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Academic Track
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Track <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={academicTrack}
                    onChange={(e) => setAcademicTrack(e.target.value as AcademicTrack)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    required
                  >
                    <option value="">Select track</option>
                    <option value="Science">Science</option>
                    <option value="Arts">Arts</option>
                    <option value="Commercial">Commercial</option>
                    <option value="Technical">Technical</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Stream (Optional)
                  </label>
                  <input
                    type="text"
                    value={stream}
                    onChange={(e) => setStream(e.target.value)}
                    placeholder="e.g., Science A, Science B"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Tertiary-Specific Fields */}
          {isTertiary && (
            <div className="bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Faculty & Programme Details
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Faculty */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Faculty <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={faculty}
                    onChange={(e) => setFaculty(e.target.value)}
                    placeholder="e.g., Engineering, Sciences"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>

                {/* Department */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Department <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    placeholder="e.g., Computer Science"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>

                {/* Programme */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Programme <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={programme}
                    onChange={(e) => {
                      setProgramme(e.target.value as TertiaryProgramme);
                      setCourseLevel("");
                    }}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    required
                  >
                    <option value="">Select programme</option>
                    <option value="B.Sc">B.Sc (Bachelor of Science)</option>
                    <option value="B.Eng">B.Eng (Bachelor of Engineering)</option>
                    <option value="B.A">B.A (Bachelor of Arts)</option>
                    <option value="ND">ND (National Diploma)</option>
                    <option value="HND">HND (Higher National Diploma)</option>
                    <option value="NCE">NCE (Nigeria Certificate in Education)</option>
                    <option value="MBBS">MBBS (Bachelor of Medicine)</option>
                  </select>
                </div>

                {/* Semester */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Semester <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={semester}
                    onChange={(e) => setSemester(e.target.value as Semester)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    required
                  >
                    <option value="First Semester">First Semester</option>
                    <option value="Second Semester">Second Semester</option>
                    {(programme === "ND" || programme === "HND") && (
                      <option value="SIWES">SIWES (Industrial Training)</option>
                    )}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Logistics Information */}
          <div className="bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                <MapPin className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Logistics & Capacity
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Room */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {isTertiary ? "Hall/Lab" : "Room"} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={room}
                  onChange={(e) => setRoom(e.target.value)}
                  placeholder={isTertiary ? "e.g., LT 101, Lab 3" : "e.g., Room 101"}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>

              {/* Capacity */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {isTertiary ? "Expected Enrollment" : "Capacity"} <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={capacity}
                  onChange={(e) => setCapacity(e.target.value)}
                  placeholder="e.g., 50"
                  min="1"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>
            </div>
          </div>

          {/* Academic Calendar */}
          <div className="bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-cyan-100 dark:bg-cyan-900/30 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Academic Calendar
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Term (for non-tertiary) */}
              {!isTertiary && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Term <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={term}
                    onChange={(e) => setTerm(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    required
                  >
                    <option value="First Term">First Term</option>
                    <option value="Second Term">Second Term</option>
                    <option value="Third Term">Third Term</option>
                  </select>
                </div>
              )}

              {/* Academic Year */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Academic Year <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={academicYear}
                  onChange={(e) => setAcademicYear(e.target.value)}
                  placeholder="e.g., 2024/2025"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex items-center justify-end gap-4">
            <Link
              href="/classes"
              className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4" />
              {isSubmitting ? "Creating..." : "Create Class"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
