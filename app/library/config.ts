import type { FilterField, SortOption, StatCardConfig } from "@/types/components";
import type { Book, BookLoan, LibraryMember, LibraryFine } from "@/types/library";
import {
  Library,
  CheckCircle2,
  BookMarked,
  BookCopy,
  AlertCircle,
  Clock,
  Users,
  UserCheck,
  BookOpen,
  Receipt,
  Trash2,
} from "lucide-react";

// ============================================================================
// BOOK CATALOG CONFIG
// ============================================================================

export const bookFilterFields: FilterField[] = [
  {
    id: "category",
    label: "Category",
    options: [
      "Textbook",
      "Fiction",
      "Non-Fiction",
      "Reference",
      "Science",
      "Mathematics",
      "History",
      "Geography",
      "Literature",
      "Art",
      "Music",
      "Sports",
      "Religion",
      "Biography",
      "Periodical",
      "Other",
    ],
    width: "half",
  },
  {
    id: "status",
    label: "Status",
    options: ["Available", "Borrowed", "Reserved", "Lost", "Damaged", "Maintenance"],
    width: "half",
  },
  {
    id: "level",
    label: "Level",
    options: ["Primary", "Secondary", "Tertiary", "All Levels"],
    width: "half",
  },
  {
    id: "condition",
    label: "Condition",
    options: ["New", "Good", "Fair", "Poor", "Damaged"],
    width: "half",
  },
];

export const bookSortOptions: SortOption[] = [
  { id: "title_asc", label: "Title A-Z" },
  { id: "title_desc", label: "Title Z-A" },
  { id: "recently_added", label: "Recently Added" },
  { id: "most_copies", label: "Most Copies" },
  { id: "least_available", label: "Least Available" },
];

export const filterBooks = (
  data: Book[],
  filters: Record<string, string[]>
): Book[] => {
  return data.filter((book) => {
    const hasFilters = Object.values(filters).some((v) => v && v.length > 0);
    if (!hasFilters) return true;

    const matchesCategory =
      !filters.category ||
      filters.category.length === 0 ||
      filters.category.some((c) => c.toLowerCase() === book.category);

    const matchesStatus =
      !filters.status ||
      filters.status.length === 0 ||
      filters.status.some((s) => s.toLowerCase() === book.status);

    const matchesLevel =
      !filters.level ||
      filters.level.length === 0 ||
      filters.level.some((l) => {
        if (l === "All Levels") return book.educationLevel === "All";
        return l === book.educationLevel;
      });

    const matchesCondition =
      !filters.condition ||
      filters.condition.length === 0 ||
      filters.condition.some((c) => c.toLowerCase() === book.condition);

    return matchesCategory && matchesStatus && matchesLevel && matchesCondition;
  });
};

export const sortBooks = (data: Book[], sortOption: string): Book[] => {
  return [...data].sort((a, b) => {
    switch (sortOption) {
      case "title_asc":
        return a.title.localeCompare(b.title);
      case "title_desc":
        return b.title.localeCompare(a.title);
      case "recently_added":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case "most_copies":
        return b.totalCopies - a.totalCopies;
      case "least_available":
        return a.availableCopies - b.availableCopies;
      default:
        return 0;
    }
  });
};

export const searchBooks = (data: Book[], query: string): Book[] => {
  const q = query.toLowerCase();
  return data.filter(
    (book) =>
      book.title.toLowerCase().includes(q) ||
      book.author.toLowerCase().includes(q) ||
      book.isbn.toLowerCase().includes(q) ||
      (book.subject && book.subject.toLowerCase().includes(q))
  );
};

