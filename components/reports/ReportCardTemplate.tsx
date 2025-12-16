"use client";

import React, { forwardRef } from "react";

// Unified subject grade interface
export interface SubjectGrade {
  subject: string;
  score: number;
  grade: string;
  remarks?: string;
  teacherRemarks?: string;
  maxScore?: number;
}

// Unified attendance interface
export interface AttendanceData {
  present: number;
  absent: number;
  late?: number;
  total: number;
  rate?: number;
}

// Unified conduct interface
export interface ConductData {
  behavior: string;
  discipline: string;
  participation: string;
}

// Props for the report card template
export interface ReportCardTemplateProps {
  schoolName: string;
  schoolMotto?: string;
  schoolAddress?: {
    line1?: string;
    city?: string;
    state?: string;
  };
  schoolContact?: {
    email?: string;
    phone?: string;
  };
  primaryColor?: string;
  secondaryColor?: string;
  principalName?: string;
  principalTitle?: string;
  studentName: string;
  admissionNumber: string;
  classLevel: string;
  section?: string;
  gender: string;
  term: string;
  academicYear: string;
  subjects: SubjectGrade[];
  classPosition?: number;
  totalStudents?: number;
  overallGrade?: string;
  conductGrade?: string;
  attendance?: AttendanceData;
  conduct?: ConductData;
  teacherRemarks?: string;
  principalRemarks?: string;
  includeRemarks?: boolean;
  includeAttendance?: boolean;
  includeConduct?: boolean;
  viewerType?: "parent" | "student" | "admin";
}

