"use client";

import { useState } from "react";
import {
  Briefcase,
  Calendar,
  BadgeCheck,
  DollarSign,
  ChevronUp,
  Building2,
  GraduationCap,
  Users,
  Hash,
  FileText,
} from "lucide-react";
import FormInput from "@/components/shared/FormInput";
import FormDropdown from "@/components/shared/FormDropdown";
import type { FormSectionProps } from "@/components/shared/form-section-types";
import type { TeacherFormData } from "./types";

type EmploymentInformationSectionProps = FormSectionProps<TeacherFormData>;

export default function EmploymentInformationSection({
  formData,
  onChange,
  errors = {},
}: EmploymentInformationSectionProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [isCustomRole, setIsCustomRole] = useState(false);
  const [customCategoryValue, setCustomCategoryValue] = useState("");
  const [customRoleValue, setCustomRoleValue] = useState("");

  const jobCategories = [
    { value: "Academic Staff", label: "Academic Staff (Teaching & Instructional)" },
    { value: "Non-Academic Staff", label: "Non-Academic Staff (Administrative & Support)" },
    { value: "Finance & Accounting", label: "Finance & Accounting Staff" },
    { value: "Technical & ICT", label: "Technical & ICT Staff" },
    { value: "Security & Health", label: "Security, Safety & Health Staff" },
    { value: "Operations & Facility", label: "Operations & Facility Management" },
    { value: "Boarding & Hostel", label: "Boarding & Hostel Staff" },
    { value: "Transportation", label: "Transportation Staff" },
    { value: "Sports & Extracurricular", label: "Sports & Extracurricular Staff" },
    { value: "Management & Governance", label: "Management & Governance Staff" },
    { value: "Auxiliary & Contract", label: "Auxiliary & Contract Staff" },
    { value: "Special Program", label: "Special Program & External Staff" },
    { value: "__custom__", label: "+ Add Custom Category" },
  ];

  const roles = [
    // Academic Staff - Primary & Secondary
    { value: "Class Teacher", label: "Class Teacher", category: "Academic Staff" },
    { value: "Subject Teacher", label: "Subject Teacher", category: "Academic Staff" },
    { value: "Assistant Teacher", label: "Assistant Teacher / Teaching Assistant", category: "Academic Staff" },
    { value: "Head Teacher", label: "Head Teacher / Lead Teacher", category: "Academic Staff" },
    { value: "Special Education Teacher", label: "Special Education Teacher", category: "Academic Staff" },
    { value: "Guidance & Counsellor", label: "Guidance & Counsellor", category: "Academic Staff" },
    { value: "Examination Officer", label: "Examination Officer", category: "Academic Staff" },
    { value: "Librarian", label: "Librarian / School Media Specialist", category: "Academic Staff" },
    { value: "Sports Teacher", label: "Sports Teacher / Coach", category: "Academic Staff" },
    { value: "ICT Teacher", label: "ICT Teacher", category: "Academic Staff" },
    { value: "Language Teacher", label: "Language Teacher", category: "Academic Staff" },
    { value: "Arts & Music Teacher", label: "Arts & Music Teacher", category: "Academic Staff" },

    // Academic Staff - Higher Education
    { value: "Lecturer I", label: "Lecturer I / II / III", category: "Academic Staff" },
    { value: "Senior Lecturer", label: "Senior Lecturer", category: "Academic Staff" },
    { value: "Associate Professor", label: "Associate Professor", category: "Academic Staff" },
    { value: "Professor", label: "Professor", category: "Academic Staff" },
    { value: "Graduate Assistant", label: "Graduate Assistant", category: "Academic Staff" },
    { value: "Teaching Fellow", label: "Teaching Fellow", category: "Academic Staff" },
    { value: "Programme Coordinator", label: "Department/Programme Coordinator", category: "Academic Staff" },
    { value: "Dean of Faculty", label: "Dean of Faculty", category: "Academic Staff" },
    { value: "Head of Department", label: "Head of Department (HOD)", category: "Academic Staff" },
    { value: "Clinical Instructor", label: "Clinical Instructor", category: "Academic Staff" },
    { value: "Laboratory Instructor", label: "Laboratory Instructor", category: "Academic Staff" },

    // Non-Academic Staff
    { value: "School Administrator", label: "School Administrator", category: "Non-Academic Staff" },
    { value: "Vice Principal", label: "Vice Principal / Deputy Head Teacher", category: "Non-Academic Staff" },
    { value: "Principal", label: "Principal / Head of School", category: "Non-Academic Staff" },
    { value: "Bursar", label: "Bursar / Treasurer", category: "Non-Academic Staff" },
    { value: "Receptionist", label: "Receptionist / Front Desk Officer", category: "Non-Academic Staff" },
    { value: "Secretary", label: "Secretary / Administrative Assistant", category: "Non-Academic Staff" },
    { value: "HR Manager", label: "HR Manager", category: "Non-Academic Staff" },
    { value: "HR Assistant", label: "HR Assistant Officer", category: "Non-Academic Staff" },
    { value: "Records Officer", label: "Records Officer", category: "Non-Academic Staff" },
    { value: "Admissions Officer", label: "Admissions Officer", category: "Non-Academic Staff" },
    { value: "Registrar", label: "Registrar", category: "Non-Academic Staff" },
    { value: "Exams & Records Officer", label: "Exams & Records Officer", category: "Non-Academic Staff" },
    { value: "Student Affairs Officer", label: "Student Affairs Officer", category: "Non-Academic Staff" },
    { value: "Faculty Officer", label: "Faculty/Department Officer", category: "Non-Academic Staff" },
    { value: "Data Entry Clerk", label: "Data Entry/Records Clerk", category: "Non-Academic Staff" },
    { value: "Compliance Officer", label: "Compliance & Quality Assurance Officer", category: "Non-Academic Staff" },

    // Finance & Accounting
    { value: "Accountant", label: "Accountant", category: "Finance & Accounting" },
    { value: "Bursary Staff", label: "Bursary Staff", category: "Finance & Accounting" },
    { value: "Payroll Officer", label: "Payroll Officer", category: "Finance & Accounting" },
    { value: "Cashier", label: "Cashier", category: "Finance & Accounting" },
    { value: "Fees & Billing Officer", label: "Fees & Billing Officer", category: "Finance & Accounting" },
    { value: "Procurement Officer", label: "Procurement Officer", category: "Finance & Accounting" },
    { value: "Inventory Manager", label: "Inventory Manager", category: "Finance & Accounting" },

    // Technical & ICT
    { value: "IT Support", label: "IT Support", category: "Technical & ICT" },
    { value: "System Administrator", label: "System Administrator", category: "Technical & ICT" },
    { value: "Network Engineer", label: "Network Engineer", category: "Technical & ICT" },
    { value: "ICT Lab Manager", label: "ICT Laboratory Manager", category: "Technical & ICT" },
    { value: "LMS Manager", label: "LMS Manager", category: "Technical & ICT" },
    { value: "Media Technician", label: "Media/Studio Technician", category: "Technical & ICT" },
    { value: "Virtual Classroom Support", label: "Virtual Classroom Support", category: "Technical & ICT" },
    { value: "Website Manager", label: "Website/CMS Manager", category: "Technical & ICT" },
    { value: "Software Developer", label: "Software Developer", category: "Technical & ICT" },

    // Security & Health
    { value: "School Nurse", label: "School Nurse / Clinic Officer", category: "Security & Health" },
    { value: "Health Centre Staff", label: "Health Centre Staff", category: "Security & Health" },
    { value: "Security Officer", label: "Security Officers", category: "Security & Health" },
    { value: "Safety Officer", label: "Safety Officer", category: "Security & Health" },
    { value: "Fire & Emergency Officer", label: "Fire & Emergency Response Officer", category: "Security & Health" },
    { value: "Child Protection Officer", label: "Child Protection Officer", category: "Security & Health" },

    // Operations & Facility
    { value: "Facility Manager", label: "Facility Manager", category: "Operations & Facility" },
    { value: "Maintenance Staff", label: "Building Maintenance Staff", category: "Operations & Facility" },
    { value: "Electrician", label: "Electrician", category: "Operations & Facility" },
    { value: "Plumber", label: "Plumber", category: "Operations & Facility" },
    { value: "Carpenter", label: "Carpenter", category: "Operations & Facility" },
    { value: "Cleaner", label: "Cleaner / Sanitation Worker", category: "Operations & Facility" },
    { value: "Gardener", label: "Gardener / Landscaping", category: "Operations & Facility" },
    { value: "Janitorial Staff", label: "Janitorial Staff", category: "Operations & Facility" },

    // Boarding & Hostel
    { value: "Hostel Matron", label: "Hostel Matron", category: "Boarding & Hostel" },
    { value: "Hostel Master", label: "Hostel Master", category: "Boarding & Hostel" },
    { value: "House Parent", label: "House Parent", category: "Boarding & Hostel" },
    { value: "Laundry Staff", label: "Laundry Staff", category: "Boarding & Hostel" },
    { value: "Boarding Supervisor", label: "Boarding Supervisor", category: "Boarding & Hostel" },
    { value: "Cook", label: "Cook / Kitchen Staff", category: "Boarding & Hostel" },
    { value: "Dining Hall Supervisor", label: "Dining Hall Supervisor", category: "Boarding & Hostel" },

    // Transportation
    { value: "Bus Driver", label: "Bus Driver", category: "Transportation" },
    { value: "Bus Conductor", label: "Assistant Bus Conductor", category: "Transportation" },
    { value: "Transport Manager", label: "Transport Manager", category: "Transportation" },
    { value: "Vehicle Maintenance Officer", label: "Vehicle Maintenance Officer", category: "Transportation" },
    { value: "Dispatcher", label: "Dispatcher", category: "Transportation" },

    // Sports & Extracurricular
    { value: "School Coach", label: "School Coach", category: "Sports & Extracurricular" },
    { value: "PE Instructor", label: "Physical Education Instructor", category: "Sports & Extracurricular" },
    { value: "Events Coordinator", label: "Events & Club Coordinator", category: "Sports & Extracurricular" },
    { value: "Cultural Activities Supervisor", label: "Cultural Activities Supervisor", category: "Sports & Extracurricular" },
    { value: "Music Director", label: "Music Director", category: "Sports & Extracurricular" },
    { value: "Drama Coordinator", label: "Drama/Arts Coordinator", category: "Sports & Extracurricular" },

    // Management & Governance
    { value: "Executive Director", label: "Executive Director", category: "Management & Governance" },
    { value: "Proprietor", label: "Proprietor/Founder", category: "Management & Governance" },
    { value: "Board Member", label: "Board Members", category: "Management & Governance" },
    { value: "School Manager", label: "School Manager", category: "Management & Governance" },
    { value: "Campus Director", label: "Campus Director", category: "Management & Governance" },
    { value: "Dean", label: "Dean / Provost / Rector", category: "Management & Governance" },

    // Auxiliary & Contract
    { value: "Contract Cleaner", label: "Contract Cleaner", category: "Auxiliary & Contract" },
    { value: "Contract Security", label: "Contract Security", category: "Auxiliary & Contract" },
    { value: "Temporary Teacher", label: "Temporary Teacher", category: "Auxiliary & Contract" },
    { value: "NYSC Member", label: "NYSC Members", category: "Auxiliary & Contract" },
    { value: "IT Intern", label: "Industrial Training (IT) Interns", category: "Auxiliary & Contract" },
    { value: "Volunteer", label: "Volunteers", category: "Auxiliary & Contract" },
    { value: "Visiting Lecturer", label: "Visiting Lecturers", category: "Auxiliary & Contract" },
    { value: "Part-time Tutor", label: "Part-time Tutors", category: "Auxiliary & Contract" },
    { value: "Exam Invigilator", label: "Exam Invigilators", category: "Auxiliary & Contract" },

    // Special Program
    { value: "NGO Program Officer", label: "NGO Program Officers", category: "Special Program" },
    { value: "School Psychologist", label: "School Psychologist", category: "Special Program" },
    { value: "Therapist", label: "Therapist (Speech/Occupational)", category: "Special Program" },
    { value: "Counselling Volunteer", label: "Counselling Volunteers", category: "Special Program" },
    { value: "Community Engagement Coordinator", label: "Community Engagement Coordinator", category: "Special Program" },
  ];

  // Filter roles based on selected job category
  const filteredRoles = formData.jobCategory && formData.jobCategory !== "__custom__"
    ? [...roles.filter((role) => role.category === formData.jobCategory), { value: "__custom__", label: "+ Add Custom Position" }]
    : formData.jobCategory === "__custom__"
    ? [{ value: "__custom__", label: "+ Add Custom Position" }]
    : [...roles, { value: "__custom__", label: "+ Add Custom Position" }];

  const employmentTypes = [
    { value: "Full-Time", label: "Full-Time" },
    { value: "Part-Time", label: "Part-Time" },
    { value: "Contract", label: "Contract" },
    { value: "Temporary", label: "Temporary" },
    { value: "Probation", label: "Probation" },
  ];

  const employmentStatuses = [
    { value: "Active", label: "Active" },
    { value: "On Leave", label: "On Leave" },
    { value: "Suspended", label: "Suspended" },
    { value: "Terminated", label: "Terminated" },
    { value: "Resigned", label: "Resigned" },
  ];

  const departments = [
    // Academic Departments
    { value: "Mathematics", label: "Mathematics" },
    { value: "Sciences", label: "Sciences" },
    { value: "Physics", label: "Physics" },
    { value: "Chemistry", label: "Chemistry" },
    { value: "Biology", label: "Biology" },
    { value: "Languages", label: "Languages" },
    { value: "English", label: "English" },
    { value: "Social Sciences", label: "Social Sciences" },
    { value: "Creative Arts", label: "Creative Arts" },
    { value: "Technology", label: "Technology" },
    { value: "Computer Science", label: "Computer Science" },
    { value: "ICT", label: "ICT" },

    // Higher Education Departments
    { value: "Engineering", label: "Engineering" },
    { value: "Civil Engineering", label: "Civil Engineering" },
    { value: "Mechanical Engineering", label: "Mechanical Engineering" },
    { value: "Electrical Engineering", label: "Electrical Engineering" },
    { value: "Medicine", label: "Medicine" },
    { value: "Nursing", label: "Nursing" },
    { value: "Pharmacy", label: "Pharmacy" },
    { value: "Law", label: "Law" },
    { value: "Business Administration", label: "Business Administration" },
    { value: "Economics", label: "Economics" },
    { value: "Accounting", label: "Accounting" },

    // Administrative Departments
    { value: "Administration", label: "Administration" },
    { value: "Human Resources", label: "Human Resources" },
    { value: "Finance", label: "Finance & Accounting" },
    { value: "Bursary", label: "Bursary" },
    { value: "Registry", label: "Registry" },
    { value: "Student Affairs", label: "Student Affairs" },
    { value: "Admissions", label: "Admissions" },

    // Support Departments
    { value: "ICT Services", label: "ICT Services" },
    { value: "Library", label: "Library" },
    { value: "Health Services", label: "Health Services" },
    { value: "Security", label: "Security" },
    { value: "Facility Management", label: "Facility Management" },
    { value: "Transport", label: "Transport" },
    { value: "Hostel Management", label: "Hostel Management" },
    { value: "Sports & Recreation", label: "Sports & Recreation" },

    { value: "Other", label: "Other" },
  ];

  // This would typically come from a staff API
  const reportingManagers = [
    { value: "", label: "Select Manager" },
    { value: "manager1", label: "John Doe - Principal" },
    { value: "manager2", label: "Jane Smith - Vice Principal" },
    { value: "manager3", label: "Robert Johnson - HOD Mathematics" },
  ];

  return (
    <section className="bg-surface rounded-xl border border-line shadow-sm hover:shadow-md transition-shadow duration-200">
      {/* Collapsible Header */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full bg-green-50/50 dark:bg-green-900/10 midnight:bg-emerald-900/10 purple:bg-emerald-900/10 hover:bg-green-50 dark:hover:bg-green-900/20 midnight:hover:bg-emerald-900/20 purple:hover:bg-emerald-900/20 px-6 py-3 flex items-center justify-between transition-all duration-200 border-b border-line"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/30 midnight:bg-emerald-900/30 purple:bg-emerald-900/30 flex items-center justify-center">
            <Briefcase className="w-4 h-4 text-green-600 dark:text-green-400 midnight:text-emerald-400 purple:text-emerald-400" />
          </div>
          <div className="text-left">
            <h2 className="text-base font-semibold text-ink">
              Employment Information
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70">
              Job role, department, and employment details
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
        <div className={isExpanded ? "overflow-visible" : "overflow-hidden"}>
          <div className="p-4 sm:p-6 space-y-6 sm:space-y-8 lg:space-y-10">
            {/* Job Role & Department Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-green-100 dark:bg-green-900/20 midnight:bg-emerald-900/20 purple:bg-emerald-900/20 flex items-center justify-center flex-shrink-0">
                  <BadgeCheck className="w-4 h-4 text-green-600 dark:text-green-400 midnight:text-emerald-400 purple:text-emerald-400" />
                </div>
                <h3 className="text-sm font-semibold text-ink">
                  Job Role & Department
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-x-4 gap-y-5 lg:gap-y-7 pl-2">
                {!isCustomCategory ? (
                  <FormDropdown
                    label="Job Category"
                    icon={<Briefcase className="w-full h-full" />}
                    iconBgColor="bg-green-100 dark:bg-green-900/30 midnight:bg-emerald-900/30 purple:bg-emerald-900/30"
                    iconColor="text-green-600 dark:text-green-400 midnight:text-emerald-400 purple:text-emerald-400"
                    value={formData.jobCategory || ""}
                    onChange={(value) => {
                      if (value === "__custom__") {
                        setIsCustomCategory(true);
                        setCustomCategoryValue("");
                        onChange("jobCategory", "");
                      } else {
                        onChange("jobCategory", value);
                      }
                      // Clear role when category changes
                      onChange("role", "");
                      setIsCustomRole(false);
                    }}
                    options={jobCategories}
                    placeholder="Select category"
                    required
                    error={errors.jobCategory}
                  />
                ) : (
                  <FormInput
                    label="Custom Job Category"
                    icon={<Briefcase className="w-full h-full" />}
                    iconBgColor="bg-green-100 dark:bg-green-900/30 midnight:bg-emerald-900/30 purple:bg-emerald-900/30"
                    iconColor="text-green-600 dark:text-green-400 midnight:text-emerald-400 purple:text-emerald-400"
                    value={customCategoryValue}
                    onChange={(value) => {
                      setCustomCategoryValue(value);
                      onChange("jobCategory", value);
                    }}
                    placeholder="Enter custom category"
                    type="text"
                    required
                    error={errors.jobCategory}
                    helpText={
                      <button
                        type="button"
                        onClick={() => {
                          setIsCustomCategory(false);
                          onChange("jobCategory", "");
                          setCustomCategoryValue("");
                        }}
                        className="text-xs text-blue-600 dark:text-blue-400 hover:underline mt-1"
                      >
                        ← Back to predefined categories
                      </button>
                    }
                  />
                )}
                {!isCustomRole ? (
                  <FormDropdown
                    label="Position/Designation"
                    icon={<Briefcase className="w-full h-full" />}
                    iconBgColor="bg-green-100 dark:bg-green-900/30 midnight:bg-emerald-900/30 purple:bg-emerald-900/30"
                    iconColor="text-green-600 dark:text-green-400 midnight:text-emerald-400 purple:text-emerald-400"
                    value={formData.role || ""}
                    onChange={(value) => {
                      if (value === "__custom__") {
                        setIsCustomRole(true);
                        setCustomRoleValue("");
                        onChange("role", "");
                      } else {
                        onChange("role", value);
                      }
                    }}
                    options={filteredRoles}
                    placeholder={formData.jobCategory ? "Select position" : "Select job category first"}
                    required
                    disabled={!formData.jobCategory}
                    error={errors.role}
                  />
                ) : (
                  <FormInput
                    label="Custom Position/Designation"
                    icon={<Briefcase className="w-full h-full" />}
                    iconBgColor="bg-green-100 dark:bg-green-900/30 midnight:bg-emerald-900/30 purple:bg-emerald-900/30"
                    iconColor="text-green-600 dark:text-green-400 midnight:text-emerald-400 purple:text-emerald-400"
                    value={customRoleValue}
                    onChange={(value) => {
                      setCustomRoleValue(value);
                      onChange("role", value);
                    }}
                    placeholder="Enter custom position"
                    type="text"
                    required
                    error={errors.role}
                    helpText={
                      <button
                        type="button"
                        onClick={() => {
                          setIsCustomRole(false);
                          onChange("role", "");
                          setCustomRoleValue("");
                        }}
                        className="text-xs text-blue-600 dark:text-blue-400 hover:underline mt-1"
                      >
                        ← Back to predefined positions
                      </button>
                    }
                  />
                )}
                <FormDropdown
                  label="Department"
                  icon={<Building2 className="w-full h-full" />}
                  iconBgColor="bg-green-100 dark:bg-green-900/30 midnight:bg-emerald-900/30 purple:bg-emerald-900/30"
                  iconColor="text-green-600 dark:text-green-400 midnight:text-emerald-400 purple:text-emerald-400"
                  value={formData.department || ""}
                  onChange={(value) => onChange("department", value)}
                  options={departments}
                  placeholder="Select department"
                  required
                  error={errors.department}
                />
                <FormInput
                  label="Campus/Branch"
                  icon={<Building2 className="w-full h-full" />}
                  iconBgColor="bg-green-100 dark:bg-green-900/30 midnight:bg-emerald-900/30 purple:bg-emerald-900/30"
                  iconColor="text-green-600 dark:text-green-400 midnight:text-emerald-400 purple:text-emerald-400"
                  value={formData.branch || ""}
                  onChange={(value) => onChange("branch", value)}
                  placeholder="Enter campus/branch"
                  type="text"
                />
                <FormDropdown
                  label="Reporting Manager"
                  icon={<Users className="w-full h-full" />}
                  iconBgColor="bg-green-100 dark:bg-green-900/30 midnight:bg-emerald-900/30 purple:bg-emerald-900/30"
                  iconColor="text-green-600 dark:text-green-400 midnight:text-emerald-400 purple:text-emerald-400"
                  value={formData.reportingManager || ""}
                  onChange={(value) => onChange("reportingManager", value)}
                  options={reportingManagers}
                  placeholder="Select reporting manager"
                />
              </div>
            </div>

            {/* Employment Details Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-green-100 dark:bg-green-900/20 midnight:bg-emerald-900/20 purple:bg-emerald-900/20 flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-4 h-4 text-green-600 dark:text-green-400 midnight:text-emerald-400 purple:text-emerald-400" />
                </div>
                <h3 className="text-sm font-semibold text-ink">
                  Employment Details
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-x-4 gap-y-5 lg:gap-y-7 pl-2">
                <FormDropdown
                  label="Employment Type"
                  icon={<Briefcase className="w-full h-full" />}
                  iconBgColor="bg-green-100 dark:bg-green-900/30 midnight:bg-emerald-900/30 purple:bg-emerald-900/30"
                  iconColor="text-green-600 dark:text-green-400 midnight:text-emerald-400 purple:text-emerald-400"
                  value={formData.employmentType || ""}
                  onChange={(value) => onChange("employmentType", value)}
                  options={employmentTypes}
                  placeholder="Select employment type"
                  required
                  error={errors.employmentType}
                />
                <FormDropdown
                  label="Employment Status"
                  icon={<BadgeCheck className="w-full h-full" />}
                  iconBgColor="bg-green-100 dark:bg-green-900/30 midnight:bg-emerald-900/30 purple:bg-emerald-900/30"
                  iconColor="text-green-600 dark:text-green-400 midnight:text-emerald-400 purple:text-emerald-400"
                  value={formData.employmentStatus || ""}
                  onChange={(value) => onChange("employmentStatus", value)}
                  options={employmentStatuses}
                  placeholder="Select status"
                  required
                  error={errors.employmentStatus}
                />
                <FormInput
                  label="Join Date"
                  icon={<Calendar className="w-full h-full" />}
                  iconBgColor="bg-green-100 dark:bg-green-900/30 midnight:bg-emerald-900/30 purple:bg-emerald-900/30"
                  iconColor="text-green-600 dark:text-green-400 midnight:text-emerald-400 purple:text-emerald-400"
                  value={formData.joinDate || ""}
                  onChange={(value) => onChange("joinDate", value)}
                  type="date"
                  placeholder="YYYY-MM-DD"
                  required
                  error={errors.joinDate}
                />
                <FormInput
                  label="Date of Confirmation"
                  icon={<Calendar className="w-full h-full" />}
                  iconBgColor="bg-green-100 dark:bg-green-900/30 midnight:bg-emerald-900/30 purple:bg-emerald-900/30"
                  iconColor="text-green-600 dark:text-green-400 midnight:text-emerald-400 purple:text-emerald-400"
                  value={formData.confirmationDate || ""}
                  onChange={(value) => onChange("confirmationDate", value)}
                  type="date"
                  placeholder="YYYY-MM-DD"
                />
                <FormInput
                  label="Years of Experience"
                  icon={<GraduationCap className="w-full h-full" />}
                  iconBgColor="bg-green-100 dark:bg-green-900/30 midnight:bg-emerald-900/30 purple:bg-emerald-900/30"
                  iconColor="text-green-600 dark:text-green-400 midnight:text-emerald-400 purple:text-emerald-400"
                  value={formData.experience || ""}
                  onChange={(value) => onChange("experience", value)}
                  placeholder="Enter years"
                  type="number"
                />
              </div>
            </div>

            {/* Previous Employment Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-green-100 dark:bg-green-900/20 midnight:bg-emerald-900/20 purple:bg-emerald-900/20 flex items-center justify-center flex-shrink-0">
                  <Building2 className="w-4 h-4 text-green-600 dark:text-green-400 midnight:text-emerald-400 purple:text-emerald-400" />
                </div>
                <h3 className="text-sm font-semibold text-ink">
                  Previous Employment
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-5 lg:gap-y-7 pl-2">
                <FormInput
                  label="Previous Employer"
                  icon={<Building2 className="w-full h-full" />}
                  iconBgColor="bg-green-100 dark:bg-green-900/30 midnight:bg-emerald-900/30 purple:bg-emerald-900/30"
                  iconColor="text-green-600 dark:text-green-400 midnight:text-emerald-400 purple:text-emerald-400"
                  value={formData.previousEmployer || ""}
                  onChange={(value) => onChange("previousEmployer", value)}
                  placeholder="Enter previous employer name"
                  type="text"
                />
              </div>
            </div>

            {/* Professional Licensing (Nigeria) Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-green-100 dark:bg-green-900/20 midnight:bg-emerald-900/20 purple:bg-emerald-900/20 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-4 h-4 text-green-600 dark:text-green-400 midnight:text-emerald-400 purple:text-emerald-400" />
                </div>
                <h3 className="text-sm font-semibold text-ink">
                  Professional Licensing (Nigeria)
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-5 lg:gap-y-7 pl-2">
                <FormInput
                  label="TRCN Number"
                  icon={<Hash className="w-full h-full" />}
                  iconBgColor="bg-green-100 dark:bg-green-900/30 midnight:bg-emerald-900/30 purple:bg-emerald-900/30"
                  iconColor="text-green-600 dark:text-green-400 midnight:text-emerald-400 purple:text-emerald-400"
                  value={formData.trcnNumber || ""}
                  onChange={(value) => onChange("trcnNumber", value)}
                  placeholder="Enter TRCN registration number"
                  type="text"
                />
                <FormInput
                  label="License Expiry Date"
                  icon={<Calendar className="w-full h-full" />}
                  iconBgColor="bg-green-100 dark:bg-green-900/30 midnight:bg-emerald-900/30 purple:bg-emerald-900/30"
                  iconColor="text-green-600 dark:text-green-400 midnight:text-emerald-400 purple:text-emerald-400"
                  value={formData.licenseExpiryDate || ""}
                  onChange={(value) => onChange("licenseExpiryDate", value)}
                  type="date"
                  placeholder="YYYY-MM-DD"
                />
              </div>
            </div>

            {/* Compensation Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-green-100 dark:bg-green-900/20 midnight:bg-emerald-900/20 purple:bg-emerald-900/20 flex items-center justify-center flex-shrink-0">
                  <DollarSign className="w-4 h-4 text-green-600 dark:text-green-400 midnight:text-emerald-400 purple:text-emerald-400" />
                </div>
                <h3 className="text-sm font-semibold text-ink">
                  Compensation
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-5 lg:gap-y-7 pl-2">
                <FormInput
                  label="Base Salary"
                  icon={<DollarSign className="w-full h-full" />}
                  iconBgColor="bg-green-100 dark:bg-green-900/30 midnight:bg-emerald-900/30 purple:bg-emerald-900/30"
                  iconColor="text-green-600 dark:text-green-400 midnight:text-emerald-400 purple:text-emerald-400"
                  value={formData.salary || ""}
                  onChange={(value) => onChange("salary", value)}
                  placeholder="Enter salary amount"
                  type="number"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
