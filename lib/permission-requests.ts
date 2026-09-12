/**
 * Permission request system — tracks requests from users to document owners.
 * In production, this would use an API. For now, uses localStorage.
 */

export interface PermissionRequest {
  id: string;
  presentationId: string;
  presentationTitle: string;
  permission: "copy" | "print" | "download";
  requesterUsername: string;
  requesterFullName: string;
  requesterEmail: string;
  ownerUsername: string;
  ownerFullName: string;
  status: "pending" | "approved" | "denied";
  message?: string;
  createdAt: string;
  respondedAt?: string;
}

export interface PermissionNotification {
  id: string;
  type: "request" | "approved" | "denied";
  requestId: string;
  recipientUsername: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

const REQUESTS_KEY = "educo_permission_requests";
const NOTIFICATIONS_KEY = "educo_permission_notifications";

function getRequests(): PermissionRequest[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(REQUESTS_KEY) || "[]"); } catch { return []; }
}

function saveRequests(items: PermissionRequest[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(REQUESTS_KEY, JSON.stringify(items));
}

function getNotifications(): PermissionNotification[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(NOTIFICATIONS_KEY) || "[]"); } catch { return []; }
}

function saveNotifications(items: PermissionNotification[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(items));
}

const permissionLabels: Record<string, string> = {
  copy: "Copy / Make a copy",
  print: "Print",
  download: "Download",
};

export const permissionRequests = {
  /** Submit a new permission request (from requester) */
  request(data: {
    presentationId: string;
    presentationTitle: string;
    permission: "copy" | "print" | "download";
    requesterUsername: string;
    requesterFullName: string;
    requesterEmail: string;
    ownerUsername: string;
    ownerFullName: string;
    message?: string;
  }): PermissionRequest {
    const requests = getRequests();

    // Check for existing pending request
    const existing = requests.find(
      r => r.presentationId === data.presentationId &&
           r.permission === data.permission &&
           r.requesterUsername === data.requesterUsername &&
           r.status === "pending"
    );
    if (existing) return existing;

    const request: PermissionRequest = {
      id: `req-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      ...data,
      status: "pending",
      createdAt: new Date().toISOString(),
    };
    requests.push(request);
    saveRequests(requests);

    // Create notification for the owner
    const notifications = getNotifications();
    notifications.push({
      id: `notif-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      type: "request",
      requestId: request.id,
      recipientUsername: data.ownerUsername,
      title: "Permission Request",
      message: `${data.requesterFullName} (${data.requesterUsername}) has requested ${permissionLabels[data.permission]} access to "${data.presentationTitle}".`,
      read: false,
      createdAt: new Date().toISOString(),
    });
    saveNotifications(notifications);

    return request;
  },

  /** Approve a permission request (from owner) */
  approve(requestId: string): void {
    const requests = getRequests();
    const idx = requests.findIndex(r => r.id === requestId);
    if (idx === -1) return;
    requests[idx].status = "approved";
    requests[idx].respondedAt = new Date().toISOString();
    saveRequests(requests);

    const req = requests[idx];
    const notifications = getNotifications();
    notifications.push({
      id: `notif-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      type: "approved",
      requestId: req.id,
      recipientUsername: req.requesterUsername,
      title: "Permission Granted",
      message: `${req.ownerFullName} has granted you ${permissionLabels[req.permission]} access to "${req.presentationTitle}".`,
      read: false,
      createdAt: new Date().toISOString(),
    });
    saveNotifications(notifications);
  },

  /** Deny a permission request (from owner) */
  deny(requestId: string): void {
    const requests = getRequests();
    const idx = requests.findIndex(r => r.id === requestId);
    if (idx === -1) return;
    requests[idx].status = "denied";
    requests[idx].respondedAt = new Date().toISOString();
    saveRequests(requests);

    const req = requests[idx];
    const notifications = getNotifications();
    notifications.push({
      id: `notif-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      type: "denied",
      requestId: req.id,
      recipientUsername: req.requesterUsername,
      title: "Permission Denied",
      message: `${req.ownerFullName} has denied your ${permissionLabels[req.permission]} request for "${req.presentationTitle}".`,
      read: false,
      createdAt: new Date().toISOString(),
    });
    saveNotifications(notifications);
  },

  /** Get pending requests for a specific presentation (for owner view) */
  getPendingForPresentation(presentationId: string): PermissionRequest[] {
    return getRequests().filter(r => r.presentationId === presentationId && r.status === "pending");
  },

  /** Get all requests by a user */
  getByRequester(username: string): PermissionRequest[] {
    return getRequests().filter(r => r.requesterUsername === username);
  },

  /** Get notifications for a user */
  getNotificationsFor(username: string): PermissionNotification[] {
    return getNotifications().filter(n => n.recipientUsername === username);
  },

  /** Get unread notification count */
  getUnreadCount(username: string): number {
    return getNotifications().filter(n => n.recipientUsername === username && !n.read).length;
  },

  /** Mark notification as read */
  markRead(notificationId: string): void {
    const notifications = getNotifications();
    const idx = notifications.findIndex(n => n.id === notificationId);
    if (idx !== -1) {
      notifications[idx].read = true;
      saveNotifications(notifications);
    }
  },

  /** Check if user has an approved permission */
  hasPermission(presentationId: string, permission: string, username: string): boolean {
    return getRequests().some(
      r => r.presentationId === presentationId &&
           r.permission === permission &&
           r.requesterUsername === username &&
           r.status === "approved"
    );
  },
};