const ReportCardTemplate = forwardRef<HTMLDivElement, ReportCardTemplateProps>(
  (props, ref) => {
    const {
      schoolName,
      schoolMotto,
      schoolAddress,
      schoolContact,
      primaryColor = "#2563eb",
      principalName = "Principal",
      studentName,
      admissionNumber,
      classLevel,
      section,
      gender,
      term,
      academicYear,
      subjects,
      classPosition,
      totalStudents,
      attendance,
      conduct,
      teacherRemarks,
      principalRemarks,
    } = props;

    const totalMarks = subjects.reduce((sum, s) => sum + s.score, 0);
    const maxTotalMarks = subjects.reduce((sum, s) => sum + (s.maxScore || 100), 0);
    const percentage = (totalMarks / maxTotalMarks) * 100;

    const getOverallGrade = (pct: number) => {
      if (pct >= 90) return { grade: "A+", status: "Outstanding" };
      if (pct >= 80) return { grade: "A", status: "Excellent" };
      if (pct >= 70) return { grade: "B", status: "Very Good" };
      if (pct >= 60) return { grade: "C", status: "Good" };
      if (pct >= 50) return { grade: "D", status: "Satisfactory" };
      return { grade: "F", status: "Needs Improvement" };
    };

    const getGradeColor = (score: number) => {
      if (score >= 80) return "#16a34a";
      if (score >= 70) return "#2563eb";
      if (score >= 60) return "#ca8a04";
      if (score >= 50) return "#ea580c";
      return "#dc2626";
    };

    const gradeInfo = getOverallGrade(percentage);

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
        }}
      >
        {/* ===== HEADER ===== */}
        <div
          style={{
            background: primaryColor,
            padding: "18px 32px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
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
              }}
            >
              <span style={{ color: "#ffffff", fontSize: "22px", fontWeight: "800" }}>
                {schoolName.charAt(0)}
              </span>
            </div>
            <div style={{ textAlign: "center" }}>
              <h1 style={{ margin: 0, fontSize: "22px", fontWeight: "800", color: "#ffffff" }}>
                {schoolName}
              </h1>
              {schoolMotto && (
                <p style={{ margin: "1px 0 0", fontSize: "10px", fontStyle: "italic", color: "rgba(255,255,255,0.95)" }}>
                  &ldquo;{schoolMotto}&rdquo;
                </p>
              )}
              <p style={{ margin: "1px 0 0", fontSize: "9px", color: "rgba(255,255,255,0.9)" }}>
                {schoolAddress?.line1}, {schoolAddress?.city} | {schoolContact?.email} | {schoolContact?.phone}
              </p>
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
            <div style={{ padding: "10px 14px", borderRight: "1px solid #e2e8f0", borderBottom: "1px solid #e2e8f0", display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontSize: "12px", color: "#64748b", fontWeight: "600" }}>Name:</span>
              <span style={{ fontSize: "13px", fontWeight: "700", color: primaryColor }}>{studentName}</span>
            </div>
            <div style={{ padding: "10px 14px", borderRight: "1px solid #e2e8f0", borderBottom: "1px solid #e2e8f0", display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontSize: "12px", color: "#64748b", fontWeight: "600" }}>Gender:</span>
              <span style={{ fontSize: "13px", fontWeight: "700", color: "#1e293b" }}>{gender}</span>
            </div>
            <div style={{ padding: "10px 14px", borderBottom: "1px solid #e2e8f0", display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontSize: "12px", color: "#64748b", fontWeight: "600" }}>Attendance:</span>
              <span style={{ fontSize: "13px", fontWeight: "700", color: "#16a34a" }}>{attendance ? `${attendance.present}/${attendance.total}` : "N/A"}</span>
            </div>
            <div style={{ padding: "10px 14px", borderRight: "1px solid #e2e8f0", display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontSize: "12px", color: "#64748b", fontWeight: "600" }}>Adm No:</span>
              <span style={{ fontSize: "13px", fontWeight: "700", color: primaryColor }}>{admissionNumber}</span>
            </div>
            <div style={{ padding: "10px 14px", borderRight: "1px solid #e2e8f0", display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontSize: "12px", color: "#64748b", fontWeight: "600" }}>Class:</span>
              <span style={{ fontSize: "13px", fontWeight: "700", color: "#1e293b" }}>{classLevel}{section ? ` - ${section}` : ""}</span>
            </div>
            <div style={{ padding: "10px 14px", display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontSize: "12px", color: "#64748b", fontWeight: "600" }}>Rank:</span>
              <span style={{ fontSize: "13px", fontWeight: "700", color: "#dc2626" }}>{classPosition} of {totalStudents}</span>
            </div>
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
                  <th style={{ padding: "10px 12px", textAlign: "center", fontWeight: "700", fontSize: "13px", color: "#fff", width: "70px" }}>
                    Max
                  </th>
                  <th style={{ padding: "10px 12px", textAlign: "center", fontWeight: "700", fontSize: "13px", color: "#fff", width: "80px" }}>
                    Obtained
                  </th>
                  <th style={{ padding: "10px 12px", textAlign: "center", fontWeight: "700", fontSize: "13px", color: "#fff", width: "70px" }}>
                    Grade
                  </th>
                  <th style={{ padding: "10px 14px", textAlign: "left", fontWeight: "700", fontSize: "13px", color: "#fff" }}>
                    Remarks
                  </th>
                </tr>
              </thead>
              <tbody>
                {subjects.map((subject, idx) => (
                  <tr key={idx} style={{ background: idx % 2 === 0 ? "#ffffff" : "#f8fafc" }}>
                    <td style={{ padding: "8px 14px", fontWeight: "600", fontSize: "13px", color: primaryColor, borderBottom: "1px solid #e2e8f0" }}>
                      {subject.subject}
                    </td>
                    <td style={{ padding: "8px 12px", textAlign: "center", fontSize: "13px", color: "#64748b", borderBottom: "1px solid #e2e8f0" }}>
                      {subject.maxScore || 100}
                    </td>
                    <td style={{ padding: "8px 12px", textAlign: "center", fontWeight: "700", fontSize: "14px", color: getGradeColor(subject.score), borderBottom: "1px solid #e2e8f0" }}>
                      {subject.score}
                    </td>
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
                    <td style={{ padding: "8px 14px", fontSize: "12px", color: "#64748b", fontStyle: "italic", borderBottom: "1px solid #e2e8f0" }}>
                      {subject.teacherRemarks || "Good progress"}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr style={{ background: primaryColor }}>
                  <td style={{ padding: "10px 14px", fontWeight: "700", fontSize: "13px", color: "#fff" }}>
                    TOTAL
                  </td>
                  <td style={{ padding: "10px 12px", textAlign: "center", fontWeight: "600", fontSize: "13px", color: "#fff" }}>
                    {maxTotalMarks}
                  </td>
                  <td style={{ padding: "10px 12px", textAlign: "center", fontWeight: "700", fontSize: "14px", color: "#fff" }}>
                    {totalMarks}
                  </td>
                  <td style={{ padding: "10px 12px", textAlign: "center", fontWeight: "700", fontSize: "13px", color: "#fff" }}>
                    {percentage.toFixed(1)}%
                  </td>
                  <td style={{ padding: "10px 14px", color: "#fff" }} />
                </tr>
              </tfoot>
            </table>
          </div>

          {/* ===== OVERALL PERFORMANCE SUMMARY ===== */}
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
                <p style={{ margin: 0, fontSize: "12px", color: "#64748b" }}>{gradeInfo.status}</p>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "32px" }}>
              <div style={{ textAlign: "center" }}>
                <p style={{ margin: 0, fontSize: "22px", fontWeight: "800", color: "#1d4ed8" }}>{percentage.toFixed(1)}%</p>
                <p style={{ margin: 0, fontSize: "11px", color: "#64748b" }}>Percentage</p>
              </div>
              <div style={{ textAlign: "center" }}>
                <p style={{ margin: 0, fontSize: "16px", fontWeight: "700", color: "#1e293b" }}>{totalMarks}/{maxTotalMarks}</p>
                <p style={{ margin: 0, fontSize: "11px", color: "#64748b" }}>Total Marks</p>
              </div>
            </div>
          </div>

          {/* ===== CONDUCT SECTION ===== */}
          {conduct && (
            <div style={{ display: "flex", gap: "12px" }}>
              {[
                { label: "Behavior", value: conduct.behavior },
                { label: "Discipline", value: conduct.discipline },
                { label: "Participation", value: conduct.participation },
              ].map((item, i) => (
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
          <div style={{ display: "flex", gap: "12px" }}>
            <div style={{ flex: 1 }}>
              <p style={{ margin: "0 0 6px", fontSize: "13px", fontWeight: "700", color: "#1e293b" }}>
                Class Teacher&apos;s Remarks:
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
            <div style={{ flex: 1 }}>
              <p style={{ margin: "0 0 6px", fontSize: "13px", fontWeight: "700", color: "#1e293b" }}>
                Principal&apos;s Remarks:
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
          </div>

          {/* ===== OFFICIAL SIGNATURES ===== */}
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
              {[
                { title: "Class Teacher", sub: "Signature" },
                { title: "Parent/Guardian", sub: "Signature" },
                { title: principalName, sub: "Principal" },
              ].map((sig, i) => (
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
        </div>

        {/* ===== FOOTER ===== */}
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
            Official document issued by <strong style={{ color: primaryColor }}>{schoolName}</strong> | Generated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>
      </div>
    );
  }
);

ReportCardTemplate.displayName = "ReportCardTemplate";

export default ReportCardTemplate;
