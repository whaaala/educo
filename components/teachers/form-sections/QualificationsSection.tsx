"use client";

import { useState } from "react";
import {
  GraduationCap,
  ChevronUp,
  Award,
  BookOpen,
  Upload,
  FileText,
  Calendar,
} from "lucide-react";
import FormInput from "@/components/shared/FormInput";
import FormDropdown from "@/components/shared/FormDropdown";
import FileUpload from "@/components/shared/FileUpload";
import TagInput from "@/components/shared/TagInput";
import { ValidationErrors } from "@/lib/validation";

interface QualificationsSectionProps {
  formData: any;
  onChange: (field: string, value: any) => void;
  errors?: ValidationErrors;
}

export default function QualificationsSection({
  formData,
  onChange,
  errors = {},
}: QualificationsSectionProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const qualificationLevels = [
    { value: "High School Diploma", label: "High School Diploma" },
    { value: "Associate Degree", label: "Associate Degree" },
    { value: "Bachelor's Degree", label: "Bachelor's Degree" },
    { value: "B.Ed", label: "B.Ed (Bachelor of Education)" },
    { value: "B.Sc", label: "B.Sc (Bachelor of Science)" },
    { value: "B.A", label: "B.A (Bachelor of Arts)" },
    { value: "Master's Degree", label: "Master's Degree" },
    { value: "M.Ed", label: "M.Ed (Master of Education)" },
    { value: "M.Sc", label: "M.Sc (Master of Science)" },
    { value: "M.A", label: "M.A (Master of Arts)" },
    { value: "Doctorate", label: "Doctorate" },
    { value: "Ph.D", label: "Ph.D (Doctor of Philosophy)" },
    { value: "Ed.D", label: "Ed.D (Doctor of Education)" },
    { value: "Professional Certificate", label: "Professional Certificate" },
    { value: "Other", label: "Other" },
  ];

  const certificationOptions = [
    "TRCN (Teachers Registration Council of Nigeria)",
    "PGDE (Post Graduate Diploma in Education)",
    "NCE (National Certificate in Education)",
    "Teaching License",
    "TESOL/TEFL",
    "Special Education Certification",
    "Educational Leadership",
    "Curriculum Development",
    "Assessment & Evaluation",
    "ICT in Education",
    "Classroom Management",
    "Early Childhood Education",
    "Subject-Specific Certification",
  ];

  return (
    <section className="bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 shadow-sm hover:shadow-md transition-shadow duration-200">
      {/* Collapsible Header */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full bg-purple-50/50 dark:bg-purple-900/10 midnight:bg-purple-900/10 purple:bg-purple-900/10 hover:bg-purple-50 dark:hover:bg-purple-900/20 midnight:hover:bg-purple-900/20 purple:hover:bg-purple-900/20 px-6 py-3 flex items-center justify-between transition-all duration-200 border-b border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 midnight:bg-purple-900/30 purple:bg-purple-900/30 flex items-center justify-center">
            <GraduationCap className="w-4 h-4 text-purple-600 dark:text-purple-400 midnight:text-purple-400 purple:text-purple-400" />
          </div>
          <div className="text-left">
            <h2 className="text-base font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
              Qualifications & Professional Development
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70">
              Academic qualifications, certifications, and professional credentials
            </p>
          </div>
        </div>
        <div className="text-gray-500 dark:text-gray-400 midnight:text-cyan-400 purple:text-pink-400 cursor-pointer">
          <ChevronUp
            className={`w-4 h-4 transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${
              isExpanded ? "rotate-0" : "rotate-180"
            }`}
          />
        </div>
      </button>

      {/* Collapsible Content */}
      <div
        className={`grid transition-[grid-template-rows,opacity] duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${
          isExpanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="p-4 sm:p-6 space-y-6 sm:space-y-8 lg:space-y-10">
            {/* Academic Qualifications Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-purple-100 dark:bg-purple-900/20 midnight:bg-purple-900/20 purple:bg-purple-900/20 flex items-center justify-center flex-shrink-0">
                  <GraduationCap className="w-4 h-4 text-purple-600 dark:text-purple-400 midnight:text-purple-400 purple:text-purple-400" />
                </div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
                  Academic Qualifications
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-5 lg:gap-y-7 pl-2">
                <FormDropdown
                  label="Highest Qualification"
                  icon={<GraduationCap className="w-full h-full" />}
                  iconBgColor="bg-purple-100 dark:bg-purple-900/30 midnight:bg-purple-900/30 purple:bg-purple-900/30"
                  iconColor="text-purple-600 dark:text-purple-400 midnight:text-purple-400 purple:text-purple-400"
                  value={formData.highestQualification || ""}
                  onChange={(value) => onChange("highestQualification", value)}
                  options={qualificationLevels}
                  placeholder="Select highest qualification"
                  required
                  error={errors.highestQualification}
                />
                <FormInput
                  label="Discipline/Specialization"
                  icon={<BookOpen className="w-full h-full" />}
                  iconBgColor="bg-purple-100 dark:bg-purple-900/30 midnight:bg-purple-900/30 purple:bg-purple-900/30"
                  iconColor="text-purple-600 dark:text-purple-400 midnight:text-purple-400 purple:text-purple-400"
                  value={formData.specialization || ""}
                  onChange={(value) => onChange("specialization", value)}
                  placeholder="e.g., Mathematics Education, Physics"
                  type="text"
                  required
                  error={errors.specialization}
                />
                <FormInput
                  label="Institution"
                  icon={<BookOpen className="w-full h-full" />}
                  iconBgColor="bg-purple-100 dark:bg-purple-900/30 midnight:bg-purple-900/30 purple:bg-purple-900/30"
                  iconColor="text-purple-600 dark:text-purple-400 midnight:text-purple-400 purple:text-purple-400"
                  value={formData.institution || ""}
                  onChange={(value) => onChange("institution", value)}
                  placeholder="Enter institution name"
                  type="text"
                />
                <FormInput
                  label="Year of Graduation"
                  icon={<Calendar className="w-full h-full" />}
                  iconBgColor="bg-purple-100 dark:bg-purple-900/30 midnight:bg-purple-900/30 purple:bg-purple-900/30"
                  iconColor="text-purple-600 dark:text-purple-400 midnight:text-purple-400 purple:text-purple-400"
                  value={formData.graduationYear || ""}
                  onChange={(value) => onChange("graduationYear", value)}
                  placeholder="YYYY"
                  type="number"
                />
              </div>
            </div>

            {/* Professional Certifications Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-purple-100 dark:bg-purple-900/20 midnight:bg-purple-900/20 purple:bg-purple-900/20 flex items-center justify-center flex-shrink-0">
                  <Award className="w-4 h-4 text-purple-600 dark:text-purple-400 midnight:text-purple-400 purple:text-purple-400" />
                </div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
                  Professional Certifications
                </h3>
              </div>
              <div className="pl-2">
                <TagInput
                  label="Certifications"
                  value={formData.certifications || []}
                  onChange={(tags) => onChange("certifications", tags)}
                  placeholder="Type and press Enter to add certifications"
                  suggestions={certificationOptions}
                />
                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70">
                  Start typing to see suggestions, or enter custom certifications
                </p>
              </div>
            </div>

            {/* Teaching Experience Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-purple-100 dark:bg-purple-900/20 midnight:bg-purple-900/20 purple:bg-purple-900/20 flex items-center justify-center flex-shrink-0">
                  <BookOpen className="w-4 h-4 text-purple-600 dark:text-purple-400 midnight:text-purple-400 purple:text-purple-400" />
                </div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
                  Teaching Experience
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-5 lg:gap-y-7 pl-2">
                <FormInput
                  label="Years of Teaching Experience"
                  icon={<Award className="w-full h-full" />}
                  iconBgColor="bg-purple-100 dark:bg-purple-900/30 midnight:bg-purple-900/30 purple:bg-purple-900/30"
                  iconColor="text-purple-600 dark:text-purple-400 midnight:text-purple-400 purple:text-purple-400"
                  value={formData.yearsOfExperience || ""}
                  onChange={(value) => onChange("yearsOfExperience", value)}
                  placeholder="Enter years"
                  type="number"
                />
              </div>
            </div>

            {/* Document Upload Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-purple-100 dark:bg-purple-900/20 midnight:bg-purple-900/20 purple:bg-purple-900/20 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-4 h-4 text-purple-600 dark:text-purple-400 midnight:text-purple-400 purple:text-purple-400" />
                </div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
                  Supporting Documents
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pl-2">
                <FileUpload
                  label="Resume/CV"
                  value={formData.cvDocument}
                  onChange={(file) => onChange("cvDocument", file)}
                  helpText="Upload PDF, DOC, or DOCX (Max 5MB)"
                  accept=".pdf,.doc,.docx"
                  error={errors.cvDocument}
                />
                <FileUpload
                  label="Degree Certificate"
                  value={formData.degreeCertificate}
                  onChange={(file) => onChange("degreeCertificate", file)}
                  helpText="Upload PDF or image (Max 5MB)"
                  accept=".pdf,.jpg,.jpeg,.png"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
