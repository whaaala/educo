"use client";

import { TranscriptRequest } from "@/types/transcript";
import { TenantTranscriptConfig } from "@/types/tenant";
import { mockAcademicRecords } from "@/data/mockTranscriptData";
import { getTenantConfig, getCurrentTenantId } from "@/data/mockTenantConfig";
import { formatGPA, formatPercentage, calculateAverage } from "@/utils/gradingAdapter";
import TranscriptHeader from "./TranscriptHeader";
import TranscriptFooter from "./TranscriptFooter";

interface TranscriptTemplateProps {
  request: TranscriptRequest;
  showWatermark?: boolean;
  tenantId?: string;
}

export default function TranscriptTemplate({
  request,
  showWatermark = true,
  tenantId
}: TranscriptTemplateProps) {
  // Get tenant configuration
  const tenantConfig: TenantTranscriptConfig = getTenantConfig(tenantId || getCurrentTenantId());
  const { branding, design, signatures } = tenantConfig;

  // Get academic records for this student
  const academicRecords = mockAcademicRecords[request.studentId as keyof typeof mockAcademicRecords] || [];

  // Calculate overall statistics
  const allScores = academicRecords.flatMap(term => term.subjects.map(s => s.score || 0));
  const overallAverage = calculateAverage(allScores);

  return (
    <div
      className="bg-white p-8 max-w-[210mm] mx-auto relative"
      id="transcript-document"
      style={{ fontFamily: design.fontFamily || "system-ui" }}
    >
      {/* Watermark */}
      {showWatermark && design.showWatermark && request.transcriptType === "official" && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5 z-0">
          <div
            className="text-9xl font-bold rotate-[-45deg] select-none"
            style={{ color: design.primaryColor }}
          >
            {design.watermarkText || "OFFICIAL"}
          </div>
        </div>
      )}

      <div className="relative z-10">
        {/* Header */}
        <TranscriptHeader
          branding={branding}
          design={design}
          transcriptType={request.transcriptType}
        />

        {/* Student Information */}
        <div className="grid grid-cols-2 gap-6 mb-8 bg-gray-50 p-6 rounded-lg">
          <div>
            <h3
              className="text-sm font-semibold mb-3 uppercase tracking-wide border-b pb-1"
              style={{
                color: design.secondaryColor || design.primaryColor,
                borderColor: design.primaryColor
              }}
            >
              Student Information
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex">
                <span className="font-semibold text-gray-700 w-40">Name:</span>
                <span className="text-gray-900">{request.studentName}</span>
              </div>
              <div className="flex">
                <span className="font-semibold text-gray-700 w-40">Admission Number:</span>
                <span className="text-gray-900">{request.studentAdmissionNumber}</span>
              </div>
              <div className="flex">
                <span className="font-semibold text-gray-700 w-40">Class/Level:</span>
                <span className="text-gray-900">{request.studentClass}</span>
              </div>
              {request.graduationYear && (
                <div className="flex">
                  <span className="font-semibold text-gray-700 w-40">Graduation Year:</span>
                  <span className="text-gray-900">{request.graduationYear}</span>
                </div>
              )}
            </div>
          </div>
          <div>
            <h3
              className="text-sm font-semibold mb-3 uppercase tracking-wide border-b pb-1"
              style={{
                color: design.secondaryColor || design.primaryColor,
                borderColor: design.primaryColor
              }}
            >
              Transcript Information
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex">
                <span className="font-semibold text-gray-700 w-40">Transcript ID:</span>
                <span className="text-gray-900">{request.requestNumber}</span>
              </div>
              <div className="flex">
                <span className="font-semibold text-gray-700 w-40">Issue Date:</span>
                <span className="text-gray-900">{new Date().toLocaleDateString()}</span>
              </div>
              <div className="flex">
                <span className="font-semibold text-gray-700 w-40">Academic Period:</span>
                <span className="text-gray-900">{request.fromYear} - {request.toYear}</span>
              </div>
              <div className="flex">
                <span className="font-semibold text-gray-700 w-40">Purpose:</span>
                <span className="text-gray-900 capitalize">{request.purpose.replace("-", " ")}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Academic Records */}
        <div className="mb-8">
          <h3
            className="text-lg font-bold text-gray-900 mb-4 pb-2"
            style={{ borderBottom: `2px solid ${design.primaryColor}` }}
          >
            Academic Performance
          </h3>

          {academicRecords.length > 0 ? (
            <div className="space-y-6">
              {academicRecords.map((term) => (
                <div
                  key={term.termId}
                  className="border rounded-lg overflow-hidden"
                  style={{ borderColor: design.primaryColor }}
                >
                  {/* Term Header */}
                  <div
                    className="px-4 py-3 border-b"
                    style={{
                      backgroundColor: `${design.primaryColor}15`,
                      borderColor: design.primaryColor
                    }}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-bold text-gray-900">{term.termName}</h4>
                        <p className="text-sm text-gray-600">{term.academicYear} • {term.level}</p>
                      </div>
                      <div className="text-right">
                        {term.termGPA && (
                          <div
                            className="text-lg font-bold"
                            style={{ color: design.primaryColor }}
                          >
                            GPA: {formatGPA(term.termGPA)}
                          </div>
                        )}
                        {term.termAverage && (
                          <div
                            className="text-lg font-bold"
                            style={{ color: design.primaryColor }}
                          >
                            Average: {term.termAverage.toFixed(1)}%
                          </div>
                        )}
                        {term.position && (
                          <div className="text-xs text-gray-600">
                            Position: {term.position}/{term.totalStudents}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Subjects Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-gray-100 border-b border-gray-300">
                          <th className="px-4 py-2 text-left font-semibold text-gray-700">Subject</th>
                          <th className="px-4 py-2 text-center font-semibold text-gray-700">Score</th>
                          <th className="px-4 py-2 text-center font-semibold text-gray-700">Grade</th>
                          {term.subjects[0]?.gradePoint !== undefined && (
                            <th className="px-4 py-2 text-center font-semibold text-gray-700">Grade Point</th>
                          )}
                          {term.subjects[0]?.creditHours !== undefined && (
                            <th className="px-4 py-2 text-center font-semibold text-gray-700">Credit Hours</th>
                          )}
                          <th className="px-4 py-2 text-center font-semibold text-gray-700">Remarks</th>
                        </tr>
                      </thead>
                      <tbody>
                        {term.subjects.map((subject, index) => (
                          <tr
                            key={subject.subjectId}
                            className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                          >
                            <td className="px-4 py-2 text-gray-900">{subject.subjectName}</td>
                            <td className="px-4 py-2 text-center font-semibold text-gray-900">
                              {subject.score}
                            </td>
                            <td
                              className="px-4 py-2 text-center font-bold"
                              style={{ color: design.primaryColor }}
                            >
                              {subject.grade}
                            </td>
                            {subject.gradePoint !== undefined && (
                              <td className="px-4 py-2 text-center text-gray-900">
                                {subject.gradePoint.toFixed(1)}
                              </td>
                            )}
                            {subject.creditHours !== undefined && (
                              <td className="px-4 py-2 text-center text-gray-900">
                                {subject.creditHours}
                              </td>
                            )}
                            <td className="px-4 py-2 text-center text-gray-700">{subject.remarks}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Attendance & Conduct */}
                  {request.includeAttendance && (
                    <div className="px-4 py-3 bg-gray-50 border-t border-gray-300 grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-semibold text-gray-700">Attendance: </span>
                        <span className="text-gray-900">
                          {term.attendance.daysPresent}/{term.attendance.totalDays} days (
                          {formatPercentage(term.attendance.percentage)})
                        </span>
                      </div>
                      <div>
                        <span className="font-semibold text-gray-700">Conduct: </span>
                        <span className="text-gray-900">{term.conduct}</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-300">
              <p className="text-gray-600">No academic records available for this period.</p>
            </div>
          )}
        </div>

        {/* Overall Summary */}
        {academicRecords.length > 0 && (
          <div
            className="mb-8 border-2 rounded-lg p-6"
            style={{
              backgroundColor: `${design.primaryColor}10`,
              borderColor: design.primaryColor
            }}
          >
            <h3 className="text-lg font-bold text-gray-900 mb-4">Overall Performance Summary</h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div
                  className="text-3xl font-bold"
                  style={{ color: design.primaryColor }}
                >
                  {overallAverage.toFixed(1)}%
                </div>
                <div className="text-sm text-gray-600 mt-1">Overall Average</div>
              </div>
              <div>
                <div
                  className="text-3xl font-bold"
                  style={{ color: design.primaryColor }}
                >
                  {academicRecords.length}
                </div>
                <div className="text-sm text-gray-600 mt-1">Terms Completed</div>
              </div>
              <div>
                <div
                  className="text-3xl font-bold"
                  style={{ color: design.primaryColor }}
                >
                  {academicRecords[0]?.subjects?.length || 0}
                </div>
                <div className="text-sm text-gray-600 mt-1">Subjects per Term</div>
              </div>
            </div>
          </div>
        )}

        {/* Grading Scale Legend */}
        <div className="mb-8">
          <h3 className="text-sm font-bold text-gray-900 mb-3 uppercase">Grading Scale</h3>
          <div className="grid grid-cols-3 gap-4 text-xs">
            <div className="bg-gray-50 p-3 rounded border border-gray-300">
              <div className="font-semibold text-gray-700 mb-2">Secondary (WAEC)</div>
              <div className="space-y-1 text-gray-600">
                <div>75-100: A1 (Excellent)</div>
                <div>70-74: B2 (Very Good)</div>
                <div>65-69: B3 (Good)</div>
                <div>60-64: C4 (Credit)</div>
                <div>0-39: F9 (Fail)</div>
              </div>
            </div>
            <div className="bg-gray-50 p-3 rounded border border-gray-300">
              <div className="font-semibold text-gray-700 mb-2">Tertiary (GPA)</div>
              <div className="space-y-1 text-gray-600">
                <div>70-100: A (5.0)</div>
                <div>60-69: B (4.0)</div>
                <div>50-59: C (3.0)</div>
                <div>45-49: D (2.0)</div>
                <div>0-39: F (0.0)</div>
              </div>
            </div>
            <div className="bg-gray-50 p-3 rounded border border-gray-300">
              <div className="font-semibold text-gray-700 mb-2">Classification</div>
              <div className="space-y-1 text-gray-600">
                <div>4.5-5.0: First Class</div>
                <div>3.5-4.49: Second Class Upper</div>
                <div>2.5-3.49: Second Class Lower</div>
                <div>1.5-2.49: Third Class</div>
                <div>1.0-1.49: Pass</div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer with Signatures */}
        <TranscriptFooter
          signatures={signatures}
          design={design}
          verificationCode={request.verificationCode || ""}
          verificationUrl={tenantConfig.verificationUrl}
        />

        {/* Document Footer */}
        <div className="mt-6 text-center text-xs text-gray-500">
          <p>This is an {request.transcriptType} transcript issued by {branding.schoolName}</p>
          <p className="mt-1">Issued on {new Date().toLocaleDateString()} • Page 1 of 1</p>
        </div>
      </div>
    </div>
  );
}
