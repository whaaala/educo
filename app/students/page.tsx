"use client";

import { useState, useCallback, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import StudentCard, { Student } from "@/components/students/StudentCard";
import StudentTable from "@/components/students/StudentTable";
import BulkDeleteModal, { BulkDeleteItem } from "@/components/shared/BulkDeleteModal";
import BulkTransferModal, { BulkTransferStudent, BulkTransferFormData } from "@/components/shared/BulkTransferModal";
import DataManagementPage from "@/components/pages/DataManagementPage";
import { useTransfers } from "@/contexts/TransferContext";
import { useAcademicYear } from "@/contexts/AcademicYearContext";
import { filterStudentsByAcademicYear } from "@/utils/academicYear";
import { exportStudentsToPDF } from "@/utils/pdfExport";
import { exportStudentsToExcel } from "@/utils/excelExport";
import { getAllStudents } from "@/lib/mockStudents";
import { useFeatureFlags } from "@/hooks/useFeatureFlags";
import { useSchoolSettings } from "@/contexts/SchoolSettingsContext";
import { useUser } from "@/contexts/UserContext";
import { Trash2, ArrowRightLeft } from "lucide-react";
import type { GridCardProps, DateRange } from "@/types/components";
import {
  studentSortOptions,
  sortStudents,
  filterStudents,
  getStudentFilterFields,
  getRandomColor,
} from "./config";

// Grid card wrapper - adapts StudentCard to GridCardProps interface
function StudentGridCard({ item, isSelected, onSelectionChange }: GridCardProps<Student>) {
  // Derive a consistent colorIndex from student ID
  const colorIndex = item.id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);

  return (
    <StudentCard
      student={item}
      colorIndex={colorIndex}
      isSelected={isSelected}
      onSelectionChange={(id, selected) => onSelectionChange(selected)}
    />
  );
}

