import { describe, expect, it } from "vitest";

import type { AdminParent } from "@/lib/mockParents";
import {
  filterParents,
  getCurrencySymbol,
  hasActiveFilters,
  searchParents,
  sortParents,
  parentFilterFields,
  parentSortOptions,
} from "@/app/admin/parents/config";

// ============ Test Data Factory ============

function makeParent(
  overrides: Partial<AdminParent> & Pick<AdminParent, "id">
): AdminParent {
  return overrides as AdminParent;
}

const parents: AdminParent[] = [
  makeParent({
    id: "p1",
    firstName: "Ada",
    lastName: "Zed",
    email: "ada@test.com",
    phone: "+234 800 000 0001",
    occupation: "Doctor",
    relationship: "Mother",
    status: "Active",
    createdAt: "2024-01-01T00:00:00Z",
    totalOutstandingFees: 0,
    children: [{ id: "c1", firstName: "Child", lastName: "One" }] as any,
  }),
  makeParent({
    id: "p2",
    firstName: "Bola",
    lastName: "Ade",
    email: "bola@test.com",
    phone: "+234 800 000 0002",
    occupation: "Lawyer",
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
    email: "chidi@test.com",
    phone: "+234 800 000 0003",
    occupation: "Teacher",
    relationship: "Guardian",
    status: "Active",
    createdAt: "2023-12-01T00:00:00Z",
    totalOutstandingFees: 75_000,
    children: [{ id: "c1" }, { id: "c2" }] as any,
  }),
];

// ============ Config Constants ============

describe("parentFilterFields", () => {
  it("has 4 filter field definitions", () => {
    expect(parentFilterFields).toHaveLength(4);
  });

  it("includes relationship, status, feeStatus, and childrenCount", () => {
    const ids = parentFilterFields.map((f) => f.id);
    expect(ids).toEqual(["relationship", "status", "feeStatus", "childrenCount"]);
  });

  it("relationship has 4 options", () => {
    const field = parentFilterFields.find((f) => f.id === "relationship");
    expect(field!.options).toEqual(["Father", "Mother", "Guardian", "Sponsor"]);
  });
});

describe("parentSortOptions", () => {
  it("has 5 sort options", () => {
    expect(parentSortOptions).toHaveLength(5);
  });

  it("includes ascending, descending, recently_added, highest_balance, most_children", () => {
    const ids = parentSortOptions.map((o) => o.id);
    expect(ids).toEqual([
      "ascending",
      "descending",
      "recently_added",
      "highest_balance",
      "most_children",
    ]);
  });
});

// ============ sortParents ============

describe("sortParents", () => {
  it("sorts ascending by full name (A-Z)", () => {
    const result = sortParents(parents, "ascending");
    expect(result.map((p) => p.id)).toEqual(["p1", "p2", "p3"]);
  });

  it("sorts descending by full name (Z-A)", () => {
    const result = sortParents(parents, "descending");
    expect(result.map((p) => p.id)).toEqual(["p3", "p2", "p1"]);
  });

  it("sorts by recently added (createdAt descending)", () => {
    const result = sortParents(parents, "recently_added");
    expect(result.map((p) => p.id)).toEqual(["p2", "p1", "p3"]);
  });

  it("sorts by highest balance (totalOutstandingFees descending)", () => {
    const result = sortParents(parents, "highest_balance");
    expect(result.map((p) => p.id)).toEqual(["p2", "p3", "p1"]);
  });

  it("sorts by most children (children.length descending)", () => {
    const result = sortParents(parents, "most_children");
    expect(result.map((p) => p.id)).toEqual(["p2", "p3", "p1"]);
  });

  it("does not mutate the original array", () => {
    const original = [...parents];
    sortParents(parents, "highest_balance");
    expect(parents).toEqual(original);
  });

  it("returns original order for unknown sort option", () => {
    const result = sortParents(parents, "unknown_sort");
    expect(result).toHaveLength(3);
  });
});

// ============ filterParents ============

