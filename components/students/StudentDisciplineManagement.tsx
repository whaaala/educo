"use client";

import { useState } from "react";
import { DisciplineIncident, IncidentCategory, IncidentSeverity, IncidentStatus } from "@/types/discipline";
import SearchFilterBar from "@/components/shared/SearchFilterBar";
import DisciplineStatisticsCards from "@/components/discipline/DisciplineStatisticsCards";
import DisciplineRecordsTable from "@/components/discipline/DisciplineRecordsTable";
import IncidentReportForm from "@/components/discipline/IncidentReportForm";
import IncidentDetailModal from "@/components/discipline/IncidentDetailModal";
import DeleteIncidentModal from "@/components/discipline/DeleteIncidentModal";
import ActionButton from "@/components/shared/ActionButton";
import ExportButton from "@/components/shared/ExportButton";
import { Plus } from "lucide-react";
import { exportDisciplineToPDF } from "@/utils/disciplinePdfExport";
import { exportDisciplineToExcel } from "@/utils/disciplineExcelExport";

// Mock discipline incidents - in real app, these would be fetched from API
const mockDisciplineIncidents: DisciplineIncident[] = [
  // Janet Daniel - AD9892434
  {
    id: "DI001",
    studentId: "AD9892434",
    studentName: "Janet Daniel",
    studentAdmissionNumber: "AD9892434",
    studentClass: "III",
    studentSection: "A",
    profilePhoto: "https://i.pravatar.cc/150?img=1",
    incidentDate: "2025-01-08",
    incidentTime: "10:30",
    location: "Classroom 3A",
    category: "disruptive-behavior",
    severity: "minor",
    title: "Talking during class",
    description: "Student was talking with classmates during English lesson despite warnings.",
    witnesses: ["Mrs. Smith", "Class Monitor"],
    reportedBy: "teacher001",
    reportedByName: "Mrs. Smith",
    reportedByRole: "English Teacher",
    reportedDate: "2025-01-08T10:45:00Z",
    actionType: "verbal-warning",
    actionDetails: "Student was given a verbal warning.",
    status: "resolved",
    followUpRequired: false,
    parentNotified: true,
    parentNotifiedDate: "2025-01-08",
    createdAt: "2025-01-08T10:45:00Z",
    updatedAt: "2025-01-08T11:00:00Z",
    resolvedAt: "2025-01-08T11:00:00Z",
  },
  {
    id: "DI002",
    studentId: "AD9892434",
    studentName: "Janet Daniel",
    studentAdmissionNumber: "AD9892434",
    studentClass: "III",
    studentSection: "A",
    profilePhoto: "https://i.pravatar.cc/150?img=1",
    incidentDate: "2024-12-15",
    incidentTime: "14:20",
    location: "Library",
    category: "dress-code",
    severity: "minor",
    title: "Dress code violation",
    description: "Student was not wearing proper uniform shoes.",
    witnesses: ["Librarian"],
    reportedBy: "teacher005",
    reportedByName: "Ms. Brown",
    reportedByRole: "Librarian",
    reportedDate: "2024-12-15T14:30:00Z",
    actionType: "written-warning",
    actionDetails: "Written warning issued. Parent notification sent.",
    status: "closed",
    followUpRequired: false,
    parentNotified: true,
    parentNotifiedDate: "2024-12-15",
    createdAt: "2024-12-15T14:30:00Z",
    updatedAt: "2024-12-15T15:00:00Z",
    resolvedAt: "2024-12-15T15:00:00Z",
  },
  // Joann Michael - AD9892433
  {
    id: "DI003",
    studentId: "AD9892433",
    studentName: "Joann Michael",
    studentAdmissionNumber: "AD9892433",
    studentClass: "IV",
    studentSection: "B",
    profilePhoto: "https://i.pravatar.cc/150?img=2",
    incidentDate: "2025-01-10",
    incidentTime: "11:15",
    location: "Playground",
    category: "bullying",
    severity: "major",
    title: "Physical altercation with peer",
    description: "Student was involved in pushing another student during break time.",
    witnesses: ["Mr. Johnson", "Security Guard", "2 Students"],
    reportedBy: "teacher002",
    reportedByName: "Mr. Johnson",
    reportedByRole: "Physical Education Teacher",
    reportedDate: "2025-01-10T11:30:00Z",
    actionType: "suspension",
    actionDetails: "2-day suspension starting January 11. Parent conference required.",
    actionStartDate: "2025-01-11",
    actionEndDate: "2025-01-12",
    status: "under-review",
    followUpRequired: true,
    followUpDate: "2025-01-13",
    parentNotified: true,
    parentNotifiedDate: "2025-01-10",
    createdAt: "2025-01-10T11:30:00Z",
    updatedAt: "2025-01-10T12:00:00Z",
  },
  {
    id: "DI004",
    studentId: "AD9892433",
    studentName: "Joann Michael",
    studentAdmissionNumber: "AD9892433",
    studentClass: "IV",
    studentSection: "B",
    profilePhoto: "https://i.pravatar.cc/150?img=2",
    incidentDate: "2024-11-20",
    incidentTime: "09:45",
    location: "Cafeteria",
    category: "disruptive-behavior",
    severity: "moderate",
    title: "Creating disturbance in cafeteria",
    description: "Student was throwing food and creating noise during lunch.",
    witnesses: ["Cafeteria Staff", "Mr. Davis"],
    reportedBy: "staff001",
    reportedByName: "Mr. Davis",
    reportedByRole: "Cafeteria Supervisor",
    reportedDate: "2024-11-20T10:00:00Z",
    actionType: "detention",
    actionDetails: "After-school detention for 3 days.",
    actionStartDate: "2024-11-21",
    actionEndDate: "2024-11-23",
    status: "resolved",
    followUpRequired: false,
    parentNotified: true,
    parentNotifiedDate: "2024-11-20",
    createdAt: "2024-11-20T10:00:00Z",
    updatedAt: "2024-11-23T16:00:00Z",
    resolvedAt: "2024-11-23T16:00:00Z",
  },
  // Kathleen Dison - AD9892432
  {
    id: "DI005",
    studentId: "AD9892432",
    studentName: "Kathleen Dison",
    studentAdmissionNumber: "AD9892432",
    studentClass: "III",
    studentSection: "A",
    profilePhoto: "https://i.pravatar.cc/150?img=3",
    incidentDate: "2025-01-05",
    incidentTime: "13:30",
    location: "Computer Lab",
    category: "technology-misuse",
    severity: "minor",
    title: "Unauthorized internet usage",
    description: "Student was browsing social media during computer class.",
    witnesses: ["Computer Teacher"],
    reportedBy: "teacher004",
    reportedByName: "Mr. Anderson",
    reportedByRole: "Computer Science Teacher",
    reportedDate: "2025-01-05T13:45:00Z",
    actionType: "written-warning",
    actionDetails: "Written warning. Computer privileges restricted for 1 week.",
    status: "resolved",
    followUpRequired: false,
    parentNotified: false,
    createdAt: "2025-01-05T13:45:00Z",
    updatedAt: "2025-01-05T14:00:00Z",
    resolvedAt: "2025-01-05T14:00:00Z",
  },
  // Ralph Claudia - AD9892430
  {
    id: "DI006",
    studentId: "AD9892430",
    studentName: "Ralph Claudia",
    studentAdmissionNumber: "AD9892430",
    studentClass: "II",
    studentSection: "B",
    profilePhoto: "https://i.pravatar.cc/150?img=5",
    incidentDate: "2024-12-10",
    incidentTime: "10:00",
    location: "Examination Hall",
    category: "academic-dishonesty",
    severity: "major",
    title: "Cheating during exam",
    description: "Student was caught with unauthorized notes during mid-term examination.",
    witnesses: ["Exam Invigilator", "Assistant Proctor"],
    reportedBy: "teacher003",
    reportedByName: "Ms. Williams",
    reportedByRole: "Exam Coordinator",
    reportedDate: "2024-12-10T10:15:00Z",
    actionType: "detention",
    actionDetails: "After-school detention for 5 days. Exam score nullified. Retake required.",
    actionStartDate: "2024-12-11",
    actionEndDate: "2024-12-17",
    status: "resolved",
    followUpRequired: false,
    parentNotified: true,
    parentNotifiedDate: "2024-12-10",
    createdAt: "2024-12-10T10:15:00Z",
    updatedAt: "2024-12-17T16:00:00Z",
    resolvedAt: "2024-12-17T16:00:00Z",
  },
  {
    id: "DI007",
    studentId: "AD9892430",
    studentName: "Ralph Claudia",
    studentAdmissionNumber: "AD9892430",
    studentClass: "II",
    studentSection: "B",
    profilePhoto: "https://i.pravatar.cc/150?img=5",
    incidentDate: "2024-10-15",
    incidentTime: "08:30",
    location: "Classroom 2B",
    category: "attendance",
    severity: "minor",
    title: "Repeated tardiness",
    description: "Student has been consistently late to morning classes for the past week.",
    witnesses: ["Homeroom Teacher"],
    reportedBy: "teacher006",
    reportedByName: "Mrs. Martinez",
    reportedByRole: "Homeroom Teacher",
    reportedDate: "2024-10-15T08:45:00Z",
    actionType: "parent-conference",
    actionDetails: "Parent conference scheduled to discuss punctuality.",
    status: "closed",
    followUpRequired: false,
    followUpDate: "2024-10-18",
    parentNotified: true,
    parentNotifiedDate: "2024-10-15",
    createdAt: "2024-10-15T08:45:00Z",
    updatedAt: "2024-10-18T14:00:00Z",
    resolvedAt: "2024-10-18T14:00:00Z",
  },
];

