"use client";

import { useState } from "react";
import { DisciplineIncident } from "@/types/discipline";
import DataManagementPage from "@/components/pages/DataManagementPage";
import DisciplineRecordsTable from "@/components/discipline/DisciplineRecordsTable";
import IncidentReportForm from "@/components/discipline/IncidentReportForm";
import IncidentDetailModal from "@/components/discipline/IncidentDetailModal";
import DeleteIncidentModal from "@/components/discipline/DeleteIncidentModal";
import { exportDisciplineToPDF } from "@/utils/disciplinePdfExport";
import { exportDisciplineToExcel } from "@/utils/disciplineExcelExport";
import {
  disciplineFilterFields,
  disciplineSortOptions,
  disciplineStats,
  filterDisciplineIncidents,
  sortDisciplineIncidents,
} from "./config";

// Mock data - replace with actual API call
const mockDisciplineIncidents: DisciplineIncident[] = [
  {
    id: "DI001",
    studentId: "AD9892302",
    studentName: "Aaliyah Griffin",
    studentAdmissionNumber: "AD9892302",
    studentClass: "JSS 1",
    studentSection: "A",
    profilePhoto: "https://i.pravatar.cc/150?img=1",
    incidentDate: "2025-01-08",
    incidentTime: "10:30",
    location: "Classroom 1A",
    category: "disruptive-behavior",
    severity: "minor",
    title: "Disrupting class during lesson",
    description: "Student was talking loudly during math lesson despite multiple warnings.",
    witnesses: ["Mrs. Johnson", "Class Monitor"],
    reportedBy: "teacher001",
    reportedByName: "Mrs. Johnson",
    reportedByRole: "Math Teacher",
    reportedDate: "2025-01-08T10:45:00Z",
    actionType: "verbal-warning",
    actionDetails: "Student was given a verbal warning and asked to stay quiet.",
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
    studentId: "AD9892303",
    studentName: "Benjamin Carter",
    studentAdmissionNumber: "AD9892303",
    studentClass: "JSS 2",
    studentSection: "B",
    profilePhoto: "https://i.pravatar.cc/150?img=12",
    incidentDate: "2025-01-09",
    incidentTime: "14:15",
    location: "Playground",
    category: "bullying",
    severity: "major",
    title: "Physical altercation with another student",
    description: "Student was involved in a physical fight with another student during break time. Multiple students witnessed the incident.",
    witnesses: ["Mr. Smith", "Security Guard", "3 Students"],
    reportedBy: "teacher002",
    reportedByName: "Mr. Smith",
    reportedByRole: "Physical Education Teacher",
    reportedDate: "2025-01-09T14:30:00Z",
    actionType: "suspension",
    actionDetails: "3-day suspension starting January 10. Parent conference required before return.",
    actionStartDate: "2025-01-10",
    actionEndDate: "2025-01-12",
    status: "under-review",
    followUpRequired: true,
    followUpDate: "2025-01-13",
    parentNotified: true,
    parentNotifiedDate: "2025-01-09",
    createdAt: "2025-01-09T14:30:00Z",
    updatedAt: "2025-01-09T15:00:00Z",
  },
  {
    id: "DI003",
    studentId: "AD9892304",
    studentName: "Charlotte Davis",
    studentAdmissionNumber: "AD9892304",
    studentClass: "JSS 3",
    studentSection: "A",
    profilePhoto: "https://i.pravatar.cc/150?img=5",
    incidentDate: "2025-01-07",
    incidentTime: "09:00",
    location: "Examination Hall",
    category: "academic-dishonesty",
    severity: "moderate",
    title: "Cheating during examination",
    description: "Student was caught with unauthorized notes during the mid-term examination.",
    witnesses: ["Exam Invigilator"],
    reportedBy: "teacher003",
    reportedByName: "Ms. Williams",
    reportedByRole: "Exam Coordinator",
    reportedDate: "2025-01-07T09:15:00Z",
    actionType: "detention",
    actionDetails: "After-school detention for 5 days. Exam score nullified.",
    actionStartDate: "2025-01-08",
    actionEndDate: "2025-01-14",
    status: "resolved",
    followUpRequired: false,
    parentNotified: true,
    parentNotifiedDate: "2025-01-07",
    createdAt: "2025-01-07T09:15:00Z",
    updatedAt: "2025-01-14T16:00:00Z",
    resolvedAt: "2025-01-14T16:00:00Z",
  },
  {
    id: "DI004",
    studentId: "AD9892305",
    studentName: "Daniel Evans",
    studentAdmissionNumber: "AD9892305",
    studentClass: "JSS 1",
    studentSection: "C",
    profilePhoto: "https://i.pravatar.cc/150?img=13",
    incidentDate: "2025-01-10",
    incidentTime: "11:45",
    location: "Cafeteria",
    category: "property-damage",
    severity: "moderate",
    title: "Damaged cafeteria equipment",
    description: "Student accidentally broke a cafeteria table during lunch break while roughhousing.",
    witnesses: ["Cafeteria Staff", "Multiple Students"],
    reportedBy: "staff001",
    reportedByName: "Mr. Brown",
    reportedByRole: "Cafeteria Manager",
    reportedDate: "2025-01-10T12:00:00Z",
    actionType: "parent-conference",
    actionDetails: "Parent conference scheduled. Student to assist in cafeteria cleanup for one week.",
    status: "reported",
    followUpRequired: true,
    followUpDate: "2025-01-12",
    parentNotified: true,
    parentNotifiedDate: "2025-01-10",
    createdAt: "2025-01-10T12:00:00Z",
    updatedAt: "2025-01-10T12:00:00Z",
  },
  {
    id: "DI005",
    studentId: "AD9892306",
    studentName: "Emma Foster",
    studentAdmissionNumber: "AD9892306",
    studentClass: "JSS 2",
    studentSection: "A",
    profilePhoto: "https://i.pravatar.cc/150?img=9",
    incidentDate: "2025-01-06",
    incidentTime: "13:30",
    location: "Computer Lab",
    category: "technology-misuse",
    severity: "minor",
    title: "Unauthorized internet access",
    description: "Student was accessing social media during computer class instead of working on assigned task.",
    witnesses: ["Computer Teacher"],
    reportedBy: "teacher004",
    reportedByName: "Mr. Anderson",
    reportedByRole: "Computer Science Teacher",
    reportedDate: "2025-01-06T13:45:00Z",
    actionType: "written-warning",
    actionDetails: "Written warning issued. Computer lab privileges restricted for one week.",
    status: "closed",
    followUpRequired: false,
    parentNotified: false,
    createdAt: "2025-01-06T13:45:00Z",
    updatedAt: "2025-01-06T14:00:00Z",
    resolvedAt: "2025-01-06T14:00:00Z",
  },
];

