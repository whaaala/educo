// Discipline and Complaints Types

// Student discipline incident types (for student discipline page)
export type IncidentCategory =
  | "academic"
  | "behavioral"
  | "attendance"
  | "substance"
  | "bullying"
  | "property"
  | "safety"
  | "disruptive-behavior"
  | "academic-dishonesty"
  | "property-damage"
  | "technology-misuse"
  | "dress-code"
  | "other";

export type IncidentSeverity = "minor" | "moderate" | "major" | "serious" | "critical";
export type IncidentStatus = "reported" | "under-review" | "investigating" | "resolved" | "appealed" | "closed";

export interface DisciplineIncident {
  id: string;
  studentId: string;
  studentName: string;
  studentAdmissionNumber?: string;
  studentClass: string;
  studentSection?: string;
  studentAvatar?: string;
  profilePhoto?: string;
  category: IncidentCategory;
  title: string;
  description: string;
  incidentDate: string;
  incidentTime?: string;
  location?: string;
  severity: IncidentSeverity;
  status: IncidentStatus;
  reportedBy: string;
  reportedByName: string;
  reportedByRole?: string;
  reportedDate?: string;
  witnesses?: string[];
  actionType?: string;
  actionTaken?: string;
  actionDetails?: string;
  actionDate?: string;
  actionStartDate?: string;
  actionEndDate?: string;
  parentNotified: boolean;
  parentNotifiedDate?: string;
  followUpRequired?: boolean;
  followUpDate?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
}

// Staff discipline incident types (existing)
export type IncidentType =
  | "misconduct"
  | "insubordination"
  | "absenteeism"
  | "tardiness"
  | "policy-violation"
  | "safety-violation"
  | "harassment"
  | "theft"
  | "fraud"
  | "other";

// Staff-specific incident severity (used by DisciplinaryAction)
export type StaffIncidentSeverity = "minor" | "moderate" | "serious" | "critical";
// Staff-specific incident status (used by DisciplinaryAction)
export type StaffIncidentStatus = "reported" | "under-investigation" | "resolved" | "closed" | "escalated";
export type ActionTaken =
  | "verbal-warning"
  | "written-warning"
  | "final-warning"
  | "suspension"
  | "demotion"
  | "termination"
  | "counseling"
  | "training"
  | "no-action"
  | "other";

export type ComplaintType =
  | "workplace-harassment"
  | "discrimination"
  | "unfair-treatment"
  | "working-conditions"
  | "safety-concerns"
  | "grievance"
  | "suggestion"
  | "other";

export type ComplaintStatus = "submitted" | "reviewing" | "investigating" | "resolved" | "closed" | "rejected";

export interface DisciplinaryAction {
  id: string;
  staffId: string;
  staffName: string;
  staffEmail: string;
  staffDepartment: string;
  staffPosition: string;
  profilePhoto?: string;

  // Incident Details
  incidentType: IncidentType;
  incidentDate: string;
  incidentTime?: string;
  incidentLocation: string;
  severity: StaffIncidentSeverity;
  status: StaffIncidentStatus;

  // Description
  incidentDescription: string;
  witnessNames?: string[];
  evidenceAttachments?: string[];

  // Reporter Information
  reportedBy: string;
  reportedByName: string;
  reportedByRole: string;
  reportedDate: string;

  // Investigation
  investigatorId?: string;
  investigatorName?: string;
  investigationStartDate?: string;
  investigationEndDate?: string;
  investigationFindings?: string;

  // Action
  actionTaken?: ActionTaken;
  actionDetails?: string;
  actionDate?: string;
  actionBy?: string;
  actionByName?: string;

  // Follow-up
  followUpRequired: boolean;
  followUpDate?: string;
  followUpNotes?: string;

  // Employee Response
  employeeStatement?: string;
  employeeAcknowledged: boolean;
  employeeAcknowledgedDate?: string;

