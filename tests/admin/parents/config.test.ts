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

// Feature: Admin parents list sorting, filtering, and utility functions
describe("app/admin/parents/config", () => {
  describe("sortParents", () => {
    // Scenario: Sorting parents ascending by full name
    it("sorts ascending by full name", () => {
      // When parents are sorted in ascending order
      const result = sortParents(parents, "ascending");

      // Then IDs should appear in alphabetical order by name
      expect(result.map((p) => p.id)).toEqual(["p1", "p2", "p3"]);
    });

    // Scenario: Sorting parents descending by full name
    it("sorts descending by full name", () => {
      // When parents are sorted in descending order
      const result = sortParents(parents, "descending");

      // Then IDs should appear in reverse alphabetical order by name
      expect(result.map((p) => p.id)).toEqual(["p3", "p2", "p1"]);
    });

    // Scenario: Sorting parents by most recently added
    it("sorts by recently added (createdAt desc)", () => {
      // When parents are sorted by recently added
      const result = sortParents(parents, "recently_added");

      // Then the most recently created parent should appear first
      expect(result.map((p) => p.id)).toEqual(["p2", "p1", "p3"]);
    });

    // Scenario: Sorting parents by highest outstanding balance
    it("sorts by highest balance (totalOutstandingFees desc)", () => {
      // When parents are sorted by highest balance
      const result = sortParents(parents, "highest_balance");

      // Then the parent with the highest fees should appear first
      expect(result.map((p) => p.id)).toEqual(["p2", "p3", "p1"]);
    });

    // Scenario: Sorting parents by most children
    it("sorts by most children (children.length desc)", () => {
      // When parents are sorted by most children
      const result = sortParents(parents, "most_children");

      // Then the parent with the most children should appear first
      expect(result.map((p) => p.id)).toEqual(["p2", "p3", "p1"]);
    });

    // Scenario: Sort does not mutate the original array
    it("does not mutate the original array", () => {
      // Given a copy of the original parents array
      const original = [...parents];

      // When parents are sorted
      sortParents(parents, "highest_balance");

      // Then the original array should be unchanged
      expect(parents).toEqual(original);
    });
  });

  describe("filterParents", () => {
    // Scenario: No filters returns all parents
    it("returns all when no filters are active", () => {
      // When parents are filtered with an empty filter object
      const result = filterParents(parents, {});

      // Then all parents should be returned
      expect(result).toHaveLength(3);
    });

    // Scenario: Filtering by relationship
    it("filters by relationship", () => {
      // When parents are filtered by "Father" relationship
      const result = filterParents(parents, { relationship: ["Father"] });

      // Then only the father should be returned
      expect(result.map((p) => p.id)).toEqual(["p2"]);
    });

    // Scenario: Filtering by status
    it("filters by status", () => {
      // When parents are filtered by "Active" status
      const result = filterParents(parents, { status: ["Active"] });

      // Then only active parents should be returned
      expect(result.map((p) => p.id)).toEqual(["p1", "p3"]);
    });

    // Scenario: Filtering by fee status categories
    it("filters by fee status: Paid Up / Pending / High Balance", () => {
      // When parents are filtered by "Paid Up" fee status
      // Then only the parent with zero outstanding fees should be returned
      expect(filterParents(parents, { feeStatus: ["Paid Up"] }).map((p) => p.id)).toEqual(["p1"]);

      // When parents are filtered by "Pending" fee status
      // Then only the parent with moderate outstanding fees should be returned
      expect(filterParents(parents, { feeStatus: ["Pending"] }).map((p) => p.id)).toEqual(["p3"]);

      // When parents are filtered by "High Balance" fee status
      // Then only the parent with high outstanding fees should be returned
      expect(filterParents(parents, { feeStatus: ["High Balance"] }).map((p) => p.id)).toEqual(["p2"]);
    });

    // Scenario: Filtering by children count buckets
    it("filters by children count buckets", () => {
      // When parents are filtered by "1 Child"
      // Then only the parent with one child should be returned
      expect(filterParents(parents, { childrenCount: ["1 Child"] }).map((p) => p.id)).toEqual(["p1"]);

      // When parents are filtered by "2 Children"
      // Then only the parent with two children should be returned
      expect(filterParents(parents, { childrenCount: ["2 Children"] }).map((p) => p.id)).toEqual(["p3"]);

      // When parents are filtered by "3+ Children"
      // Then only the parent with three or more children should be returned
      expect(filterParents(parents, { childrenCount: ["3+ Children"] }).map((p) => p.id)).toEqual(["p2"]);
    });

    // Scenario: Multiple filters are combined with AND logic
    it("combines filters using AND logic", () => {
      // When parents are filtered by multiple criteria simultaneously
      const result = filterParents(parents, {
        relationship: ["Mother", "Guardian"],
        status: ["Active"],
        feeStatus: ["Pending", "Paid Up"],
      });

      // Then only parents matching all criteria should be returned
      expect(result.map((p) => p.id)).toEqual(["p1", "p3"]);
    });
  });

  describe("getCurrencySymbol", () => {
    // Scenario: Invalid currency code returns Naira fallback
    it("returns ₦ fallback for invalid currency codes", () => {
      // When getCurrencySymbol is called with an invalid currency code
      // Then it should return the Naira symbol as a fallback
      expect(getCurrencySymbol("NOT_A_CURRENCY")).toBe("₦");
    });

    // Scenario: Valid currency code returns a non-empty symbol
    it("returns a non-empty symbol for a valid currency code", () => {
      // When getCurrencySymbol is called with a valid currency code
      const symbol = getCurrencySymbol("NGN");

      // Then it should return a non-empty string
      expect(typeof symbol).toBe("string");
      expect(symbol.length).toBeGreaterThan(0);
    });
  });

  describe("hasActiveFilters", () => {
    // Scenario: No filters and no date range means no active filters
    it("is false when no filters and no date range", () => {
      // Given empty filters and no date range
      // Then hasActiveFilters should return false
      expect(hasActiveFilters({}, null)).toBe(false);
    });

    // Scenario: Any filter with values means active filters
    it("is true when any filter has values", () => {
      // Given a filter with a relationship value
      // Then hasActiveFilters should return true
      expect(hasActiveFilters({ relationship: ["Father"] }, null)).toBe(true);
    });

    // Scenario: Date range with start or end means active filters
    it("is true when date range has start or end", () => {
      // Given a date range with only a start date
      // Then hasActiveFilters should return true
      expect(hasActiveFilters({}, { start: "2024-01-01", end: null })).toBe(true);

      // Given a date range with only an end date
      // Then hasActiveFilters should return true
      expect(hasActiveFilters({}, { start: null, end: "2024-12-31" })).toBe(true);
    });
  });
});
