// Mock Tenant Data (Educo v4.0 Multi-Tenant System)

import { Tenant, TenantSummary, ReportCardConfig, TranscriptConfig } from "@/types/school";

/**
 * Mock Tenants - Represents different schools using the Educo system
 * In production, this would be fetched from the database
 */
export const mockTenants: Tenant[] = [
  {
    id: "educo-default",
    name: "Educo Demo School",
    shortName: "EDUCO",
    slug: "educo-demo",
    subdomain: "demo.educo.africa",
    status: "Active",
    createdAt: "2024-01-15T00:00:00Z",
    updatedAt: "2025-01-10T00:00:00Z",

    config: {
      supportedLevels: ["Primary", "Secondary"],
      defaultEducationLevel: "Secondary",
      institutionType: "Private",
      tertiaryType: "University",
      scheduleType: "full-time",
      supportsMultipleLevels: true,
      academicYearStart: "September",
      academicYearEnd: "July",
      termSystem: "3-term",
      region: "Nigeria",
      timezone: "Africa/Lagos",
      locale: "en-NG",
      currency: "NGN",
      enabledFeatures: [
        "FF_Student_Profile",
        "FF_Student_Transfer",
        "FF_Finance_Private",
        "FF_Grading_Primary",
        "FF_Grading_Secondary",
      ],
      bankAccount: {
        bankName: "First Bank Nigeria",
        accountNumber: "1234567890",
        accountName: "Educo Demo School",
      },
      // Timetable for Educo Demo School
      timetable: {
        periods: [
          { id: "p1", label: "Period 1", startTime: "08:00", endTime: "08:45", type: "regular" },
          { id: "p2", label: "Period 2", startTime: "08:45", endTime: "09:30", type: "regular" },
          { id: "break1", label: "Short Break", startTime: "09:30", endTime: "09:45", type: "break" },
          { id: "p3", label: "Period 3", startTime: "09:45", endTime: "10:30", type: "regular" },
          { id: "p4", label: "Period 4", startTime: "10:30", endTime: "11:15", type: "regular" },
          { id: "p5", label: "Period 5", startTime: "11:15", endTime: "12:00", type: "regular" },
          { id: "lunch", label: "Lunch Break", startTime: "12:00", endTime: "13:00", type: "lunch" },
          { id: "p6", label: "Period 6", startTime: "13:00", endTime: "13:45", type: "regular" },
          { id: "p7", label: "Period 7", startTime: "13:45", endTime: "14:30", type: "regular" },
          { id: "p8", label: "Period 8", startTime: "14:30", endTime: "15:15", type: "regular" },
        ],
      },
      // Subjects offered by Educo Demo School
      subjects: [
        { id: "math", name: "Mathematics", code: "MTH", level: "Secondary", isCore: true },
        { id: "eng", name: "English Language", code: "ENG", level: "Secondary", isCore: true },
        { id: "phy", name: "Physics", code: "PHY", level: "Secondary", isCore: false },
        { id: "chem", name: "Chemistry", code: "CHM", level: "Secondary", isCore: false },
        { id: "bio", name: "Biology", code: "BIO", level: "Secondary", isCore: false },
        { id: "geo", name: "Geography", code: "GEO", level: "Secondary", isCore: false },
        { id: "hist", name: "History", code: "HIS", level: "Secondary", isCore: false },
        { id: "civic", name: "Civic Education", code: "CIV", level: "Secondary", isCore: true },
        { id: "comp", name: "Computer Science", code: "CSC", level: "Secondary", isCore: false },
        { id: "econ", name: "Economics", code: "ECO", level: "Secondary", isCore: false },
        // Tertiary courses
        { id: "csc101", name: "Introduction to Computing", code: "CSC 101", level: "Tertiary", department: "Computer Science", isCore: true },
        { id: "csc201", name: "Data Structures", code: "CSC 201", level: "Tertiary", department: "Computer Science", isCore: true },
        { id: "mth101", name: "General Mathematics", code: "MTH 101", level: "Tertiary", department: "Mathematics", isCore: true },
      ],
    },

    contact: {
      email: "admin@educo.africa",
      phone: "+234 800 EDUCO-01",
      website: "www.educo.africa",
      address: {
        line1: "123 Education Avenue",
        city: "Lagos",
        state: "Lagos",
        postalCode: "100001",
        country: "Nigeria",
      },
    },

    branding: {
      motto: "Excellence in Education",
      primaryColor: "#2563eb",
      secondaryColor: "#1e40af",
      theme: "auto",
      transcriptDesign: {
        template: "classic",
        headerStyle: "centered",
        showSchoolLogo: true,
        showSchoolMotto: true,
        showWatermark: true,
        watermarkText: "OFFICIAL",
        fontFamily: "system-ui",
        borderStyle: "solid",
        includeQRCode: true,
      },
      signatures: {
        registrarName: "Dr. Oluwaseun Adebayo",
        registrarTitle: "Registrar",
        principalName: "Prof. Chioma Okonkwo",
        principalTitle: "Principal",
        classTeacherTitle: "Class Teacher",
        showOfficialSeal: true,
      },
      // Report Card Configuration - Modern template with all features
      reportCardConfig: {
        template: "modern",
        paperSize: "A4",
        orientation: "portrait",
        header: {
          showLogo: true,
          logoPosition: "center",
          showMotto: true,
          showAddress: true,
          showContact: true,
        },
        studentInfo: {
          showPhoto: false,
          showAdmissionNumber: true,
          showClass: true,
          showSection: true,
          showGender: true,
          showDateOfBirth: false,
          showAttendanceSummary: true,
          showClassRank: true,
        },
        academicSection: {
          showMaxScore: true,
          showGradeBadge: true,
          showRemarks: true,
          showSubjectPosition: false,
          gradeDisplayFormat: "letter",
          sortSubjectsBy: "alphabetical",
          showTotalRow: true,
          showAverageRow: false,
        },
        overallSection: {
          showOverallGrade: true,
          showPercentage: true,
          showTotalMarks: true,
          showClassAverage: false,
          showGradeDescription: true,
        },
        conductSection: {
          enabled: true,
          showBehavior: true,
          showDiscipline: true,
          showParticipation: true,
          showPunctuality: false,
          showNeatness: false,
        },
        attendanceSection: {
          enabled: true,
          showDaysPresent: true,
          showDaysAbsent: true,
          showDaysLate: true,
          showAttendanceRate: true,
        },
        remarksSection: {
          showTeacherRemarks: true,
          showPrincipalRemarks: true,
          showCustomRemarks: false,
        },
        signaturesSection: {
          showClassTeacher: true,
          showPrincipal: true,
          showParentGuardian: true,
          showDateField: false,
          showOfficialSeal: false,
        },
        footer: {
          showFooter: true,
          showGeneratedDate: true,
          showSchoolName: true,
        },
        gradingScale: {
          showOnCard: false,
          position: "bottom",
          scale: [
            { grade: "A", minScore: 80, maxScore: 100, description: "Excellent", color: "#16a34a" },
            { grade: "B", minScore: 70, maxScore: 79, description: "Very Good", color: "#2563eb" },
            { grade: "C", minScore: 60, maxScore: 69, description: "Good", color: "#ca8a04" },
            { grade: "D", minScore: 50, maxScore: 59, description: "Satisfactory", color: "#ea580c" },
            { grade: "F", minScore: 0, maxScore: 49, description: "Needs Improvement", color: "#dc2626" },
          ],
        },
        options: {
          showWatermark: false,
          showQRCode: false,
          showBorder: true,
          borderStyle: "solid",
        },
      },
      // Transcript Configuration - Modern template
      transcriptConfig: {
        template: "modern",
        paperSize: "A4",
        orientation: "portrait",
        header: {
          showLogo: true,
          logoPosition: "center",
          headerStyle: "centered",
          showMotto: true,
          showAddress: true,
          showContact: true,
        },
        studentInfo: {
          showPhoto: false,
          showAdmissionNumber: true,
          showClass: true,
          showDateOfBirth: false,
          showGender: true,
          showNationality: false,
          showStateOfOrigin: false,
          showGraduationYear: true,
        },
        academicSection: {
          showTermGPA: true,
          showTermAverage: true,
          showPosition: true,
          showCreditHours: true,
          showGradePoints: true,
          showRemarks: true,
          gradeDisplayFormat: "both",
          showAttendance: true,
          showConduct: true,
        },
        summarySection: {
          showOverallGPA: true,
          showOverallAverage: true,
          showTotalCredits: true,
          showClassification: true,
          showTermsCompleted: true,
        },
        gradingScale: {
          showOnTranscript: true,
          position: "bottom",
          showSecondaryScale: true,
          showTertiaryScale: true,
          showClassification: true,
        },
        signaturesSection: {
          showRegistrar: true,
          showPrincipal: true,
          showDean: false,
          showOfficialSeal: true,
          showDate: true,
        },
        footer: {
          showFooter: true,
          showIssueDate: true,
          showPageNumbers: true,
          showVerificationCode: true,
        },
        options: {
          showWatermark: true,
          watermarkText: "OFFICIAL",
          showQRCode: true,
          qrCodeContent: "verification",
          showBorder: true,
          borderStyle: "solid",
        },
      },
    },

    subscription: {
      plan: "professional",
      status: "active",
      startDate: "2024-01-15",
      maxStudents: 1000,
      maxStaff: 100,
      features: ["all"],
    },
  },

  {
    id: "greenfield-international",
    name: "Greenfield International School",
    shortName: "GIS",
    slug: "greenfield",
    subdomain: "greenfield.educo.africa",
    status: "Active",
    createdAt: "2024-02-01T00:00:00Z",
    updatedAt: "2025-01-10T00:00:00Z",

    config: {
      supportedLevels: ["Primary", "Secondary"],
      defaultEducationLevel: "Secondary",
      institutionType: "International",
      scheduleType: "full-time",
      supportsMultipleLevels: true,
      academicYearStart: "September",
      academicYearEnd: "June",
      termSystem: "3-term",
      region: "Nigeria",
      timezone: "Africa/Lagos",
      locale: "en-NG",
      currency: "NGN",
      enabledFeatures: [
        "FF_Student_Profile",
        "FF_Student_Transfer",
        "FF_Finance_Private",
        "FF_Hostel_Management",
        "FF_Transport_GPS",
      ],
      bankAccount: {
        bankName: "Access Bank Nigeria",
        accountNumber: "0987654321",
        accountName: "Greenfield International School",
      },
      // Timetable for Greenfield International (includes primary periods)
      timetable: {
        periods: [
          { id: "p1", label: "Period 1", startTime: "08:00", endTime: "08:40", type: "regular" },
          { id: "p2", label: "Period 2", startTime: "08:40", endTime: "09:20", type: "regular" },
          { id: "break1", label: "Break", startTime: "09:20", endTime: "09:40", type: "break" },
          { id: "p3", label: "Period 3", startTime: "09:40", endTime: "10:20", type: "regular" },
          { id: "p4", label: "Period 4", startTime: "10:20", endTime: "11:00", type: "regular" },
          { id: "p5", label: "Period 5", startTime: "11:00", endTime: "11:40", type: "regular" },
          { id: "lunch", label: "Lunch", startTime: "11:40", endTime: "12:30", type: "lunch" },
          { id: "p6", label: "Period 6", startTime: "12:30", endTime: "13:10", type: "regular" },
          { id: "p7", label: "Period 7", startTime: "13:10", endTime: "13:50", type: "regular" },
        ],
      },
      // Subjects offered (Primary and Secondary)
      subjects: [
        // Primary subjects
        { id: "math-pri", name: "Mathematics", code: "MTH", level: "Primary", isCore: true },
        { id: "eng-pri", name: "English Language", code: "ENG", level: "Primary", isCore: true },
        { id: "sci-pri", name: "Basic Science", code: "SCI", level: "Primary", isCore: true },
        { id: "soc-pri", name: "Social Studies", code: "SOC", level: "Primary", isCore: true },
        { id: "french-pri", name: "French", code: "FRN", level: "Primary", isCore: false },
        // Secondary subjects
        { id: "math-sec", name: "Mathematics", code: "MTH", level: "Secondary", isCore: true },
        { id: "eng-sec", name: "English Language", code: "ENG", level: "Secondary", isCore: true },
        { id: "phy-sec", name: "Physics", code: "PHY", level: "Secondary", isCore: false },
        { id: "chem-sec", name: "Chemistry", code: "CHM", level: "Secondary", isCore: false },
        { id: "bio-sec", name: "Biology", code: "BIO", level: "Secondary", isCore: false },
        { id: "french-sec", name: "French", code: "FRN", level: "Secondary", isCore: true },
      ],
    },

    contact: {
      email: "academics@greenfield.edu.ng",
      phone: "+234 809 123 4567",
      website: "www.greenfield.edu.ng",
      address: {
        line1: "45 Victoria Island Road",
        city: "Lagos",
        state: "Lagos",
        postalCode: "101241",
        country: "Nigeria",
      },
    },

    branding: {
      motto: "Building Global Leaders",
      mission: "To provide world-class education",
      primaryColor: "#059669",
      secondaryColor: "#047857",
      theme: "light",
      transcriptDesign: {
        template: "modern",
        headerStyle: "logo-left",
        showSchoolLogo: true,
        showSchoolMotto: true,
        showWatermark: true,
        watermarkText: "VERIFIED",
        borderStyle: "double",
        includeQRCode: true,
      },
      signatures: {
        registrarName: "Mrs. Funmilayo Adeleke",
        registrarTitle: "Academic Registrar",
        principalName: "Dr. Emmanuel Okafor",
        principalTitle: "School Principal",
        classTeacherTitle: "Form Teacher",
        showOfficialSeal: true,
      },
      // Report Card Configuration - Detailed template with more features
      reportCardConfig: {
        template: "detailed",
        paperSize: "A4",
        orientation: "portrait",
        header: {
          showLogo: true,
          logoPosition: "left",
          showMotto: true,
          showAddress: true,
          showContact: true,
          backgroundColor: "#059669",
        },
        studentInfo: {
          showPhoto: true,
          showAdmissionNumber: true,
          showClass: true,
          showSection: true,
          showGender: true,
          showDateOfBirth: true,
          showAttendanceSummary: true,
          showClassRank: true,
        },
        academicSection: {
          showMaxScore: true,
          showGradeBadge: true,
          showRemarks: true,
          showSubjectPosition: true,
          gradeDisplayFormat: "both",
          sortSubjectsBy: "score",
          showTotalRow: true,
          showAverageRow: true,
        },
        overallSection: {
          showOverallGrade: true,
          showPercentage: true,
          showTotalMarks: true,
          showClassAverage: true,
          showGradeDescription: true,
        },
        conductSection: {
          enabled: true,
          showBehavior: true,
          showDiscipline: true,
          showParticipation: true,
          showPunctuality: true,
          showNeatness: true,
        },
        attendanceSection: {
          enabled: true,
          showDaysPresent: true,
          showDaysAbsent: true,
          showDaysLate: true,
          showAttendanceRate: true,
        },
        remarksSection: {
          showTeacherRemarks: true,
          showPrincipalRemarks: true,
          showCustomRemarks: true,
          customRemarksLabel: "Head of Department's Remarks",
        },
        signaturesSection: {
          showClassTeacher: true,
          showPrincipal: true,
          showParentGuardian: true,
          showDateField: true,
          showOfficialSeal: true,
        },
        footer: {
          showFooter: true,
          showGeneratedDate: true,
          showSchoolName: true,
          customText: "This is an official document of Greenfield International School",
        },
        gradingScale: {
          showOnCard: true,
          position: "bottom",
          scale: [
            { grade: "A*", minScore: 90, maxScore: 100, description: "Outstanding", color: "#059669" },
            { grade: "A", minScore: 80, maxScore: 89, description: "Excellent", color: "#16a34a" },
            { grade: "B", minScore: 70, maxScore: 79, description: "Very Good", color: "#2563eb" },
            { grade: "C", minScore: 60, maxScore: 69, description: "Good", color: "#ca8a04" },
            { grade: "D", minScore: 50, maxScore: 59, description: "Satisfactory", color: "#ea580c" },
            { grade: "E", minScore: 40, maxScore: 49, description: "Needs Work", color: "#f97316" },
            { grade: "F", minScore: 0, maxScore: 39, description: "Fail", color: "#dc2626" },
          ],
        },
        options: {
          showWatermark: true,
          watermarkText: "GREENFIELD",
          showQRCode: true,
          qrCodeContent: "verification",
          showBorder: true,
          borderStyle: "double",
        },
      },
      // Transcript Configuration - Formal template with comprehensive features
      transcriptConfig: {
        template: "formal",
        paperSize: "A4",
        orientation: "portrait",
        header: {
          showLogo: true,
          logoPosition: "left",
          headerStyle: "logo-left",
          showMotto: true,
          showAddress: true,
          showContact: true,
          backgroundColor: "#059669",
        },
        studentInfo: {
          showPhoto: true,
          showAdmissionNumber: true,
          showClass: true,
          showDateOfBirth: true,
          showGender: true,
          showNationality: true,
          showStateOfOrigin: true,
          showGraduationYear: true,
        },
        academicSection: {
          showTermGPA: true,
          showTermAverage: true,
          showPosition: true,
          showCreditHours: true,
          showGradePoints: true,
          showRemarks: true,
          gradeDisplayFormat: "both",
          showAttendance: true,
          showConduct: true,
        },
        summarySection: {
          showOverallGPA: true,
          showOverallAverage: true,
          showTotalCredits: true,
          showClassification: true,
          showTermsCompleted: true,
        },
        gradingScale: {
          showOnTranscript: true,
          position: "bottom",
          showSecondaryScale: true,
          showTertiaryScale: true,
          showClassification: true,
        },
        signaturesSection: {
          showRegistrar: true,
          showPrincipal: true,
          showDean: true,
          showOfficialSeal: true,
          showDate: true,
        },
        footer: {
          showFooter: true,
          showIssueDate: true,
          showPageNumbers: true,
          showVerificationCode: true,
          customText: "This is an official document of Greenfield International School",
        },
        options: {
          showWatermark: true,
          watermarkText: "GREENFIELD",
          showQRCode: true,
          qrCodeContent: "verification",
          showBorder: true,
          borderStyle: "double",
          fontFamily: "Georgia, serif",
        },
      },
    },

    subscription: {
      plan: "enterprise",
      status: "active",
      startDate: "2024-02-01",
      maxStudents: 2000,
      maxStaff: 200,
      features: ["all"],
    },
  },

  {
    id: "royaloak-academy",
    name: "Royal Oak Academy",
    shortName: "ROA",
    slug: "royaloak",
    subdomain: "royaloak.educo.africa",
    status: "Active",
    createdAt: "2024-03-10T00:00:00Z",
    updatedAt: "2025-01-10T00:00:00Z",

    config: {
      supportedLevels: ["Primary", "Secondary"],
      defaultEducationLevel: "Secondary",
      institutionType: "Private",
      scheduleType: "full-time",
      supportsMultipleLevels: true,
      academicYearStart: "September",
      academicYearEnd: "July",
      termSystem: "3-term",
      region: "Nigeria",
      timezone: "Africa/Lagos",
      locale: "en-NG",
      currency: "NGN",
      enabledFeatures: [
        "FF_Student_Profile",
        "FF_Finance_Private",
        "FF_Grading_Primary",
        "FF_Grading_Secondary",
      ],
      bankAccount: {
        bankName: "GTBank Nigeria",
        accountNumber: "1122334455",
        accountName: "Royal Oak Academy",
      },
    },

    contact: {
      email: "admin@royaloak.edu.ng",
      phone: "+234 802 345 6789",
      website: "www.royaloak.edu.ng",
      address: {
        line1: "78 Independence Avenue",
        city: "Abuja",
        state: "FCT",
        postalCode: "900211",
        country: "Nigeria",
      },
    },

    branding: {
      motto: "Wisdom, Character, Excellence",
      primaryColor: "#7c2d12",
      secondaryColor: "#92400e",
      theme: "light",
      transcriptDesign: {
        template: "formal",
        headerStyle: "centered",
        showSchoolLogo: true,
        showSchoolMotto: true,
        showWatermark: true,
        watermarkText: "AUTHENTIC",
        fontFamily: "serif",
        borderStyle: "double",
        includeQRCode: false,
      },
      signatures: {
        registrarName: "Mr. Chukwuemeka Nwosu",
        registrarTitle: "Chief Registrar",
        principalName: "Rev. Dr. Grace Adeyemi",
        principalTitle: "Head of School",
        classTeacherTitle: "Class Master",
        showOfficialSeal: true,
      },
      // Report Card Configuration - Formal/Traditional style
      reportCardConfig: {
        template: "standard",
        paperSize: "A4",
        orientation: "portrait",
        header: {
          showLogo: true,
          logoPosition: "center",
          showMotto: true,
          showAddress: true,
          showContact: false,
          backgroundColor: "#7c2d12",
        },
        studentInfo: {
          showPhoto: false,
          showAdmissionNumber: true,
          showClass: true,
          showSection: true,
          showGender: true,
          showDateOfBirth: false,
          showAttendanceSummary: true,
          showClassRank: true,
        },
        academicSection: {
          showMaxScore: true,
          showGradeBadge: true,
          showRemarks: false,
          showSubjectPosition: false,
          gradeDisplayFormat: "letter",
          sortSubjectsBy: "alphabetical",
          showTotalRow: true,
          showAverageRow: false,
        },
        overallSection: {
          showOverallGrade: true,
          showPercentage: true,
          showTotalMarks: true,
          showClassAverage: false,
          showGradeDescription: true,
        },
        conductSection: {
          enabled: true,
          showBehavior: true,
          showDiscipline: true,
          showParticipation: false,
          showPunctuality: true,
          showNeatness: true,
        },
        attendanceSection: {
          enabled: true,
          showDaysPresent: true,
          showDaysAbsent: true,
          showDaysLate: false,
          showAttendanceRate: false,
        },
        remarksSection: {
          showTeacherRemarks: true,
          showPrincipalRemarks: true,
          showCustomRemarks: false,
        },
        signaturesSection: {
          showClassTeacher: true,
          showPrincipal: true,
          showParentGuardian: true,
          showDateField: true,
          showOfficialSeal: true,
        },
        footer: {
          showFooter: true,
          showGeneratedDate: true,
          showSchoolName: true,
          customText: "Deo Optimo Maximo - To God, the Best and Greatest",
        },
        gradingScale: {
          showOnCard: false,
          position: "bottom",
          scale: [
            { grade: "A", minScore: 75, maxScore: 100, description: "Distinction", color: "#7c2d12" },
            { grade: "B", minScore: 65, maxScore: 74, description: "Credit", color: "#92400e" },
            { grade: "C", minScore: 55, maxScore: 64, description: "Pass", color: "#b45309" },
            { grade: "D", minScore: 45, maxScore: 54, description: "Fair", color: "#d97706" },
            { grade: "E", minScore: 35, maxScore: 44, description: "Poor", color: "#ea580c" },
            { grade: "F", minScore: 0, maxScore: 34, description: "Fail", color: "#dc2626" },
          ],
        },
        options: {
          showWatermark: true,
          watermarkText: "ROYAL OAK",
          showQRCode: false,
          showBorder: true,
          borderStyle: "decorative",
        },
      },
      // Transcript Configuration - Classic/Traditional template
      transcriptConfig: {
        template: "classic",
        paperSize: "A4",
        orientation: "portrait",
        header: {
          showLogo: true,
          logoPosition: "center",
          headerStyle: "centered",
          showMotto: true,
          showAddress: true,
          showContact: false,
          backgroundColor: "#7c2d12",
        },
        studentInfo: {
          showPhoto: false,
          showAdmissionNumber: true,
          showClass: true,
          showDateOfBirth: false,
          showGender: true,
          showNationality: false,
          showStateOfOrigin: false,
          showGraduationYear: true,
        },
        academicSection: {
          showTermGPA: false,
          showTermAverage: true,
          showPosition: true,
          showCreditHours: false,
          showGradePoints: false,
          showRemarks: false,
          gradeDisplayFormat: "letter",
          showAttendance: true,
          showConduct: true,
        },
        summarySection: {
          showOverallGPA: false,
          showOverallAverage: true,
          showTotalCredits: false,
          showClassification: false,
          showTermsCompleted: true,
        },
        gradingScale: {
          showOnTranscript: true,
          position: "bottom",
          showSecondaryScale: true,
          showTertiaryScale: false,
          showClassification: false,
        },
        signaturesSection: {
          showRegistrar: true,
          showPrincipal: true,
          showDean: false,
          showOfficialSeal: true,
          showDate: true,
        },
        footer: {
          showFooter: true,
          showIssueDate: true,
          showPageNumbers: true,
          showVerificationCode: false,
          customText: "Deo Optimo Maximo - To God, the Best and Greatest",
        },
        options: {
          showWatermark: true,
          watermarkText: "AUTHENTIC",
          showQRCode: false,
          showBorder: true,
          borderStyle: "double",
          fontFamily: "Times New Roman, serif",
        },
      },
    },

    subscription: {
      plan: "professional",
      status: "active",
      startDate: "2024-03-10",
      maxStudents: 800,
      maxStaff: 80,
      features: ["all"],
    },
  },

  {
    id: "techbridge-college",
    name: "TechBridge College",
    shortName: "TBC",
    slug: "techbridge",
    subdomain: "techbridge.educo.africa",
    status: "Active",
    createdAt: "2024-06-01T00:00:00Z",
    updatedAt: "2025-01-10T00:00:00Z",

    config: {
      supportedLevels: ["Tertiary"],
      defaultEducationLevel: "Tertiary",
      institutionType: "Private",
      tertiaryType: "College of Technology",
      scheduleType: "full-time",
      supportsMultipleLevels: false,
      academicYearStart: "September",
      academicYearEnd: "July",
      termSystem: "2-semester",
      region: "Nigeria",
      timezone: "Africa/Lagos",
      locale: "en-NG",
      currency: "NGN",
      enabledFeatures: [
        "FF_Student_Profile",
        "FF_Finance_Tertiary",
        "FF_Grading_Tertiary",
        "FF_Hostel_Management",
        "FF_LMS_Zoom",
      ],
      bankAccount: {
        bankName: "Zenith Bank Nigeria",
        accountNumber: "5566778899",
        accountName: "TechBridge College",
      },
      // Timetable for TechBridge College (Tertiary - Lecture periods)
      timetable: {
        periods: [
          { id: "lec1", label: "Lecture 1", startTime: "08:00", endTime: "10:00", type: "regular" },
          { id: "lec2", label: "Lecture 2", startTime: "10:00", endTime: "12:00", type: "regular" },
          { id: "lunch", label: "Lunch Break", startTime: "12:00", endTime: "13:00", type: "lunch" },
          { id: "lec3", label: "Lecture 3", startTime: "13:00", endTime: "15:00", type: "regular" },
          { id: "lec4", label: "Lecture 4", startTime: "15:00", endTime: "17:00", type: "regular" },
        ],
        // Evening classes available
        eveningPeriods: [
          { id: "eve1", label: "Evening Session 1", startTime: "17:00", endTime: "19:00", type: "regular" },
          { id: "eve2", label: "Evening Session 2", startTime: "19:00", endTime: "21:00", type: "regular" },
        ],
      },
      // Tertiary courses offered
      subjects: [
        { id: "csc101", name: "Introduction to Computing", code: "CSC 101", level: "Tertiary", department: "Computer Science", isCore: true },
        { id: "csc102", name: "Introduction to Programming", code: "CSC 102", level: "Tertiary", department: "Computer Science", isCore: true },
        { id: "csc201", name: "Data Structures", code: "CSC 201", level: "Tertiary", department: "Computer Science", isCore: true },
        { id: "csc202", name: "Computer Architecture", code: "CSC 202", level: "Tertiary", department: "Computer Science", isCore: true },
        { id: "csc301", name: "Algorithms", code: "CSC 301", level: "Tertiary", department: "Computer Science", isCore: true },
        { id: "csc302", name: "Operating Systems", code: "CSC 302", level: "Tertiary", department: "Computer Science", isCore: true },
        { id: "mth101", name: "General Mathematics I", code: "MTH 101", level: "Tertiary", department: "Mathematics", isCore: true },
        { id: "mth102", name: "General Mathematics II", code: "MTH 102", level: "Tertiary", department: "Mathematics", isCore: true },
        { id: "phy101", name: "General Physics I", code: "PHY 101", level: "Tertiary", department: "Physics", isCore: true },
        { id: "eng101", name: "Use of English", code: "ENG 101", level: "Tertiary", department: "General Studies", isCore: true },
      ],
    },

    contact: {
      email: "records@techbridge.edu.ng",
      phone: "+234 803 456 7890",
      website: "www.techbridge.edu.ng",
      address: {
        line1: "12 Tech Hub Drive",
        city: "Port Harcourt",
        state: "Rivers",
        postalCode: "500211",
        country: "Nigeria",
      },
    },

    branding: {
      motto: "Innovation Through Education",
      mission: "Empowering the next generation of tech leaders",
      primaryColor: "#6366f1",
      secondaryColor: "#4f46e5",
      theme: "dark",
      transcriptDesign: {
        template: "minimal",
        headerStyle: "logo-right",
        showSchoolLogo: true,
        showSchoolMotto: false,
        showWatermark: false,
        borderStyle: "none",
        includeQRCode: true,
      },
      signatures: {
        registrarName: "Dr. Aisha Mohammed",
        registrarTitle: "Academic Coordinator",
        principalName: "Prof. Taiwo Johnson",
        principalTitle: "College Provost",
        classTeacherTitle: "Course Advisor",
        showOfficialSeal: true,
      },
      // Report Card Configuration - Compact/Minimal for Tech College
      reportCardConfig: {
        template: "compact",
        paperSize: "A4",
        orientation: "portrait",
        header: {
          showLogo: true,
          logoPosition: "right",
          showMotto: false,
          showAddress: false,
          showContact: true,
          backgroundColor: "#6366f1",
        },
        studentInfo: {
          showPhoto: false,
          showAdmissionNumber: true,
          showClass: true,
          showSection: false,
          showGender: false,
          showDateOfBirth: false,
          showAttendanceSummary: false,
          showClassRank: false,
        },
        academicSection: {
          showMaxScore: true,
          showGradeBadge: true,
          showRemarks: false,
          showSubjectPosition: false,
          gradeDisplayFormat: "both",
          sortSubjectsBy: "custom",
          showTotalRow: true,
          showAverageRow: true,
        },
        overallSection: {
          showOverallGrade: true,
          showPercentage: true,
          showTotalMarks: false,
          showClassAverage: true,
          showGradeDescription: true,
        },
        conductSection: {
          enabled: false,
          showBehavior: false,
          showDiscipline: false,
          showParticipation: false,
          showPunctuality: false,
          showNeatness: false,
        },
        attendanceSection: {
          enabled: false,
          showDaysPresent: false,
          showDaysAbsent: false,
          showDaysLate: false,
          showAttendanceRate: false,
        },
        remarksSection: {
          showTeacherRemarks: false,
          showPrincipalRemarks: true,
          showCustomRemarks: true,
          customRemarksLabel: "Dean's Comments",
        },
        signaturesSection: {
          showClassTeacher: false,
          showPrincipal: true,
          showParentGuardian: false,
          showDateField: true,
          showOfficialSeal: true,
        },
        footer: {
          showFooter: true,
          showGeneratedDate: true,
          showSchoolName: true,
        },
        gradingScale: {
          showOnCard: true,
          position: "sidebar",
          scale: [
            { grade: "A", minScore: 70, maxScore: 100, description: "Excellent", color: "#6366f1" },
            { grade: "B", minScore: 60, maxScore: 69, description: "Very Good", color: "#8b5cf6" },
            { grade: "C", minScore: 50, maxScore: 59, description: "Good", color: "#a855f7" },
            { grade: "D", minScore: 45, maxScore: 49, description: "Pass", color: "#d946ef" },
            { grade: "F", minScore: 0, maxScore: 44, description: "Fail", color: "#dc2626" },
          ],
        },
        options: {
          showWatermark: false,
          showQRCode: true,
          qrCodeContent: "student-profile",
          showBorder: false,
          borderStyle: "none",
        },
      },
      // Transcript Configuration - Minimal/Tech template for Tertiary
      transcriptConfig: {
        template: "minimal",
        paperSize: "A4",
        orientation: "portrait",
        header: {
          showLogo: true,
          logoPosition: "right",
          headerStyle: "logo-right",
          showMotto: false,
          showAddress: false,
          showContact: true,
          backgroundColor: "#6366f1",
        },
        studentInfo: {
          showPhoto: false,
          showAdmissionNumber: true,
          showClass: true,
          showDateOfBirth: false,
          showGender: false,
          showNationality: false,
          showStateOfOrigin: false,
          showGraduationYear: true,
        },
        academicSection: {
          showTermGPA: true,
          showTermAverage: false,
          showPosition: false,
          showCreditHours: true,
          showGradePoints: true,
          showRemarks: false,
          gradeDisplayFormat: "gpa",
          showAttendance: false,
          showConduct: false,
        },
        summarySection: {
          showOverallGPA: true,
          showOverallAverage: false,
          showTotalCredits: true,
          showClassification: true,
          showTermsCompleted: true,
        },
        gradingScale: {
          showOnTranscript: true,
          position: "sidebar",
          showSecondaryScale: false,
          showTertiaryScale: true,
          showClassification: true,
        },
        signaturesSection: {
          showRegistrar: true,
          showPrincipal: false,
          showDean: true,
          showOfficialSeal: true,
          showDate: true,
        },
        footer: {
          showFooter: true,
          showIssueDate: true,
          showPageNumbers: true,
          showVerificationCode: true,
        },
        options: {
          showWatermark: false,
          showQRCode: true,
          qrCodeContent: "student-profile",
          showBorder: false,
          borderStyle: "none",
          fontFamily: "Inter, sans-serif",
        },
      },
    },

    subscription: {
      plan: "professional",
      status: "active",
      startDate: "2024-06-01",
      maxStudents: 500,
      maxStaff: 50,
      features: ["all"],
    },
  },
];