interface StudentDisciplineManagementProps {
  studentId: string;
  studentName: string;
  studentClass: string;
  studentSection: string;
}

export default function StudentDisciplineManagement({
  studentId,
  studentName,
  studentClass,
  studentSection,
}: StudentDisciplineManagementProps) {
  const [incidents, setIncidents] = useState<DisciplineIncident[]>(
    mockDisciplineIncidents.filter(i => i.studentId === studentId)
  );
  const [showReportForm, setShowReportForm] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState<DisciplineIncident | null>(null);
  const [incidentToEdit, setIncidentToEdit] = useState<DisciplineIncident | null>(null);
  const [incidentToDelete, setIncidentToDelete] = useState<DisciplineIncident | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState<IncidentCategory | "all">("all");
  const [filterSeverity, setFilterSeverity] = useState<IncidentSeverity | "all">("all");
  const [filterStatus, setFilterStatus] = useState<IncidentStatus | "all">("all");
  const [filterYear, setFilterYear] = useState<string>("all");

  // Filter incidents
  const filteredIncidents = incidents.filter(incident => {
    const matchesSearch = searchQuery === "" ||
      incident.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      incident.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = filterCategory === "all" || incident.category === filterCategory;
    const matchesSeverity = filterSeverity === "all" || incident.severity === filterSeverity;
    const matchesStatus = filterStatus === "all" || incident.status === filterStatus;

    const incidentYear = new Date(incident.incidentDate).getFullYear().toString();
    const matchesYear = filterYear === "all" || incidentYear === filterYear;

    return matchesSearch && matchesCategory && matchesSeverity && matchesStatus && matchesYear;
  });

  const handleSubmitReport = (incident: Partial<DisciplineIncident>) => {
    if (incidentToEdit) {
      // Edit existing incident
      setIncidents(incidents.map(i =>
        i.id === incidentToEdit.id
          ? { ...i, ...incident, updatedAt: new Date().toISOString() } as DisciplineIncident
          : i
      ));
      setIncidentToEdit(null);
    } else {
      // Create new incident
      const newIncident: DisciplineIncident = {
        id: `DI${String(incidents.length + 1).padStart(3, "0")}`,
        studentId,
        studentName,
        studentAdmissionNumber: studentId,
        studentClass,
        studentSection,
        profilePhoto: "",
        ...incident,
      } as DisciplineIncident;

      setIncidents([newIncident, ...incidents]);
    }
    setShowReportForm(false);
  };

  const handleEditIncident = (incident: DisciplineIncident) => {
    setIncidentToEdit(incident);
    setShowReportForm(true);
  };

  const handleDeleteIncident = (incidentId: string) => {
    const incident = incidents.find(i => i.id === incidentId);
    if (incident) {
      setIncidentToDelete(incident);
    }
  };

  const confirmDeleteIncident = (incidentId: string) => {
    setIncidents(incidents.filter(i => i.id !== incidentId));
  };

  const handleExportPDF = () => {
    const timestamp = new Date().toISOString().split('T')[0];
    const cleanName = studentName.replace(/\s+/g, '-');
    exportDisciplineToPDF(filteredIncidents, `${cleanName}-discipline-${timestamp}.pdf`);
  };

  const handleExportExcel = () => {
    const timestamp = new Date().toISOString().split('T')[0];
    const cleanName = studentName.replace(/\s+/g, '-');
    exportDisciplineToExcel(filteredIncidents, `${cleanName}-discipline-${timestamp}.xlsx`);
  };

  const handleCloseReportForm = () => {
    setShowReportForm(false);
    setIncidentToEdit(null);
  };

  return (
    <div className="space-y-6">
      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3 flex-wrap">
          <ActionButton
            onClick={() => setShowReportForm(true)}
            icon={<Plus className="w-full h-full" />}
            variant="primary"
          >
            Report Incident
          </ActionButton>
        </div>
        <ExportButton
          onExportPDF={handleExportPDF}
          onExportExcel={handleExportExcel}
          description="Export student discipline records"
        />
      </div>

      {/* Statistics Cards */}
      <DisciplineStatisticsCards incidents={incidents} />

      {/* Search and Filters */}
      <SearchFilterBar
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search by incident title or ID..."
        filters={[
          {
            label: "Year Filter",
            value: filterYear,
            onChange: (value) => setFilterYear(value as string),
            options: [
              { label: "All Years", value: "all" },
              { label: "2025", value: "2025" },
              { label: "2024", value: "2024" },
              { label: "2023", value: "2023" },
            ],
          },
          {
            label: "Category Filter",
            value: filterCategory,
            onChange: (value) => setFilterCategory(value as IncidentCategory | "all"),
            options: [
              { label: "All Categories", value: "all" },
              { label: "Disruptive Behavior", value: "disruptive-behavior" },
              { label: "Attendance", value: "attendance" },
              { label: "Academic Dishonesty", value: "academic-dishonesty" },
              { label: "Bullying", value: "bullying" },
              { label: "Violence", value: "violence" },
              { label: "Property Damage", value: "property-damage" },
              { label: "Substance Abuse", value: "substance-abuse" },
              { label: "Dress Code", value: "dress-code" },
              { label: "Technology Misuse", value: "technology-misuse" },
              { label: "Other", value: "other" },
            ],
          },
          {
            label: "Severity Filter",
            value: filterSeverity,
            onChange: (value) => setFilterSeverity(value as IncidentSeverity | "all"),
            options: [
              { label: "All Severities", value: "all" },
              { label: "Minor", value: "minor" },
              { label: "Moderate", value: "moderate" },
              { label: "Major", value: "major" },
              { label: "Critical", value: "critical" },
            ],
          },
          {
            label: "Status Filter",
            value: filterStatus,
            onChange: (value) => setFilterStatus(value as IncidentStatus | "all"),
            options: [
              { label: "All Status", value: "all" },
              { label: "Reported", value: "reported" },
              { label: "Under Review", value: "under-review" },
              { label: "Resolved", value: "resolved" },
              { label: "Appealed", value: "appealed" },
              { label: "Closed", value: "closed" },
            ],
          },
        ]}
      />

      {/* Discipline Records Table */}
      <DisciplineRecordsTable
        incidents={filteredIncidents}
        onViewDetails={(incident) => setSelectedIncident(incident)}
        onEdit={handleEditIncident}
        onDelete={handleDeleteIncident}
        filterKey={`${searchQuery}-${filterYear}-${filterCategory}-${filterSeverity}-${filterStatus}`}
        hideStudentColumn={true}
      />

      {/* Incident Report Form Modal */}
      <IncidentReportForm
        isOpen={showReportForm}
        onClose={handleCloseReportForm}
        onSubmit={handleSubmitReport}
        initialData={incidentToEdit}
        studentInfo={{
          studentId,
          studentName,
          studentClass,
          studentSection,
        }}
      />

      {/* Incident Detail Modal */}
      <IncidentDetailModal
        incident={selectedIncident}
        isOpen={selectedIncident !== null}
        onClose={() => setSelectedIncident(null)}
      />

      {/* Delete Incident Modal */}
      <DeleteIncidentModal
        incident={incidentToDelete}
        isOpen={incidentToDelete !== null}
        onClose={() => setIncidentToDelete(null)}
        onConfirmDelete={confirmDeleteIncident}
      />
    </div>
  );
}
