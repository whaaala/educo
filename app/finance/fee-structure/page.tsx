"use client";

import { useState, useMemo, useEffect } from "react";
import { DataManagementPage } from "@/components/pages";
import { useSchoolSettings } from "@/contexts/SchoolSettingsContext";
import { useCountry } from "@/contexts/CountryContext";
import { formatCurrency } from "@/config/countries";
import { exportFeeStructureToExcel, exportFeeStructureToPDF } from "@/lib/export-utils";
import ResponsiveListTable, { type ColumnConfig } from "@/components/shared/ResponsiveListTable";
import SearchFilterBar from "@/components/shared/SearchFilterBar";
import StatCard from "@/components/shared/StatCard";
import FeeStructureModal from "@/components/finance/FeeStructureModal";
import ActionModal from "@/components/shared/ActionModal";
import {
  Edit,
  Trash2,
  Layers,
  CheckCircle2,
  Copy,
  FileText,
  TrendingUp,
} from "lucide-react";
import {
  FEE_CATEGORIES,
  getFeeCategoriesForSchoolType,
  getFeesByLevelAndSchoolType,
  SchoolType,
  EducationLevel,
} from "@/lib/feeConfigNew";
import { ACADEMIC_YEARS, TERMS } from "../config";

// Fee Structure item - the actual fee with amount for a specific class
interface FeeStructureItem {
  id: string;
  feeTypeId: string;
  feeTypeName: string;
  categoryId: string;
  categoryName: string;
  educationLevel: EducationLevel;
  classLevel: string;
  amount: number;
  currency: string;
  dueDate: string;
  academicYear: string;
  term: string;
  isActive: boolean;
  allowInstallments: boolean;
  installmentCount?: number;
  lateFee?: number;
  lateFeeType?: "fixed" | "percentage";
  createdAt: string;
  updatedAt: string;
}

// Class options by education level
const PRIMARY_CLASSES = ["All Primary", "Nursery 1", "Nursery 2", "KG 1", "KG 2", "Primary 1", "Primary 2", "Primary 3", "Primary 4", "Primary 5", "Primary 6"];
const SECONDARY_CLASSES = ["All Secondary", "JSS 1", "JSS 2", "JSS 3", "SSS 1", "SSS 2", "SSS 3"];
const TERTIARY_CLASSES = ["All Levels", "100 Level", "200 Level", "300 Level", "400 Level", "500 Level", "600 Level"];

// Mock fee structure data
const MOCK_FEE_STRUCTURES: FeeStructureItem[] = [
  {
    id: "fs-001",
    feeTypeId: "monthly-tuition-secondary",
    feeTypeName: "Monthly Tuition Fee",
    categoryId: "tuition",
    categoryName: "Tuition Fees",
    educationLevel: "secondary",
    classLevel: "JSS 1",
    amount: 25000,
    currency: "NGN",
    dueDate: "2024-01-10",
    academicYear: "2024-2025",
    term: "first-term",
    isActive: true,
    allowInstallments: true,
    installmentCount: 3,
    lateFee: 2000,
    lateFeeType: "fixed",
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
  },
  {
    id: "fs-002",
    feeTypeId: "monthly-tuition-secondary",
    feeTypeName: "Monthly Tuition Fee",
    categoryId: "tuition",
    categoryName: "Tuition Fees",
    educationLevel: "secondary",
    classLevel: "SSS 1",
    amount: 35000,
    currency: "NGN",
    dueDate: "2024-01-10",
    academicYear: "2024-2025",
    term: "first-term",
    isActive: true,
    allowInstallments: true,
    installmentCount: 3,
    lateFee: 2500,
    lateFeeType: "fixed",
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
  },
  {
    id: "fs-003",
    feeTypeId: "exam-fee-semester",
    feeTypeName: "Examination Fee",
    categoryId: "examination",
    categoryName: "Examination & Certification",
    educationLevel: "secondary",
    classLevel: "All Secondary",
    amount: 5000,
    currency: "NGN",
    dueDate: "2024-03-01",
    academicYear: "2024-2025",
    term: "first-term",
    isActive: true,
    allowInstallments: false,
    lateFee: 500,
    lateFeeType: "fixed",
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
  },
  {
    id: "fs-004",
    feeTypeId: "semester-tuition-tertiary",
    feeTypeName: "Semester Tuition Fee",
    categoryId: "tuition",
    categoryName: "Tuition Fees",
    educationLevel: "tertiary",
    classLevel: "100 Level",
    amount: 150000,
    currency: "NGN",
    dueDate: "2024-02-15",
    academicYear: "2024-2025",
    term: "first-semester",
    isActive: true,
    allowInstallments: true,
    installmentCount: 4,
    lateFee: 10,
    lateFeeType: "percentage",
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
  },
];