export default function AllStudentsPage() {
  const { selectedYear } = useAcademicYear();
  const featureFlags = useFeatureFlags();
  const { settings } = useSchoolSettings();
  const { isSuperAdmin } = useUser();
  const { addTransferRequest } = useTransfers();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [students] = useState<Student[]>(getAllStudents());
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [dateRange, setDateRange] = useState<DateRange | null>(null);

  // Track viewMode from URL for print function
  const urlView = searchParams.get("view");
  const viewMode = urlView === "list" ? "list" : "grid";

  // Bulk delete modal state
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);
  const [itemsToDelete, setItemsToDelete] = useState<BulkDeleteItem[]>([]);

  // Bulk transfer modal state
  const [isBulkTransferModalOpen, setIsBulkTransferModalOpen] = useState(false);
  const [studentsToTransfer, setStudentsToTransfer] = useState<BulkTransferStudent[]>([]);

  // Multi-level support check
  const supportsMultipleLevels = settings.supportsMultipleLevels && settings.supportedLevels.length > 1;

  // Dynamic filter fields
  const filterFields = useMemo(
    () =>
      getStudentFilterFields({
        canUseBranchHierarchy: featureFlags.canUseBranchHierarchy,
        supportsMultipleLevels,
        isSuperAdmin,
        supportedLevels: settings.supportedLevels,
      }),
    [featureFlags.canUseBranchHierarchy, supportsMultipleLevels, isSuperAdmin, settings.supportedLevels]
  );

  // Pre-filter by academic year
  const academicYearFilteredStudents = useMemo(
    () => filterStudentsByAcademicYear(students, selectedYear),
    [students, selectedYear]
  );

  // Filter function closure over dateRange (re-creates when dateRange changes)
  const filterFn = useCallback(
    (data: Student[], filters: Record<string, string[]>) => filterStudents(data, filters, dateRange),
    [dateRange]
  );

  // Sort function
  const sortFn = useCallback(
    (data: Student[], sortOption: string) => sortStudents(data, sortOption),
    []
  );

  // Handle date range change from DataManagementPage
  const handleDateRangeChange = useCallback((range: DateRange) => {
    setDateRange(range);
  }, []);

  // Handle add student
  const handleAddStudent = useCallback(() => {
    if (!featureFlags.canManageProfile) {
      alert(`Student profile management is not enabled for ${settings.institutionType} institutions in ${settings.region}`);
      return;
    }
    router.push("/students/add");
  }, [featureFlags.canManageProfile, settings.institutionType, settings.region, router]);

  // ============ Bulk Delete Handlers ============

  const handleBulkDelete = useCallback(
    (ids: Set<string>) => {
      const selectedStudents = academicYearFilteredStudents.filter((s) => ids.has(s.id));
      const items: BulkDeleteItem[] = selectedStudents.map((student) => ({
        id: student.id,
        name: student.name,
        subtitle: student.id,
        avatarColor: student.avatar ? undefined : getRandomColor(student.name),
        avatar: student.avatar,
      }));
      setItemsToDelete(items);
      setIsBulkDeleteModalOpen(true);
    },
    [academicYearFilteredStudents]
  );

  const handleRemoveFromDeleteList = useCallback((itemId: string) => {
    setItemsToDelete((prev) => prev.filter((item) => item.id !== itemId));
    setSelectedIds((prev) => {
      const newIds = new Set(prev);
      newIds.delete(itemId);
      return newIds;
    });
  }, []);

  const handleConfirmBulkDelete = useCallback((itemIds: string[]) => {
    console.log("Deleting students:", itemIds);
    setSelectedIds(new Set());
    setIsBulkDeleteModalOpen(false);
    setItemsToDelete([]);
  }, []);

  const handleRestoreItem = useCallback((item: BulkDeleteItem) => {
    setItemsToDelete((prev) => [...prev, item]);
    setSelectedIds((prev) => {
      const newIds = new Set(prev);
      newIds.add(item.id);
      return newIds;
    });
  }, []);

  const handleRestoreAll = useCallback((items: BulkDeleteItem[]) => {
    setItemsToDelete((prev) => [...prev, ...items]);
    setSelectedIds((prev) => {
      const newIds = new Set(prev);
      items.forEach((item) => newIds.add(item.id));
      return newIds;
    });
  }, []);

  // ============ Bulk Transfer Handlers ============

  const handleBulkTransfer = useCallback(
    (ids: Set<string>) => {
      const selectedStudents = academicYearFilteredStudents.filter((s) => ids.has(s.id));
      const transferStudents: BulkTransferStudent[] = selectedStudents.map((student) => {
        const [classNum, section] = student.class.split(", ");
        return {
          id: student.id,
          name: student.name,
          admissionNumber: student.id,
          class: classNum || student.class,
          section: section || "A",
          avatar: student.avatar,
        };
      });
      setStudentsToTransfer(transferStudents);
      setIsBulkTransferModalOpen(true);
    },
    [academicYearFilteredStudents]
  );

  const handleRemoveFromTransferList = useCallback((studentId: string) => {
    setStudentsToTransfer((prev) => prev.filter((s) => s.id !== studentId));
    setSelectedIds((prev) => {
      const newIds = new Set(prev);
      newIds.delete(studentId);
      return newIds;
    });
  }, []);

  const handleConfirmBulkTransfer = useCallback(
    (transferStudents: BulkTransferStudent[], transferData: BulkTransferFormData) => {
      transferStudents.forEach((student) => {
        addTransferRequest(
          {
            studentId: student.id,
            studentName: student.name,
            studentAdmissionNumber: student.admissionNumber,
            studentClass: student.class,
            studentSection: student.section,
          },
          {
            transferType: transferData.transferType,
            destinationClass: transferData.destinationClass,
            destinationSection: transferData.destinationSection,
            destinationSchoolName: transferData.destinationSchoolName,
            destinationSchoolAddress: transferData.destinationSchoolAddress,
            reason: transferData.reason,
            effectiveDate: transferData.effectiveDate,
            notes: transferData.notes,
          }
        );
      });
      setSelectedIds(new Set());
      setIsBulkTransferModalOpen(false);
      setStudentsToTransfer([]);
    },
    [addTransferRequest]
  );

  const handleRestoreTransferStudent = useCallback((student: BulkTransferStudent) => {
    setStudentsToTransfer((prev) => [...prev, student]);
    setSelectedIds((prev) => {
      const newIds = new Set(prev);
      newIds.add(student.id);
      return newIds;
    });
  }, []);

  const handleRestoreAllTransferStudents = useCallback((transferStudents: BulkTransferStudent[]) => {
    setStudentsToTransfer((prev) => [...prev, ...transferStudents]);
    setSelectedIds((prev) => {
      const newIds = new Set(prev);
      transferStudents.forEach((s) => newIds.add(s.id));
      return newIds;
    });
  }, []);

  // ============ Export Handlers ============

  const handleExportPDF = useCallback(
    (items: Student[]) => {
      if (!featureFlags.canExportReports) {
        alert(`Report export is not enabled for ${settings.institutionType} institutions`);
        return;
      }
      const now = new Date();
      const dateStr = now
        .toLocaleDateString("en-US", { year: "numeric", month: "2-digit", day: "2-digit" })
        .replace(/\//g, "-");
      exportStudentsToPDF(items, `students_${dateStr}.pdf`);
    },
    [featureFlags.canExportReports, settings.institutionType]
  );

  const handleExportExcel = useCallback(
    (items: Student[]) => {
      if (!featureFlags.canExportReports) {
        alert(`Report export is not enabled for ${settings.institutionType} institutions`);
        return;
      }
      const now = new Date();
      const dateStr = now
        .toLocaleDateString("en-US", { year: "numeric", month: "2-digit", day: "2-digit" })
        .replace(/\//g, "-");
      exportStudentsToExcel(items, `students_${dateStr}.xlsx`);
    },
    [featureFlags.canExportReports, settings.institutionType]
  );

  // ============ Print Handler ============

  const handlePrint = useCallback(
    async (studentsData: Student[]) => {
      const getBase64Image = async (url: string): Promise<string> => {
        try {
          const response = await fetch(url);
          const blob = await response.blob();
          return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
          });
        } catch (error) {
          console.error("Error loading image:", error);
          return "";
        }
      };

      const studentsWithBase64Avatars = await Promise.all(
        studentsData.map(async (student) => {
          if (student.avatar) {
            const base64 = await getBase64Image(student.avatar);
            return { ...student, avatar: base64 || student.avatar };
          }
          return student;
        })
      );

      const printWindow = window.open("", "_blank");
      if (!printWindow) return;

      const now = new Date();
      const dateStr = now.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
      const timeStr = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
      const studentsToPrint = studentsWithBase64Avatars;

      let htmlContent = `
        <!DOCTYPE html>
        <html>
          <head>
            <title>Student Records - ${dateStr}</title>
            <style>
              * { margin: 0; padding: 0; box-sizing: border-box; }
              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 20px; color: #1f2937; }
              .header { text-align: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 2px solid #3b82f6; }
              .header h1 { font-size: 28px; color: #1f2937; margin-bottom: 8px; }
              .header .subtitle { font-size: 14px; color: #6b7280; margin-bottom: 4px; }
              .meta-info { display: flex; justify-content: space-between; margin-bottom: 20px; font-size: 12px; color: #6b7280; }
              ${
                viewMode === "grid"
                  ? `
                .grid-container { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 20px; }
                .student-card { border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px; break-inside: avoid; }
                .student-header { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; }
                .student-avatar { width: 40px; height: 40px; border-radius: 50%; background: linear-gradient(135deg, #3b82f6, #2563eb); color: white; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 16px; object-fit: cover; }
                .student-avatar img { width: 100%; height: 100%; border-radius: 50%; object-fit: cover; }
                .student-name { font-weight: 600; font-size: 14px; color: #1f2937; }
                .student-id { font-size: 11px; color: #3b82f6; }
                .student-info { display: grid; gap: 8px; font-size: 12px; }
                .info-row { display: flex; justify-content: space-between; }
                .info-label { color: #6b7280; font-weight: 500; }
                .info-value { color: #1f2937; }
                .status { display: inline-block; padding: 2px 8px; border-radius: 12px; font-size: 11px; font-weight: 600; }
                .status-active { background-color: #dcfce7; color: #166534; }
                .status-inactive { background-color: #fee2e2; color: #991b1b; }
              `
                  : `
                table { width: 100%; border-collapse: collapse; font-size: 11px; }
                thead { background-color: #f3f4f6; }
                th { padding: 12px 8px; text-align: left; font-weight: 600; color: #374151; border-bottom: 2px solid #d1d5db; }
                td { padding: 10px 8px; border-bottom: 1px solid #e5e7eb; }
                tbody tr:hover { background-color: #f9fafb; }
                .student-name-cell { display: flex; align-items: center; gap: 8px; }
                .table-avatar { width: 28px; height: 28px; border-radius: 50%; background: linear-gradient(135deg, #3b82f6, #2563eb); color: white; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 12px; flex-shrink: 0; object-fit: cover; }
                .table-avatar img { width: 100%; height: 100%; border-radius: 50%; object-fit: cover; }
                .admission-no { color: #3b82f6; font-weight: 600; }
                .status { display: inline-block; padding: 3px 10px; border-radius: 12px; font-size: 10px; font-weight: 600; }
                .status-active { background-color: #dcfce7; color: #166534; }
                .status-inactive { background-color: #fee2e2; color: #991b1b; }
              `
              }
              .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center; font-size: 11px; color: #6b7280; }
              @media print { body { padding: 10px; } .no-print { display: none; } @page { margin: 1cm; } }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>Student Records</h1>
              <div class="subtitle">Educo - School ERP System</div>
              <div class="subtitle">View: ${viewMode === "grid" ? "Grid View" : "Table View"}</div>
            </div>
            <div class="meta-info">
              <div><strong>Date:</strong> ${dateStr} | <strong>Time:</strong> ${timeStr}</div>
              <div><strong>Total Students:</strong> ${studentsToPrint.length}</div>
            </div>
      `;

      if (viewMode === "grid") {
        htmlContent += '<div class="grid-container">';
        studentsToPrint.forEach((student) => {
          htmlContent += `
            <div class="student-card">
              <div class="student-header">
                <div class="student-avatar">
                  ${student.avatar ? `<img src="${student.avatar}" alt="${student.name}" />` : student.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)}
                </div>
                <div>
                  <div class="student-name">${student.name}</div>
                  <div class="student-id">${student.id}</div>
                </div>
              </div>
              <div class="student-info">
                <div class="info-row"><span class="info-label">Roll No:</span><span class="info-value">${student.rollNo}</span></div>
                <div class="info-row"><span class="info-label">Class:</span><span class="info-value">${student.class}</span></div>
                <div class="info-row"><span class="info-label">Gender:</span><span class="info-value">${student.gender}</span></div>
                <div class="info-row"><span class="info-label">Status:</span><span class="status ${student.status === "Active" ? "status-active" : "status-inactive"}">${student.status}</span></div>
                <div class="info-row"><span class="info-label">Joined:</span><span class="info-value">${student.joinedOn}</span></div>
              </div>
            </div>
          `;
        });
        htmlContent += "</div>";
      } else {
        htmlContent += `
          <table><thead><tr>
            <th>ID</th><th>Admission No</th><th>Roll No</th><th>Name</th><th>Class</th><th>Section</th><th>Gender</th><th>Status</th><th>Date of Join</th>
          </tr></thead><tbody>
        `;
        studentsToPrint.forEach((student, index) => {
          const [classNum, section] = student.class.split(", ");
          htmlContent += `
            <tr>
              <td>${index + 1}</td>
              <td class="admission-no">${student.id}</td>
              <td>${student.rollNo}</td>
              <td><div class="student-name-cell"><div class="table-avatar">${student.avatar ? `<img src="${student.avatar}" alt="${student.name}" />` : student.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)}</div><span>${student.name}</span></div></td>
              <td>${classNum}</td>
              <td>${section}</td>
              <td>${student.gender}</td>
              <td><span class="status ${student.status === "Active" ? "status-active" : "status-inactive"}">${student.status}</span></td>
              <td>${student.joinedOn}</td>
            </tr>
          `;
        });
        htmlContent += "</tbody></table>";
      }

      htmlContent += `
            <div class="footer">
              <p>Generated on ${dateStr} at ${timeStr}</p>
              <p style="margin-top: 4px;">Educo School ERP System - Student Records Report</p>
            </div>
          </body>
        </html>
      `;

      printWindow.document.write(htmlContent);
      printWindow.document.close();

      printWindow.onload = () => {
        const images = printWindow.document.querySelectorAll("img");
        const imagePromises = Array.from(images).map(
          (img) =>
            new Promise((resolve) => {
              if (img.complete) resolve(true);
              else {
                img.onload = () => resolve(true);
                img.onerror = () => resolve(true);
              }
            })
        );
        Promise.all(imagePromises).then(() => {
          setTimeout(() => {
            printWindow.focus();
            printWindow.print();
          }, 500);
        });
      };
    },
    [viewMode]
  );

  // Breadcrumbs change based on view mode
  const breadcrumbs = useMemo(
    () => [
      { label: "Dashboard", href: "/" },
      { label: "Peoples" },
      { label: viewMode === "grid" ? "Students Grid" : "Students Table", isActive: true },
    ],
    [viewMode]
  );

  return (
    <DataManagementPage<Student>
      title="Students"
      breadcrumbs={breadcrumbs}
      data={academicYearFilteredStudents}
      getRowKey={(item) => item.id}
      columns={[]} // Using customListComponent for table view
      // Filters & Sort
      filterFields={filterFields}
      sortOptions={studentSortOptions}
      defaultSort="ascending"
      filterFn={filterFn}
      sortFn={sortFn}
      // Date Range
      enableDateRange
      onDateRangeChange={handleDateRangeChange}
      // View Mode
      enableViewToggle
      defaultViewMode="grid"
      gridCardComponent={StudentGridCard}
      gridColumns={{ sm: 1, md: 2, lg: 3, xl: 4 }}
      // Selection (controlled mode for modal interactions)
      enableSelection
      controlledSelection={{
        selectedIds,
        onChange: setSelectedIds,
      }}
      // Bulk Actions
      bulkActions={[
        {
          id: "transfer",
          label: "Transfer",
          icon: ArrowRightLeft,
          variant: "primary" as const,
          showCount: true,
          onClick: handleBulkTransfer,
        },
        {
          id: "delete",
          label: "Delete",
          icon: Trash2,
          variant: "danger" as const,
          showCount: true,
          onClick: handleBulkDelete,
        },
      ]}
      // Export
      enableExport
      onPrint={handlePrint}
      onExportPDF={handleExportPDF}
      onExportExcel={handleExportExcel}
      // Page Actions
      addButtonConfig={{
        label: "Add Student",
        onClick: handleAddStudent,
      }}
      // Grid view pagination
      enableLoadMore
      initialGridCount={8}
      loadMoreCount={8}
      // Labels
      itemLabel="student"
      itemLabelPlural="students"
      // Table (using custom list component)
      customListComponent={
        <StudentTable
          students={academicYearFilteredStudents}
          onClearFilters={undefined}
          hasActiveFilters={false}
          totalStudentsCount={students.length}
          selectedIds={selectedIds}
          onSelectionChange={setSelectedIds}
        />
      }
    >
      {/* Bulk Delete Modal */}
      <BulkDeleteModal
        isOpen={isBulkDeleteModalOpen}
        onClose={() => setIsBulkDeleteModalOpen(false)}
        onConfirm={handleConfirmBulkDelete}
        items={itemsToDelete}
        onRemoveItem={handleRemoveFromDeleteList}
        onRestoreItem={handleRestoreItem}
        onRestoreAll={handleRestoreAll}
        title="Delete Students"
        warningMessage="This will permanently remove these students and all associated data. This action cannot be undone."
        confirmButtonText="Delete Students"
      />

      {/* Bulk Transfer Modal */}
      <BulkTransferModal
        isOpen={isBulkTransferModalOpen}
        onClose={() => setIsBulkTransferModalOpen(false)}
        onConfirm={handleConfirmBulkTransfer}
        students={studentsToTransfer}
        onRemoveStudent={handleRemoveFromTransferList}
        onRestoreStudent={handleRestoreTransferStudent}
        onRestoreAll={handleRestoreAllTransferStudents}
      />
    </DataManagementPage>
  );
}
