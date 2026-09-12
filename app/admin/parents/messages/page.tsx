"use client";

import { useState, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { DashboardPage } from "@/components/pages";
import { MessagesPageContent, AdminMessage, MessagesPageConfig } from "@/components/shared/messages";
import { getAllParents } from "@/lib/mockParents";

// Generate mock messages for parent admin view
const generateAdminMessages = (): AdminMessage[] => {
  const parents = getAllParents();
  const messages: AdminMessage[] = [];
  const subjects = [
    { category: "Academic" as const, subjects: ["Progress Report for", "Test Results Discussion", "Homework Submission Issue", "Parent-Teacher Meeting Request"] },
    { category: "Fee" as const, subjects: ["Fee Payment Confirmation", "Outstanding Balance Query", "Payment Plan Request", "Fee Receipt Request"] },
    { category: "Event" as const, subjects: ["School Event Invitation", "Sports Day Confirmation", "Cultural Day Participation", "Annual Day Registration"] },
    { category: "General" as const, subjects: ["General Inquiry", "School Policy Question", "Feedback and Suggestions", "Contact Information Update"] },
    { category: "Complaint" as const, subjects: ["Service Complaint", "Concern About Facilities", "Bus Service Issue", "Safety Concern"] },
    { category: "Inquiry" as const, subjects: ["Admission Inquiry", "Curriculum Question", "Extra-curricular Activities", "School Timings Query"] },
  ];
  const teachers = [
    { id: "teacher-001", name: "Mrs. Nkechi Eze", avatar: "https://i.pravatar.cc/150?u=nkechi" },
    { id: "teacher-002", name: "Mr. Oluwaseun Adeyemi", avatar: "https://i.pravatar.cc/150?u=oluwaseun" },
    { id: "teacher-003", name: "Miss Amaka Nwankwo", avatar: "https://i.pravatar.cc/150?u=amaka" },
    { id: "teacher-004", name: "Mr. Chidi Okafor", avatar: "https://i.pravatar.cc/150?u=chidi" },
  ];

  let msgId = 1;

  parents.forEach((parent) => {
    const numMessages = Math.floor(Math.random() * 4) + 2;

    for (let i = 0; i < numMessages; i++) {
      const isReceived = Math.random() > 0.4;
      const categoryData = subjects[Math.floor(Math.random() * subjects.length)];
      const subjectTemplate = categoryData.subjects[Math.floor(Math.random() * categoryData.subjects.length)];
      const teacher = teachers[Math.floor(Math.random() * teachers.length)];
      const child = parent.children[Math.floor(Math.random() * parent.children.length)];

      const daysAgo = Math.floor(Math.random() * 30);
      const timestamp = new Date();
      timestamp.setDate(timestamp.getDate() - daysAgo);
      timestamp.setHours(Math.floor(Math.random() * 12) + 8, Math.floor(Math.random() * 60));

      const subject = subjectTemplate.includes("for")
        ? `${subjectTemplate} ${child.fullName}`
        : subjectTemplate;

      if (isReceived) {
        messages.push({
          id: `msg-${String(msgId++).padStart(4, "0")}`,
          type: "received",
          senderId: parent.id,
          senderName: `${parent.firstName} ${parent.lastName}`,
          senderRole: "Parent",
          senderAvatar: parent.profilePhoto,
          recipientId: teacher.id,
          recipientName: teacher.name,
          recipientRole: "Teacher",
          recipientAvatar: teacher.avatar,
          subject,
          preview: `Dear ${teacher.name.split(" ")[0]}, I am writing to discuss ${subject.toLowerCase()}...`,
          timestamp: timestamp.toISOString(),
          isRead: Math.random() > 0.3,
          hasAttachment: Math.random() > 0.8,
          priority: Math.random() > 0.85 ? "high" : Math.random() > 0.7 ? "normal" : "low",
          category: categoryData.category,
          childName: child.fullName,
          childId: child.id,
        });
      } else {
        messages.push({
          id: `msg-${String(msgId++).padStart(4, "0")}`,
          type: "sent",
          senderId: teacher.id,
          senderName: teacher.name,
          senderRole: "Teacher",
          senderAvatar: teacher.avatar,
          recipientId: parent.id,
          recipientName: `${parent.firstName} ${parent.lastName}`,
          recipientRole: "Parent",
          recipientAvatar: parent.profilePhoto,
          subject,
          preview: `Dear Mr./Mrs. ${parent.lastName}, I am writing regarding ${subject.toLowerCase()}...`,
          timestamp: timestamp.toISOString(),
          isRead: true,
          hasAttachment: Math.random() > 0.85,
          priority: Math.random() > 0.9 ? "high" : "normal",
          category: categoryData.category,
          childName: child.fullName,
          childId: child.id,
        });
      }
    }
  });

  return messages.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};

const MOCK_MESSAGES = generateAdminMessages();

export default function AdminParentMessagesPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Get recipient filter from URL
  const recipientId = searchParams.get("recipient");

  // Find the selected parent from mock data if recipient filter is active
  const allParents = getAllParents();
  const selectedParent = recipientId
    ? allParents.find(p => p.id === recipientId)
    : null;

  const [messages] = useState<AdminMessage[]>(MOCK_MESSAGES);

  // Clear recipient filter
  const handleClearRecipient = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("recipient");
    router.push(`/admin/parents/messages?${params.toString()}`);
  };

  // Page configuration
  const config: MessagesPageConfig = useMemo(() => ({
    recipientType: "parent",
    pageTitle: "Parent Messages",
    basePath: "/admin/parents",
    breadcrumbs: [
      { label: "Dashboard", href: "/" },
      { label: "Admin" },
      { label: "Parents", href: "/admin/parents" },
      { label: "Messages", isActive: true },
    ],
    composeUrl: "/admin/parents/messages/compose",
    viewMessageUrl: (msg) => `/parents/messages?messageId=${msg.id}&from=admin&subject=${encodeURIComponent(msg.subject)}`,
    replyMessageUrl: (msg) => `/parents/messages?messageId=${msg.id}&from=admin&subject=${encodeURIComponent(msg.subject)}&action=reply`,
  }), []);

  // Selected recipient for filtering
  const selectedRecipient = selectedParent
    ? {
        id: selectedParent.id,
        firstName: selectedParent.firstName,
        lastName: selectedParent.lastName,
        profilePhoto: selectedParent.profilePhoto,
      }
    : null;

  return (
    <DashboardPage
      title="Parent Messages"
      breadcrumbs={[
        { label: "Dashboard", href: "/" },
        { label: "Admin", href: "/admin" },
        { label: "Parents", href: "/admin/parents" },
        { label: "Messages", isActive: true },
      ]}
      loadingText="Loading Messages"
      afterStats={
        <div className="mt-6">
          <MessagesPageContent
            messages={messages}
            config={config}
            selectedRecipient={selectedRecipient}
            onClearRecipient={handleClearRecipient}
          />
        </div>
      }
    />
  );
}
