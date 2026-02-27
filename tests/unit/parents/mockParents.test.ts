import { describe, expect, it } from "vitest";

import {
  getAllParents,
  getParentById,
  getParentsByStatus,
  getParentsWithOutstandingFees,
  searchParents,
  getParentStats,
  getAllFeeRecords,
  getFeeRecordById,
  getFeeRecordsByParentId,
  getFeeRecordsByChildId,
  getFeeRecordsByStatus,
  getOverdueFeeRecords,
  getFeeStats,
  searchFeeRecords,
  getPaymentsByParentId,
  getCommunicationsByParentId,
  getEventAttendanceByParentId,
  getLibraryPaymentsByParentId,
  getLeaveRequestsByParentId,
  updateLeaveRequestStatus,
  getMeetingsByParentId,
  getUpcomingMeetingsByParentId,
  getPastMeetingsByParentId,
  getAllFeeReminders,
  getRemindersByFeeRecordId,
  getRemindersByParentId,
  getReminderCountByFeeRecordId,
  getReminderCountByParentId,
  getReminderStatsByParentId,
} from "@/lib/mockParents";

// ===== Parent CRUD Helpers =====

describe("mockParents - Parent Helpers", () => {
  describe("getAllParents", () => {
    it("returns an array of 12 parents", () => {
      const parents = getAllParents();
      expect(parents).toHaveLength(12);
    });

    it("each parent has required fields", () => {
      const parents = getAllParents();
      for (const p of parents) {
        expect(p).toHaveProperty("id");
        expect(p).toHaveProperty("firstName");
        expect(p).toHaveProperty("lastName");
        expect(p).toHaveProperty("email");
        expect(p).toHaveProperty("phone");
        expect(p).toHaveProperty("children");
        expect(p).toHaveProperty("totalOutstandingFees");
        expect(p).toHaveProperty("totalPaidFees");
        expect(p).toHaveProperty("status");
        expect(p.children.length).toBeGreaterThan(0);
      }
    });
  });

  describe("getParentById", () => {
    it("returns the correct parent for a valid ID", () => {
      const parent = getParentById("parent-001");
      expect(parent).toBeDefined();
      expect(parent!.firstName).toBe("Emeka");
      expect(parent!.lastName).toBe("Okonkwo");
    });

    it("returns undefined for a non-existent ID", () => {
      expect(getParentById("nonexistent")).toBeUndefined();
    });
  });

  describe("getParentsByStatus", () => {
    it("returns all active parents", () => {
      const active = getParentsByStatus("Active");
      expect(active.length).toBeGreaterThan(0);
      for (const p of active) {
        expect(p.status).toBe("Active");
      }
    });

    it("returns empty array for inactive (all mock parents are Active)", () => {
      const inactive = getParentsByStatus("Inactive");
      expect(inactive).toHaveLength(0);
    });
  });

  describe("getParentsWithOutstandingFees", () => {
    it("returns only parents with totalOutstandingFees > 0", () => {
      const result = getParentsWithOutstandingFees();
      for (const p of result) {
        expect(p.totalOutstandingFees).toBeGreaterThan(0);
      }
    });

    it("excludes parents with zero outstanding fees", () => {
      const result = getParentsWithOutstandingFees();
      const ids = result.map((p) => p.id);
      // parent-002 and parent-009 have 0 outstanding
      expect(ids).not.toContain("parent-002");
      expect(ids).not.toContain("parent-009");
    });
  });

  describe("searchParents", () => {
    it("finds a parent by first name", () => {
      const result = searchParents("Emeka");
      expect(result.length).toBeGreaterThan(0);
      expect(result[0].firstName).toBe("Emeka");
    });

    it("finds a parent by last name", () => {
      const result = searchParents("Adeyemi");
      expect(result.length).toBeGreaterThan(0);
      expect(result[0].lastName).toBe("Adeyemi");
    });

    it("finds a parent by email", () => {
      const result = searchParents("folake.adeyemi@email.com");
      expect(result).toHaveLength(1);
    });

    it("finds a parent by phone number", () => {
      const result = searchParents("+234 803 456 7890");
      expect(result.length).toBeGreaterThan(0);
    });

    it("finds a parent by child name", () => {
      const result = searchParents("Janet Daniel");
      expect(result.length).toBeGreaterThan(0);
    });

    it("finds a parent by child admission number", () => {
      const result = searchParents("AD9892434");
      expect(result.length).toBeGreaterThan(0);
    });

    it("returns empty array for no match", () => {
      expect(searchParents("zzzznonexistent")).toHaveLength(0);
    });

    it("search is case-insensitive", () => {
      const upper = searchParents("EMEKA");
      const lower = searchParents("emeka");
      expect(upper.length).toBe(lower.length);
    });
  });

  describe("getParentStats", () => {
    it("returns correct aggregate stats", () => {
      const stats = getParentStats();
      expect(stats.totalParents).toBe(12);
      expect(stats.activeParents).toBe(12); // all mock parents are active
      expect(stats.inactiveParents).toBe(0);
      expect(stats.totalChildren).toBeGreaterThan(0);
      expect(stats.totalOutstanding).toBeGreaterThan(0);
      expect(stats.totalPaid).toBeGreaterThan(0);
      expect(stats.collectionRate).toBeGreaterThanOrEqual(0);
      expect(stats.collectionRate).toBeLessThanOrEqual(100);
    });

    it("totalChildren sums all children across parents", () => {
      const parents = getAllParents();
      const expected = parents.reduce((acc, p) => acc + p.children.length, 0);
      expect(getParentStats().totalChildren).toBe(expected);
    });
  });
});