/**
 * Get all tenants
 */
export function getAllTenants(): Tenant[] {
  return mockTenants;
}

/**
 * Get tenant by ID
 */
export function getTenantById(id: string): Tenant | undefined {
  return mockTenants.find((tenant) => tenant.id === id);
}

/**
 * Get tenant by slug
 */
export function getTenantBySlug(slug: string): Tenant | undefined {
  return mockTenants.find((tenant) => tenant.slug === slug);
}

/**
 * Get tenant summaries (for listing pages)
 */
export function getTenantSummaries(): TenantSummary[] {
  return mockTenants.map((tenant) => ({
    id: tenant.id,
    name: tenant.name,
    shortName: tenant.shortName,
    slug: tenant.slug,
    status: tenant.status,
    institutionType: tenant.config.institutionType,
    region: tenant.config.region,
    createdAt: tenant.createdAt,
    subscription: tenant.subscription ? {
      plan: tenant.subscription.plan,
      status: tenant.subscription.status,
    } : undefined,
  }));
}

/**
 * Create a new tenant (mock implementation)
 */
export function createTenant(data: Partial<Tenant>): Tenant {
  const newTenant: Tenant = {
    id: data.id || `tenant-${Date.now()}`,
    name: data.name || "New School",
    slug: data.slug || "new-school",
    status: "Active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    config: data.config || {
      supportedLevels: ["Secondary"],
      defaultEducationLevel: "Secondary",
      institutionType: "Private",
      scheduleType: "full-time",
      supportsMultipleLevels: false,
      academicYearStart: "September",
      academicYearEnd: "July",
      termSystem: "3-term",
      region: "Nigeria",
      timezone: "Africa/Lagos",
      locale: "en-NG",
      currency: "NGN",
      enabledFeatures: [],
    },
    contact: data.contact || {
      email: "admin@school.com",
      phone: "+234 800 0000 000",
      address: {
        line1: "",
        city: "",
        state: "",
        country: "Nigeria",
      },
    },
    branding: data.branding || {
      primaryColor: "#2563eb",
    },
  };

  mockTenants.push(newTenant);
  return newTenant;
}

/**
 * Update tenant
 */
export function updateTenant(id: string, data: Partial<Tenant>): Tenant | undefined {
  const index = mockTenants.findIndex((t) => t.id === id);
  if (index === -1) return undefined;

  mockTenants[index] = {
    ...mockTenants[index],
    ...data,
    updatedAt: new Date().toISOString(),
  };

  return mockTenants[index];
}

/**
 * Delete tenant
 */
export function deleteTenant(id: string): boolean {
  const index = mockTenants.findIndex((t) => t.id === id);
  if (index === -1) return false;

  mockTenants.splice(index, 1);
  return true;
}