export default function DisciplinePage() {
  const [incidents, setIncidents] = useState<DisciplineIncident[]>(mockDisciplineIncidents);
  const [showReportForm, setShowReportForm] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState<DisciplineIncident | null>(null);
  const [incidentToDelete, setIncidentToDelete] = useState<DisciplineIncident | null>(null);
  const [incidentToEdit, setIncidentToEdit] = useState<DisciplineIncident | null>(null);

  const handleSubmitReport = (incident: Partial<DisciplineIncident>) => {
    if (incidentToEdit) {
      // Update existing incident
      setIncidents(incidents.map(i =>
        i.id === incidentToEdit.id
          ? { ...i, ...incident, updatedAt: new Date().toISOString() }
          : i
      ));
      setIncidentToEdit(null);
    } else {
      // Create new incident
      const newIncident: DisciplineIncident = {
        id: `DI${String(incidents.length + 1).padStart(3, "0")}`,
        ...incident,
      } as DisciplineIncident;

      setIncidents([newIncident, ...incidents]);
    }
  };

  const handleEditIncident = (incident: DisciplineIncident) => {
    setIncidentToEdit(incident);
    setShowReportForm(true);
  };

  const handleCloseReportForm = () => {
    setShowReportForm(false);
    setIncidentToEdit(null);
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

  const handleExportPDF = (items: DisciplineIncident[]) => {
    const timestamp = new Date().toISOString().split('T')[0];
    exportDisciplineToPDF(items, `discipline-records-${timestamp}.pdf`);
  };

  const handleExportExcel = (items: DisciplineIncident[]) => {
    const timestamp = new Date().toISOString().split('T')[0];
    exportDisciplineToExcel(items, `discipline-records-${timestamp}.xlsx`);
  };

  return (
    <DataManagementPage<DisciplineIncident>
      title="Discipline Management"
      breadcrumbs={[
        { label: "Dashboard", href: "/" },
        { label: "Students", href: "/students" },
        { label: "Discipline", isActive: true },
      ]}
      data={incidents}
      getRowKey={(item) => item.id}
      columns={[]} // Using customListComponent instead
      stats={disciplineStats}
      statsColumns={{ default: 2, sm: 3, md: 6 }}
      filterFields={disciplineFilterFields}
      sortOptions={disciplineSortOptions}
      defaultSort="newest"
      filterFn={filterDisciplineIncidents}
      sortFn={sortDisciplineIncidents}
      enableViewToggle={false}
      enableSelection={false}
      enableExport={true}
      onExportPDF={handleExportPDF}
      onExportExcel={handleExportExcel}
      addButtonConfig={{
        label: "Report Incident",
        onClick: () => setShowReportForm(true),
      }}
      itemLabel="incident"
      itemLabelPlural="incidents"
      showTableSearch={false}
      customListComponent={
        <DisciplineRecordsTable
          incidents={incidents}
          onViewDetails={(incident) => setSelectedIncident(incident)}
          onEdit={handleEditIncident}
          onDelete={handleDeleteIncident}
        />
      }
    >
      {/* Incident Report Form Modal */}
      <IncidentReportForm
        isOpen={showReportForm}
        onClose={handleCloseReportForm}
        onSubmit={handleSubmitReport}
        initialData={incidentToEdit}
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
    </DataManagementPage>
  );
}
