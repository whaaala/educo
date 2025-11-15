"use client";

import { useState } from "react";
import { Plus, Download, RefreshCw } from "lucide-react";
import { TranscriptRequest, TranscriptStatus, TranscriptType, PaymentStatus } from "@/types/transcript";
import { mockTranscriptRequests } from "@/data/mockTranscriptData";
import MainLayout from "@/components/layout/MainLayout";
import PageHeader from "@/components/shared/PageHeader";
import PageActions from "@/components/shared/PageActions";
import SearchFilterBar from "@/components/shared/SearchFilterBar";
import TranscriptStatisticsCards from "@/components/transcript/TranscriptStatisticsCards";
import TranscriptRequestsTable from "@/components/transcript/TranscriptRequestsTable";
import TranscriptDetailModal from "@/components/transcript/TranscriptDetailModal";
import TranscriptRequestForm from "@/components/transcript/TranscriptRequestForm";
import TranscriptTemplate from "@/components/transcript/TranscriptTemplate";
import TranscriptTemplatePrintable from "@/components/transcript/TranscriptTemplatePrintable";
import { generateTranscriptPDF } from "@/utils/transcriptPdfExport";

export default function TranscriptsPage() {
  const [requests, setRequests] = useState<TranscriptRequest[]>(mockTranscriptRequests);
  const [selectedRequest, setSelectedRequest] = useState<TranscriptRequest | null>(null);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<TranscriptStatus | "all">("all");
  const [filterType, setFilterType] = useState<TranscriptType | "all">("all");
  const [filterPayment, setFilterPayment] = useState<PaymentStatus | "all">("all");
  const [filterYear, setFilterYear] = useState<string>("all");

  // Filter requests
  const filteredRequests = requests.filter((request) => {
    const matchesSearch =
      searchQuery === "" ||
      request.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.studentAdmissionNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.requestNumber.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = filterStatus === "all" || request.status === filterStatus;
    const matchesType = filterType === "all" || request.transcriptType === filterType;
    const matchesPayment = filterPayment === "all" || request.payment.status === filterPayment;

    // Extract year from request date
    const requestYear = new Date(request.requestDate).getFullYear().toString();
    const matchesYear = filterYear === "all" || requestYear === filterYear;

    return matchesSearch && matchesStatus && matchesType && matchesPayment && matchesYear;
  });

  const handleViewDetails = (request: TranscriptRequest) => {
    setSelectedRequest(request);
  };

  const handleRequestNew = () => {
    setShowRequestForm(true);
  };

  const handleSubmitRequest = (requestData: Partial<TranscriptRequest>) => {
    const newRequest: TranscriptRequest = {
      ...requestData,
      id: `TR${String(requests.length + 1).padStart(3, '0')}`,
      requestNumber: `TR-2025-${String(requests.length + 1).padStart(3, '0')}`,
      requestDate: new Date().toISOString(),
      status: 'pending',
      statusHistory: [
        {
          status: 'pending',
          timestamp: new Date().toISOString(),
          updatedBy: 'System',
          remarks: 'Request submitted',
        },
      ],
      verificationCode: `VRF-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
      graduationYear: requestData.toYear,
    } as TranscriptRequest;

    setRequests([newRequest, ...requests]);
    setShowRequestForm(false);
  };

  const handleEdit = (request: TranscriptRequest) => {
    console.log("Edit request:", request);
    // TODO: Open edit form
  };

  const handleDelete = (requestId: string) => {
    console.log("Delete request:", requestId);
    // TODO: Show delete confirmation modal
  };

  const handleDownload = async (request: TranscriptRequest) => {
    try {
      await generateTranscriptPDF(request);
    } catch (error) {
      console.error("Error downloading transcript:", error);
      alert("Failed to download transcript. Please try again.");
    }
  };

  const handleExportPDF = () => {
    console.log("Export to PDF");
    // TODO: Export filtered requests to PDF
  };

  const handleExportExcel = () => {
    console.log("Export to Excel");
    // TODO: Export filtered requests to Excel
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header with Breadcrumbs and Actions */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-4 border-b border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20">
          <PageHeader
            title="Transcript Management"
            breadcrumbs={[
              { label: "Dashboard", href: "/" },
              { label: "Students", href: "/students" },
              { label: "Transcripts", isActive: true },
            ]}
          />
          <PageActions
            onRefresh={() => window.location.reload()}
            onAdd={handleRequestNew}
            onExportPDF={handleExportPDF}
            onExportExcel={handleExportExcel}
            addButtonLabel="Request Transcript"
            exportDescription="Export transcript records"
            showPrint={false}
          />
        </div>

        {/* Statistics Cards */}
        <TranscriptStatisticsCards requests={requests} />

        {/* Search and Filters */}
        <SearchFilterBar
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="Search by student name, admission number, or request number..."
          filters={[
            {
              label: "Year Filter",
              value: filterYear,
              onChange: (value) => setFilterYear(value as string),
              options: [
                { label: "All Years", value: "all" },
                { label: "2025", value: "2025" },
                { label: "2024", value: "2024" },
                { label: "2023", value: "2023" },
                { label: "2022", value: "2022" },
              ],
            },
            {
              label: "Type Filter",
              value: filterType,
              onChange: (value) => setFilterType(value as TranscriptType | "all"),
              options: [
                { label: "All Types", value: "all" },
                { label: "Official", value: "official" },
                { label: "Unofficial", value: "unofficial" },
              ],
            },
            {
              label: "Status Filter",
              value: filterStatus,
              onChange: (value) => setFilterStatus(value as TranscriptStatus | "all"),
              options: [
                { label: "All Status", value: "all" },
                { label: "Pending", value: "pending" },
                { label: "Processing", value: "processing" },
                { label: "Ready", value: "ready" },
                { label: "Delivered", value: "delivered" },
                { label: "Rejected", value: "rejected" },
              ],
            },
            {
              label: "Payment Filter",
              value: filterPayment,
              onChange: (value) => setFilterPayment(value as PaymentStatus | "all"),
              options: [
                { label: "All Payments", value: "all" },
                { label: "Paid", value: "paid" },
                { label: "Unpaid", value: "unpaid" },
                { label: "Partial", value: "partial" },
                { label: "Waived", value: "waived" },
              ],
            },
          ]}
        />

        {/* Transcript Requests Table */}
        <TranscriptRequestsTable
          requests={filteredRequests}
          onViewDetails={handleViewDetails}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onDownload={handleDownload}
          filterKey={`${searchQuery}-${filterYear}-${filterType}-${filterStatus}-${filterPayment}`}
        />
      </div>

      {/* Transcript Detail Modal */}
      {selectedRequest && (
        <TranscriptDetailModal
          request={selectedRequest}
          isOpen={selectedRequest !== null}
          onClose={() => setSelectedRequest(null)}
        />
      )}

      {/* Transcript Request Form Modal */}
      <TranscriptRequestForm
        isOpen={showRequestForm}
        onClose={() => setShowRequestForm(false)}
        onSubmit={handleSubmitRequest}
      />

      {/* Hidden transcript templates for PDF generation - using printable version with RGB colors */}
      <div className="hidden">
        {requests.map((request) => (
          <div key={request.id} id={`transcript-temp-${request.id}`}>
            <TranscriptTemplatePrintable
              request={request}
              showWatermark={request.transcriptType === "official"}
            />
          </div>
        ))}
      </div>
    </MainLayout>
  );
}