// ===== Fee Record Helpers =====

describe("mockParents - Fee Record Helpers", () => {
  describe("getAllFeeRecords", () => {
    it("returns a non-empty array", () => {
      const records = getAllFeeRecords();
      expect(records.length).toBeGreaterThan(0);
    });

    it("each fee record has required fields", () => {
      const records = getAllFeeRecords();
      for (const r of records.slice(0, 5)) {
        expect(r).toHaveProperty("id");
        expect(r).toHaveProperty("parentId");
        expect(r).toHaveProperty("childId");
        expect(r).toHaveProperty("feeType");
        expect(r).toHaveProperty("amount");
        expect(r).toHaveProperty("paidAmount");
        expect(r).toHaveProperty("balance");
        expect(r).toHaveProperty("status");
        expect(r.balance).toBe(r.amount - r.paidAmount);
      }
    });
  });

  describe("getFeeRecordById", () => {
    it("returns the correct fee record", () => {
      const allRecords = getAllFeeRecords();
      const first = allRecords[0];
      const found = getFeeRecordById(first.id);
      expect(found).toBeDefined();
      expect(found!.id).toBe(first.id);
    });

    it("returns undefined for non-existent ID", () => {
      expect(getFeeRecordById("nonexistent")).toBeUndefined();
    });
  });

  describe("getFeeRecordsByParentId", () => {
    it("returns fee records only for the given parent", () => {
      const records = getFeeRecordsByParentId("parent-001");
      expect(records.length).toBeGreaterThan(0);
      for (const r of records) {
        expect(r.parentId).toBe("parent-001");
      }
    });
  });

  describe("getFeeRecordsByChildId", () => {
    it("returns fee records only for the given child", () => {
      const allRecords = getAllFeeRecords();
      const childId = allRecords[0].childId;
      const records = getFeeRecordsByChildId(childId);
      for (const r of records) {
        expect(r.childId).toBe(childId);
      }
    });
  });

  describe("getFeeRecordsByStatus", () => {
    it("returns only paid fee records", () => {
      const paid = getFeeRecordsByStatus("paid");
      for (const r of paid) {
        expect(r.status).toBe("paid");
      }
    });

    it("returns only overdue fee records", () => {
      const overdue = getFeeRecordsByStatus("overdue");
      for (const r of overdue) {
        expect(r.status).toBe("overdue");
      }
    });
  });

  describe("getOverdueFeeRecords", () => {
    it("returns same result as getFeeRecordsByStatus('overdue')", () => {
      const overdue = getOverdueFeeRecords();
      const byStatus = getFeeRecordsByStatus("overdue");
      expect(overdue.length).toBe(byStatus.length);
    });
  });

  describe("getFeeStats", () => {
    it("returns correct aggregate fee stats", () => {
      const stats = getFeeStats();
      expect(stats.totalRecords).toBeGreaterThan(0);
      expect(stats.totalFees).toBeGreaterThan(0);
      expect(stats.totalCollected).toBeGreaterThanOrEqual(0);
      expect(stats.totalOutstanding).toBeGreaterThanOrEqual(0);
      expect(stats.collectionRate).toBeGreaterThanOrEqual(0);
      expect(stats.collectionRate).toBeLessThanOrEqual(100);
      expect(stats.paidCount + stats.partialCount + stats.pendingCount + stats.overdueCount).toBe(stats.totalRecords);
    });
  });

  describe("searchFeeRecords", () => {
    it("finds records by parent name", () => {
      const results = searchFeeRecords("Emeka");
      expect(results.length).toBeGreaterThan(0);
    });

    it("finds records by fee type", () => {
      const results = searchFeeRecords("School Fees");
      for (const r of results) {
        expect(r.feeType.toLowerCase()).toContain("school fees");
      }
    });

    it("returns empty for no match", () => {
      expect(searchFeeRecords("zzzzz")).toHaveLength(0);
    });
  });
});