/** The values FeeStructureModal collects and hands back on save. The modal owns this state; the page only
 *  needs to describe its shape. It was previously described as `typeof formData`, which kept a dead piece of
 *  page state alive purely to be a type. */
type FeeFormValues = {
  feeTypeId: string;
  classLevel: string;
  amount: string;
  dueDate: string;
  term: string;
  allowInstallments: boolean;
  installmentCount: string;
  lateFee: string;
  lateFeeType: "fixed" | "percentage";
};

function getClassesForLevel(level: EducationLevel): string[] {
  switch (level) {
    case "primary":
      return PRIMARY_CLASSES;
    case "secondary":
      return SECONDARY_CLASSES;
    case "tertiary":
      return TERTIARY_CLASSES;
    default:
      return SECONDARY_CLASSES;
  }
}

export default function FeeStructurePage() {
  const { settings } = useSchoolSettings();
  const { countryCode, countryConfig } = useCountry();
  const currencySymbol = countryConfig.currency.symbol;

  // Determine school type from settings
  const schoolType: SchoolType = settings?.institutionType === "Public"
    ? "public"
    : settings?.defaultEducationLevel === "Tertiary"
      ? "tertiary"
      : "private";

  // State - use consistent default for SSR, then update on client
  const [feeStructures, setFeeStructures] = useState<FeeStructureItem[]>(MOCK_FEE_STRUCTURES);
  const [selectedLevel, setSelectedLevel] = useState<EducationLevel>("secondary");

  // Update selectedLevel when settings are available (client-side only)
  useEffect(() => {
    if (settings?.defaultEducationLevel) {
      setSelectedLevel(settings.defaultEducationLevel.toLowerCase() as EducationLevel);
    }
  }, [settings?.defaultEducationLevel]);
  const [selectedClass, setSelectedClass] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedYear, setSelectedYear] = useState<string>("2024-2025");
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<FeeStructureItem | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingItem, setDeletingItem] = useState<FeeStructureItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isFiltering, setIsFiltering] = useState(false);
  const [animationTrigger, setAnimationTrigger] = useState(0);

  // Create a filterKey to track filter/search changes
  const filterKey = `${searchQuery}-${selectedYear}-${selectedLevel}-${selectedClass}-${selectedCategory}`;
  const [prevFilterKey, setPrevFilterKey] = useState(filterKey);

  // No form state here on purpose: FeeStructureModal holds its own fields and hands them back to
  // handleModalSave. The page used to keep a parallel copy that was written on open/edit and never read once.

  // Get applicable categories and fee types
  const applicableCategories = useMemo(() => {
    return getFeeCategoriesForSchoolType(schoolType);
  }, [schoolType]);

  const applicableFeeTypes = useMemo(() => {
    return getFeesByLevelAndSchoolType(selectedLevel, schoolType);
  }, [selectedLevel, schoolType]);

  // Filter fee structures
  const filteredStructures = useMemo(() => {
    return feeStructures.filter((item) => {
      if (item.educationLevel !== selectedLevel) return false;
      if (selectedClass !== "all" && item.classLevel !== selectedClass && !item.classLevel.startsWith("All")) return false;
      if (selectedCategory !== "all" && item.categoryId !== selectedCategory) return false;
      if (item.academicYear !== selectedYear) return false;
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          item.feeTypeName.toLowerCase().includes(query) ||
          item.categoryName.toLowerCase().includes(query) ||
          item.classLevel.toLowerCase().includes(query)
        );
      }
      return true;
    });
  }, [feeStructures, selectedLevel, selectedClass, selectedCategory, selectedYear, searchQuery]);

  // Calculate totals
  const totalFees = useMemo(() => {
    return filteredStructures.reduce((sum, item) => sum + item.amount, 0);
  }, [filteredStructures]);

  const activeFeesCount = useMemo(() => {
    return filteredStructures.filter((item) => item.isActive).length;
  }, [filteredStructures]);

  const installmentFeesCount = useMemo(() => {
    return filteredStructures.filter((item) => item.allowInstallments).length;
  }, [filteredStructures]);

  // Trigger animation when filterKey changes
  useEffect(() => {
    if (filterKey !== prevFilterKey) {
      setAnimationTrigger(prev => prev + 1);
      setPrevFilterKey(filterKey);
    }
  }, [filterKey, prevFilterKey]);

  // Apply row animation when filter/search changes
  useEffect(() => {
    if (animationTrigger > 0) {
      const timeoutId = setTimeout(() => {
        const tables = document.querySelectorAll('table');
        tables.forEach((table) => {
          const rows = table.querySelectorAll('tbody tr');
          rows.forEach((row, index) => {
            const htmlRow = row as HTMLElement;
            const delay = index / 80;
            htmlRow.style.animation = `fadeSlideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1) ${delay}s both`;
          });
        });

        // Cleanup after animation completes (animation duration + max delay for rows)
        setTimeout(() => {
          tables.forEach((table) => {
            const rows = table.querySelectorAll('tbody tr');
            rows.forEach((row) => {
              const htmlRow = row as HTMLElement;
              htmlRow.style.animation = '';
            });
          });
        }, 600);
      }, 50);

      return () => clearTimeout(timeoutId);
    }
  }, [animationTrigger]);


  // Handle refresh
  const handleRefresh = () => {
    setIsRefreshing(true);
    setSearchQuery("");
    setSelectedClass("all");
    setSelectedCategory("all");
    setTimeout(() => {
      setIsRefreshing(false);
    }, 500);
  };

  // Handle filter changes with animation
  const handleFilterChange = (setter: (val: string) => void, value: string) => {
    setIsFiltering(true);
    setTimeout(() => {
      setter(value);
      setTimeout(() => setIsFiltering(false), 100);
    }, 200);
  };

  // Handle search change
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
  };

  // Open add modal
  const handleAddNew = () => {
    setIsAddModalOpen(true);
  };

  // Open edit modal
  const handleEdit = (item: FeeStructureItem) => {
    // The modal reads `editingItem` for its initial values, so setting a second copy here changed nothing.
    setEditingItem(item);
    setIsEditModalOpen(true);
  };

  // Handle modal save (for both add and edit)
  const handleModalSave = async (modalFormData: FeeFormValues) => {
    setIsSaving(true);

    const feeType = applicableFeeTypes.find((f) => f.id === modalFormData.feeTypeId);
    const category = feeType ? FEE_CATEGORIES[feeType.categoryId] : null;

    if (isEditModalOpen && editingItem) {
      // Update existing
      const updatedItem: FeeStructureItem = {
        ...editingItem,
        feeTypeId: modalFormData.feeTypeId,
        feeTypeName: feeType?.name || editingItem.feeTypeName,
        categoryId: feeType?.categoryId || editingItem.categoryId,
        categoryName: category?.name || editingItem.categoryName,
        classLevel: modalFormData.classLevel,
        amount: parseFloat(modalFormData.amount) || 0,
        dueDate: modalFormData.dueDate,
        term: modalFormData.term,
        allowInstallments: modalFormData.allowInstallments,
        installmentCount: modalFormData.allowInstallments ? parseInt(modalFormData.installmentCount) : undefined,
        lateFee: modalFormData.lateFee ? parseFloat(modalFormData.lateFee) : undefined,
        lateFeeType: modalFormData.lateFee ? modalFormData.lateFeeType : undefined,
        updatedAt: new Date().toISOString(),
      };

      await new Promise((resolve) => setTimeout(resolve, 500));

      setFeeStructures(feeStructures.map((item) =>
        item.id === editingItem.id ? updatedItem : item
      ));
      setIsEditModalOpen(false);
      setEditingItem(null);
    } else {
      // Create new
      const newItem: FeeStructureItem = {
        id: `fs-${Date.now()}`,
        feeTypeId: modalFormData.feeTypeId,
        feeTypeName: feeType?.name || "",
        categoryId: feeType?.categoryId || "",
        categoryName: category?.name || "",
        educationLevel: selectedLevel,
        classLevel: modalFormData.classLevel,
        amount: parseFloat(modalFormData.amount) || 0,
        currency: settings?.currency || "NGN",
        dueDate: modalFormData.dueDate,
        academicYear: selectedYear,
        term: modalFormData.term,
        isActive: true,
        allowInstallments: modalFormData.allowInstallments,
        installmentCount: modalFormData.allowInstallments ? parseInt(modalFormData.installmentCount) : undefined,
        lateFee: modalFormData.lateFee ? parseFloat(modalFormData.lateFee) : undefined,
        lateFeeType: modalFormData.lateFee ? modalFormData.lateFeeType : undefined,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await new Promise((resolve) => setTimeout(resolve, 500));

      setFeeStructures([...feeStructures, newItem]);
      setIsAddModalOpen(false);
    }

    setIsSaving(false);
  };

  // Delete fee structure
  const requestDelete = (item: FeeStructureItem) => {
    setDeletingItem(item);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingItem) return;

    setIsDeleting(true);
    await new Promise((resolve) => setTimeout(resolve, 400));

    setFeeStructures((prev) => prev.filter((item) => item.id !== deletingItem.id));
    setIsDeleting(false);
    setIsDeleteModalOpen(false);
    setDeletingItem(null);
  };

  // Toggle active status
  const handleToggleActive = (id: string) => {
    setFeeStructures(feeStructures.map((item) =>
      item.id === id ? { ...item, isActive: !item.isActive } : item
    ));
  };

  // Duplicate fee structure
  const handleDuplicate = (item: FeeStructureItem) => {
    const duplicated: FeeStructureItem = {
      ...item,
      id: `fs-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setFeeStructures([...feeStructures, duplicated]);
  };

  // Table columns
  const columns: ColumnConfig<FeeStructureItem>[] = [
    {
      key: "feeTypeName",
      label: "Fee Type",
      sortable: true,
      className: "text-left",
      render: (item) => (
        <div>
          <div className="font-semibold text-ink" style={{ fontSize: '0.7375rem' }}>
            {item.feeTypeName}
          </div>
          <div className="text-gray-500 dark:text-gray-400 midnight:text-cyan-400/60 purple:text-pink-400/60" style={{ fontSize: '0.625rem' }}>
            {item.categoryName}
          </div>
        </div>
      ),
    },
    {
      key: "classLevel",
      label: "Class/Level",
      sortable: true,
      className: "text-left",
      render: (item) => (
        <span className="inline-flex px-2.5 py-0.5 rounded-full font-semibold bg-blue-100 dark:bg-blue-900/30 midnight:bg-blue-900/20 purple:bg-blue-900/20 text-blue-700 dark:text-blue-400 midnight:text-blue-400 purple:text-blue-400 border border-blue-200 dark:border-blue-800" style={{ fontSize: '0.7375rem' }}>
          {item.classLevel}
        </span>
      ),
    },
    {
      key: "amount",
      label: "Amount",
      sortable: true,
      className: "text-left",
      render: (item) => (
        <div className="font-semibold text-ink" style={{ fontSize: '0.7375rem' }}>
          {formatCurrency(item.amount, countryCode)}
        </div>
      ),
    },
    {
      key: "dueDate",
      label: "Due Date",
      sortable: true,
      className: "text-left",
      render: (item) => (
        <div className="font-semibold text-ink whitespace-nowrap" style={{ fontSize: '0.7375rem' }}>
          {new Date(item.dueDate).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </div>
      ),
    },
    {
      key: "term",
      label: "Term",
      className: "text-left",
      render: (item) => (
        <div className="font-semibold text-ink capitalize whitespace-nowrap" style={{ fontSize: '0.7375rem' }}>
          {item.term.replace("-", " ").replace(/\b\w/g, l => l.toUpperCase())}
        </div>
      ),
    },
    {
      key: "allowInstallments",
      label: "Installments",
      className: "text-left",
      render: (item) => (
        item.allowInstallments ? (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full font-semibold bg-green-100 dark:bg-green-900/30 midnight:bg-green-900/20 purple:bg-green-900/20 text-green-700 dark:text-green-400 midnight:text-green-400 purple:text-green-400 border border-green-200 dark:border-green-800" style={{ fontSize: '0.7375rem' }}>
            <CheckCircle2 className="w-3 h-3" />
            {item.installmentCount}x
          </span>
        ) : (
          <span className="text-gray-400 dark:text-gray-500 midnight:text-cyan-400 purple:text-pink-400" style={{ fontSize: '0.7375rem' }}>—</span>
        )
      ),
    },
    {
      key: "isActive",
      label: "Status",
      className: "text-left",
      render: (item) => (
        <button
          onClick={() => handleToggleActive(item.id)}
          className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full font-semibold cursor-pointer transition-colors border whitespace-nowrap ${
            item.isActive
              ? "bg-green-100 dark:bg-green-900/30 midnight:bg-green-900/20 purple:bg-green-900/20 text-green-700 dark:text-green-400 midnight:text-green-400 purple:text-green-400 border-green-200 dark:border-green-800 hover:bg-green-200"
              : "bg-gray-100 dark:bg-[#1a1d24] midnight:bg-[#0f1330] purple:bg-[#251340] text-gray-500 dark:text-gray-400 midnight:text-gray-400 purple:text-gray-400 border-line hover:bg-gray-200"
          }`}
          style={{ fontSize: '0.7375rem' }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
          {item.isActive ? "Active" : "Inactive"}
        </button>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      className: "text-center",
      render: (item) => (
        <div className="flex items-center justify-center gap-2.5">
          <button
            onClick={() => handleEdit(item)}
            className="group relative p-2 rounded-lg bg-gradient-to-br from-orange-50/50 to-orange-100/30 dark:from-orange-950/30 dark:to-orange-900/20 midnight:from-orange-950/30 midnight:to-orange-900/20 purple:from-orange-950/30 purple:to-orange-900/20 hover:from-orange-100 hover:to-orange-100 dark:hover:from-orange-900/40 dark:hover:to-orange-800/30 transition-all duration-200 cursor-pointer border border-orange-200/40 dark:border-orange-800/30 hover:border-orange-400/60 dark:hover:border-orange-600/50 active:scale-95"
            title="Edit"
          >
            <Edit className="w-4 h-4 text-orange-600 dark:text-orange-400 group-hover:text-orange-700 dark:group-hover:text-orange-300 transition-colors" />
          </button>
          <button
            onClick={() => handleDuplicate(item)}
            className="group relative p-2 rounded-lg bg-gradient-to-br from-purple-50/50 to-purple-100/30 dark:from-purple-950/30 dark:to-purple-900/20 midnight:from-purple-950/30 midnight:to-purple-900/20 purple:from-purple-950/30 purple:to-purple-900/20 hover:from-purple-100 hover:to-purple-100 dark:hover:from-purple-900/40 dark:hover:to-purple-800/30 transition-all duration-200 cursor-pointer border border-purple-200/40 dark:border-purple-800/30 hover:border-purple-400/60 dark:hover:border-purple-600/50 active:scale-95"
            title="Duplicate"
          >
            <Copy className="w-4 h-4 text-purple-600 dark:text-purple-400 group-hover:text-purple-700 dark:group-hover:text-purple-300 transition-colors" />
          </button>
          <button
            onClick={() => requestDelete(item)}
            className="group relative p-2 rounded-lg bg-gradient-to-br from-red-50/50 to-red-100/30 dark:from-red-950/30 dark:to-red-900/20 midnight:from-red-950/30 midnight:to-red-900/20 purple:from-red-950/30 purple:to-red-900/20 hover:from-red-100 hover:to-red-100 dark:hover:from-red-900/40 dark:hover:to-red-800/30 transition-all duration-200 cursor-pointer border border-red-200/40 dark:border-red-800/30 hover:border-red-400/60 dark:hover:border-red-600/50 active:scale-95"
            title="Delete"
          >
            <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400 midnight:text-red-400 purple:text-red-400 group-hover:text-red-700 dark:group-hover:text-red-300 transition-colors" />
          </button>
        </div>
      ),
    },
  ];

  // Level options
  const levelOptions = [
    { label: "Primary", value: "primary" },
    { label: "Secondary", value: "secondary" },
    { label: "Tertiary", value: "tertiary" },
  ];

  // Category options for filter
  const categoryOptions = [
    { label: "All Categories", value: "all" },
    ...applicableCategories.map((cat) => ({ label: cat.name, value: cat.id })),
  ];

  // Class options for filter
  const classOptions = [
    { label: "All Classes", value: "all" },
    ...getClassesForLevel(selectedLevel).map((cls) => ({ label: cls, value: cls })),
  ];

  const isLoading = isRefreshing || isFiltering;

  return (
    <DataManagementPage<FeeStructureItem>
      title="Fee Structure"
      breadcrumbs={[
        { label: "Finance", href: "/finance" },
        { label: "Fee Structure" },
      ]}
      data={filteredStructures}
      getRowKey={(item) => item.id}
      columns={columns}
      enableSelection={false}
      enableViewToggle={false}
      showTableSearch={false}
      addButtonConfig={{
        label: "Add Fee",
        onClick: handleAddNew,
      }}
      onRefresh={handleRefresh}
      onExportPDF={() => exportFeeStructureToPDF(
        filteredStructures,
        "fee-structure",
        (amount) => formatCurrency(amount, countryCode),
        settings?.schoolName || "School Management System"
      )}
      onExportExcel={() => exportFeeStructureToExcel(
        filteredStructures,
        "fee-structure",
        (amount) => formatCurrency(amount, countryCode)
      )}
      headerContent={
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4 mt-6">
            <StatCard
              icon={FileText}
              label="Total Fees"
              value={formatCurrency(totalFees, countryCode)}
              color="blue"
              badge="100%"
            />
            <StatCard
              icon={TrendingUp}
              label="Active Fees"
              value={formatCurrency(filteredStructures.filter(f => f.isActive).reduce((sum, f) => sum + f.amount, 0), countryCode)}
              color="green"
              badge={`${filteredStructures.length > 0 ? ((activeFeesCount / filteredStructures.length) * 100).toFixed(0) : 0}%`}
            />
            <StatCard
              icon={TrendingUp}
              label="Inactive Fees"
              value={formatCurrency(filteredStructures.filter(f => !f.isActive).reduce((sum, f) => sum + f.amount, 0), countryCode)}
              color="purple"
              badge={`${filteredStructures.length > 0 ? (((filteredStructures.length - activeFeesCount) / filteredStructures.length) * 100).toFixed(0) : 0}%`}
            />
            <StatCard
              icon={Layers}
              label="Installments"
              value={formatCurrency(filteredStructures.filter(f => f.allowInstallments).reduce((sum, f) => sum + f.amount, 0), countryCode)}
              color="amber"
              badge={`${filteredStructures.length > 0 ? ((installmentFeesCount / filteredStructures.length) * 100).toFixed(0) : 0}%`}
            />
            <StatCard
              icon={FileText}
              label="Late Fees"
              value={formatCurrency(filteredStructures.filter(f => f.lateFee && f.lateFeeType === 'fixed').reduce((sum, f) => sum + (f.lateFee || 0), 0), countryCode)}
              color="red"
              badge={`${filteredStructures.length > 0 ? ((filteredStructures.filter(f => f.lateFee && f.lateFee > 0).length / filteredStructures.length) * 100).toFixed(0) : 0}%`}
            />
          </div>

          {/* Filters Bar */}
          <div className="mt-6">
            <SearchFilterBar
              searchValue={searchQuery}
              onSearchChange={handleSearchChange}
              searchPlaceholder="Search by fee name, category, or class..."
              filters={[
                {
                  label: "Academic Year",
                  value: selectedYear,
                  onChange: (val) => handleFilterChange(setSelectedYear, String(val)),
                  options: ACADEMIC_YEARS,
                },
                {
                  label: "Level",
                  value: selectedLevel,
                  onChange: (val) => handleFilterChange(setSelectedLevel as (val: string) => void, String(val)),
                  options: levelOptions,
                },
                {
                  label: "Class",
                  value: selectedClass,
                  onChange: (val) => handleFilterChange(setSelectedClass, String(val)),
                  options: classOptions,
                },
                {
                  label: "Category",
                  value: selectedCategory,
                  onChange: (val) => handleFilterChange(setSelectedCategory, String(val)),
                  options: categoryOptions,
                },
              ]}
            />
          </div>
        </>
      }
      customListComponent={
        <div>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
                <p className="text-sm text-muted">
                  {isRefreshing ? "Refreshing..." : "Filtering..."}
                </p>
              </div>
            </div>
          ) : filteredStructures.length === 0 ? (
            <div className="bg-surface rounded-xl border border-line shadow-sm p-8 sm:p-12">
              <div className="flex flex-col items-center justify-center">
                <div className="relative mb-4">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700/20 dark:to-gray-800/20 animate-pulse" />
                  </div>
                  <div className="relative z-10 flex items-center justify-center w-16 h-16">
                    <FileText className="w-8 h-8 text-gray-400 dark:text-gray-500 midnight:text-cyan-400 purple:text-pink-400" />
                  </div>
                </div>
                <h3 className="text-sm sm:text-base font-semibold text-gray-700 dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200 mb-1 text-center">
                  No fee structures found
                </h3>
                <p className="text-xs sm:text-sm text-muted mb-4 text-center">
                  {searchQuery
                    ? "No results match your search. Try adjusting your filters."
                    : "Get started by adding your first fee structure."}
                </p>
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="text-xs sm:text-sm font-medium text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400 hover:underline"
                  >
                    Clear search
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="relative">
              {/* Mobile Scroll Indicator */}
              <div className="md:hidden absolute top-0 right-0 z-20 bg-gradient-to-l from-blue-500/20 to-transparent w-8 h-full pointer-events-none" />

              <div
                key={`table-data-${searchQuery}-${selectedYear}-${selectedLevel}-${selectedClass}-${selectedCategory}`}
                className="bg-surface rounded-xl border border-line shadow-sm overflow-hidden"
              >
                <ResponsiveListTable variant="contained" showColumnHeaders={true}
                  columns={columns}
                  data={filteredStructures}
                  getRowKey={(item) => item.id}
                  emptyMessage="No fee structures found. Click 'Add Fee' to create one."
                  title=""
                  showSearch={false}
                  defaultItemsPerPage={10}
                  itemsPerPageOptions={[5, 10, 15, 20, 25]}
                  enablePagination={true}
                  enableItemsPerPage={true}
                />
              </div>
            </div>
          )}
        </div>
      }
    >
      {/* Add/Edit Modal */}
      <FeeStructureModal
        isOpen={isAddModalOpen || isEditModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setIsEditModalOpen(false);
          setEditingItem(null);
        }}
        onSave={handleModalSave}
        isEditing={isEditModalOpen}
        editingItem={editingItem}
        isSaving={isSaving}
        applicableFeeTypes={applicableFeeTypes}
        feeCategories={FEE_CATEGORIES}
        classOptions={getClassesForLevel(selectedLevel)}
        termOptions={TERMS}
        currencySymbol={currencySymbol}
      />

      {/* Delete Confirmation */}
      <ActionModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          if (isDeleting) return;
          setIsDeleteModalOpen(false);
          setDeletingItem(null);
        }}
        title="Delete Fee Structure"
        subtitle={deletingItem ? `${deletingItem.feeTypeName} • ${deletingItem.classLevel}` : undefined}
        variant="danger"
        message="Are you sure you want to delete this fee structure? This action cannot be undone."
        details={
          deletingItem
            ? [
                { label: "Category", value: deletingItem.categoryName },
                { label: "Amount", value: formatCurrency(deletingItem.amount, countryCode) },
                { label: "Due Date", value: new Date(deletingItem.dueDate).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) },
              ]
            : undefined
        }
        confirmLabel="Delete"
        cancelLabel="Cancel"
        onConfirm={handleDeleteConfirm}
        isConfirming={isDeleting}
      />
    </DataManagementPage>
  );
}