export const getBookStats = (formatCurrencyFn?: (amount: number) => string): StatCardConfig<Book>[] => [
  {
    icon: Library,
    label: "Total Books",
    getValue: (data) => data.reduce((sum, b) => sum + b.totalCopies, 0).toLocaleString(),
    color: "blue",
    getBadge: (data) => `${data.length} shown`,
  },
  {
    icon: CheckCircle2,
    label: "Available",
    getValue: (data) => data.reduce((sum, b) => sum + b.availableCopies, 0).toLocaleString(),
    color: "green",
    getBadge: (data) => {
      const total = data.reduce((sum, b) => sum + b.totalCopies, 0);
      const available = data.reduce((sum, b) => sum + b.availableCopies, 0);
      return `${total > 0 ? ((available / total) * 100).toFixed(0) : 0}%`;
    },
  },
  {
    icon: BookMarked,
    label: "Borrowed",
    getValue: (data) => {
      const total = data.reduce((sum, b) => sum + b.totalCopies, 0);
      const available = data.reduce((sum, b) => sum + b.availableCopies, 0);
      return (total - available).toLocaleString();
    },
    color: "amber",
    getBadge: (data) => {
      const total = data.reduce((sum, b) => sum + b.totalCopies, 0);
      const available = data.reduce((sum, b) => sum + b.availableCopies, 0);
      const borrowed = total - available;
      return `${total > 0 ? ((borrowed / total) * 100).toFixed(0) : 0}%`;
    },
  },
  {
    icon: BookCopy,
    label: "Unique Titles",
    getValue: (data) => data.length.toLocaleString(),
    color: "purple",
  },
];

// ============================================================================
// BORROWING CONFIG
// ============================================================================

export const borrowingFilterFields: FilterField[] = [
  {
    id: "status",
    label: "Status",
    options: ["Active", "Overdue", "Returned", "Lost"],
    width: "half",
  },
  {
    id: "memberType",
    label: "Member Type",
    options: ["Students", "Staff", "Teachers"],
    width: "half",
  },
];

export const borrowingSortOptions: SortOption[] = [
  { id: "newest", label: "Newest First" },
  { id: "oldest", label: "Oldest First" },
  { id: "due_soon", label: "Due Soonest" },
  { id: "highest_fine", label: "Highest Fine" },
];

export const filterLoans = (
  data: BookLoan[],
  filters: Record<string, string[]>
): BookLoan[] => {
  return data.filter((loan) => {
    const hasFilters = Object.values(filters).some((v) => v && v.length > 0);
    if (!hasFilters) return true;

    const matchesStatus =
      !filters.status ||
      filters.status.length === 0 ||
      filters.status.some((s) => s.toLowerCase() === loan.status);

    const matchesMemberType =
      !filters.memberType ||
      filters.memberType.length === 0 ||
      filters.memberType.some((t) => {
        const typeMap: Record<string, string> = {
          Students: "student",
          Staff: "staff",
          Teachers: "teacher",
        };
        return typeMap[t] === loan.memberType;
      });

    return matchesStatus && matchesMemberType;
  });
};

export const sortLoans = (data: BookLoan[], sortOption: string): BookLoan[] => {
  return [...data].sort((a, b) => {
    switch (sortOption) {
      case "newest":
        return new Date(b.borrowDate).getTime() - new Date(a.borrowDate).getTime();
      case "oldest":
        return new Date(a.borrowDate).getTime() - new Date(b.borrowDate).getTime();
      case "due_soon":
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      case "highest_fine":
        return b.fineAmount - a.fineAmount;
      default:
        return 0;
    }
  });
};

export const searchLoans = (data: BookLoan[], query: string): BookLoan[] => {
  const q = query.toLowerCase();
  return data.filter(
    (loan) =>
      loan.bookTitle.toLowerCase().includes(q) ||
      loan.memberName.toLowerCase().includes(q) ||
      loan.loanNumber.toLowerCase().includes(q) ||
      loan.bookIsbn.toLowerCase().includes(q)
  );
};

export const getBorrowingStats = (
  allLoans: BookLoan[],
  formatCurrency: (amount: number) => string
): StatCardConfig<BookLoan>[] => [
  {
    icon: BookMarked,
    label: "Active Loans",
    getValue: () => allLoans.filter((l) => l.status === "active").length.toString(),
    color: "blue",
    getBadge: (data) => `${data.filter((l) => l.status === "active").length} shown`,
  },
  {
    icon: AlertCircle,
    label: "Overdue",
    getValue: () => allLoans.filter((l) => l.status === "overdue").length.toString(),
    color: "red",
    getBadge: () => {
      const overdueCount = allLoans.filter((l) => l.status === "overdue").length;
      return overdueCount > 0 ? "Needs attention" : "All clear";
    },
  },
  {
    icon: CheckCircle2,
    label: "Returned",
    getValue: () => allLoans.filter((l) => l.status === "returned").length.toString(),
    color: "green",
  },
  {
    icon: Clock,
    label: "Pending Fines",
    getValue: () => {
      const totalFines = allLoans.reduce((sum, l) => sum + (l.finePaid ? 0 : l.fineAmount), 0);
      return formatCurrency(totalFines);
    },
    color: "amber",
    getBadge: () => {
      const totalFines = allLoans.reduce((sum, l) => sum + (l.finePaid ? 0 : l.fineAmount), 0);
      return totalFines > 0 ? "Outstanding" : "None";
    },
  },
];