// ===== Payment, Communication, Leave Helpers =====

describe("mockParents - Related Data Helpers", () => {
  describe("getPaymentsByParentId", () => {
    it("returns payments for a known parent", () => {
      const payments = getPaymentsByParentId("parent-001");
      expect(payments.length).toBeGreaterThan(0);
      for (const p of payments) {
        expect(p.parentId).toBe("parent-001");
      }
    });

    it("returns empty for unknown parent", () => {
      expect(getPaymentsByParentId("unknown")).toHaveLength(0);
    });
  });

  describe("getCommunicationsByParentId", () => {
    it("returns communications for a known parent", () => {
      const comms = getCommunicationsByParentId("parent-001");
      expect(comms.length).toBeGreaterThan(0);
      for (const c of comms) {
        expect(c.parentId).toBe("parent-001");
      }
    });
  });

  describe("getEventAttendanceByParentId", () => {
    it("returns attendance records for a known parent", () => {
      const attendance = getEventAttendanceByParentId("parent-001");
      expect(attendance.length).toBeGreaterThan(0);
      for (const a of attendance) {
        expect(a.parentId).toBe("parent-001");
      }
    });
  });

  describe("getLibraryPaymentsByParentId", () => {
    it("returns library payments for a known parent", () => {
      const payments = getLibraryPaymentsByParentId("parent-001");
      expect(payments.length).toBeGreaterThan(0);
      for (const p of payments) {
        expect(p.parentId).toBe("parent-001");
      }
    });
  });

  describe("getLeaveRequestsByParentId", () => {
    it("returns leave requests for a known parent", () => {
      const requests = getLeaveRequestsByParentId("parent-001");
      expect(requests.length).toBeGreaterThan(0);
      for (const r of requests) {
        expect(r.parentId).toBe("parent-001");
      }
    });
  });

  describe("updateLeaveRequestStatus", () => {
    it("updates the status of a leave request", () => {
      const requests = getLeaveRequestsByParentId("parent-001");
      const pendingReq = requests.find((r) => r.status === "pending");
      if (pendingReq) {
        const updated = updateLeaveRequestStatus(
          pendingReq.id,
          "approved",
          "Principal Adeyemi",
          "Approved for family reasons"
        );
        expect(updated).toBeDefined();
        expect(updated!.status).toBe("approved");
        expect(updated!.processedBy).toBe("Principal Adeyemi");
        expect(updated!.adminNotes).toBe("Approved for family reasons");
        expect(updated!.processedAt).toBeDefined();
      }
    });

    it("returns undefined for non-existent request", () => {
      expect(
        updateLeaveRequestStatus("nonexistent", "approved", "Admin")
      ).toBeUndefined();
    });
  });

  describe("getMeetingsByParentId", () => {
    it("returns meetings for a known parent", () => {
      const meetings = getMeetingsByParentId("parent-001");
      expect(meetings.length).toBeGreaterThan(0);
      for (const m of meetings) {
        expect(m.parentId).toBe("parent-001");
      }
    });
  });

  describe("getUpcomingMeetingsByParentId", () => {
    it("returns only upcoming meetings", () => {
      const upcoming = getUpcomingMeetingsByParentId("parent-001");
      for (const m of upcoming) {
        expect(m.status).toBe("upcoming");
      }
    });
  });

  describe("getPastMeetingsByParentId", () => {
    it("returns only non-upcoming meetings", () => {
      const past = getPastMeetingsByParentId("parent-001");
      for (const m of past) {
        expect(m.status).not.toBe("upcoming");
      }
    });
  });
});

