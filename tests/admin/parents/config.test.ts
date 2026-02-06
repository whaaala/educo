import { describe, expect, it } from "vitest";

import type { AdminParent } from "@/lib/mockParents";
import { filterParents, getCurrencySymbol, hasActiveFilters, sortParents } from "@/app/admin/parents/config";

function makeParent(overrides: Partial<AdminParent> & Pick<AdminParent, "id">): AdminParent {
  return overrides as AdminParent;
}

const parents: AdminParent[] = [
  makeParent({
    id: "p1",
    firstName: "Ada",
    lastName: "Zed",
    relationship: "Mother",
    status: "Active",
    createdAt: "2024-01-01T00:00:00Z",
    totalOutstandingFees: 0,
    children: [{ id: "c1" }] as any,
  }),
  makeParent({
    id: "p2",
    firstName: "Bola",
    lastName: "Ade",
    relationship: "Father",
    status: "Inactive",
    createdAt: "2024-02-01T00:00:00Z",
    totalOutstandingFees: 200_000,
    children: [{ id: "c1" }, { id: "c2" }, { id: "c3" }] as any,
  }),
  makeParent({
    id: "p3",
    firstName: "Chidi",
    lastName: "Baker",
    relationship: "Guardian",
    status: "Active",
    createdAt: "2023-12-01T00:00:00Z",
    totalOutstandingFees: 75_000,
    children: [{ id: "c1" }, { id: "c2" }] as any,
  }),
];

describe("app/admin/parents/config", () => {
  describe("sortParents", () => {
    it("sorts ascending by full name", () => {
      const result = sortParents(parents, "ascending");
      expect(result.map((p) => p.id)).toEqual(["p1", "p2", "p3"]);
    });

    it("sorts descending by full name", () => {
      const result = sortParents(parents, "descending");
      expect(result.map((p) => p.id)).toEqual(["p3", "p2", "p1"]);
    });

    it("sorts by recently added (createdAt desc)", () => {
      const result = sortParents(parents, "recently_added");
      expect(result.map((p) => p.id)).toEqual(["p2", "p1", "p3"]);
    });

    it("sorts by highest balance (totalOutstandingFees desc)", () => {
      const result = sortParents(parents, "highest_balance");
      expect(result.map((p) => p.id)).toEqual(["p2", "p3", "p1"]);
    });

    it("sorts by most children (children.length desc)", () => {
      const result = sortParents(parents, "most_children");
      expect(result.map((p) => p.id)).toEqual(["p2", "p3", "p1"]);
    });

    it("does not mutate the original array", () => {
      const original = [...parents];
      sortParents(parents, "highest_balance");
      expect(parents).toEqual(original);
    });
  });

  describe("filterParents", () => {
    it("returns all when no filters are active", () => {
      const result = filterParents(parents, {});
      expect(result).toHaveLength(3);
    });

    it("filters by relationship", () => {
      const result = filterParents(parents, { relationship: ["Father"] });
      expect(result.map((p) => p.id)).toEqual(["p2"]);
    });

    it("filters by status", () => {
      const result = filterParents(parents, { status: ["Active"] });
      expect(result.map((p) => p.id)).toEqual(["p1", "p3"]);
    });

    it("filters by fee status: Paid Up / Pending / High Balance", () => {
      expect(filterParents(parents, { feeStatus: ["Paid Up"] }).map((p) => p.id)).toEqual(["p1"]);
      expect(filterParents(parents, { feeStatus: ["Pending"] }).map((p) => p.id)).toEqual(["p3"]);
      expect(filterParents(parents, { feeStatus: ["High Balance"] }).map((p) => p.id)).toEqual(["p2"]);
    });

    it("filters by children count buckets", () => {
      expect(filterParents(parents, { childrenCount: ["1 Child"] }).map((p) => p.id)).toEqual(["p1"]);
      expect(filterParents(parents, { childrenCount: ["2 Children"] }).map((p) => p.id)).toEqual(["p3"]);
      expect(filterParents(parents, { childrenCount: ["3+ Children"] }).map((p) => p.id)).toEqual(["p2"]);
    });

    it("combines filters using AND logic", () => {
      const result = filterParents(parents, {
        relationship: ["Mother", "Guardian"],
        status: ["Active"],
        feeStatus: ["Pending", "Paid Up"],
      });
      expect(result.map((p) => p.id)).toEqual(["p1", "p3"]);
    });
  });

  describe("getCurrencySymbol", () => {
    it("returns ₦ fallback for invalid currency codes", () => {
      expect(getCurrencySymbol("NOT_A_CURRENCY")).toBe("₦");
    });

    it("returns a non-empty symbol for a valid currency code", () => {
      const symbol = getCurrencySymbol("NGN");
      expect(typeof symbol).toBe("string");
      expect(symbol.length).toBeGreaterThan(0);
    });
  });

  describe("hasActiveFilters", () => {
    it("is false when no filters and no date range", () => {
      expect(hasActiveFilters({}, null)).toBe(false);
    });

    it("is true when any filter has values", () => {
      expect(hasActiveFilters({ relationship: ["Father"] }, null)).toBe(true);
    });

    it("is true when date range has start or end", () => {
      expect(hasActiveFilters({}, { start: "2024-01-01", end: null })).toBe(true);
      expect(hasActiveFilters({}, { start: null, end: "2024-12-31" })).toBe(true);
    });
  });
});

