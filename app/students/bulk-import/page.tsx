"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Upload, Download, FileSpreadsheet, AlertCircle, CheckCircle2, X } from "lucide-react";
import * as XLSX from "xlsx";
import { DashboardPage } from "@/components/pages";
import Button from "@/components/shared/Button";
import ResponsiveListTable, { type ColumnConfig } from "@/components/shared/ResponsiveListTable";
type ImportStep = "upload" | "mapping" | "preview" | "validation" | "progress" | "complete";

interface ColumnMapping {
  excelColumn: string;
  systemField: string;
}

interface ValidationError {
  row: number;
  field: string;
  message: string;
}

/** One cell as XLSX hands it over. Empty cells come back undefined, so that is part of the type. */
type ImportedCell = string | number | boolean | null | undefined;

interface ImportedRow {
  [key: string]: ImportedCell | ValidationError[];
  _rowNumber: number;
  _errors: ValidationError[];
}

const REQUIRED_FIELDS = [
  { field: "admissionNumber", label: "Admission Number" },
  { field: "firstName", label: "First Name" },
  { field: "lastName", label: "Last Name" },
  { field: "class", label: "Class" },
  { field: "gender", label: "Gender" },
];

const OPTIONAL_FIELDS = [
  { field: "middleName", label: "Middle Name" },
  { field: "section", label: "Section" },
  { field: "dateOfBirth", label: "Date of Birth" },
  { field: "bloodGroup", label: "Blood Group" },
  { field: "email", label: "Email" },
  { field: "phone", label: "Phone" },
  { field: "address", label: "Address" },
  { field: "fatherName", label: "Father Name" },
  { field: "fatherPhone", label: "Father Phone" },
  { field: "motherName", label: "Mother Name" },
  { field: "motherPhone", label: "Mother Phone" },
  { field: "educationLevel", label: "Education Level" },
  { field: "institutionType", label: "Institution Type" },
];