// ===== Fee Reminders =====

describe("mockParents - Fee Reminder Helpers", () => {
  describe("getAllFeeReminders", () => {
    it("returns a non-empty array sorted by sentAt desc", () => {
      const reminders = getAllFeeReminders();
      expect(reminders.length).toBeGreaterThan(0);
      for (let i = 1; i < reminders.length; i++) {
        expect(new Date(reminders[i - 1].sentAt).getTime()).toBeGreaterThanOrEqual(
          new Date(reminders[i].sentAt).getTime()
        );
      }
    });
  });

  describe("getRemindersByParentId", () => {
    it("returns reminders for a parent that has them", () => {
      const all = getAllFeeReminders();
      if (all.length > 0) {
        const parentId = all[0].parentId;
        const reminders = getRemindersByParentId(parentId);
        expect(reminders.length).toBeGreaterThan(0);
        for (const r of reminders) {
          expect(r.parentId).toBe(parentId);
        }
      }
    });
  });

  describe("getReminderCountByParentId", () => {
    it("returns a count matching array length", () => {
      const all = getAllFeeReminders();
      if (all.length > 0) {
        const parentId = all[0].parentId;
        const count = getReminderCountByParentId(parentId);
        const list = getRemindersByParentId(parentId);
        expect(count).toBe(list.length);
      }
    });
  });

  describe("getReminderStatsByParentId", () => {
    it("returns stats with byChannel breakdown", () => {
      const all = getAllFeeReminders();
      if (all.length > 0) {
        const parentId = all[0].parentId;
        const stats = getReminderStatsByParentId(parentId);
        expect(stats.total).toBeGreaterThan(0);
        expect(stats.byChannel).toHaveProperty("email");
        expect(stats.byChannel).toHaveProperty("sms");
        expect(stats.byChannel).toHaveProperty("push");
        expect(stats.byChannel).toHaveProperty("whatsapp");
      }
    });
  });

  describe("getRemindersByFeeRecordId", () => {
    it("returns reminders for a known fee record", () => {
      const all = getAllFeeReminders();
      if (all.length > 0) {
        const feeRecordId = all[0].feeRecordId;
        const reminders = getRemindersByFeeRecordId(feeRecordId);
        expect(reminders.length).toBeGreaterThan(0);
        for (const r of reminders) {
          expect(r.feeRecordId).toBe(feeRecordId);
        }
      }
    });
  });

  describe("getReminderCountByFeeRecordId", () => {
    it("returns count matching array length", () => {
      const all = getAllFeeReminders();
      if (all.length > 0) {
        const feeRecordId = all[0].feeRecordId;
        const count = getReminderCountByFeeRecordId(feeRecordId);
        const list = getRemindersByFeeRecordId(feeRecordId);
        expect(count).toBe(list.length);
      }
    });
  });
});
