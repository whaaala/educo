"use client";

import React, { forwardRef } from "react";
import { ReportCardConfig, DEFAULT_REPORT_CARD_CONFIG, GradeScaleItem } from "@/types/school";

// Unified subject grade interface
export interface SubjectGrade {
  subject: string;
  score: number;
  grade: string;
  remarks?: string;
  teacherRemarks?: string;
  maxScore?: number;
  position?: number; // Subject position in class
}

// Unified attendance interface
export interface AttendanceData {
  present: number;
  absent: number;
  late?: number;
  total: number;
  rate?: number;
}

// Extended conduct interface with more fields
export interface ConductData {
  behavior?: string;
  discipline?: string;
  participation?: string;
  punctuality?: string;
  neatness?: string;
  [key: string]: string | undefined; // For custom fields
}

// Props for the report card template
export interface ReportCardTemplateProps {
  // School info
  schoolName: string;
  schoolMotto?: string;
  schoolLogo?: string;
  schoolAddress?: {
    line1?: string;
    city?: string;
    state?: string;
  };
  schoolContact?: {
    email?: string;
    phone?: string;
  };

  // Branding
  primaryColor?: string;
  secondaryColor?: string;

  // Signatures
  principalName?: string;
  principalTitle?: string;
  classTeacherTitle?: string;

  // Student info
  studentName: string;
  studentPhoto?: string;
  admissionNumber: string;
  classLevel: string;
  section?: string;
  gender: string;
  dateOfBirth?: string;

  // Academic info
  term: string;
  academicYear: string;
  subjects: SubjectGrade[];
  classPosition?: number;
  totalStudents?: number;
  classAverage?: number;
  overallGrade?: string;
  conductGrade?: string;

  // Optional sections
  attendance?: AttendanceData;
  conduct?: ConductData;
  teacherRemarks?: string;
  principalRemarks?: string;
  customRemarks?: string;

  // Legacy props (for backward compatibility)
  includeRemarks?: boolean;
  includeAttendance?: boolean;
  includeConduct?: boolean;
  viewerType?: "parent" | "student" | "admin";

  // NEW: Report card configuration from tenant settings
  config?: ReportCardConfig;

  // Highlighted subject for scroll-to navigation
  highlightedSubject?: string;
}

