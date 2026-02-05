"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, TrendingUp, CheckCircle2, AlertCircle, RotateCcw } from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";
import Button from "@/components/shared/Button";
import PageHeader from "@/components/shared/PageHeader";
import DataTable, { ColumnConfig } from "@/components/shared/DataTable";
import { Student } from "@/components/students/StudentCard";
import { useStudentsByTenant } from "@/hooks/useStudentsByTenant";
import NameLabel from "@/components/shared/NameLabel";

type PromotionStep = "select" | "configure" | "preview" | "confirm" | "complete";

interface PromotionConfig {
  fromClass: string;
  fromSection: string;
  toClass: string;
  toSection: string;
  academicYear: string;
  promotionDate: string;
  reason: string;
}

interface PromotionRecord {
  student: Student;
  currentClass: string;
  currentSection: string;
  newClass: string;
  newSection: string;
  status: "pending" | "success" | "failed";
  error?: string;
}

const CLASSES = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"];
const SECTIONS = ["A", "B", "C", "D", "E"];

export default function PromotionPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<PromotionStep>("select");

  // Educo v4.0 Multi-Tenant: Get students for current tenant only
  const tenantStudents = useStudentsByTenant();
  const [allStudents, setAllStudents] = useState<Student[]>([]);

  const [selectedStudents, setSelectedStudents] = useState<Set<string>>(new Set());
  const [promotionConfig, setPromotionConfig] = useState<PromotionConfig>({
    fromClass: "",
    fromSection: "",
    toClass: "",
    toSection: "",
    academicYear: "2024",
    promotionDate: "2024-01-01",
    reason: "Annual Promotion",
  });
  const [promotionRecords, setPromotionRecords] = useState<PromotionRecord[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Use tenant-filtered students
    setAllStudents(tenantStudents);

    // Set current date on client side only
    const currentYear = new Date().getFullYear().toString();
    const currentDate = new Date().toISOString().split("T")[0];
    setPromotionConfig(prev => ({
      ...prev,
      academicYear: currentYear,
      promotionDate: currentDate
    }));
  }, [tenantStudents]);

  const filteredStudents = allStudents.filter(
    (student) =>
      (!promotionConfig.fromClass || student.class === promotionConfig.fromClass) &&
      (!promotionConfig.fromSection || student.class.includes(promotionConfig.fromSection))
  );

  const handleSelectAll = () => {
    if (selectedStudents.size === filteredStudents.length) {
      setSelectedStudents(new Set());
    } else {
      setSelectedStudents(new Set(filteredStudents.map((s) => s.id)));
    }
  };

  const handleSelectStudent = (id: string) => {
    const newSelected = new Set(selectedStudents);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedStudents(newSelected);
  };

  const handleProceedToConfiguration = () => {
    if (selectedStudents.size === 0) {
      alert("Please select at least one student");
      return;
    }
    setCurrentStep("configure");
  };

  const handleProceedToPreview = () => {
    if (!promotionConfig.toClass) {
      alert("Please select a destination class");
      return;
    }

    // Create promotion records
    const records: PromotionRecord[] = Array.from(selectedStudents).map((studentId) => {
      const student = allStudents.find((s) => s.id === studentId)!;
      return {
        student,
        currentClass: student.class,
        currentSection: student.class.split(", ")[1] || "",
        newClass: promotionConfig.toClass,
        newSection: promotionConfig.toSection,
        status: "pending",
      };
    });

    setPromotionRecords(records);
    setCurrentStep("preview");
  };

  const handleConfirmPromotion = async () => {
    setCurrentStep("confirm");
    setIsProcessing(true);
    setProgress(0);

    // Simulate promotion process
    for (let i = 0; i < promotionRecords.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 200));

      // Simulate 95% success rate
      const success = Math.random() > 0.05;

      setPromotionRecords((prev) =>
        prev.map((record, index) =>
          index === i
            ? {
                ...record,
                status: success ? "success" : "failed",
                error: success ? undefined : "Failed to update student record",
              }
            : record
        )
      );

      setProgress(((i + 1) / promotionRecords.length) * 100);
    }

    setIsProcessing(false);
    setCurrentStep("complete");
  };

  const handleReset = () => {
    setCurrentStep("select");
    setSelectedStudents(new Set());
    setPromotionRecords([]);
    setProgress(0);
    setPromotionConfig({
      fromClass: "",
      fromSection: "",
      toClass: "",
      toSection: "",
      academicYear: new Date().getFullYear().toString(),
      promotionDate: new Date().toISOString().split("T")[0],
      reason: "Annual Promotion",
    });
  };

  const studentColumns: ColumnConfig<Student>[] = [
    {
      key: "select",
      label: (
        <input
          type="checkbox"
          checked={selectedStudents.size === filteredStudents.length && filteredStudents.length > 0}
          onChange={handleSelectAll}
          className="w-4 h-4 rounded border-neutral-300 dark:border-neutral-600"
        />
      ),
      sortable: false,
      render: (student) => (
        <input
          type="checkbox"
          checked={selectedStudents.has(student.id)}
          onChange={() => handleSelectStudent(student.id)}
          className="w-4 h-4 rounded border-neutral-300 dark:border-neutral-600"
        />
      ),
    },
    {
      key: "name",
      label: "Student Name",
      sortable: true,
      render: (student) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white text-sm font-semibold">
            {student.name.charAt(0)}
          </div>
          <NameLabel name={student.name} />
        </div>
      ),
    },
    {
      key: "rollNo",
      label: "Admission No",
      sortable: true,
    },
    {
      key: "class",
      label: "Current Class",
      sortable: true,
    },
    {
      key: "gender",
      label: "Gender",
      sortable: true,
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (student) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            student.status === "Active"
              ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
              : "bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300"
          }`}
        >
          {student.status}
        </span>
      ),
    },
  ];

  const previewColumns: ColumnConfig<PromotionRecord>[] = [
    {
      key: "student",
      label: "Student Name",
      sortable: false,
      render: (record) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white text-sm font-semibold">
            {record.student.name.charAt(0)}
          </div>
          <div>
            <NameLabel name={record.student.name} />
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              {record.student.rollNo}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "currentClass",
      label: "Current Class",
      sortable: false,
      render: (record) => (
        <span className="font-medium text-neutral-700 dark:text-neutral-300">
          {record.currentClass}
        </span>
      ),
    },
    {
      key: "arrow",
      label: "",
      sortable: false,
      render: () => (
        <ArrowRight className="w-5 h-5 text-neutral-400 dark:text-neutral-500" />
      ),
    },
    {
      key: "newClass",
      label: "New Class",
      sortable: false,
      render: (record) => (
        <span className="font-medium text-purple-700 dark:text-purple-300">
          {record.newClass}
          {record.newSection && `, ${record.newSection}`}
        </span>
      ),
    },
    {
      key: "status",
      label: "Status",
      sortable: false,
      render: (record) => (
        <div className="flex items-center gap-2">
          {record.status === "success" && (
            <>
              <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
              <span className="text-xs text-green-600 dark:text-green-400">Success</span>
            </>
          )}
          {record.status === "failed" && (
            <>
              <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
              <span className="text-xs text-red-600 dark:text-red-400">Failed</span>
            </>
          )}
          {record.status === "pending" && (
            <span className="text-xs text-neutral-600 dark:text-neutral-400">Pending</span>
          )}
        </div>
      ),
    },
  ];

  return (
    <MainLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
      <PageHeader
        title="Student Promotion"
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "Peoples", href: "#" },
          { label: "Students", href: "/students" },
          { label: "Promotion", isActive: true }
        ]}
      />

      {/* Progress Steps */}
      <div className="flex items-center justify-between bg-white dark:bg-neutral-800 rounded-lg p-6 shadow-sm">
        {["select", "configure", "preview", "complete"].map((step, index) => (
          <div key={step} className="flex items-center">
            <div className="flex flex-col items-center gap-2">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                  currentStep === step
                    ? "bg-purple-600 text-white"
                    : ["select", "configure", "preview"].indexOf(currentStep) > index
                    ? "bg-green-600 text-white"
                    : "bg-neutral-200 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-400"
                }`}
              >
                {["select", "configure", "preview"].indexOf(currentStep) > index ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : (
                  index + 1
                )}
              </div>
              <span className="text-xs font-medium capitalize text-neutral-700 dark:text-neutral-300">
                {step === "select" ? "Select Students" : step === "configure" ? "Configure" : step === "preview" ? "Preview" : "Complete"}
              </span>
            </div>
            {index < 3 && (
              <div
                className={`w-32 h-1 mx-2 ${
                  ["select", "configure", "preview"].indexOf(currentStep) > index
                    ? "bg-green-600"
                    : "bg-neutral-200 dark:bg-neutral-700"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      {currentStep === "select" && (
        <div className="space-y-6">
          {/* Filters */}
          <div className="bg-white dark:bg-neutral-800 rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
              Filter Students
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Class
                </label>
                <select
                  value={promotionConfig.fromClass}
                  onChange={(e) =>
                    setPromotionConfig({ ...promotionConfig, fromClass: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">All Classes</option>
                  {CLASSES.map((cls) => (
                    <option key={cls} value={cls}>
                      Class {cls}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Section
                </label>
                <select
                  value={promotionConfig.fromSection}
                  onChange={(e) =>
                    setPromotionConfig({ ...promotionConfig, fromSection: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">All Sections</option>
                  {SECTIONS.map((section) => (
                    <option key={section} value={section}>
                      Section {section}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-end">
                <div className="text-sm text-neutral-600 dark:text-neutral-400">
                  <span className="font-semibold text-purple-600 dark:text-purple-400">
                    {selectedStudents.size}
                  </span>{" "}
                  of {filteredStudents.length} students selected
                </div>
              </div>
            </div>
          </div>

          {/* Student List */}
          <div className="bg-white dark:bg-neutral-800 rounded-lg p-6 shadow-sm">
            <DataTable
              data={filteredStudents}
              columns={studentColumns}
              getRowKey={(student) => student.id}
              isLoading={false}
              emptyMessage="No students found"
            />
          </div>

          <div className="flex justify-end">
            <Button
              onClick={handleProceedToConfiguration}
              disabled={selectedStudents.size === 0}
            >
              Continue ({selectedStudents.size} students)
            </Button>
          </div>
        </div>
      )}

      {currentStep === "configure" && (
        <div className="bg-white dark:bg-neutral-800 rounded-lg p-6 shadow-sm space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
              Configure Promotion
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400">
              Set the destination class and promotion details
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Destination Class <span className="text-red-500">*</span>
              </label>
              <select
                value={promotionConfig.toClass}
                onChange={(e) =>
                  setPromotionConfig({ ...promotionConfig, toClass: e.target.value })
                }
                className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">Select class...</option>
                {CLASSES.map((cls) => (
                  <option key={cls} value={cls}>
                    Class {cls}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Destination Section
              </label>
              <select
                value={promotionConfig.toSection}
                onChange={(e) =>
                  setPromotionConfig({ ...promotionConfig, toSection: e.target.value })
                }
                className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">Select section...</option>
                {SECTIONS.map((section) => (
                  <option key={section} value={section}>
                    Section {section}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Academic Year <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={promotionConfig.academicYear}
                onChange={(e) =>
                  setPromotionConfig({ ...promotionConfig, academicYear: e.target.value })
                }
                className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="2024"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Promotion Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={promotionConfig.promotionDate}
                onChange={(e) =>
                  setPromotionConfig({ ...promotionConfig, promotionDate: e.target.value })
                }
                className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Reason
              </label>
              <input
                type="text"
                value={promotionConfig.reason}
                onChange={(e) =>
                  setPromotionConfig({ ...promotionConfig, reason: e.target.value })
                }
                className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Annual Promotion, Merit-based Promotion, etc."
              />
            </div>
          </div>

          <div className="flex justify-between pt-4">
            <Button variant="outline" onClick={() => setCurrentStep("select")}>
              Back
            </Button>
            <Button onClick={handleProceedToPreview}>
              Preview Promotion
            </Button>
          </div>
        </div>
      )}

      {(currentStep === "preview" || currentStep === "confirm") && (
        <div className="space-y-6">
          {/* Summary */}
          <div className="bg-white dark:bg-neutral-800 rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
              Promotion Summary
            </h3>
            <div className="grid grid-cols-4 gap-6">
              <div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">Students</p>
                <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                  {promotionRecords.length}
                </p>
              </div>
              <div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">To Class</p>
                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {promotionConfig.toClass}
                  {promotionConfig.toSection && `, ${promotionConfig.toSection}`}
                </p>
              </div>
              <div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">Academic Year</p>
                <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                  {promotionConfig.academicYear}
                </p>
              </div>
              <div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">Date</p>
                <p className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                  {new Date(promotionConfig.promotionDate).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          {/* Preview Table */}
          <div className="bg-white dark:bg-neutral-800 rounded-lg p-6 shadow-sm">
            <DataTable
              data={promotionRecords}
              columns={previewColumns}
              getRowKey={(record) => record.student.id}
              isLoading={false}
              emptyMessage="No promotion records"
            />
          </div>

          {/* Progress Bar (during confirm step) */}
          {currentStep === "confirm" && isProcessing && (
            <div className="bg-white dark:bg-neutral-800 rounded-lg p-6 shadow-sm space-y-4">
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                Processing Promotion...
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-neutral-600 dark:text-neutral-400">
                  <span>Progress</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <div className="w-full h-3 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-purple-600 transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => setCurrentStep("configure")}
              disabled={isProcessing}
            >
              Back
            </Button>
            {currentStep === "preview" && (
              <Button onClick={handleConfirmPromotion}>
                Confirm Promotion
              </Button>
            )}
          </div>
        </div>
      )}

      {currentStep === "complete" && (
        <div className="bg-white dark:bg-neutral-800 rounded-lg p-12 shadow-sm">
          <div className="max-w-2xl mx-auto text-center space-y-6">
            <div className="w-16 h-16 mx-auto bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                Promotion Complete!
              </h2>
              <p className="text-neutral-600 dark:text-neutral-400">
                Students have been promoted successfully
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <p className="text-sm text-green-700 dark:text-green-300">Successful</p>
                <p className="text-3xl font-bold text-green-900 dark:text-green-100">
                  {promotionRecords.filter((r) => r.status === "success").length}
                </p>
              </div>
              <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <p className="text-sm text-red-700 dark:text-red-300">Failed</p>
                <p className="text-3xl font-bold text-red-900 dark:text-red-100">
                  {promotionRecords.filter((r) => r.status === "failed").length}
                </p>
              </div>
            </div>

            <div className="flex gap-4 justify-center pt-4">
              <Button variant="outline" onClick={handleReset}>
                <RotateCcw className="w-4 h-4 mr-2" />
                Promote More
              </Button>
              <Button onClick={() => router.push("/students")}>
                View Students
              </Button>
            </div>
          </div>
        </div>
      )}
      </div>
    </MainLayout>
  );
}
