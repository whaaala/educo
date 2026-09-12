/**
 * Library Management Types
 * Types for managing books, borrowing, returns, and library members
 */

// Book status
export type BookStatus = "available" | "borrowed" | "reserved" | "lost" | "damaged" | "maintenance";

// Book condition
export type BookCondition = "new" | "good" | "fair" | "poor" | "damaged";

// Borrower type
export type BorrowerType = "student" | "staff" | "teacher";

// Loan status
export type LoanStatus = "active" | "returned" | "overdue" | "lost";

// Book category/genre
export type BookCategory =
  | "textbook"
  | "fiction"
  | "non-fiction"
  | "reference"
  | "science"
  | "mathematics"
  | "history"
  | "geography"
  | "literature"
  | "art"
  | "music"
  | "sports"
  | "religion"
  | "biography"
  | "periodical"
  | "other";

// Education level for books
export type BookEducationLevel = "Primary" | "Secondary" | "Tertiary" | "All";

// Book interface
export interface Book {
  id: string;
  isbn: string;
  title: string;
  author: string;
  publisher: string;
  publishYear: number;
  edition?: string;
  category: BookCategory;
  subject?: string;
  educationLevel: BookEducationLevel;
  description?: string;
  coverImage?: string;
  totalCopies: number;
  availableCopies: number;
  location: string; // Shelf/section location
  condition: BookCondition;
  status: BookStatus;
  language: string;
  pages?: number;
  price?: number;
  acquisitionDate: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

// Library member (student, staff, or teacher)
export interface LibraryMember {
  id: string;
  memberId: string; // Library card number
  type: BorrowerType;
  personId: string; // Reference to student/staff/teacher ID
  name: string;
  email?: string;
  phone?: string;
  class?: string; // For students
  department?: string; // For staff/teachers
  avatarUrl?: string;
  isActive: boolean;
  maxBooksAllowed: number;
  currentBooksCount: number;
  totalBorrowedCount: number;
  finesDue: number;
  memberSince: string;
  expiryDate?: string;
  createdAt: string;
  updatedAt: string;
}

// Book loan/borrowing record
export interface BookLoan {
  id: string;
  loanNumber: string;
  bookId: string;
  bookTitle: string;
  bookIsbn: string;
  memberId: string;
  memberName: string;
  memberType: BorrowerType;
  borrowDate: string;
  dueDate: string;
  returnDate?: string;
  status: LoanStatus;
  renewalCount: number;
  maxRenewals: number;
  fineAmount: number;
  finePaid: boolean;
  notes?: string;
  issuedBy: string;
  returnedTo?: string;
  createdAt: string;
  updatedAt: string;
}

// Book reservation
export interface BookReservation {
  id: string;
  bookId: string;
  bookTitle: string;
  memberId: string;
  memberName: string;
  reservationDate: string;
  expiryDate: string;
  status: "pending" | "fulfilled" | "cancelled" | "expired";
  notificationSent: boolean;
  createdAt: string;
  updatedAt: string;
}

// Library fine
export interface LibraryFine {
  id: string;
  loanId: string;
  memberId: string;
  memberName: string;
  bookTitle: string;
  fineType: "overdue" | "lost" | "damaged";
  amount: number;
  daysOverdue?: number;
  isPaid: boolean;
  paidDate?: string;
  paidAmount?: number;
  paymentMethod?: string;
  paymentReference?: string;
  waivedAmount?: number;
  waivedBy?: string;
  waivedReason?: string;
  createdAt: string;
  updatedAt: string;
}

// Library settings
export interface LibrarySettings {
  maxBooksPerStudent: number;
  maxBooksPerStaff: number;
  maxBooksPerTeacher: number;
  loanDurationDays: number;
  maxRenewals: number;
  renewalDurationDays: number;
  finePerDay: number;
  lostBookFineMultiplier: number;
  damagedBookFinePercentage: number;
  reservationExpiryDays: number;
  sendOverdueReminders: boolean;
  reminderDaysBefore: number;
}

// Library statistics
export interface LibraryStats {
  totalBooks: number;
  availableBooks: number;
  borrowedBooks: number;
  reservedBooks: number;
  totalMembers: number;
  activeLoans: number;
  overdueLoans: number;
  totalFinesCollected: number;
  pendingFines: number;
  booksAddedThisMonth: number;
  loansThisMonth: number;
  mostBorrowedBooks: { bookId: string; title: string; count: number }[];
  categoryDistribution: { category: BookCategory; count: number }[];
}

// Book search/filter options
export interface BookFilterOptions {
  search?: string;
  category?: BookCategory | "all";
  status?: BookStatus | "all";
  educationLevel?: BookEducationLevel | "all";
  author?: string;
  publisher?: string;
  language?: string;
  yearFrom?: number;
  yearTo?: number;
}

// Loan filter options
export interface LoanFilterOptions {
  search?: string;
  status?: LoanStatus | "all";
  memberType?: BorrowerType | "all";
  dateFrom?: string;
  dateTo?: string;
  isOverdue?: boolean;
}
