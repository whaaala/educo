"use client";

import { useState, useEffect, useMemo } from "react";
import { Plus, AlertTriangle, MessageSquare } from "lucide-react";
import { DisciplinaryAction, Complaint } from "@/types/discipline";
import DataManagementPage from "@/components/pages/DataManagementPage";
import { useDiscipline } from "@/contexts/DisciplineContext";
import DisciplineStatisticsCards from "@/components/discipline/DisciplineStatisticsCards";
import ComplaintStatisticsCards from "@/components/discipline/ComplaintStatisticsCards";
import DisciplinaryActionsTable from "@/components/discipline/DisciplinaryActionsTable";
import ComplaintsTable from "@/components/discipline/ComplaintsTable";
import NewIncidentReportModal from "@/components/discipline/NewIncidentReportModal";
import ViewDisciplinaryActionModal from "@/components/discipline/ViewDisciplinaryActionModal";
import EditDisciplinaryActionModal from "@/components/discipline/EditDisciplinaryActionModal";
import ActionModal from "@/components/shared/ActionModal";
import type { FilterValues } from "@/types/components";
import {
  disciplineFilterFields,
  complaintsFilterFields,
  disciplineSortOptions,
} from "./config";

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
    incidentTime: "08:45 AM",
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
    incidentTime: "02:30 PM",
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
  {
    id: "DA003",
    staffId: "STF007",
    staffName: "Mr. David Chen",
    staffEmail: "david.chen@school.com",
    staffDepartment: "Science",
    staffPosition: "Lab Assistant",
    profilePhoto: "https://i.pravatar.cc/150?img=14",
    incidentType: "policy-violation",
    incidentDate: "2024-11-10",
    incidentTime: "11:00 AM",
    incidentLocation: "Science Laboratory",
    severity: "moderate",
    status: "under-investigation",
    incidentDescription: "Violation of laboratory safety protocols. Failed to wear protective equipment and allowed students to handle chemicals without supervision.",
    witnessNames: ["Dr. Patricia Jones", "Lab Technician"],
    reportedBy: "MGR003",
    reportedByName: "Dr. Patricia Jones",
    reportedByRole: "VP Administration",
    reportedDate: "2024-11-10",
    investigatorId: "HR001",
    investigatorName: "Ms. Okonkwo",
    investigationStartDate: "2024-11-11",
    followUpRequired: true,
    employeeAcknowledged: false,
    hrReviewed: false,
    createdAt: "2024-11-10T12:00:00Z",
    updatedAt: "2024-11-11T09:00:00Z",
  },
  {
    id: "DA004",
    staffId: "STF010",
    staffName: "Ms. Rachel Adams",
    staffEmail: "rachel.adams@school.com",
    staffDepartment: "Administration",
    staffPosition: "Office Manager",
    profilePhoto: "https://i.pravatar.cc/150?img=25",
    incidentType: "absenteeism",
    incidentDate: "2024-09-15",
    incidentTime: "N/A",
    incidentLocation: "Administrative Office",
    severity: "serious",
    status: "closed",
    incidentDescription: "Unexplained absence for 5 consecutive days without notification or valid reason.",
    reportedBy: "MGR003",
    reportedByName: "Dr. Patricia Jones",
    reportedByRole: "VP Administration",
    reportedDate: "2024-09-20",
    investigatorId: "HR001",
    investigatorName: "Ms. Okonkwo",
    investigationStartDate: "2024-09-21",
    investigationEndDate: "2024-09-25",
    investigationFindings: "Staff member had family emergency but failed to communicate. Provided documentation after investigation.",
    actionTaken: "verbal-warning",
    actionDetails: "Verbal warning issued. Staff member counseled on proper communication procedures for emergencies.",
    actionDate: "2024-09-26",
    actionBy: "HR001",
    actionByName: "Ms. Okonkwo",
    followUpRequired: false,
    employeeStatement: "I apologize for not communicating. I was dealing with a family emergency and should have informed the school.",
    employeeAcknowledged: true,
    employeeAcknowledgedDate: "2024-09-26",
    hrReviewed: true,
    hrReviewedBy: "HR001",
    hrReviewedDate: "2024-09-27",
    hrComments: "Case closed. Employee has been cooperative and remorseful.",
    createdAt: "2024-09-20T10:00:00Z",
    updatedAt: "2024-09-27T14:00:00Z",
    closedAt: "2024-09-27T14:00:00Z",
  },
  {
    id: "DA005",
    staffId: "STF015",
    staffName: "Mr. Kevin Martinez",
    staffEmail: "kevin.martinez@school.com",
    staffDepartment: "Sports",
    staffPosition: "Coach",
    profilePhoto: "https://i.pravatar.cc/150?img=33",
    incidentType: "safety-violation",
    incidentDate: "2024-11-18",
    incidentTime: "03:45 PM",
    incidentLocation: "Sports Field",
    severity: "critical",
    status: "escalated",
    incidentDescription: "Failed to conduct safety checks before sports practice. Equipment malfunction led to student injury.",
    witnessNames: ["Assistant Coach", "Medical Officer", "Student witnesses"],
    reportedBy: "MGR001",
    reportedByName: "Dr. Adeyemi",
    reportedByRole: "Principal",
    reportedDate: "2024-11-18",
    investigatorId: "HR001",
    investigatorName: "Ms. Okonkwo",
    investigationStartDate: "2024-11-19",
    investigationFindings: "Preliminary findings indicate negligence in safety protocols. Student suffered minor injury requiring medical attention.",
    followUpRequired: true,
    followUpDate: "2024-12-18",
    employeeStatement: "I take full responsibility for not conducting the equipment check. I deeply regret this oversight.",
    employeeAcknowledged: true,
    employeeAcknowledgedDate: "2024-11-19",
    hrReviewed: true,
    hrReviewedBy: "HR001",
    hrReviewedDate: "2024-11-19",
    hrComments: "Case escalated to board of directors due to student injury. Pending disciplinary committee review.",
    createdAt: "2024-11-18T16:00:00Z",
    updatedAt: "2024-11-19T15:00:00Z",
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
  const [isNewIncidentModalOpen, setIsNewIncidentModalOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState<DisciplinaryAction | null>(null);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [actionToDelete, setActionToDelete] = useState<DisciplinaryAction | null>(null);

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
    return { total };
  }, [disciplinaryActions]);

  // Calculate statistics for complaints
  const complaintStats = useMemo(() => {
    const total = complaints.length;
    return { total };
  }, [complaints]);

  const handleExportExcel = () => {
    console.log(`Export ${activeTab} to Excel clicked`);
  };

  const handleExportPDF = () => {
    console.log(`Export ${activeTab} to PDF clicked`);
  };

  const handleViewAction = (action: DisciplinaryAction) => {
    setSelectedAction(action);
    setIsViewModalOpen(true);
  };

  const handleEditAction = (action: DisciplinaryAction) => {
    setSelectedAction(action);
    setIsEditModalOpen(true);
  };

  const handleDeleteAction = (action: DisciplinaryAction) => {
    setActionToDelete(action);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (actionToDelete) {
      setDisciplinaryActions(prev => prev.filter(a => a.id !== actionToDelete.id));
      setIsDeleteModalOpen(false);
      setActionToDelete(null);
    }
  };

  // Use a union type since the page manages both disciplines and complaints
  // We pass disciplines as the data to DataManagementPage, but use customListComponent to render both
  const currentData = activeTab === "discipline" ? disciplinaryActions : [];

  // Filter function for the ActionBar filters (handles discipline tab filters via DataManagementPage)
  const filterDisciplineData = (data: DisciplinaryAction[], filters: FilterValues) => {
    return data.filter((action) => {
      const hasFilters = Object.values(filters).some(
        (values) => values && values.length > 0
      );
      if (!hasFilters) return true;

      const matchesStatus =
        !filters.status ||
        filters.status.length === 0 ||
        filters.status.includes(action.status);

      const matchesSeverity =
        !filters.severity ||
        filters.severity.length === 0 ||
        filters.severity.includes(action.severity);

      return matchesStatus && matchesSeverity;
    });
  };

  return (
    <DataManagementPage<DisciplinaryAction>
      title="Discipline & Complaints"
      breadcrumbs={[
        { label: "Dashboard", href: "/" },
        { label: "Staff", href: "/staff" },
        { label: "Discipline & Complaints", isActive: true },
      ]}
      data={disciplinaryActions}
      getRowKey={(item) => item.id}
      columns={[]}
      filterFields={activeTab === "discipline" ? disciplineFilterFields : complaintsFilterFields}
      sortOptions={disciplineSortOptions}
      filterFn={filterDisciplineData}
      addButtonConfig={{
        label: activeTab === "discipline" ? "Report Incident" : "New Complaint",
        onClick: () => {
          if (activeTab === "discipline") {
            setIsNewIncidentModalOpen(true);
          } else {
            console.log("New Complaint clicked");
          }
        },
      }}
      onExportPDF={handleExportPDF}
      onExportExcel={handleExportExcel}
      enableViewToggle={false}
      enableSelection={false}
      enablePagination={false}
      showTableSearch={false}
      itemLabel={activeTab === "discipline" ? "disciplinary action" : "complaint"}
      itemLabelPlural={activeTab === "discipline" ? "disciplinary actions" : "complaints"}
      headerContent={
        <>
          {/* Tabs */}
          <div className="mt-6 border-b border-line">
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

          {/* Statistics Cards */}
          <div className="mt-6">
            {activeTab === "discipline" ? (
              <DisciplineStatisticsCards actions={disciplinaryActions} />
            ) : (
              <ComplaintStatisticsCards complaints={complaints} />
            )}
          </div>
        </>
      }
      customListComponent={
        activeTab === "discipline" ? (
          <DisciplinaryActionsTable
            actions={filteredActions}
            onViewDetails={handleViewAction}
            onEdit={handleEditAction}
            onDelete={handleDeleteAction}
            filterKey={`${filterStatus}-${filterSeverity}-${searchQuery}`}
          />
        ) : (
          <ComplaintsTable
            complaints={filteredComplaints}
            onViewDetails={(complaint) => setSelectedComplaint(complaint)}
            filterKey={`${filterStatus}-${filterPriority}-${searchQuery}`}
          />
        )
      }
    >
      {/* New Incident Report Modal */}
      <NewIncidentReportModal
        isOpen={isNewIncidentModalOpen}
        onClose={() => setIsNewIncidentModalOpen(false)}
      />

      {/* View Disciplinary Action Modal */}
      {selectedAction && (
        <ViewDisciplinaryActionModal
          isOpen={isViewModalOpen}
          onClose={() => {
            setIsViewModalOpen(false);
            setSelectedAction(null);
          }}
          action={selectedAction}
          onEdit={() => {
            setIsViewModalOpen(false);
            setIsEditModalOpen(true);
          }}
        />
      )}

      {/* Edit Disciplinary Action Modal */}
      {selectedAction && (
        <EditDisciplinaryActionModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedAction(null);
          }}
          action={selectedAction}
        />
      )}

      {/* Delete Confirmation Modal */}
      <ActionModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setActionToDelete(null);
        }}
        title="Delete Disciplinary Action"
        subtitle={actionToDelete?.id}
        variant="danger"
        message="Are you sure you want to delete this disciplinary action? This action cannot be undone."
        details={
          actionToDelete
            ? [
                { label: "Staff", value: actionToDelete.staffName },
                { label: "Department", value: actionToDelete.staffDepartment },
                { label: "Type", value: actionToDelete.incidentType },
                { label: "Severity", value: actionToDelete.severity },
              ]
            : undefined
        }
        confirmLabel="Delete"
        cancelLabel="Cancel"
        onConfirm={confirmDelete}
      />
    </DataManagementPage>
  );
}
