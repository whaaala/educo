"use client";

import { TranscriptRequest } from "@/types/transcript";
import { TenantTranscriptConfig } from "@/types/tenant";
import { mockAcademicRecords } from "@/data/mockTranscriptData";
import { getTenantConfig, getCurrentTenantId } from "@/data/mockTenantConfig";
import { formatGPA, formatPercentage, calculateAverage } from "@/utils/gradingAdapter";

interface TranscriptTemplatePrintableProps {
  request: TranscriptRequest;
  showWatermark?: boolean;
  tenantId?: string;
}

/**
 * PDF-optimized version of TranscriptTemplate
 * Uses only RGB colors (no oklch) to ensure compatibility with html2canvas
 */
export default function TranscriptTemplatePrintable({
  request,
  showWatermark = true,
  tenantId
}: TranscriptTemplatePrintableProps) {
  // Get tenant configuration
  const tenantConfig: TenantTranscriptConfig = getTenantConfig(tenantId || getCurrentTenantId());
  const { branding, design, signatures } = tenantConfig;

  // Get academic records for this student
  const academicRecords = mockAcademicRecords[request.studentId as keyof typeof mockAcademicRecords] || [];

  // Calculate overall statistics
  const allScores = academicRecords.flatMap(term => term.subjects.map(s => s.score || 0));
  const overallAverage = calculateAverage(allScores);

  // Convert hex color to RGB values
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 59, g: 130, b: 246 }; // Default blue
  };

  const primaryRgb = hexToRgb(design.primaryColor);

  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        padding: '32px',
        maxWidth: '210mm',
        margin: '0 auto',
        position: 'relative',
        fontFamily: design.fontFamily || 'system-ui, -apple-system, sans-serif',
        color: '#000000'
      }}
    >
      {/* Watermark */}
      {showWatermark && design.showWatermark && request.transcriptType === "official" && (
        <div style={{
          position: 'absolute',
          inset: '0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'none',
          opacity: 0.05,
          zIndex: 0
        }}>
          <div style={{
            fontSize: '96px',
            fontWeight: 'bold',
            transform: 'rotate(-45deg)',
            userSelect: 'none',
            color: design.primaryColor
          }}>
            {design.watermarkText || "OFFICIAL"}
          </div>
        </div>
      )}

      <div style={{ position: 'relative', zIndex: 10 }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px', borderBottom: `3px solid ${design.primaryColor}`, paddingBottom: '24px' }}>
          {/* Logo temporarily removed to prevent PDF generation errors */}
          {/* TODO: Add logo back when /logos/educo-logo.png is available */}
          <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: design.primaryColor, margin: '8px 0' }}>
            {branding.schoolName}
          </h1>
          {branding.motto && (
            <p style={{ fontSize: '14px', fontStyle: 'italic', color: '#4b5563', margin: '4px 0' }}>
              {branding.motto}
            </p>
          )}
          <p style={{ fontSize: '12px', color: '#6b7280', margin: '4px 0' }}>
            {branding.address}
          </p>
          <p style={{ fontSize: '12px', color: '#6b7280', margin: '4px 0' }}>
            Email: {branding.email} | Phone: {branding.phone} | {branding.website}
          </p>

          <div style={{ marginTop: '24px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: design.primaryColor, margin: '8px 0' }}>
              {request.transcriptType === "official" ? "OFFICIAL TRANSCRIPT" : "UNOFFICIAL TRANSCRIPT"}
            </h2>
            <p style={{ fontSize: '14px', color: '#6b7280' }}>Academic Record</p>
          </div>
        </div>

        {/* Student Information */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px', backgroundColor: '#f9fafb', padding: '24px', borderRadius: '8px' }}>
          <div>
            <h3 style={{
              fontSize: '12px',
              fontWeight: '600',
              marginBottom: '12px',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              borderBottom: `1px solid ${design.primaryColor}`,
              paddingBottom: '4px',
              color: design.secondaryColor || design.primaryColor
            }}>
              Student Information
            </h3>
            <div style={{ fontSize: '14px' }}>
              <div style={{ marginBottom: '8px' }}>
                <span style={{ fontWeight: '600', color: '#374151', width: '160px', display: 'inline-block' }}>Name:</span>
                <span style={{ color: '#111827' }}>{request.studentName}</span>
              </div>
              <div style={{ marginBottom: '8px' }}>
                <span style={{ fontWeight: '600', color: '#374151', width: '160px', display: 'inline-block' }}>Admission Number:</span>
                <span style={{ color: '#111827' }}>{request.studentAdmissionNumber}</span>
              </div>
              <div style={{ marginBottom: '8px' }}>
                <span style={{ fontWeight: '600', color: '#374151', width: '160px', display: 'inline-block' }}>Class/Level:</span>
                <span style={{ color: '#111827' }}>{request.studentClass}</span>
              </div>
              {request.graduationYear && (
                <div style={{ marginBottom: '8px' }}>
                  <span style={{ fontWeight: '600', color: '#374151', width: '160px', display: 'inline-block' }}>Graduation Year:</span>
                  <span style={{ color: '#111827' }}>{request.graduationYear}</span>
                </div>
              )}
            </div>
          </div>
          <div>
            <h3 style={{
              fontSize: '12px',
              fontWeight: '600',
              marginBottom: '12px',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              borderBottom: `1px solid ${design.primaryColor}`,
              paddingBottom: '4px',
              color: design.secondaryColor || design.primaryColor
            }}>
              Transcript Information
            </h3>
            <div style={{ fontSize: '14px' }}>
              <div style={{ marginBottom: '8px' }}>
                <span style={{ fontWeight: '600', color: '#374151', width: '160px', display: 'inline-block' }}>Transcript ID:</span>
                <span style={{ color: '#111827' }}>{request.requestNumber}</span>
              </div>
              <div style={{ marginBottom: '8px' }}>
                <span style={{ fontWeight: '600', color: '#374151', width: '160px', display: 'inline-block' }}>Issue Date:</span>
                <span style={{ color: '#111827' }}>{new Date().toLocaleDateString()}</span>
              </div>
              <div style={{ marginBottom: '8px' }}>
                <span style={{ fontWeight: '600', color: '#374151', width: '160px', display: 'inline-block' }}>Academic Period:</span>
                <span style={{ color: '#111827' }}>{request.fromYear} - {request.toYear}</span>
              </div>
              <div style={{ marginBottom: '8px' }}>
                <span style={{ fontWeight: '600', color: '#374151', width: '160px', display: 'inline-block' }}>Purpose:</span>
                <span style={{ color: '#111827', textTransform: 'capitalize' }}>{request.purpose.replace("-", " ")}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Academic Records */}
        <div style={{ marginBottom: '32px' }}>
          <h3 style={{
            fontSize: '18px',
            fontWeight: 'bold',
            color: '#111827',
            marginBottom: '16px',
            paddingBottom: '8px',
            borderBottom: `2px solid ${design.primaryColor}`
          }}>
            Academic Performance
          </h3>

          {academicRecords.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {academicRecords.map((term) => (
                <div
                  key={term.termId}
                  style={{
                    border: `1px solid ${design.primaryColor}`,
                    borderRadius: '8px',
                    overflow: 'hidden'
                  }}
                >
                  {/* Term Header */}
                  <div style={{
                    padding: '12px 16px',
                    backgroundColor: `rgba(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}, 0.08)`,
                    borderBottom: `1px solid ${design.primaryColor}`,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div>
                      <h4 style={{ fontWeight: 'bold', color: '#111827', margin: '0 0 4px 0' }}>{term.termName}</h4>
                      <p style={{ fontSize: '14px', color: '#4b5563', margin: 0 }}>{term.academicYear} • {term.level}</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      {term.termGPA && (
                        <div style={{ fontSize: '18px', fontWeight: 'bold', color: design.primaryColor }}>
                          GPA: {formatGPA(term.termGPA)}
                        </div>
                      )}
                      {term.termAverage && (
                        <div style={{ fontSize: '18px', fontWeight: 'bold', color: design.primaryColor }}>
                          Average: {term.termAverage.toFixed(1)}%
                        </div>
                      )}
                      {term.position && (
                        <div style={{ fontSize: '12px', color: '#4b5563' }}>
                          Position: {term.position}/{term.totalStudents}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Subjects Table */}
                  <table style={{ width: '100%', fontSize: '14px', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#f3f4f6', borderBottom: '1px solid #d1d5db' }}>
                        <th style={{ padding: '8px 16px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Subject</th>
                        <th style={{ padding: '8px 16px', textAlign: 'center', fontWeight: '600', color: '#374151' }}>Score</th>
                        <th style={{ padding: '8px 16px', textAlign: 'center', fontWeight: '600', color: '#374151' }}>Grade</th>
                        {term.subjects[0]?.gradePoint !== undefined && (
                          <th style={{ padding: '8px 16px', textAlign: 'center', fontWeight: '600', color: '#374151' }}>Grade Point</th>
                        )}
                        {term.subjects[0]?.creditHours !== undefined && (
                          <th style={{ padding: '8px 16px', textAlign: 'center', fontWeight: '600', color: '#374151' }}>Credit Hours</th>
                        )}
                        <th style={{ padding: '8px 16px', textAlign: 'center', fontWeight: '600', color: '#374151' }}>Remarks</th>
                      </tr>
                    </thead>
                    <tbody>
                      {term.subjects.map((subject, index) => (
                        <tr
                          key={subject.subjectId}
                          style={{ backgroundColor: index % 2 === 0 ? '#ffffff' : '#f9fafb' }}
                        >
                          <td style={{ padding: '8px 16px', color: '#111827' }}>{subject.subjectName}</td>
                          <td style={{ padding: '8px 16px', textAlign: 'center', fontWeight: '600', color: '#111827' }}>
                            {subject.score}
                          </td>
                          <td style={{ padding: '8px 16px', textAlign: 'center', fontWeight: 'bold', color: design.primaryColor }}>
                            {subject.grade}
                          </td>
                          {subject.gradePoint !== undefined && (
                            <td style={{ padding: '8px 16px', textAlign: 'center', color: '#111827' }}>
                              {subject.gradePoint.toFixed(1)}
                            </td>
                          )}
                          {subject.creditHours !== undefined && (
                            <td style={{ padding: '8px 16px', textAlign: 'center', color: '#111827' }}>
                              {subject.creditHours}
                            </td>
                          )}
                          <td style={{ padding: '8px 16px', textAlign: 'center', color: '#374151' }}>{subject.remarks}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {/* Attendance & Conduct */}
                  {request.includeAttendance && (
                    <div style={{
                      padding: '12px 16px',
                      backgroundColor: '#f9fafb',
                      borderTop: '1px solid #d1d5db',
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '16px',
                      fontSize: '14px'
                    }}>
                      <div>
                        <span style={{ fontWeight: '600', color: '#374151' }}>Attendance: </span>
                        <span style={{ color: '#111827' }}>
                          {term.attendance.daysPresent}/{term.attendance.totalDays} days ({formatPercentage(term.attendance.percentage)})
                        </span>
                      </div>
                      <div>
                        <span style={{ fontWeight: '600', color: '#374151' }}>Conduct: </span>
                        <span style={{ color: '#111827' }}>{term.conduct}</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '32px', backgroundColor: '#f9fafb', borderRadius: '8px', border: '1px solid #d1d5db' }}>
              <p style={{ color: '#6b7280' }}>No academic records available for this period.</p>
            </div>
          )}
        </div>

        {/* Overall Summary */}
        {academicRecords.length > 0 && (
          <div style={{
            marginBottom: '32px',
            border: `2px solid ${design.primaryColor}`,
            borderRadius: '8px',
            padding: '24px',
            backgroundColor: `rgba(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}, 0.06)`
          }}>
            <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#111827', marginBottom: '16px' }}>Overall Performance Summary</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', textAlign: 'center' }}>
              <div>
                <div style={{ fontSize: '32px', fontWeight: 'bold', color: design.primaryColor }}>
                  {overallAverage.toFixed(1)}%
                </div>
                <div style={{ fontSize: '14px', color: '#6b7280', marginTop: '4px' }}>Overall Average</div>
              </div>
              <div>
                <div style={{ fontSize: '32px', fontWeight: 'bold', color: design.primaryColor }}>
                  {academicRecords.length}
                </div>
                <div style={{ fontSize: '14px', color: '#6b7280', marginTop: '4px' }}>Terms Completed</div>
              </div>
              <div>
                <div style={{ fontSize: '32px', fontWeight: 'bold', color: design.primaryColor }}>
                  {academicRecords[0]?.subjects?.length || 0}
                </div>
                <div style={{ fontSize: '14px', color: '#6b7280', marginTop: '4px' }}>Subjects per Term</div>
              </div>
            </div>
          </div>
        )}

        {/* Grading Scale Legend */}
        <div style={{ marginBottom: '32px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 'bold', color: '#111827', marginBottom: '12px', textTransform: 'uppercase' }}>Grading Scale</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', fontSize: '12px' }}>
            <div style={{ backgroundColor: '#f9fafb', padding: '12px', borderRadius: '4px', border: '1px solid #d1d5db' }}>
              <div style={{ fontWeight: '600', color: '#374151', marginBottom: '8px' }}>Secondary (WAEC)</div>
              <div style={{ color: '#6b7280', lineHeight: '1.5' }}>
                <div>75-100: A1 (Excellent)</div>
                <div>70-74: B2 (Very Good)</div>
                <div>65-69: B3 (Good)</div>
                <div>60-64: C4 (Credit)</div>
                <div>0-39: F9 (Fail)</div>
              </div>
            </div>
            <div style={{ backgroundColor: '#f9fafb', padding: '12px', borderRadius: '4px', border: '1px solid #d1d5db' }}>
              <div style={{ fontWeight: '600', color: '#374151', marginBottom: '8px' }}>Tertiary (GPA)</div>
              <div style={{ color: '#6b7280', lineHeight: '1.5' }}>
                <div>70-100: A (5.0)</div>
                <div>60-69: B (4.0)</div>
                <div>50-59: C (3.0)</div>
                <div>45-49: D (2.0)</div>
                <div>0-39: F (0.0)</div>
              </div>
            </div>
            <div style={{ backgroundColor: '#f9fafb', padding: '12px', borderRadius: '4px', border: '1px solid #d1d5db' }}>
              <div style={{ fontWeight: '600', color: '#374151', marginBottom: '8px' }}>Classification</div>
              <div style={{ color: '#6b7280', lineHeight: '1.5' }}>
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
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', marginTop: '48px' }}>
            {signatures.registrar && (
              <div>
                <div style={{ borderTop: '2px solid #111827', paddingTop: '8px', marginTop: '40px' }}>
                  <p style={{ fontWeight: '600', color: '#111827', margin: '4px 0' }}>{signatures.registrar.name}</p>
                  <p style={{ fontSize: '14px', color: '#6b7280', margin: '4px 0' }}>{signatures.registrar.title}</p>
                  <p style={{ fontSize: '12px', color: '#9ca3af', margin: '4px 0' }}>
                    Date: {new Date().toLocaleDateString()}
                  </p>
                </div>
              </div>
            )}
            {signatures.principal && (
              <div>
                <div style={{ borderTop: '2px solid #111827', paddingTop: '8px', marginTop: '40px' }}>
                  <p style={{ fontWeight: '600', color: '#111827', margin: '4px 0' }}>{signatures.principal.name}</p>
                  <p style={{ fontSize: '14px', color: '#6b7280', margin: '4px 0' }}>{signatures.principal.title}</p>
                  <p style={{ fontSize: '12px', color: '#9ca3af', margin: '4px 0' }}>
                    Date: {new Date().toLocaleDateString()}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Verification Code */}
          {request.verificationCode && (
            <div style={{ marginTop: '32px', textAlign: 'center', padding: '16px', backgroundColor: '#f9fafb', borderRadius: '8px' }}>
              <p style={{ fontSize: '12px', color: '#6b7280', margin: '4px 0' }}>
                Verification Code: <span style={{ fontWeight: '600', color: '#111827' }}>{request.verificationCode}</span>
              </p>
              {tenantConfig.verificationUrl && (
                <p style={{ fontSize: '12px', color: '#6b7280', margin: '4px 0' }}>
                  Verify at: {tenantConfig.verificationUrl}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Document Footer */}
        <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '12px', color: '#9ca3af' }}>
          <p style={{ margin: '4px 0' }}>This is an {request.transcriptType} transcript issued by {branding.schoolName}</p>
          <p style={{ margin: '4px 0' }}>Issued on {new Date().toLocaleDateString()} • Page 1 of 1</p>
        </div>
      </div>
    </div>
  );
}
