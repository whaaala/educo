"use client";

import { useState } from "react";
import { Plus, Download, RefreshCw, FileText } from "lucide-react";
import { DisciplineIncident, IncidentCategory, IncidentSeverity, IncidentStatus } from "@/types/discipline";
import MainLayout from "@/components/layout/MainLayout";
import PageHeader from "@/components/shared/PageHeader";
import PageActions from "@/components/shared/PageActions";
import SearchFilterBar from "@/components/shared/SearchFilterBar";
import DisciplineStatisticsCards from "@/components/discipline/DisciplineStatisticsCards";
import DisciplineRecordsTable from "@/components/discipline/DisciplineRecordsTable";
import IncidentReportForm from "@/components/discipline/IncidentReportForm";

// Mock data - replace with actual API call
const mockDisciplineIncidents: DisciplineIncident[] = [
  {
    id: "DI001",
    studentId: "AD9892302",
    studentName: "Aaliyah Griffin",
    studentAdmissionNumber: "AD9892302",
    studentClass: "JSS 1",
    studentSection: "A",
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
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState<IncidentCategory | "all">("all");
  const [filterSeverity, setFilterSeverity] = useState<IncidentSeverity | "all">("all");
  const [filterStatus, setFilterStatus] = useState<IncidentStatus | "all">("all");

  // Filter incidents
  const filteredIncidents = incidents.filter(incident => {
    const matchesSearch = searchQuery === "" ||
      incident.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      incident.studentAdmissionNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      incident.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      incident.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = filterCategory === "all" || incident.category === filterCategory;
    const matchesSeverity = filterSeverity === "all" || incident.severity === filterSeverity;
    const matchesStatus = filterStatus === "all" || incident.status === filterStatus;

    return matchesSearch && matchesCategory && matchesSeverity && matchesStatus;
  });

  const handleSubmitReport = (incident: Partial<DisciplineIncident>) => {
    const newIncident: DisciplineIncident = {
      id: `DI${String(incidents.length + 1).padStart(3, "0")}`,
      ...incident,
    } as DisciplineIncident;

    setIncidents([newIncident, ...incidents]);
  };

  const handleDeleteIncident = (incidentId: string) => {
    if (confirm("Are you sure you want to delete this incident record?")) {
      setIncidents(incidents.filter(i => i.id !== incidentId));
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header with Breadcrumbs and Actions */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-4 border-b border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20">
          <PageHeader
            title="Discipline Management"
            breadcrumbs={[
              { label: "Dashboard", href: "/" },
              { label: "Students", href: "/students" },
              { label: "Discipline", isActive: true },
            ]}
          />
          <PageActions
            onRefresh={() => window.location.reload()}
            onAdd={() => setShowReportForm(true)}
            onExportPDF={() => console.log("Export PDF clicked")}
            onExportExcel={() => console.log("Export Excel clicked")}
            addButtonLabel="Report Incident"
            exportDescription="Export discipline records"
            showPrint={false}
          />
        </div>

        {/* Statistics Cards */}
        <DisciplineStatisticsCards incidents={incidents} />

        {/* Search and Filters */}
        <SearchFilterBar
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="Search by student name, admission number, or incident title..."
          filters={[
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
          onDelete={handleDeleteIncident}
        />

        {/* Incident Report Form Modal */}
        <IncidentReportForm
          isOpen={showReportForm}
          onClose={() => setShowReportForm(false)}
          onSubmit={handleSubmitReport}
        />

        {/* TODO: Add Incident Detail Modal for viewing full incident details */}
      </div>
    </MainLayout>
  );
}
