"use client";

import { useState, useEffect, useMemo } from "react";
import { Download, Plus, AlertTriangle, MessageSquare } from "lucide-react";
import { DisciplinaryAction, Complaint, IncidentStatus, ComplaintStatus } from "@/types/discipline";
import MainLayout from "@/components/layout/MainLayout";
import PageHeader from "@/components/shared/PageHeader";
import PageActions from "@/components/shared/PageActions";
import SearchFilterBar from "@/components/shared/SearchFilterBar";
import { useDiscipline } from "@/contexts/DisciplineContext";
import DisciplineStatisticsCards from "@/components/discipline/DisciplineStatisticsCards";
import ComplaintStatisticsCards from "@/components/discipline/ComplaintStatisticsCards";
import DisciplinaryActionsTable from "@/components/discipline/DisciplinaryActionsTable";
import ComplaintsTable from "@/components/discipline/ComplaintsTable";
// Import will be added when needed for export functionality

// Mock data for disciplinary actions
const mockDisciplinaryActions: DisciplinaryAction[] = [
  {
    id: "DA001",
    staffId: "STF003",
    staffName: "Mr. John Doe",
    staffEmail: "john.doe@school.com",
    staffDepartment: "Mathematics",
    staffPosition: "Teacher",
    profilePhoto: "https://i.pravatar.cc/150?img=12",
    incidentType: "tardiness",
    incidentDate: "2024-11-15",
    incidentTime: "08:45",
    incidentLocation: "Main Gate",
    severity: "minor",
    status: "reported",
    incidentDescription: "Staff member arrived 45 minutes late without prior notification",
    reportedBy: "MGR001",
    reportedByName: "Dr. Adeyemi",
    reportedByRole: "Principal",
    reportedDate: "2024-11-15",
    followUpRequired: true,
    employeeAcknowledged: false,
    hrReviewed: false,
    createdAt: "2024-11-15T09:00:00Z",
    updatedAt: "2024-11-15T09:00:00Z",
  },
  {
    id: "DA002",
    staffId: "STF005",
    staffName: "Mrs. Jane Smith",
    staffEmail: "jane.smith@school.com",
    staffDepartment: "English",
    staffPosition: "Senior Teacher",
    profilePhoto: "https://i.pravatar.cc/150?img=5",
    incidentType: "misconduct",
    incidentDate: "2024-10-20",
    incidentTime: "14:30",
    incidentLocation: "Classroom 2B",
    severity: "serious",
    status: "resolved",
    incidentDescription: "Inappropriate behavior towards students reported by multiple witnesses",
    witnessNames: ["Student A", "Student B", "Mrs. Johnson"],
    reportedBy: "MGR002",
    reportedByName: "Mr. Williams",
    reportedByRole: "VP Academics",
    reportedDate: "2024-10-20",
    investigatorId: "HR001",
    investigatorName: "Ms. Okonkwo",
    investigationStartDate: "2024-10-21",
    investigationEndDate: "2024-10-28",
    investigationFindings: "Incident confirmed by witnesses. Staff member acknowledged error.",
    actionTaken: "written-warning",
    actionDetails: "Official written warning issued. Mandatory counseling required.",
    actionDate: "2024-10-29",
    actionBy: "HR001",
    actionByName: "Ms. Okonkwo",
    followUpRequired: true,
    followUpDate: "2024-12-29",
    employeeStatement: "I acknowledge my error and apologize for my behavior.",
    employeeAcknowledged: true,
    employeeAcknowledgedDate: "2024-10-30",
    hrReviewed: true,
    hrReviewedBy: "HR001",
    hrReviewedDate: "2024-10-30",
    hrComments: "Case resolved. Employee to undergo counseling.",
    createdAt: "2024-10-20T15:00:00Z",
    updatedAt: "2024-10-30T16:00:00Z",
    closedAt: "2024-10-30T16:00:00Z",
  },
];