  // HR Review
  hrReviewed: boolean;
  hrReviewedBy?: string;
  hrReviewedDate?: string;
  hrComments?: string;

  // Metadata
  createdAt: string;
  updatedAt: string;
  closedAt?: string;
}

export interface Complaint {
  id: string;
  profilePhoto?: string;

  // Complainant Information (can be anonymous)
  isAnonymous: boolean;
  complainantId?: string;
  complainantName?: string;
  complainantEmail?: string;
  complainantDepartment?: string;
  complainantPosition?: string;

  // Against (if applicable)
  againstStaffId?: string;
  againstStaffName?: string;
  againstStaffPosition?: string;

  // Complaint Details
  complaintType: ComplaintType;
  complaintDate: string;
  status: ComplaintStatus;
  priority: "low" | "medium" | "high" | "urgent";

  // Description
  subject: string;
  description: string;
  incidentDate?: string;
  location?: string;
  witnesses?: string[];
  evidenceAttachments?: string[];

  // Assignment
  assignedTo?: string;
  assignedToName?: string;
  assignedDate?: string;

  // Investigation
  investigationNotes?: string;
  investigationStartDate?: string;
  investigationEndDate?: string;

  // Resolution
  resolution?: string;
  resolutionDate?: string;
  resolvedBy?: string;
  resolvedByName?: string;
  actionsTaken?: string[];

  // Feedback
  complainantSatisfied?: boolean;
  complainantFeedback?: string;

  // Metadata
  createdAt: string;
  updatedAt: string;
  closedAt?: string;
}

export interface CreateDisciplinaryAction {
  staffId: string;
  incidentType: IncidentType;
  incidentDate: string;
  incidentTime?: string;
  incidentLocation: string;
  severity: StaffIncidentSeverity;
  incidentDescription: string;
  witnessNames?: string[];
  reportedBy: string;
  reportedByName: string;
  reportedByRole: string;
}

export interface CreateComplaint {
  isAnonymous: boolean;
  complainantId?: string;
  complainantName?: string;
  complainantEmail?: string;
  againstStaffId?: string;
  againstStaffName?: string;
  complaintType: ComplaintType;
  priority: "low" | "medium" | "high" | "urgent";
  subject: string;
  description: string;
  incidentDate?: string;
  location?: string;
  witnesses?: string[];
}

export const INCIDENT_TYPES = [
  { value: "misconduct", label: "Misconduct" },
  { value: "insubordination", label: "Insubordination" },
  { value: "absenteeism", label: "Absenteeism" },
  { value: "tardiness", label: "Tardiness" },
  { value: "policy-violation", label: "Policy Violation" },
  { value: "safety-violation", label: "Safety Violation" },
  { value: "harassment", label: "Harassment" },
  { value: "theft", label: "Theft" },
  { value: "fraud", label: "Fraud" },
  { value: "other", label: "Other" },
];

export const COMPLAINT_TYPES = [
  { value: "workplace-harassment", label: "Workplace Harassment" },
  { value: "discrimination", label: "Discrimination" },
  { value: "unfair-treatment", label: "Unfair Treatment" },
  { value: "working-conditions", label: "Working Conditions" },
  { value: "safety-concerns", label: "Safety Concerns" },
  { value: "grievance", label: "Grievance" },
  { value: "suggestion", label: "Suggestion" },
  { value: "other", label: "Other" },
];

export const ACTION_TYPES = [
  { value: "verbal-warning", label: "Verbal Warning" },
  { value: "written-warning", label: "Written Warning" },
  { value: "final-warning", label: "Final Warning" },
  { value: "suspension", label: "Suspension" },
  { value: "demotion", label: "Demotion" },
  { value: "termination", label: "Termination" },
  { value: "counseling", label: "Counseling" },
  { value: "training", label: "Training" },
  { value: "no-action", label: "No Action Required" },
  { value: "other", label: "Other" },
];
