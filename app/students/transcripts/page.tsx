"use client";

import { useState } from "react";
import { TranscriptRequest } from "@/types/transcript";
import { mockTranscriptRequests } from "@/data/mockTranscriptData";
import DataManagementPage from "@/components/pages/DataManagementPage";
import TranscriptRequestsTable from "@/components/transcript/TranscriptRequestsTable";
import TranscriptDetailModal from "@/components/transcript/TranscriptDetailModal";
import TranscriptRequestForm from "@/components/transcript/TranscriptRequestForm";
import TranscriptTemplatePrintable from "@/components/transcript/TranscriptTemplatePrintable";
import { generateTranscriptPDF } from "@/utils/transcriptPdfExport";
import { exportTranscriptRequestsToPDF } from "@/utils/transcriptRequestsPdfExport";
import { exportTranscriptRequestsToExcel } from "@/utils/transcriptRequestsExcelExport";
import {
  transcriptFilterFields,
  transcriptSortOptions,
  transcriptStats,
  filterTranscriptRequests,
  sortTranscriptRequests,
} from "./config";

export default function TranscriptsPage() {
  const [requests, setRequests] = useState<TranscriptRequest[]>(mockTranscriptRequests);
  const [selectedRequest, setSelectedRequest] = useState<TranscriptRequest | null>(null);
  const [showRequestForm, setShowRequestForm] = useState(false);

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

  const handleExportPDF = (items: TranscriptRequest[]) => {
    const dateStr = new Date().toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '-');
    exportTranscriptRequestsToPDF(items, `transcript-requests_${dateStr}.pdf`);
  };

  const handleExportExcel = (items: TranscriptRequest[]) => {
    const dateStr = new Date().toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '-');
    exportTranscriptRequestsToExcel(items, `transcript-requests_${dateStr}.xlsx`);
  };

  return (
    <DataManagementPage<TranscriptRequest>
      title="Transcript Management"
      breadcrumbs={[
        { label: "Dashboard", href: "/" },
        { label: "Students", href: "/students" },
        { label: "Transcripts", isActive: true },
      ]}
      data={requests}
      getRowKey={(item) => item.id}
      columns={[]} // Using customListComponent instead
      stats={transcriptStats}
      statsColumns={{ default: 2, sm: 4, md: 8 }}
      filterFields={transcriptFilterFields}
      sortOptions={transcriptSortOptions}
      defaultSort="newest"
      filterFn={filterTranscriptRequests}
      sortFn={sortTranscriptRequests}
      enableViewToggle={false}
      enableSelection={false}
      enableExport={true}
      onExportPDF={handleExportPDF}
      onExportExcel={handleExportExcel}
      addButtonConfig={{
        label: "Request Transcript",
        onClick: handleRequestNew,
      }}
      itemLabel="request"
      itemLabelPlural="requests"
      showTableSearch={false}
      customListComponent={
        <TranscriptRequestsTable
          requests={requests}
          onViewDetails={handleViewDetails}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onDownload={handleDownload}
        />
      }
    >
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
    </DataManagementPage>
  );
}