// Mock data for complaints
const mockComplaints: Complaint[] = [
  {
    id: "CP001",
    isAnonymous: false,
    complainantId: "STF008",
    complainantName: "Mr. Ahmed Hassan",
    complainantEmail: "ahmed.hassan@school.com",
    complainantDepartment: "Science",
    complainantPosition: "Lab Technician",
    profilePhoto: "https://i.pravatar.cc/150?img=33",
    againstStaffId: "STF009",
    againstStaffName: "Mrs. Victoria Okoro",
    againstStaffPosition: "Department Head - Science",
    complaintType: "unfair-treatment",
    complaintDate: "2024-11-10",
    status: "investigating",
    priority: "medium",
    subject: "Unfair workload distribution",
    description: "I am consistently assigned more duties than my colleagues in the same role without compensation or recognition.",
    incidentDate: "2024-11-01",
    location: "Science Laboratory",
    assignedTo: "HR001",
    assignedToName: "Ms. Okonkwo",
    assignedDate: "2024-11-11",
    investigationStartDate: "2024-11-12",
    createdAt: "2024-11-10T10:30:00Z",
    updatedAt: "2024-11-12T09:00:00Z",
  },
  {
    id: "CP002",
    isAnonymous: true,
    complaintType: "workplace-harassment",
    complaintDate: "2024-11-05",
    status: "submitted",
    priority: "high",
    subject: "Hostile work environment",
    description: "There is a pattern of verbal harassment and intimidation in the administrative office.",
    incidentDate: "2024-10-28",
    location: "Administrative Block",
    witnesses: ["Anonymous colleague 1", "Anonymous colleague 2"],
    createdAt: "2024-11-05T14:20:00Z",
    updatedAt: "2024-11-05T14:20:00Z",
  },
  {
    id: "CP003",
    isAnonymous: false,
    complainantId: "STF012",
    complainantName: "Miss Sarah Afolabi",
    complainantEmail: "sarah.afolabi@school.com",
    complainantDepartment: "Sports",
    complainantPosition: "PE Teacher",
    profilePhoto: "https://i.pravatar.cc/150?img=47",
    complaintType: "safety-concerns",
    complaintDate: "2024-10-15",
    status: "resolved",
    priority: "urgent",
    subject: "Unsafe sports equipment",
    description: "Several pieces of sports equipment are damaged and pose safety risks to students.",
    incidentDate: "2024-10-10",
    location: "Sports Field",
    assignedTo: "ADMIN001",
    assignedToName: "Mr. Adeleke",
    assignedDate: "2024-10-15",
    investigationNotes: "Equipment inspection conducted. Damaged items identified and removed from service.",
    investigationStartDate: "2024-10-16",
    investigationEndDate: "2024-10-18",
    resolution: "All damaged equipment replaced. New safety inspection protocol implemented.",
    resolutionDate: "2024-10-20",
    resolvedBy: "ADMIN001",
    resolvedByName: "Mr. Adeleke",
    actionsTaken: ["Equipment replaced", "New safety protocol", "Staff training on equipment safety"],
    complainantSatisfied: true,
    complainantFeedback: "Thank you for the quick response. The new equipment is excellent.",
    createdAt: "2024-10-15T11:00:00Z",
    updatedAt: "2024-10-20T16:00:00Z",
    closedAt: "2024-10-20T16:00:00Z",
  },
];

