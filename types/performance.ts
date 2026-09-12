// Performance Review Types

export type ReviewPeriod = "quarterly" | "half-yearly" | "annual" | "probation";
export type ReviewStatus = "scheduled" | "in-progress" | "completed" | "overdue";
export type OverallRating = "outstanding" | "exceeds-expectations" | "meets-expectations" | "needs-improvement" | "unsatisfactory";

export interface PerformanceCriteria {
  id: string;
  category: string;
  criterion: string;
  rating: number; // 1-5 scale
  comments?: string;
}

export interface PerformanceGoal {
  id: string;
  goal: string;
  targetDate: string;
  status: "not-started" | "in-progress" | "completed" | "delayed";
  completionPercentage: number;
  comments?: string;
}

export interface PerformanceReview {
  id: string;
  staffId: string;
  staffName: string;
  staffEmail: string;
  staffDepartment: string;
  staffPosition: string;
  profilePhoto?: string;

  // Review Details
  reviewPeriod: ReviewPeriod;
  reviewYear: string;
  reviewQuarter?: string; // Q1, Q2, Q3, Q4
  reviewDate: string;
  reviewDueDate: string;
  status: ReviewStatus;

  // Reviewer Information
  reviewerId: string;
  reviewerName: string;
  reviewerPosition: string;

  // Performance Ratings
  criteria: PerformanceCriteria[];
  overallRating: OverallRating;
  averageScore: number; // Calculated from criteria ratings

  // Goals and Objectives
  previousGoals?: PerformanceGoal[];
  newGoals?: PerformanceGoal[];

  // Feedback
  strengths: string;
  areasForImprovement: string;
  reviewerComments: string;
  employeeComments?: string;

  // Signatures and Approval
  reviewerSignedDate?: string;
  employeeAcknowledgedDate?: string;
  hrApprovedDate?: string;
  hrApprovedBy?: string;

  // Metadata
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

export interface CreatePerformanceReview {
  staffId: string;
  reviewPeriod: ReviewPeriod;
  reviewYear: string;
  reviewQuarter?: string;
  reviewDueDate: string;
  reviewerId: string;
  reviewerName: string;
  reviewerPosition: string;
}

export interface PerformanceStatistics {
  totalReviews: number;
  scheduled: number;
  inProgress: number;
  completed: number;
  overdue: number;
  averageRating: number;
  outstandingPerformers: number;
}

// Rating categories
export const PERFORMANCE_CATEGORIES = [
  {
    id: "job-knowledge",
    name: "Job Knowledge & Skills",
    criteria: [
      "Technical knowledge and expertise",
      "Understanding of job responsibilities",
      "Quality of work output",
      "Problem-solving abilities",
    ],
  },
  {
    id: "productivity",
    name: "Productivity & Efficiency",
    criteria: [
      "Ability to meet deadlines",
      "Time management",
      "Work volume and output",
      "Resource utilization",
    ],
  },
  {
    id: "communication",
    name: "Communication",
    criteria: [
      "Verbal communication skills",
      "Written communication skills",
      "Listening and comprehension",
      "Presentation skills",
    ],
  },
  {
    id: "teamwork",
    name: "Teamwork & Collaboration",
    criteria: [
      "Cooperation with colleagues",
      "Contribution to team goals",
      "Conflict resolution",
      "Support for team members",
    ],
  },
  {
    id: "initiative",
    name: "Initiative & Innovation",
    criteria: [
      "Proactive approach to work",
      "Creative problem-solving",
      "Willingness to take on new challenges",
      "Continuous improvement mindset",
    ],
  },
  {
    id: "professionalism",
    name: "Professionalism",
    criteria: [
      "Attendance and punctuality",
      "Professional conduct",
      "Adherence to policies",
      "Ethical behavior",
    ],
  },
];

export const RATING_SCALE = [
  { value: 5, label: "Outstanding", description: "Consistently exceeds all expectations" },
  { value: 4, label: "Exceeds Expectations", description: "Frequently exceeds expectations" },
  { value: 3, label: "Meets Expectations", description: "Consistently meets all expectations" },
  { value: 2, label: "Needs Improvement", description: "Sometimes meets expectations" },
  { value: 1, label: "Unsatisfactory", description: "Rarely meets expectations" },
];