const ReportCardTemplate = forwardRef<HTMLDivElement, ReportCardTemplateProps>(
  (props, ref) => {
    const {
      schoolName,
      schoolMotto,
      schoolLogo,
      schoolAddress,
      schoolContact,
      primaryColor = "#2563eb",
      principalName = "Principal",
      principalTitle = "Principal",
      classTeacherTitle = "Class Teacher",
      studentName,
      studentPhoto,
      admissionNumber,
      classLevel,
      section,
      gender,
      dateOfBirth,
      term,
      academicYear,
      subjects,
      classPosition,
      totalStudents,
      classAverage,
      attendance,
      conduct,
      teacherRemarks,
      principalRemarks,
      customRemarks,
      config: propConfig,
      highlightedSubject,
    } = props;

    // Merge provided config with defaults
    const config: ReportCardConfig = {
      ...DEFAULT_REPORT_CARD_CONFIG,
      ...propConfig,
      header: { ...DEFAULT_REPORT_CARD_CONFIG.header, ...propConfig?.header },
      studentInfo: { ...DEFAULT_REPORT_CARD_CONFIG.studentInfo, ...propConfig?.studentInfo },
      academicSection: { ...DEFAULT_REPORT_CARD_CONFIG.academicSection, ...propConfig?.academicSection },
      overallSection: { ...DEFAULT_REPORT_CARD_CONFIG.overallSection, ...propConfig?.overallSection },
      conductSection: { ...DEFAULT_REPORT_CARD_CONFIG.conductSection, ...propConfig?.conductSection },
      attendanceSection: { ...DEFAULT_REPORT_CARD_CONFIG.attendanceSection, ...propConfig?.attendanceSection },
      remarksSection: { ...DEFAULT_REPORT_CARD_CONFIG.remarksSection, ...propConfig?.remarksSection },
      signaturesSection: { ...DEFAULT_REPORT_CARD_CONFIG.signaturesSection, ...propConfig?.signaturesSection },
      footer: { ...DEFAULT_REPORT_CARD_CONFIG.footer, ...propConfig?.footer },
      gradingScale: { ...DEFAULT_REPORT_CARD_CONFIG.gradingScale, ...propConfig?.gradingScale },
      options: { ...DEFAULT_REPORT_CARD_CONFIG.options, ...propConfig?.options },
    };

    // Get header background color
    const headerBgColor = config.header.backgroundColor || primaryColor;

    // Calculate totals
    const totalMarks = subjects.reduce((sum, s) => sum + s.score, 0);
    const maxTotalMarks = subjects.reduce((sum, s) => sum + (s.maxScore || 100), 0);
    const percentage = maxTotalMarks > 0 ? (totalMarks / maxTotalMarks) * 100 : 0;

    // Get grade from config scale or use default
    const getGradeFromScale = (score: number): { grade: string; description: string; color: string } => {
      const scale = config.gradingScale.scale;
      for (const item of scale) {
        if (score >= item.minScore && score <= item.maxScore) {
          return { grade: item.grade, description: item.description, color: item.color || primaryColor };
        }
      }
      return { grade: "F", description: "Fail", color: "#dc2626" };
    };

    const getOverallGrade = (pct: number) => {
      const gradeInfo = getGradeFromScale(pct);
      return { grade: gradeInfo.grade, status: gradeInfo.description };
    };

    const getGradeColor = (score: number) => {
      return getGradeFromScale(score).color;
    };

    const gradeInfo = getOverallGrade(percentage);

    // Sort subjects based on config
    const sortedSubjects = [...subjects].sort((a, b) => {
      switch (config.academicSection.sortSubjectsBy) {
        case "score":
          return b.score - a.score;
        case "alphabetical":
          return a.subject.localeCompare(b.subject);
        default:
          return 0;
      }
    });

    // Build conduct items based on config
    const conductItems: { label: string; value: string }[] = [];
    if (config.conductSection.enabled && conduct) {
      if (config.conductSection.showBehavior && conduct.behavior) {
        conductItems.push({ label: "Behavior", value: conduct.behavior });
      }
      if (config.conductSection.showDiscipline && conduct.discipline) {
        conductItems.push({ label: "Discipline", value: conduct.discipline });
      }
      if (config.conductSection.showParticipation && conduct.participation) {
        conductItems.push({ label: "Participation", value: conduct.participation });
      }
      if (config.conductSection.showPunctuality && conduct.punctuality) {
        conductItems.push({ label: "Punctuality", value: conduct.punctuality });
      }
      if (config.conductSection.showNeatness && conduct.neatness) {
        conductItems.push({ label: "Neatness", value: conduct.neatness });
      }
      // Add custom fields
      if (config.conductSection.customFields) {
        config.conductSection.customFields.forEach(field => {
          if (conduct[field]) {
            conductItems.push({ label: field, value: conduct[field] as string });
          }
        });
      }
    }

    // Build signatures based on config
    const signatures: { title: string; sub: string }[] = [];
    if (config.signaturesSection.showClassTeacher) {
      signatures.push({ title: classTeacherTitle, sub: "Signature" });
    }
    if (config.signaturesSection.showParentGuardian) {
      signatures.push({ title: "Parent/Guardian", sub: "Signature" });
    }
    if (config.signaturesSection.showPrincipal) {
      signatures.push({ title: principalName, sub: principalTitle });
    }

    return (
      <div
        ref={ref}
        className="print-content"
        style={{
          fontFamily: "'Segoe UI', 'Inter', system-ui, -apple-system, sans-serif",
          color: "#1e293b",
          width: "210mm",
          height: "297mm",
          margin: "0 auto",
          padding: "0",
          boxSizing: "border-box",
          background: "#ffffff",
          display: "flex",
          flexDirection: "column",
          position: "relative",
          overflow: "hidden",
          border: config.options.showBorder ?
            (config.options.borderStyle === "double" ? "4px double #e2e8f0" :
             config.options.borderStyle === "decorative" ? `3px solid ${primaryColor}` :
             "1px solid #e2e8f0") : "none",
        }}
      >
        {/* ===== HEADER ===== */}
        <div
          style={{
            background: headerBgColor,
            padding: "18px 32px",
            display: "flex",
            alignItems: "center",
            justifyContent: config.header.logoPosition === "center" ? "center" :
                           config.header.logoPosition === "left" ? "flex-start" : "flex-end",
          }}
        >
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "14px",
            flexDirection: config.header.logoPosition === "right" ? "row-reverse" : "row",
          }}>
            {config.header.showLogo && (
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "24px",
                  backgroundColor: "rgba(255,255,255,0.2)",
                  border: "2px solid #ffffff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  overflow: "hidden",
                }}
              >
                {schoolLogo ? (
                  <img src={schoolLogo} alt={schoolName} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  <span style={{ color: "#ffffff", fontSize: "22px", fontWeight: "800" }}>
                    {schoolName.charAt(0)}
                  </span>
                )}
              </div>
            )}
            <div style={{ textAlign: config.header.logoPosition === "center" ? "center" : "left" }}>
              <h1 style={{ margin: 0, fontSize: "22px", fontWeight: "800", color: "#ffffff" }}>
                {schoolName}
              </h1>
              {config.header.showMotto && schoolMotto && (
                <p style={{ margin: "1px 0 0", fontSize: "10px", fontStyle: "italic", color: "rgba(255,255,255,0.95)" }}>
                  &ldquo;{schoolMotto}&rdquo;
                </p>
              )}
              {(config.header.showAddress || config.header.showContact) && (
                <p style={{ margin: "1px 0 0", fontSize: "9px", color: "rgba(255,255,255,0.9)" }}>
                  {config.header.showAddress && `${schoolAddress?.line1}, ${schoolAddress?.city}`}
                  {config.header.showAddress && config.header.showContact && " | "}
                  {config.header.showContact && `${schoolContact?.email} | ${schoolContact?.phone}`}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* ===== REPORT CARD TITLE BANNER ===== */}
        <div
          style={{
            backgroundColor: "#1d4ed8",
            padding: "10px 32px",
            textAlign: "center",
          }}
        >
          <h2 style={{ margin: 0, fontSize: "16px", fontWeight: "700", color: "#ffffff", letterSpacing: "2px", textTransform: "uppercase" }}>
            Progress Report Card
          </h2>
          <p style={{ margin: "3px 0 0", fontSize: "11px", color: "rgba(255,255,255,0.95)", fontWeight: "500" }}>
            {term} - Academic Year {academicYear}
          </p>
        </div>

        {/* ===== MAIN CONTENT ===== */}
        <div
          style={{
            flex: 1,
            padding: "20px 32px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          {/* ===== STUDENT INFO SECTION ===== */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: "0",
              border: "1px solid #e2e8f0",
              borderRadius: "8px",
              overflow: "hidden",
              background: "#f8fafc",
            }}
          >
            {/* Row 1 */}
            <div style={{ padding: "10px 14px", borderRight: "1px solid #e2e8f0", borderBottom: "1px solid #e2e8f0", display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontSize: "12px", color: "#64748b", fontWeight: "600" }}>Name:</span>
              <span style={{ fontSize: "13px", fontWeight: "700", color: primaryColor }}>{studentName}</span>
            </div>
            {config.studentInfo.showGender && (
              <div style={{ padding: "10px 14px", borderRight: "1px solid #e2e8f0", borderBottom: "1px solid #e2e8f0", display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ fontSize: "12px", color: "#64748b", fontWeight: "600" }}>Gender:</span>
                <span style={{ fontSize: "13px", fontWeight: "700", color: "#1e293b" }}>{gender}</span>
              </div>
            )}
            {config.studentInfo.showAttendanceSummary && attendance && (
              <div style={{ padding: "10px 14px", borderBottom: "1px solid #e2e8f0", display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ fontSize: "12px", color: "#64748b", fontWeight: "600" }}>Attendance:</span>
                <span style={{ fontSize: "13px", fontWeight: "700", color: "#16a34a" }}>{attendance.present}/{attendance.total}</span>
              </div>
            )}
            {/* Row 2 */}
            {config.studentInfo.showAdmissionNumber && (
              <div style={{ padding: "10px 14px", borderRight: "1px solid #e2e8f0", display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ fontSize: "12px", color: "#64748b", fontWeight: "600" }}>Adm No:</span>
                <span style={{ fontSize: "13px", fontWeight: "700", color: primaryColor }}>{admissionNumber}</span>
              </div>
            )}
            {config.studentInfo.showClass && (
              <div style={{ padding: "10px 14px", borderRight: "1px solid #e2e8f0", display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ fontSize: "12px", color: "#64748b", fontWeight: "600" }}>Class:</span>
                <span style={{ fontSize: "13px", fontWeight: "700", color: "#1e293b" }}>
                  {classLevel}{config.studentInfo.showSection && section ? ` - ${section}` : ""}
                </span>
              </div>
            )}
            {config.studentInfo.showClassRank && classPosition && totalStudents && (
              <div style={{ padding: "10px 14px", display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ fontSize: "12px", color: "#64748b", fontWeight: "600" }}>Rank:</span>
                <span style={{ fontSize: "13px", fontWeight: "700", color: "#dc2626" }}>{classPosition} of {totalStudents}</span>
              </div>
            )}
          </div>

          {/* ===== ACADEMIC PERFORMANCE SECTION ===== */}
          <div>
            <h3 style={{ margin: "0 0 10px", fontSize: "15px", fontWeight: "700", color: "#1e293b" }}>
              Academic Performance
            </h3>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                border: "2px solid #e2e8f0",
                borderRadius: "10px",
                overflow: "hidden",
              }}
            >
              <thead>
                <tr style={{ background: primaryColor }}>
                  <th style={{ padding: "10px 14px", textAlign: "left", fontWeight: "700", fontSize: "13px", color: "#fff" }}>
                    Subject
                  </th>
                  {config.academicSection.showMaxScore && (
                    <th style={{ padding: "10px 12px", textAlign: "center", fontWeight: "700", fontSize: "13px", color: "#fff", width: "70px" }}>
                      Max
                    </th>
                  )}
                  <th style={{ padding: "10px 12px", textAlign: "center", fontWeight: "700", fontSize: "13px", color: "#fff", width: "80px" }}>
                    Obtained
                  </th>
                  {config.academicSection.showGradeBadge && (
                    <th style={{ padding: "10px 12px", textAlign: "center", fontWeight: "700", fontSize: "13px", color: "#fff", width: "70px" }}>
                      Grade
                    </th>
                  )}
                  {config.academicSection.showSubjectPosition && (
                    <th style={{ padding: "10px 12px", textAlign: "center", fontWeight: "700", fontSize: "13px", color: "#fff", width: "60px" }}>
                      Pos
                    </th>
                  )}
                  {config.academicSection.showRemarks && (
                    <th style={{ padding: "10px 14px", textAlign: "left", fontWeight: "700", fontSize: "13px", color: "#fff" }}>
                      Remarks
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {sortedSubjects.map((subject, idx) => {
                  const subjectSlug = subject.subject.toLowerCase().replace(/\s+/g, "-");
                  const isHighlighted = highlightedSubject?.toLowerCase().replace(/\s+/g, "-") === subjectSlug;
                  return (
                  <tr
                    key={idx}
                    id={`subject-${subjectSlug}`}
                    style={{
                      background: isHighlighted
                        ? "#fef3c7"
                        : idx % 2 === 0
                          ? "#ffffff"
                          : "#f8fafc",
                      transition: "background-color 0.3s ease",
                    }}
                  >
                    <td style={{ padding: "8px 14px", fontWeight: "600", fontSize: "13px", color: primaryColor, borderBottom: "1px solid #e2e8f0" }}>
                      {subject.subject}
                    </td>
                    {config.academicSection.showMaxScore && (
                      <td style={{ padding: "8px 12px", textAlign: "center", fontSize: "13px", color: "#64748b", borderBottom: "1px solid #e2e8f0" }}>
                        {subject.maxScore || 100}
                      </td>
                    )}
                    <td style={{ padding: "8px 12px", textAlign: "center", fontWeight: "700", fontSize: "14px", color: getGradeColor(subject.score), borderBottom: "1px solid #e2e8f0" }}>
                      {subject.score}
                      {config.academicSection.gradeDisplayFormat === "both" && ` (${subject.grade})`}
                    </td>
                    {config.academicSection.showGradeBadge && (
                      <td style={{ padding: "8px 12px", textAlign: "center", borderBottom: "1px solid #e2e8f0" }}>
                        <span
                          style={{
                            display: "inline-block",
                            backgroundColor: getGradeColor(subject.score),
                            borderRadius: "4px",
                            padding: "4px 10px",
                            fontSize: "12px",
                            fontWeight: "700",
                            color: "#ffffff",
                          }}
                        >
                          {subject.grade}
                        </span>
                      </td>
                    )}
                    {config.academicSection.showSubjectPosition && (
                      <td style={{ padding: "8px 12px", textAlign: "center", fontSize: "13px", color: "#64748b", borderBottom: "1px solid #e2e8f0" }}>
                        {subject.position || "-"}
                      </td>
                    )}
                    {config.academicSection.showRemarks && (
                      <td style={{ padding: "8px 14px", fontSize: "12px", color: "#64748b", fontStyle: "italic", borderBottom: "1px solid #e2e8f0" }}>
                        {subject.teacherRemarks || "Good progress"}
                      </td>
                    )}
                  </tr>
                  );
                })}
              </tbody>
              {config.academicSection.showTotalRow && (
                <tfoot>
                  <tr style={{ background: primaryColor }}>
                    <td style={{ padding: "10px 14px", fontWeight: "700", fontSize: "13px", color: "#fff" }}>
                      TOTAL
                    </td>
                    {config.academicSection.showMaxScore && (
                      <td style={{ padding: "10px 12px", textAlign: "center", fontWeight: "600", fontSize: "13px", color: "#fff" }}>
                        {maxTotalMarks}
                      </td>
                    )}
                    <td style={{ padding: "10px 12px", textAlign: "center", fontWeight: "700", fontSize: "14px", color: "#fff" }}>
                      {totalMarks}
                    </td>
                    {config.academicSection.showGradeBadge && (
                      <td style={{ padding: "10px 12px", textAlign: "center", fontWeight: "700", fontSize: "13px", color: "#fff" }}>
                        {percentage.toFixed(1)}%
                      </td>
                    )}
                    {config.academicSection.showSubjectPosition && <td style={{ padding: "10px 12px", color: "#fff" }} />}
                    {config.academicSection.showRemarks && <td style={{ padding: "10px 14px", color: "#fff" }} />}
                  </tr>
                </tfoot>
              )}
            </table>
          </div>

          {/* ===== OVERALL PERFORMANCE SUMMARY ===== */}
          {(config.overallSection.showOverallGrade || config.overallSection.showPercentage || config.overallSection.showTotalMarks) && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "14px 24px",
                backgroundColor: "#dbeafe",
                borderRadius: "10px",
                border: "2px solid #93c5fd",
              }}
            >
              {config.overallSection.showOverallGrade && (
                <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                  <div
                    style={{
                      width: "50px",
                      height: "50px",
                      borderRadius: "25px",
                      backgroundColor: primaryColor,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <span style={{ color: "#fff", fontSize: "20px", fontWeight: "800" }}>{gradeInfo.grade}</span>
                  </div>
                  <div>
                    <p style={{ margin: 0, fontSize: "14px", fontWeight: "700", color: "#1d4ed8" }}>Overall Grade</p>
                    {config.overallSection.showGradeDescription && (
                      <p style={{ margin: 0, fontSize: "12px", color: "#64748b" }}>{gradeInfo.status}</p>
                    )}
                  </div>
                </div>
              )}
              <div style={{ display: "flex", alignItems: "center", gap: "32px" }}>
                {config.overallSection.showPercentage && (
                  <div style={{ textAlign: "center" }}>
                    <p style={{ margin: 0, fontSize: "22px", fontWeight: "800", color: "#1d4ed8" }}>{percentage.toFixed(1)}%</p>
                    <p style={{ margin: 0, fontSize: "11px", color: "#64748b" }}>Percentage</p>
                  </div>
                )}
                {config.overallSection.showTotalMarks && (
                  <div style={{ textAlign: "center" }}>
                    <p style={{ margin: 0, fontSize: "16px", fontWeight: "700", color: "#1e293b" }}>{totalMarks}/{maxTotalMarks}</p>
                    <p style={{ margin: 0, fontSize: "11px", color: "#64748b" }}>Total Marks</p>
                  </div>
                )}
                {config.overallSection.showClassAverage && classAverage && (
                  <div style={{ textAlign: "center" }}>
                    <p style={{ margin: 0, fontSize: "16px", fontWeight: "700", color: "#64748b" }}>{classAverage.toFixed(1)}%</p>
                    <p style={{ margin: 0, fontSize: "11px", color: "#64748b" }}>Class Avg</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ===== CONDUCT SECTION ===== */}
          {config.conductSection.enabled && conductItems.length > 0 && (
            <div style={{ display: "flex", gap: "12px" }}>
              {conductItems.map((item, i) => (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    padding: "12px 16px",
                    background: "#f8fafc",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                    textAlign: "center",
                  }}
                >
                  <p style={{ margin: 0, fontSize: "11px", color: "#64748b", fontWeight: "600" }}>
                    {item.label}
                  </p>
                  <p style={{ margin: "4px 0 0", fontSize: "16px", fontWeight: "700", color: primaryColor }}>
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* ===== REMARKS SECTION ===== */}
          {(config.remarksSection.showTeacherRemarks || config.remarksSection.showPrincipalRemarks) && (
            <div style={{ display: "flex", gap: "12px" }}>
              {config.remarksSection.showTeacherRemarks && (
                <div style={{ flex: 1 }}>
                  <p style={{ margin: "0 0 6px", fontSize: "13px", fontWeight: "700", color: "#1e293b" }}>
                    {classTeacherTitle}&apos;s Remarks:
                  </p>
                  <div
                    style={{
                      padding: "12px 14px",
                      background: "#f8fafc",
                      border: "1px solid #e2e8f0",
                      borderRadius: "8px",
                      fontSize: "12px",
                      fontStyle: "italic",
                      color: "#475569",
                      lineHeight: 1.5,
                      minHeight: "40px",
                    }}
                  >
                    {teacherRemarks || "Good academic performance. Keep up the excellent work!"}
                  </div>
                </div>
              )}
              {config.remarksSection.showPrincipalRemarks && (
                <div style={{ flex: 1 }}>
                  <p style={{ margin: "0 0 6px", fontSize: "13px", fontWeight: "700", color: "#1e293b" }}>
                    {principalTitle}&apos;s Remarks:
                  </p>
                  <div
                    style={{
                      padding: "12px 14px",
                      background: "#f8fafc",
                      border: "1px solid #e2e8f0",
                      borderRadius: "8px",
                      fontSize: "12px",
                      fontStyle: "italic",
                      color: "#475569",
                      lineHeight: 1.5,
                      minHeight: "40px",
                    }}
                  >
                    {principalRemarks || "Congratulations on your achievement. Keep up the excellent work!"}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ===== CUSTOM REMARKS (if enabled) ===== */}
          {config.remarksSection.showCustomRemarks && config.remarksSection.customRemarksLabel && (
            <div>
              <p style={{ margin: "0 0 6px", fontSize: "13px", fontWeight: "700", color: "#1e293b" }}>
                {config.remarksSection.customRemarksLabel}:
              </p>
              <div
                style={{
                  padding: "12px 14px",
                  background: "#f8fafc",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                  fontSize: "12px",
                  fontStyle: "italic",
                  color: "#475569",
                  lineHeight: 1.5,
                  minHeight: "40px",
                }}
              >
                {customRemarks || "No additional remarks."}
              </div>
            </div>
          )}

          {/* ===== OFFICIAL SIGNATURES ===== */}
          {signatures.length > 0 && (
            <div>
              <p
                style={{
                  margin: "0 0 10px",
                  fontSize: "13px",
                  fontWeight: "700",
                  color: "#1e293b",
                  textAlign: "center",
                  textTransform: "uppercase",
                  letterSpacing: "2px",
                }}
              >
                Official Signatures
              </p>
              <div style={{ display: "flex", gap: "14px" }}>
                {signatures.map((sig, i) => (
                  <div
                    key={i}
                    style={{
                      flex: 1,
                      padding: "14px 16px",
                      background: "#f8fafc",
                      border: "1px solid #e2e8f0",
                      borderRadius: "8px",
                      textAlign: "center",
                    }}
                  >
                    <div
                      style={{
                        height: "28px",
                        borderBottom: "2px dashed #cbd5e1",
                        marginBottom: "8px",
                      }}
                    />
                    <p style={{ margin: 0, fontSize: "13px", fontWeight: "700", color: "#1e293b" }}>
                      {sig.title}
                    </p>
                    <p style={{ margin: "4px 0 0", fontSize: "10px", color: "#94a3b8" }}>{sig.sub}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ===== GRADING SCALE (if enabled at bottom) ===== */}
          {config.gradingScale.showOnCard && config.gradingScale.position === "bottom" && (
            <div style={{ marginTop: "10px", padding: "10px", background: "#f8fafc", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
              <p style={{ margin: "0 0 8px", fontSize: "11px", fontWeight: "700", color: "#64748b", textTransform: "uppercase" }}>
                Grading Scale
              </p>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {config.gradingScale.scale.map((item, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "10px" }}>
                    <span style={{
                      display: "inline-block",
                      width: "20px",
                      height: "20px",
                      borderRadius: "4px",
                      backgroundColor: item.color,
                      color: "#fff",
                      textAlign: "center",
                      lineHeight: "20px",
                      fontWeight: "700",
                      fontSize: "10px",
                    }}>
                      {item.grade}
                    </span>
                    <span style={{ color: "#64748b" }}>
                      {item.minScore}-{item.maxScore} ({item.description})
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ===== FOOTER ===== */}
        {config.footer.showFooter && (
          <div
            style={{
              padding: "12px 32px",
              borderTop: "1px solid #e2e8f0",
              textAlign: "center",
              background: "#f8fafc",
              flexShrink: 0,
            }}
          >
            <p style={{ margin: 0, fontSize: "11px", color: "#64748b" }}>
              {config.footer.customText ? (
                config.footer.customText
              ) : (
                <>
                  {config.footer.showSchoolName && (
                    <>Official document issued by <strong style={{ color: primaryColor }}>{schoolName}</strong></>
                  )}
                  {config.footer.showGeneratedDate && (
                    <> | Generated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</>
                  )}
                </>
              )}
            </p>
          </div>
        )}
      </div>
    );
  }
);

ReportCardTemplate.displayName = "ReportCardTemplate";

export default ReportCardTemplate;