export default function DisciplinePage() {
  const {
    disciplinaryActions: contextActions,
    complaints: contextComplaints,
    updateDisciplinaryAction,
    updateComplaint,
  } = useDiscipline();

  const [activeTab, setActiveTab] = useState<"discipline" | "complaints">("discipline");
  const [disciplinaryActions, setDisciplinaryActions] = useState<DisciplinaryAction[]>(mockDisciplinaryActions);
  const [complaints, setComplaints] = useState<Complaint[]>(mockComplaints);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterSeverity, setFilterSeverity] = useState<string>("all");
  const [filterPriority, setFilterPriority] = useState<string>("all");

  // Initialize with mock data and merge with context data
  useEffect(() => {
    const mergedActions = [
      ...contextActions,
      ...mockDisciplinaryActions.filter(
        mock => !contextActions.some(ctx => ctx.id === mock.id)
      )
    ];
    setDisciplinaryActions(prev => {
      if (contextActions.length === 0 && prev.length > 0) {
        return prev;
      }
      return mergedActions;
    });

    const mergedComplaints = [
      ...contextComplaints,
      ...mockComplaints.filter(
        mock => !contextComplaints.some(ctx => ctx.id === mock.id)
      )
    ];
    setComplaints(prev => {
      if (contextComplaints.length === 0 && prev.length > 0) {
        return prev;
      }
      return mergedComplaints;
    });
  }, [contextActions, contextComplaints]);

  // Filter disciplinary actions
  const filteredActions = useMemo(() => {
    return disciplinaryActions.filter(action => {
      const matchesStatus = filterStatus === "all" || action.status === filterStatus;
      const matchesSeverity = filterSeverity === "all" || action.severity === filterSeverity;
      const matchesSearch = searchQuery === "" ||
        action.staffName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        action.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        action.incidentType.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesStatus && matchesSeverity && matchesSearch;
    });
  }, [disciplinaryActions, filterStatus, filterSeverity, searchQuery]);

  // Filter complaints
  const filteredComplaints = useMemo(() => {
    return complaints.filter(complaint => {
      const matchesStatus = filterStatus === "all" || complaint.status === filterStatus;
      const matchesPriority = filterPriority === "all" || complaint.priority === filterPriority;
      const matchesSearch = searchQuery === "" ||
        (complaint.complainantName && complaint.complainantName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        complaint.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        complaint.subject.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesStatus && matchesPriority && matchesSearch;
    });
  }, [complaints, filterStatus, filterPriority, searchQuery]);

  // Calculate statistics for disciplinary actions
  const disciplineStats = useMemo(() => {
    const total = disciplinaryActions.length;
    const reported = disciplinaryActions.filter(a => a.status === "reported").length;
    const investigating = disciplinaryActions.filter(a => a.status === "under-investigation").length;
    const resolved = disciplinaryActions.filter(a => a.status === "resolved").length;
    const critical = disciplinaryActions.filter(a => a.severity === "critical").length;
    const serious = disciplinaryActions.filter(a => a.severity === "serious").length;

    return { total, reported, investigating, resolved, critical, serious };
  }, [disciplinaryActions]);

  // Calculate statistics for complaints
  const complaintStats = useMemo(() => {
    const total = complaints.length;
    const submitted = complaints.filter(c => c.status === "submitted").length;
    const reviewing = complaints.filter(c => c.status === "reviewing").length;
    const investigating = complaints.filter(c => c.status === "investigating").length;
    const resolved = complaints.filter(c => c.status === "resolved").length;
    const urgent = complaints.filter(c => c.priority === "urgent").length;
    const anonymous = complaints.filter(c => c.isAnonymous).length;

    return { total, submitted, reviewing, investigating, resolved, urgent, anonymous };
  }, [complaints]);

  const handleExportExcel = () => {
    // Export functionality will be added later
    console.log(`Export ${activeTab} to Excel clicked`);
  };

  const handleExportPDF = () => {
    // Export functionality will be added later
    console.log(`Export ${activeTab} to PDF clicked`);
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header with Breadcrumbs and Actions */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-4 border-b border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20">
          <PageHeader
            title="Discipline & Complaints"
            breadcrumbs={[
              { label: "Dashboard", href: "/" },
              { label: "Staff", href: "/staff" },
              { label: "Discipline & Complaints", isActive: true },
            ]}
          />
          <PageActions
            actions={[
              {
                label: activeTab === "discipline" ? "Report Incident" : "New Complaint",
                icon: Plus,
                onClick: () => console.log("New item clicked"),
                variant: "primary",
              },
            ]}
            onExportPDF={handleExportPDF}
            onExportExcel={handleExportExcel}
            exportDescription={`Download ${activeTab === "discipline" ? "disciplinary actions" : "complaints"} data`}
          />
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab("discipline")}
              className={`
                py-4 px-1 border-b-2 font-medium text-sm transition-colors
                ${activeTab === "discipline"
                  ? "border-blue-500 text-blue-600 dark:border-blue-400 dark:text-blue-400 midnight:border-cyan-400 midnight:text-cyan-400 purple:border-pink-400 purple:text-pink-400"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 midnight:text-cyan-300/70 midnight:hover:text-cyan-300 purple:text-pink-300/70 purple:hover:text-pink-300"
                }
              `}
            >
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                Disciplinary Actions
                <span className="ml-2 py-0.5 px-2 rounded-full text-xs bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400 midnight:bg-red-500/10 midnight:text-red-400 purple:bg-red-500/10 purple:text-red-400">
                  {disciplineStats.total}
                </span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab("complaints")}
              className={`
                py-4 px-1 border-b-2 font-medium text-sm transition-colors
                ${activeTab === "complaints"
                  ? "border-blue-500 text-blue-600 dark:border-blue-400 dark:text-blue-400 midnight:border-cyan-400 midnight:text-cyan-400 purple:border-pink-400 purple:text-pink-400"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 midnight:text-cyan-300/70 midnight:hover:text-cyan-300 purple:text-pink-300/70 purple:hover:text-pink-300"
                }
              `}
            >
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                Complaints
                <span className="ml-2 py-0.5 px-2 rounded-full text-xs bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400 midnight:bg-cyan-500/10 midnight:text-cyan-400 purple:bg-pink-500/10 purple:text-pink-400">
                  {complaintStats.total}
                </span>
              </div>
            </button>
          </nav>
        </div>

        {/* Statistics Cards - Disciplinary Actions */}
        {activeTab === "discipline" && (
          <DisciplineStatisticsCards actions={disciplinaryActions} />
        )}

        {/* Statistics Cards - Complaints */}
        {activeTab === "complaints" && (
          <ComplaintStatisticsCards complaints={complaints} />
        )}

        {/* Search and Filters */}
        <SearchFilterBar
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder={activeTab === "discipline"
            ? "Search by staff name, incident type, or action ID..."
            : "Search by complainant, subject, or complaint ID..."
          }
          filters={activeTab === "discipline" ? [
            {
              label: "Status Filter",
              value: filterStatus,
              onChange: (value) => setFilterStatus(value as string),
              options: [
                { label: "All Status", value: "all" },
                { label: "Reported", value: "reported" },
                { label: "Under Investigation", value: "under-investigation" },
                { label: "Resolved", value: "resolved" },
                { label: "Closed", value: "closed" },
                { label: "Escalated", value: "escalated" },
              ],
            },
            {
              label: "Severity Filter",
              value: filterSeverity,
              onChange: (value) => setFilterSeverity(value as string),
              options: [
                { label: "All Severity", value: "all" },
                { label: "Minor", value: "minor" },
                { label: "Moderate", value: "moderate" },
                { label: "Serious", value: "serious" },
                { label: "Critical", value: "critical" },
              ],
            },
          ] : [
            {
              label: "Status Filter",
              value: filterStatus,
              onChange: (value) => setFilterStatus(value as string),
              options: [
                { label: "All Status", value: "all" },
                { label: "Submitted", value: "submitted" },
                { label: "Reviewing", value: "reviewing" },
                { label: "Investigating", value: "investigating" },
                { label: "Resolved", value: "resolved" },
                { label: "Closed", value: "closed" },
                { label: "Rejected", value: "rejected" },
              ],
            },
            {
              label: "Priority Filter",
              value: filterPriority,
              onChange: (value) => setFilterPriority(value as string),
              options: [
                { label: "All Priority", value: "all" },
                { label: "Low", value: "low" },
                { label: "Medium", value: "medium" },
                { label: "High", value: "high" },
                { label: "Urgent", value: "urgent" },
              ],
            },
          ]}
        />

        {/* Tables */}
        {activeTab === "discipline" ? (
          <DisciplinaryActionsTable
            actions={filteredActions}
            onViewDetails={(action) => setSelectedAction(action)}
            filterKey={`${filterStatus}-${filterSeverity}-${searchQuery}`}
          />
        ) : (
          <ComplaintsTable
            complaints={filteredComplaints}
            onViewDetails={(complaint) => setSelectedComplaint(complaint)}
            filterKey={`${filterStatus}-${filterPriority}-${searchQuery}`}
          />
        )}
      </div>
    </MainLayout>
  );
}
