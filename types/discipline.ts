// Discipline Tracking System Types

export type IncidentSeverity = "minor" | "moderate" | "major" | "critical";
export type IncidentCategory =
  | "attendance"
  | "academic-dishonesty"
  | "disruptive-behavior"
  | "bullying"
  | "violence"
  | "property-damage"
  | "substance-abuse"
  | "dress-code"
  | "technology-misuse"
  | "other";

export type DisciplinaryActionType =
  | "verbal-warning"
  | "written-warning"
  | "detention"
  | "suspension"
  | "expulsion"
  | "community-service"
  | "counseling"
  | "parent-conference"
  | "behavior-contract"
  | "other";

export type IncidentStatus = "reported" | "under-review" | "resolved" | "appealed" | "closed";

export interface DisciplineIncident {
  id: string;
  studentId: string;
  studentName: string;
  studentAdmissionNumber: string;
  studentClass: string;
  studentSection: string;
  profilePhoto?: string;

  // Incident Details
  incidentDate: string;
  incidentTime: string;
  location: string;
  category: IncidentCategory;
  severity: IncidentSeverity;
  title: string;
  description: string;
  witnesses?: string[]; // Array of witness names or IDs

  // Reporting Information
  reportedBy: string;
  reportedByName: string;
  reportedByRole: string; // "Teacher", "Administrator", "Staff", etc.
  reportedDate: string;

  // Action Taken
  actionType?: DisciplinaryActionType;
  actionDetails?: string;
  actionStartDate?: string;
  actionEndDate?: string;
  actionCompletedDate?: string;

  // Follow-up
  status: IncidentStatus;
  followUpRequired: boolean;
  followUpDate?: string;
  followUpNotes?: string;

  // Parent Communication
  parentNotified: boolean;
  parentNotifiedDate?: string;
  parentResponse?: string;

  // Additional Information
  attachments?: string[]; // URLs or file paths
  notes?: string;
  resolutionNotes?: string;

  // Timestamps
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
}

export interface BehaviorPoint {
  id: string;
  studentId: string;
  points: number; // Positive for good behavior, negative for bad
  reason: string;
  category: "academic" | "behavior" | "attendance" | "participation" | "other";
  awardedBy: string;
  awardedByName: string;
  awardedDate: string;
  createdAt: string;
}

export interface DisciplineStatistics {
  totalIncidents: number;
  incidentsByCategory: Record<IncidentCategory, number>;
  incidentsBySeverity: Record<IncidentSeverity, number>;
  incidentsByStatus: Record<IncidentStatus, number>;
  activeActions: number;
  studentsWithIncidents: number;
  repeatOffenders: number;
  averageResolutionTime: number; // in days
}

export interface StudentDisciplineRecord {
  studentId: string;
  studentName: string;
  totalIncidents: number;
  minorIncidents: number;
  moderateIncidents: number;
  majorIncidents: number;
  criticalIncidents: number;
  activeActions: number;
  behaviorScore: number; // 0-100
  lastIncidentDate?: string;
  incidents: DisciplineIncident[];
}