describe("filterParents", () => {
  it("returns all parents when no filters are active", () => {
    expect(filterParents(parents, {})).toHaveLength(3);
  });

  it("filters by relationship", () => {
    const result = filterParents(parents, { relationship: ["Father"] });
    expect(result.map((p) => p.id)).toEqual(["p2"]);
  });

  it("filters by multiple relationships (OR within category)", () => {
    const result = filterParents(parents, {
      relationship: ["Mother", "Guardian"],
    });
    expect(result.map((p) => p.id)).toEqual(["p1", "p3"]);
  });

  it("filters by status", () => {
    const result = filterParents(parents, { status: ["Active"] });
    expect(result.map((p) => p.id)).toEqual(["p1", "p3"]);
  });

  it("filters by feeStatus: Paid Up (totalOutstandingFees === 0)", () => {
    const result = filterParents(parents, { feeStatus: ["Paid Up"] });
    expect(result.map((p) => p.id)).toEqual(["p1"]);
  });

  it("filters by feeStatus: Pending (0 < fees <= 100000)", () => {
    const result = filterParents(parents, { feeStatus: ["Pending"] });
    expect(result.map((p) => p.id)).toEqual(["p3"]);
  });

  it("filters by feeStatus: High Balance (fees > 100000)", () => {
    const result = filterParents(parents, { feeStatus: ["High Balance"] });
    expect(result.map((p) => p.id)).toEqual(["p2"]);
  });

  it("filters by childrenCount: 1 Child", () => {
    expect(
      filterParents(parents, { childrenCount: ["1 Child"] }).map((p) => p.id)
    ).toEqual(["p1"]);
  });

  it("filters by childrenCount: 2 Children", () => {
    expect(
      filterParents(parents, { childrenCount: ["2 Children"] }).map((p) => p.id)
    ).toEqual(["p3"]);
  });

  it("filters by childrenCount: 3+ Children", () => {
    expect(
      filterParents(parents, { childrenCount: ["3+ Children"] }).map((p) => p.id)
    ).toEqual(["p2"]);
  });

  it("combines filters using AND logic across categories", () => {
    const result = filterParents(parents, {
      relationship: ["Mother", "Guardian"],
      status: ["Active"],
      feeStatus: ["Pending", "Paid Up"],
    });
    expect(result.map((p) => p.id)).toEqual(["p1", "p3"]);
  });

  it("returns empty when AND combination has no matches", () => {
    const result = filterParents(parents, {
      relationship: ["Father"],
      status: ["Active"],
    });
    expect(result).toHaveLength(0);
  });
});

// ============ searchParents ============

describe("searchParents (config)", () => {
  it("finds by first name", () => {
    const result = searchParents(parents, "Ada");
    expect(result.map((p) => p.id)).toEqual(["p1"]);
  });

  it("finds by last name", () => {
    const result = searchParents(parents, "Baker");
    expect(result.map((p) => p.id)).toEqual(["p3"]);
  });

  it("finds by email", () => {
    const result = searchParents(parents, "bola@test.com");
    expect(result).toHaveLength(1);
  });

  it("finds by phone", () => {
    const result = searchParents(parents, "+234 800 000 0003");
    expect(result).toHaveLength(1);
  });

  it("finds by occupation", () => {
    const result = searchParents(parents, "Doctor");
    expect(result).toHaveLength(1);
  });

  it("finds by relationship", () => {
    const result = searchParents(parents, "Guardian");
    expect(result).toHaveLength(1);
  });

  it("search is case-insensitive", () => {
    expect(searchParents(parents, "ADA")).toHaveLength(1);
    expect(searchParents(parents, "ada")).toHaveLength(1);
  });

  it("returns empty for no match", () => {
    expect(searchParents(parents, "zzzzz")).toHaveLength(0);
  });
});

// ============ getCurrencySymbol ============

describe("getCurrencySymbol", () => {
  it("returns ₦ fallback for invalid currency codes", () => {
    expect(getCurrencySymbol("NOT_A_CURRENCY")).toBe("₦");
  });

  it("returns a non-empty symbol for NGN", () => {
    const symbol = getCurrencySymbol("NGN");
    expect(typeof symbol).toBe("string");
    expect(symbol.length).toBeGreaterThan(0);
  });

  it("returns a non-empty symbol for USD", () => {
    const symbol = getCurrencySymbol("USD");
    expect(typeof symbol).toBe("string");
    expect(symbol.length).toBeGreaterThan(0);
  });

  it("returns a non-empty symbol for GBP", () => {
    const symbol = getCurrencySymbol("GBP");
    expect(symbol.length).toBeGreaterThan(0);
  });
});

// ============ hasActiveFilters ============

describe("hasActiveFilters", () => {
  it("returns false when no filters and no date range", () => {
    expect(hasActiveFilters({}, null)).toBe(false);
  });

  it("returns false when filters have empty arrays", () => {
    expect(hasActiveFilters({ relationship: [] }, null)).toBe(false);
  });

  it("returns true when any filter has values", () => {
    expect(hasActiveFilters({ relationship: ["Father"] }, null)).toBe(true);
  });

  it("returns true when date range has start", () => {
    expect(hasActiveFilters({}, { start: "2024-01-01", end: null })).toBe(true);
  });

  it("returns true when date range has end", () => {
    expect(hasActiveFilters({}, { start: null, end: "2024-12-31" })).toBe(true);
  });

  it("returns true when both filters and date range are set", () => {
    expect(
      hasActiveFilters(
        { status: ["Active"] },
        { start: "2024-01-01", end: "2024-12-31" }
      )
    ).toBe(true);
  });
});