export default function BulkImportPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<ImportStep>("upload");
  const [file, setFile] = useState<File | null>(null);
  const [excelColumns, setExcelColumns] = useState<string[]>([]);
  const [columnMappings, setColumnMappings] = useState<ColumnMapping[]>([]);
  const [importedData, setImportedData] = useState<ImportedRow[]>([]);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [importProgress, setImportProgress] = useState(0);
  const [successCount, setSuccessCount] = useState(0);
  const [errorCount, setErrorCount] = useState(0);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files?.[0];
    if (!uploadedFile) return;

    setFile(uploadedFile);

    // Read the Excel file
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = e.target?.result;
      const workbook = XLSX.read(data, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as ImportedCell[][];

      if (json.length > 0) {
        const headers = json[0] as string[];
        setExcelColumns(headers);

        // Auto-map columns based on similar names
        const autoMappings: ColumnMapping[] = [];
        [...REQUIRED_FIELDS, ...OPTIONAL_FIELDS].forEach((field) => {
          const matchingHeader = headers.find(
            (h) => h.toLowerCase().replace(/\s+/g, "") === field.field.toLowerCase().replace(/\s+/g, "")
          );
          if (matchingHeader) {
            autoMappings.push({
              excelColumn: matchingHeader,
              systemField: field.field,
            });
          }
        });
        setColumnMappings(autoMappings);

        // Parse data rows
        const dataRows = json.slice(1).map((row, index) => {
          const rowData: ImportedRow = { _rowNumber: index + 2, _errors: [] };
          headers.forEach((header, colIndex) => {
            rowData[header] = row[colIndex];
          });
          return rowData;
        });
        setImportedData(dataRows);

        setCurrentStep("mapping");
      }
    };
    reader.readAsBinaryString(uploadedFile);
  };

  const handleColumnMapping = (excelColumn: string, systemField: string) => {
    const existingMapping = columnMappings.find((m) => m.systemField === systemField);

    if (existingMapping) {
      setColumnMappings(
        columnMappings.map((m) =>
          m.systemField === systemField ? { ...m, excelColumn } : m
        )
      );
    } else {
      setColumnMappings([...columnMappings, { excelColumn, systemField }]);
    }
  };

  const removeMapping = (systemField: string) => {
    setColumnMappings(columnMappings.filter((m) => m.systemField !== systemField));
  };

  const handleProceedToPreview = () => {
    // Check if all required fields are mapped
    const missingFields = REQUIRED_FIELDS.filter(
      (field) => !columnMappings.find((m) => m.systemField === field.field)
    );

    if (missingFields.length > 0) {
      alert(`Please map the following required fields: ${missingFields.map((f) => f.label).join(", ")}`);
      return;
    }

    // Apply mappings to imported data
    const mappedData = importedData.map((row) => {
      const mappedRow: ImportedRow = { _rowNumber: row._rowNumber, _errors: [] };
      columnMappings.forEach((mapping) => {
        mappedRow[mapping.systemField] = row[mapping.excelColumn];
      });
      return mappedRow;
    });

    setImportedData(mappedData);
    setCurrentStep("preview");
  };

  const validateData = () => {
    const errors: ValidationError[] = [];

    importedData.forEach((row, _index) => {
      const rowErrors: ValidationError[] = [];

      // Validate required fields
      REQUIRED_FIELDS.forEach((field) => {
        if (!row[field.field] || String(row[field.field] ?? "").trim() === "") {
          rowErrors.push({
            row: row._rowNumber,
            field: field.field,
            message: `${field.label} is required`,
          });
        }
      });

      // Validate email format
      if (row.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(row.email))) {
        rowErrors.push({
          row: row._rowNumber,
          field: "email",
          message: "Invalid email format",
        });
      }

      // Validate gender
      if (row.gender && !["Male", "Female", "Other"].includes(String(row.gender))) {
        rowErrors.push({
          row: row._rowNumber,
          field: "gender",
          message: "Gender must be Male, Female, or Other",
        });
      }

      // Validate education level
      if (row.educationLevel && !["Primary", "Secondary", "Tertiary"].includes(String(row.educationLevel))) {
        rowErrors.push({
          row: row._rowNumber,
          field: "educationLevel",
          message: "Education Level must be Primary, Secondary, or Tertiary",
        });
      }

      row._errors = rowErrors;
      errors.push(...rowErrors);
    });

    setValidationErrors(errors);
    setCurrentStep("validation");
  };

  const handleImport = async () => {
    setCurrentStep("progress");
    setImportProgress(0);
    setSuccessCount(0);
    setErrorCount(0);

    const validRows = importedData.filter((row) => row._errors.length === 0);

    // Simulate import progress
    for (let i = 0; i < validRows.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 100)); // Simulate API call

      // Simulate success/failure (90% success rate)
      const success = Math.random() > 0.1;
      if (success) {
        setSuccessCount((prev) => prev + 1);
      } else {
        setErrorCount((prev) => prev + 1);
      }

      setImportProgress(((i + 1) / validRows.length) * 100);
    }

    setCurrentStep("complete");
  };

  const downloadSampleTemplate = () => {
    const headers = [...REQUIRED_FIELDS, ...OPTIONAL_FIELDS].map((f) => f.label);
    const sampleData = [
      ["ST001", "John", "Doe", "Smith", "X", "A", "2010-05-15", "O+", "john.doe@example.com", "1234567890", "123 Main St", "Michael Doe", "0987654321", "Jane Doe", "0987654322", "Secondary", "Private"],
      ["ST002", "Alice", "Johnson", "", "IX", "B", "2011-08-20", "A+", "alice.j@example.com", "2345678901", "456 Elm St", "Robert Johnson", "1234567890", "Emily Johnson", "1234567891", "Secondary", "Private"],
    ];

    const ws = XLSX.utils.aoa_to_sheet([headers, ...sampleData]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Students");
    XLSX.writeFile(wb, "student_import_template.xlsx");
  };

  const previewColumns: ColumnConfig<ImportedRow>[] = [
    {
      key: "_rowNumber",
      label: "Row",
      sortable: false,
      render: (row) => (
        <span className="text-xs text-neutral-500 dark:text-neutral-400">
          {row._rowNumber}
        </span>
      ),
    },
    ...columnMappings.slice(0, 5).map((mapping) => ({
      key: mapping.systemField,
      label: REQUIRED_FIELDS.concat(OPTIONAL_FIELDS).find((f) => f.field === mapping.systemField)?.label || mapping.systemField,
      sortable: false,
      render: (row: ImportedRow) => (
        <span className={row._errors.some((e) => e.field === mapping.systemField) ? "text-red-600 dark:text-red-400 midnight:text-red-400 purple:text-red-400" : ""}>
          {String(row[mapping.systemField] ?? "") || "-"}
        </span>
      ),
    })),
    {
      key: "status",
      label: "Status",
      sortable: false,
      render: (row) => (
        <div className="flex items-center gap-2">
          {row._errors.length === 0 ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400 midnight:text-emerald-400 purple:text-emerald-400" />
              <span className="text-xs text-green-600 dark:text-green-400 midnight:text-emerald-400 purple:text-emerald-400">Valid</span>
            </>
          ) : (
            <>
              <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 midnight:text-red-400 purple:text-red-400" />
              <span className="text-xs text-red-600 dark:text-red-400 midnight:text-red-400 purple:text-red-400">{row._errors.length} errors</span>
            </>
          )}
        </div>
      ),
    },
  ];

  return (
    <DashboardPage
      title="Bulk Import Students"
      breadcrumbs={[
        { label: "Dashboard", href: "/" },
        { label: "Students", href: "/students" },
        { label: "Bulk Import", isActive: true },
      ]}
      loadingText="Loading Bulk Import"
      afterStats={
        <div className="mt-6 p-6 space-y-6">
          {/* Header Actions */}
          <div className="flex items-center justify-end">
            <Button
              variant="outline"
              onClick={downloadSampleTemplate}
              className="flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Download Sample Template
            </Button>
          </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-between bg-white dark:bg-neutral-800 rounded-lg p-6 shadow-sm">
        {["upload", "mapping", "preview", "validation", "complete"].map((step, index) => (
          <div key={step} className="flex items-center">
            <div className="flex flex-col items-center gap-2">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                  currentStep === step
                    ? "bg-purple-600 text-white"
                    : ["upload", "mapping", "preview", "validation"].indexOf(currentStep) > index
                    ? "bg-green-600 text-white"
                    : "bg-neutral-200 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-400"
                }`}
              >
                {["upload", "mapping", "preview", "validation"].indexOf(currentStep) > index ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : (
                  index + 1
                )}
              </div>
              <span className="text-xs font-medium capitalize text-neutral-700 dark:text-neutral-300">
                {step}
              </span>
            </div>
            {index < 4 && (
              <div
                className={`w-24 h-1 mx-2 ${
                  ["upload", "mapping", "preview", "validation"].indexOf(currentStep) > index
                    ? "bg-green-600"
                    : "bg-neutral-200 dark:bg-neutral-700"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      {currentStep === "upload" && (
        <div className="bg-white dark:bg-neutral-800 rounded-lg p-12 shadow-sm">
          <div className="max-w-2xl mx-auto text-center space-y-6">
            <FileSpreadsheet className="w-16 h-16 mx-auto text-purple-600" />
            <div>
              <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                Upload Your File
              </h2>
              <p className="text-neutral-600 dark:text-neutral-400">
                Select an Excel (.xlsx, .xls) or CSV file containing student data
              </p>
            </div>
            <div className="border-2 border-dashed border-neutral-300 dark:border-neutral-600 rounded-lg p-12 hover:border-purple-400 dark:hover:border-purple-500 transition-colors">
              <input
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer flex flex-col items-center gap-4"
              >
                <Upload className="w-12 h-12 text-neutral-400 dark:text-neutral-500" />
                <div>
                  <p className="text-lg font-medium text-neutral-700 dark:text-neutral-300">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">
                    Excel (.xlsx, .xls) or CSV files
                  </p>
                </div>
              </label>
            </div>
            {file && (
              <div className="flex items-center justify-center gap-3 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <FileSpreadsheet className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <span className="text-sm font-medium text-purple-900 dark:text-purple-100">
                  {file.name}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {currentStep === "mapping" && (
        <div className="bg-white dark:bg-neutral-800 rounded-lg p-6 shadow-sm space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
              Map Columns
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400">
              Match your Excel columns to the system fields
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {/* Required Fields */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 flex items-center gap-2">
                <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                Required Fields
              </h3>
              {REQUIRED_FIELDS.map((field) => {
                const mapping = columnMappings.find((m) => m.systemField === field.field);
                return (
                  <div key={field.field} className="flex items-center gap-3">
                    <label className="w-1/3 text-sm font-medium text-neutral-700 dark:text-neutral-300">
                      {field.label}
                    </label>
                    <div className="flex-1 flex items-center gap-2">
                      <select
                        value={mapping?.excelColumn || ""}
                        onChange={(e) => handleColumnMapping(e.target.value, field.field)}
                        className="flex-1 px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="">Select column...</option>
                        {excelColumns.map((col) => (
                          <option key={col} value={col}>
                            {col}
                          </option>
                        ))}
                      </select>
                      {mapping && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeMapping(field.field)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Optional Fields */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 flex items-center gap-2">
                <span className="w-2 h-2 bg-neutral-400 rounded-full"></span>
                Optional Fields
              </h3>
              {OPTIONAL_FIELDS.map((field) => {
                const mapping = columnMappings.find((m) => m.systemField === field.field);
                return (
                  <div key={field.field} className="flex items-center gap-3">
                    <label className="w-1/3 text-sm font-medium text-neutral-700 dark:text-neutral-300">
                      {field.label}
                    </label>
                    <div className="flex-1 flex items-center gap-2">
                      <select
                        value={mapping?.excelColumn || ""}
                        onChange={(e) => handleColumnMapping(e.target.value, field.field)}
                        className="flex-1 px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="">Select column...</option>
                        {excelColumns.map((col) => (
                          <option key={col} value={col}>
                            {col}
                          </option>
                        ))}
                      </select>
                      {mapping && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeMapping(field.field)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button onClick={handleProceedToPreview}>
              Continue to Preview
            </Button>
          </div>
        </div>
      )}

      {currentStep === "preview" && (
        <div className="bg-white dark:bg-neutral-800 rounded-lg p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                Preview Import Data
              </h2>
              <p className="text-neutral-600 dark:text-neutral-400">
                Review the data before importing ({importedData.length} records)
              </p>
            </div>
            <Button onClick={validateData}>
              Validate Data
            </Button>
          </div>

          <ResponsiveListTable variant="contained" showColumnHeaders={true}
            data={importedData.slice(0, 100)}
            columns={previewColumns}
            getRowKey={(row) => row._rowNumber.toString()}
            isLoading={false}
            emptyMessage="No data to preview"
          />

          {importedData.length > 100 && (
            <p className="text-sm text-neutral-600 dark:text-neutral-400 text-center">
              Showing first 100 records of {importedData.length}
            </p>
          )}
        </div>
      )}

      {currentStep === "validation" && (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-3 gap-6">
            <div className="bg-white dark:bg-neutral-800 rounded-lg p-6 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400 midnight:text-emerald-400 purple:text-emerald-400" />
                </div>
                <div>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">Valid Records</p>
                  <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                    {importedData.filter((r) => r._errors.length === 0).length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-neutral-800 rounded-lg p-6 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-red-100 dark:bg-red-900/30 midnight:bg-red-900/30 purple:bg-red-900/30 flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400 midnight:text-red-400 purple:text-red-400" />
                </div>
                <div>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">Invalid Records</p>
                  <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                    {importedData.filter((r) => r._errors.length > 0).length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-neutral-800 rounded-lg p-6 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-amber-600 dark:text-amber-400 midnight:text-amber-400 purple:text-amber-400" />
                </div>
                <div>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">Total Errors</p>
                  <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                    {validationErrors.length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Error Details */}
          {validationErrors.length > 0 && (
            <div className="bg-white dark:bg-neutral-800 rounded-lg p-6 shadow-sm space-y-4">
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                Validation Errors
              </h3>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {validationErrors.slice(0, 50).map((error, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-3 bg-red-50 dark:bg-red-900/20 midnight:bg-red-900/20 purple:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800"
                  >
                    <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 midnight:text-red-400 purple:text-red-400 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-red-900 dark:text-red-100">
                        Row {error.row}: {error.field}
                      </p>
                      <p className="text-sm text-red-700 dark:text-red-300">
                        {error.message}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              {validationErrors.length > 50 && (
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  Showing first 50 of {validationErrors.length} errors
                </p>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => setCurrentStep("mapping")}
            >
              Back to Mapping
            </Button>
            <Button
              onClick={handleImport}
              disabled={importedData.filter((r) => r._errors.length === 0).length === 0}
            >
              Import {importedData.filter((r) => r._errors.length === 0).length} Valid Records
            </Button>
          </div>
        </div>
      )}

      {currentStep === "progress" && (
        <div className="bg-white dark:bg-neutral-800 rounded-lg p-12 shadow-sm">
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
                Importing Students...
              </h2>
              <p className="text-neutral-600 dark:text-neutral-400">
                Please wait while we import your students
              </p>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-neutral-600 dark:text-neutral-400">
                <span>Progress</span>
                <span>{Math.round(importProgress)}%</span>
              </div>
              <div className="w-full h-3 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-purple-600 transition-all duration-300"
                  style={{ width: `${importProgress}%` }}
                />
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <p className="text-sm text-green-700 dark:text-green-300">Imported</p>
                <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                  {successCount}
                </p>
              </div>
              <div className="p-4 bg-red-50 dark:bg-red-900/20 midnight:bg-red-900/20 purple:bg-red-900/20 rounded-lg">
                <p className="text-sm text-red-700 dark:text-red-300">Failed</p>
                <p className="text-2xl font-bold text-red-900 dark:text-red-100">
                  {errorCount}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {currentStep === "complete" && (
        <div className="bg-white dark:bg-neutral-800 rounded-lg p-12 shadow-sm">
          <div className="max-w-2xl mx-auto text-center space-y-6">
            <div className="w-16 h-16 mx-auto bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10 text-green-600 dark:text-green-400 midnight:text-emerald-400 purple:text-emerald-400" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                Import Complete!
              </h2>
              <p className="text-neutral-600 dark:text-neutral-400">
                Your students have been imported successfully
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <p className="text-sm text-green-700 dark:text-green-300">Successfully Imported</p>
                <p className="text-3xl font-bold text-green-900 dark:text-green-100">
                  {successCount}
                </p>
              </div>
              <div className="p-4 bg-red-50 dark:bg-red-900/20 midnight:bg-red-900/20 purple:bg-red-900/20 rounded-lg">
                <p className="text-sm text-red-700 dark:text-red-300">Failed</p>
                <p className="text-3xl font-bold text-red-900 dark:text-red-100">
                  {errorCount}
                </p>
              </div>
            </div>

            <div className="flex gap-4 justify-center pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setCurrentStep("upload");
                  setFile(null);
                  setExcelColumns([]);
                  setColumnMappings([]);
                  setImportedData([]);
                  setValidationErrors([]);
                  setImportProgress(0);
                  setSuccessCount(0);
                  setErrorCount(0);
                }}
              >
                Import More
              </Button>
              <Button onClick={() => router.push("/students")}>
                View Students
              </Button>
            </div>
          </div>
        </div>
      )}
        </div>
      }
    />
  );
}
