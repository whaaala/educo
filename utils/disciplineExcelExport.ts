import * as XLSX from "xlsx";
import { DisciplineIncident } from "@/types/discipline";
import { format } from "date-fns";

export function exportDisciplineToExcel(incidents: DisciplineIncident[], filename: string = "discipline-records.xlsx") {
  // Helper function to get category label
  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      "disruptive-behavior": "Disruptive Behavior",
      "attendance": "Attendance",
      "academic-dishonesty": "Academic Dishonesty",
      "bullying": "Bullying",
      "violence": "Violence",
      "property-damage": "Property Damage",
      "substance-abuse": "Substance Abuse",
      "dress-code": "Dress Code",
      "technology-misuse": "Technology Misuse",
      "other": "Other",
    };
    return labels[category] || category;
  };

  // Helper function to get status label
  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      "reported": "Reported",
      "under-review": "Under Review",
      "resolved": "Resolved",
      "appealed": "Appealed",
      "closed": "Closed",
    };
    return labels[status] || status;
  };

  // Helper function to get action type label
  const getActionTypeLabel = (actionType: string) => {
    return actionType
      .split("-")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  // Prepare data for Excel - Main Sheet
  const worksheetData = [
    // Header row
    [
      "Incident ID",
      "Date",
      "Time",
      "Student Name",
      "Admission No.",
      "Class",
      "Section",
      "Incident Title",
      "Description",
      "Location",
      "Category",
      "Severity",
      "Status",
      "Action Taken",
      "Action Details",
      "Action Start Date",
      "Action End Date",
      "Witnesses",
      "Reported By",
      "Reporter Role",
      "Reported Date",
      "Parent Notified",
      "Parent Notified Date",
      "Follow Up Required",
      "Follow Up Date",
      "Resolved Date",
    ],
    // Data rows
    ...incidents.map((incident) => [
      incident.id,
      format(new Date(incident.incidentDate), "MMM dd, yyyy"),
      incident.incidentTime,
      incident.studentName,
      incident.studentAdmissionNumber,
      incident.studentClass,
      incident.studentSection,
      incident.title,
      incident.description,
      incident.location,
      getCategoryLabel(incident.category),
      incident.severity.charAt(0).toUpperCase() + incident.severity.slice(1),
      getStatusLabel(incident.status),
      incident.actionType ? getActionTypeLabel(incident.actionType) : "-",
      incident.actionDetails || "-",
      incident.actionStartDate ? format(new Date(incident.actionStartDate), "MMM dd, yyyy") : "-",
      incident.actionEndDate ? format(new Date(incident.actionEndDate), "MMM dd, yyyy") : "-",
      incident.witnesses ? incident.witnesses.join(", ") : "-",
      incident.reportedByName,
      incident.reportedByRole,
      incident.reportedDate ? format(new Date(incident.reportedDate), "MMM dd, yyyy HH:mm") : "-",
      incident.parentNotified ? "Yes" : "No",
      incident.parentNotifiedDate ? format(new Date(incident.parentNotifiedDate), "MMM dd, yyyy") : "-",
      incident.followUpRequired ? "Yes" : "No",
      incident.followUpDate ? format(new Date(incident.followUpDate), "MMM dd, yyyy") : "-",
      incident.resolvedAt ? format(new Date(incident.resolvedAt), "MMM dd, yyyy HH:mm") : "-",
    ]),
  ];

  // Create worksheet
  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

  // Set column widths for better readability
  const columnWidths = [
    { wch: 12 }, // Incident ID
    { wch: 14 }, // Date
    { wch: 10 }, // Time
    { wch: 20 }, // Student Name
    { wch: 15 }, // Admission No.
    { wch: 10 }, // Class
    { wch: 10 }, // Section
    { wch: 30 }, // Incident Title
    { wch: 50 }, // Description
    { wch: 20 }, // Location
    { wch: 20 }, // Category
    { wch: 12 }, // Severity
    { wch: 14 }, // Status
    { wch: 20 }, // Action Taken
    { wch: 40 }, // Action Details
    { wch: 16 }, // Action Start Date
    { wch: 16 }, // Action End Date
    { wch: 30 }, // Witnesses
    { wch: 20 }, // Reported By
    { wch: 20 }, // Reporter Role
    { wch: 18 }, // Reported Date
    { wch: 14 }, // Parent Notified
    { wch: 18 }, // Parent Notified Date
    { wch: 16 }, // Follow Up Required
    { wch: 16 }, // Follow Up Date
    { wch: 18 }, // Resolved Date
  ];
  worksheet["!cols"] = columnWidths;

  // Style the header row
  const headerRange = XLSX.utils.decode_range(worksheet["!ref"] || "A1");
  for (let col = headerRange.s.c; col <= headerRange.e.c; col++) {
    const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col });
    if (!worksheet[cellAddress]) continue;

    worksheet[cellAddress].s = {
      font: { bold: true, color: { rgb: "FFFFFF" } },
      fill: { fgColor: { rgb: "3B82F6" } },
      alignment: { horizontal: "center", vertical: "center" },
    };
  }

  // Calculate summary statistics
  const stats = {
    total: incidents.length,
    minor: incidents.filter(i => i.severity === "minor").length,
    moderate: incidents.filter(i => i.severity === "moderate").length,
    major: incidents.filter(i => i.severity === "major").length,
    critical: incidents.filter(i => i.severity === "critical").length,
    reported: incidents.filter(i => i.status === "reported").length,
    underReview: incidents.filter(i => i.status === "under-review").length,
    resolved: incidents.filter(i => i.status === "resolved").length,
    appealed: incidents.filter(i => i.status === "appealed").length,
    closed: incidents.filter(i => i.status === "closed").length,
    uniqueStudents: new Set(incidents.map(i => i.studentId)).size,
    parentNotified: incidents.filter(i => i.parentNotified).length,
    followUpRequired: incidents.filter(i => i.followUpRequired).length,
  };

  // Add summary sheet
  const summaryData = [
    ["Discipline Records Export Summary"],
    [""],
    ["Generated On:", new Date().toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })],
    [""],
    ["Overall Statistics"],
    ["Total Incidents:", stats.total],
    ["Unique Students Involved:", stats.uniqueStudents],
    ["Active Cases:", stats.reported + stats.underReview],
    ["Resolved Cases:", stats.resolved + stats.closed],
    [""],
    ["Severity Breakdown"],
    ["Minor:", stats.minor],
    ["Moderate:", stats.moderate],
    ["Major:", stats.major],
    ["Critical:", stats.critical],
    [""],
    ["Status Breakdown"],
    ["Reported:", stats.reported],
    ["Under Review:", stats.underReview],
    ["Resolved:", stats.resolved],
    ["Appealed:", stats.appealed],
    ["Closed:", stats.closed],
    [""],
    ["Additional Statistics"],
    ["Parent Notified:", stats.parentNotified],
    ["Follow-up Required:", stats.followUpRequired],
    ["Parent Notification Rate:", incidents.length > 0 ? `${((stats.parentNotified / incidents.length) * 100).toFixed(1)}%` : "0%"],
    ["Resolution Rate:", incidents.length > 0 ? `${(((stats.resolved + stats.closed) / incidents.length) * 100).toFixed(1)}%` : "0%"],
    [""],
    ["Category Distribution"],
  ];

  // Add category breakdown
  const categoryCount: Record<string, number> = {};
  incidents.forEach(incident => {
    const label = getCategoryLabel(incident.category);
    categoryCount[label] = (categoryCount[label] || 0) + 1;
  });

  Object.entries(categoryCount)
    .sort((a, b) => b[1] - a[1])
    .forEach(([category, count]) => {
      summaryData.push([category + ":", count]);
    });

  summaryData.push([""], ["Column Descriptions"]);
  summaryData.push(["Incident ID", "Unique identifier for each incident"]);
  summaryData.push(["Date", "Date when incident occurred"]);
  summaryData.push(["Time", "Time when incident occurred"]);
  summaryData.push(["Student Name", "Full name of the student involved"]);
  summaryData.push(["Admission No.", "Student's admission number"]);
  summaryData.push(["Class", "Student's class"]);
  summaryData.push(["Section", "Student's section"]);
  summaryData.push(["Incident Title", "Brief title of the incident"]);
  summaryData.push(["Description", "Detailed description of the incident"]);
  summaryData.push(["Location", "Location where incident occurred"]);
  summaryData.push(["Category", "Type/category of the incident"]);
  summaryData.push(["Severity", "Severity level (Minor, Moderate, Major, Critical)"]);
  summaryData.push(["Status", "Current status of the incident"]);
  summaryData.push(["Action Taken", "Type of action taken"]);
  summaryData.push(["Action Details", "Details of the action taken"]);
  summaryData.push(["Witnesses", "People who witnessed the incident"]);
  summaryData.push(["Reported By", "Name of person who reported"]);
  summaryData.push(["Reporter Role", "Role of the person who reported"]);
  summaryData.push(["Parent Notified", "Whether parent was notified"]);
  summaryData.push(["Follow Up Required", "Whether follow-up is required"]);

  const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);

  // Set column widths for summary sheet
  summarySheet["!cols"] = [
    { wch: 30 },
    { wch: 50 },
  ];

  // Create workbook
  const workbook = XLSX.utils.book_new();

  // Add sheets to workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, "Discipline Records");
  XLSX.utils.book_append_sheet(workbook, summarySheet, "Summary");

  // Generate Excel file and trigger download
  XLSX.writeFile(workbook, filename);
}