// ============================================================================
// MEMBERS CONFIG
// ============================================================================

export const memberFilterFields: FilterField[] = [
  {
    id: "type",
    label: "Type",
    options: ["Students", "Staff", "Teachers"],
    width: "half",
  },
  {
    id: "status",
    label: "Status",
    options: ["Active", "Inactive"],
    width: "half",
  },
  {
    id: "fines",
    label: "Fines",
    options: ["With Fines", "No Fines"],
    width: "full",
  },
];

export const memberSortOptions: SortOption[] = [
  { id: "name_asc", label: "Name A-Z" },
  { id: "name_desc", label: "Name Z-A" },
  { id: "most_borrowed", label: "Most Borrowed" },
  { id: "highest_fines", label: "Highest Fines" },
  { id: "newest_member", label: "Newest Member" },
];

export const filterMembers = (
  data: LibraryMember[],
  filters: Record<string, string[]>
): LibraryMember[] => {
  return data.filter((member) => {
    const hasFilters = Object.values(filters).some((v) => v && v.length > 0);
    if (!hasFilters) return true;

    const matchesType =
      !filters.type ||
      filters.type.length === 0 ||
      filters.type.some((t) => {
        const typeMap: Record<string, string> = {
          Students: "student",
          Staff: "staff",
          Teachers: "teacher",
        };
        return typeMap[t] === member.type;
      });

    const matchesStatus =
      !filters.status ||
      filters.status.length === 0 ||
      filters.status.some((s) => {
        if (s === "Active") return member.isActive;
        if (s === "Inactive") return !member.isActive;
        return false;
      });

    const matchesFines =
      !filters.fines ||
      filters.fines.length === 0 ||
      filters.fines.some((f) => {
        if (f === "With Fines") return member.finesDue > 0;
        if (f === "No Fines") return member.finesDue === 0;
        return false;
      });

    return matchesType && matchesStatus && matchesFines;
  });
};

export const sortMembers = (data: LibraryMember[], sortOption: string): LibraryMember[] => {
  return [...data].sort((a, b) => {
    switch (sortOption) {
      case "name_asc":
        return a.name.localeCompare(b.name);
      case "name_desc":
        return b.name.localeCompare(a.name);
      case "most_borrowed":
        return b.totalBorrowedCount - a.totalBorrowedCount;
      case "highest_fines":
        return b.finesDue - a.finesDue;
      case "newest_member":
        return new Date(b.memberSince).getTime() - new Date(a.memberSince).getTime();
      default:
        return 0;
    }
  });
};

export const searchMembers = (data: LibraryMember[], query: string): LibraryMember[] => {
  const q = query.toLowerCase();
  return data.filter(
    (member) =>
      member.name.toLowerCase().includes(q) ||
      member.memberId.toLowerCase().includes(q) ||
      (member.email && member.email.toLowerCase().includes(q)) ||
      (member.class && member.class.toLowerCase().includes(q)) ||
      (member.department && member.department.toLowerCase().includes(q))
  );
};

export const getMemberStats = (
  allMembers: LibraryMember[],
  formatCurrency: (amount: number) => string
): StatCardConfig<LibraryMember>[] => [
  {
    icon: Users,
    label: "Total Members",
    getValue: () => allMembers.length.toString(),
    color: "blue",
    getBadge: (data) => `${data.length} shown`,
  },
  {
    icon: UserCheck,
    label: "Active Members",
    getValue: () => allMembers.filter((m) => m.isActive).length.toString(),
    color: "green",
    getBadge: () =>
      `${Math.round((allMembers.filter((m) => m.isActive).length / allMembers.length) * 100)}%`,
  },
  {
    icon: BookOpen,
    label: "Books Borrowed",
    getValue: () => allMembers.reduce((sum, m) => sum + m.currentBooksCount, 0).toString(),
    color: "purple",
  },
  {
    icon: AlertCircle,
    label: "Outstanding Fines",
    getValue: () => formatCurrency(allMembers.reduce((sum, m) => sum + m.finesDue, 0)),
    color: "red",
    getBadge: () => {
      const withFines = allMembers.filter((m) => m.finesDue > 0).length;
      return withFines > 0 ? `${withFines} members` : "None";
    },
  },
];

