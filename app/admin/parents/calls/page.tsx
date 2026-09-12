"use client";

import { useState, useMemo } from "react";
import DashboardPage from "@/components/shared/DashboardPage";
import { CallLogsPageContent, CallLog, CallLogsPageConfig } from "@/components/shared/call-logs";
import { useCall } from "@/hooks/useCall";
import { getAllParents } from "@/lib/mockParents";

// Generate mock call logs for parent admin view
const generateCallLogs = (): CallLog[] => {
  const parents = getAllParents();
  const calls: CallLog[] = [];

  const callTypes: Array<"video" | "voice"> = ["video", "voice"];
  const callStatuses: Array<"completed" | "missed" | "declined" | "no_answer"> = [
    "completed",
    "completed",
    "completed",
    "missed",
    "no_answer",
    "declined",
  ];
  const callDirections: Array<"incoming" | "outgoing"> = ["incoming", "outgoing"];

  let callId = 1;

  parents.forEach((parent, index) => {
    // Generate 1-3 calls per parent
    const numCalls = (index % 3) + 1;

    for (let i = 0; i < numCalls; i++) {
      const daysAgo = (index + i) % 14;
      const hoursAgo = ((index * 3) + i) % 24;
      const timestamp = new Date("2026-01-25T12:00:00");
      timestamp.setDate(timestamp.getDate() - daysAgo);
      timestamp.setHours(timestamp.getHours() - hoursAgo);

      const callType = callTypes[(index + i) % callTypes.length];
      const callStatus = callStatuses[(index + i) % callStatuses.length];
      const callDirection = callDirections[(index + i) % callDirections.length];

      // Duration only for completed calls
      const duration = callStatus === "completed" ? ((index + i) % 20 + 1) * 60 + ((index * i) % 60) : undefined;

      calls.push({
        id: `call-${String(callId++).padStart(4, "0")}`,
        recipientId: parent.id,
        recipientName: `${parent.firstName} ${parent.lastName}`,
        recipientAvatar: parent.profilePhoto,
        recipientEmail: parent.email,
        recipientRole: "Parent",
        callType,
        callDirection,
        callStatus,
        startTime: timestamp.toISOString(),
        endTime: duration ? new Date(timestamp.getTime() + duration * 1000).toISOString() : undefined,
        duration,
        recordingUrl: callStatus === "completed" && (index + i) % 3 === 0 ? `/recordings/call-${callId}.mp3` : undefined,
        childName: parent.children[0]?.fullName,
      });
    }
  });

  // Sort by most recent first
  return calls.sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());
};

const MOCK_CALLS = generateCallLogs();

export default function AdminParentCallsPage() {
  const [calls] = useState<CallLog[]>(MOCK_CALLS);
  const { startVideoCall, startVoiceCall } = useCall();

  // Handler for callback functionality
  const handleCallback = (call: CallLog) => {
    const participant = {
      id: call.recipientId,
      name: call.recipientName,
      avatar: call.recipientAvatar,
      email: call.recipientEmail,
      role: call.recipientRole,
    };

    if (call.callType === "video") {
      startVideoCall(participant, { callContext: `Callback to ${call.recipientName}` });
    } else {
      startVoiceCall(participant, { callContext: `Callback to ${call.recipientName}` });
    }
  };

  // Page configuration
  const config: CallLogsPageConfig = useMemo(() => ({
    recipientType: "parent",
    recipientLabel: "Parent",
    recipientLabelPlural: "Parents",
    pageTitle: "Parent Call History",
    basePath: "/admin/parents",
    breadcrumbs: [
      { label: "Dashboard", href: "/" },
      { label: "Admin" },
      { label: "Parents", href: "/admin/parents" },
      { label: "Calls", isActive: true },
    ],
    viewCallUrl: (call) => `/admin/parents/calls/${call.id}`,
  }), []);

  return (
    <DashboardPage
      title={config.pageTitle}
      breadcrumbs={config.breadcrumbs}
      loadingText="Loading Call History"
      afterStats={
        <CallLogsPageContent
          calls={calls}
          config={config}
          onCallback={handleCallback}
        />
      }
    />
  );
}
