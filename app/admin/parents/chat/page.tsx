"use client";

import { useState, useMemo } from "react";
import MainLayout from "@/components/layout/MainLayout";
import PageLoader from "@/components/shared/PageLoader";
import { ChatPageContent, ChatConversation, ChatPageConfig } from "@/components/shared/chat";
import { usePageLoad } from "@/hooks/usePageLoad";
import { getAllParents } from "@/lib/mockParents";

// Generate mock chat conversations for parent admin view
const generateChatConversations = (): ChatConversation[] => {
  const parents = getAllParents();
  const conversations: ChatConversation[] = [];
  const lastMessages = [
    "Thank you for the quick response!",
    "Can you please share the fee statement?",
    "When is the next parent-teacher meeting?",
    "I'll check it out and get back to you.",
    "That sounds great, thank you!",
    "Could you clarify the homework assignment?",
    "My child will be absent tomorrow.",
    "Is there any update on the school event?",
    "Thanks for letting me know!",
    "I have a question about the report card.",
  ];

  parents.forEach((parent, index) => {
    // Use deterministic values based on index to avoid hydration mismatch
    const daysAgo = index % 7;
    const hoursAgo = (index * 3) % 24;
    const timestamp = new Date("2026-01-25T12:00:00");
    timestamp.setDate(timestamp.getDate() - daysAgo);
    timestamp.setHours(timestamp.getHours() - hoursAgo);

    conversations.push({
      id: `chat-${parent.id}`,
      recipientId: parent.id,
      recipientName: `${parent.firstName} ${parent.lastName}`,
      recipientAvatar: parent.profilePhoto,
      recipientEmail: parent.email,
      recipientRole: "Parent",
      lastMessage: lastMessages[index % lastMessages.length],
      lastMessageTime: timestamp.toISOString(),
      lastMessageFrom: index % 2 === 0 ? "recipient" : "admin",
      unreadCount: index % 3 === 0 ? (index % 5) + 1 : 0,
      isOnline: index % 3 !== 2,
      isPinned: index % 10 === 0,
      childName: parent.children[0]?.fullName,
    });
  });

  // Sort by pinned first, then by timestamp
  return conversations.sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime();
  });
};

const MOCK_CONVERSATIONS = generateChatConversations();

export default function AdminParentChatPage() {
  const isPageLoading = usePageLoad(600);
  const [conversations] = useState<ChatConversation[]>(MOCK_CONVERSATIONS);

  // Page configuration
  const config: ChatPageConfig = useMemo(() => ({
    recipientType: "parent",
    recipientLabel: "Parent",
    recipientLabelPlural: "Parents",
    pageTitle: "Parent Chats",
    basePath: "/admin/parents",
    breadcrumbs: [
      { label: "Dashboard", href: "/" },
      { label: "Admin" },
      { label: "Parents", href: "/admin/parents" },
      { label: "Chat", isActive: true },
    ],
    composeUrl: "/admin/parents/chat/compose",
    viewChatUrl: (chat) => `/parents/chat?chatId=${chat.id}&from=admin&parentName=${encodeURIComponent(chat.recipientName)}`,
  }), []);

  return (
    <MainLayout>
      <PageLoader isLoading={isPageLoading} loadingText="Loading Chats" />

      <div className={`transition-opacity duration-500 ${isPageLoading ? "opacity-0" : "opacity-100"}`}>
        <ChatPageContent
          conversations={conversations}
          config={config}
        />
      </div>
    </MainLayout>
  );
}