// ============================================================================
// FINES CONFIG
// ============================================================================

export const fineFilterFields: FilterField[] = [
  {
    id: "type",
    label: "Type",
    options: ["Overdue", "Lost Book", "Damaged Book"],
    width: "half",
  },
  {
    id: "status",
    label: "Status",
    options: ["Pending", "Paid", "Waived"],
    width: "half",
  },
];

export const fineSortOptions: SortOption[] = [
  { id: "newest", label: "Newest First" },
  { id: "oldest", label: "Oldest First" },
  { id: "highest_amount", label: "Highest Amount" },
  { id: "most_overdue", label: "Most Days Overdue" },
];

export const filterFines = (
  data: LibraryFine[],
  filters: Record<string, string[]>
): LibraryFine[] => {
  return data.filter((fine) => {
    const hasFilters = Object.values(filters).some((v) => v && v.length > 0);
    if (!hasFilters) return true;

    const matchesType =
      !filters.type ||
      filters.type.length === 0 ||
      filters.type.some((t) => {
        const typeMap: Record<string, string> = {
          "Overdue": "overdue",
          "Lost Book": "lost",
          "Damaged Book": "damaged",
        };
        return typeMap[t] === fine.fineType;
      });

    const matchesStatus =
      !filters.status ||
      filters.status.length === 0 ||
      filters.status.some((s) => {
        if (s === "Pending") return !fine.isPaid;
        if (s === "Paid")
          return fine.isPaid && (!fine.waivedAmount || fine.waivedAmount === 0 || (fine.paidAmount && fine.paidAmount > 0));
        if (s === "Waived")
          return fine.isPaid && fine.waivedAmount && fine.waivedAmount > 0 && (!fine.paidAmount || fine.paidAmount === 0);
        return false;
      });

    return matchesType && matchesStatus;
  });
};

export const sortFines = (data: LibraryFine[], sortOption: string): LibraryFine[] => {
  return [...data].sort((a, b) => {
    switch (sortOption) {
      case "newest":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case "oldest":
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case "highest_amount":
        return b.amount - a.amount;
      case "most_overdue":
        return (b.daysOverdue || 0) - (a.daysOverdue || 0);
      default:
        return 0;
    }
  });
};

export const searchFines = (data: LibraryFine[], query: string): LibraryFine[] => {
  const q = query.toLowerCase();
  return data.filter(
    (fine) =>
      fine.memberName.toLowerCase().includes(q) ||
      fine.bookTitle.toLowerCase().includes(q) ||
      (fine.paymentReference && fine.paymentReference.toLowerCase().includes(q)) ||
      fine.loanId.toLowerCase().includes(q)
  );
};

export const getFineStats = (
  allFines: LibraryFine[],
  formatCurrency: (amount: number) => string
): StatCardConfig<LibraryFine>[] => [
  {
    icon: Receipt,
    label: "Total Fines",
    getValue: () => allFines.length.toString(),
    color: "blue",
    getBadge: (data) => `${data.length} shown`,
  },
  {
    icon: Clock,
    label: "Pending",
    getValue: () => formatCurrency(allFines.filter((f) => !f.isPaid).reduce((sum, f) => sum + f.amount, 0)),
    color: "red",
    getBadge: () => {
      const pending = allFines.filter((f) => !f.isPaid).length;
      return pending > 0 ? `${pending} fines` : "None";
    },
  },
  {
    icon: CheckCircle2,
    label: "Collected",
    getValue: () =>
      formatCurrency(allFines.filter((f) => f.isPaid).reduce((sum, f) => sum + (f.paidAmount || 0), 0)),
    color: "green",
  },
  {
    icon: Trash2,
    label: "Waived",
    getValue: () => formatCurrency(allFines.reduce((sum, f) => sum + (f.waivedAmount || 0), 0)),
    color: "purple",
  },
];
