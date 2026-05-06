import { describe, expect, it } from "vitest";

import { defaultFilters, filterIncidents } from "./filterIncidents";
import type { Incident } from "../../../api/types";

const baseIncident: Omit<Incident, "id" | "title"> = {
  description: "",
  status: "Open",
  severity: "Medium",
  assigneeId: null,
  createdAt: "2026-01-01T10:00:00Z",
  updatedAt: "2026-01-01T10:00:00Z",
  statusHistory: [],
};

function makeIncident(over: Partial<Incident>): Incident {
  return {
    ...baseIncident,
    id: "x",
    title: "x",
    ...over,
  } as Incident;
}

const incidents: Incident[] = [
  makeIncident({
    id: "a",
    title: "Database timeout",
    description: "Connections are dropping intermittently",
    status: "Open",
    severity: "High",
    assigneeId: "user-1",
  }),
  makeIncident({
    id: "b",
    title: "Payment gateway error",
    description: "Checkout returns 500",
    status: "In Progress",
    severity: "Critical",
    assigneeId: "user-2",
  }),
  makeIncident({
    id: "c",
    title: "Login CSS broken",
    description: "Button hidden on mobile",
    status: "Resolved",
    severity: "Medium",
    assigneeId: null,
  }),
];

describe("filterIncidents", () => {
  it("returns all incidents when filters are at defaults", () => {
    expect(filterIncidents(incidents, defaultFilters)).toHaveLength(3);
  });

  it("filters by status", () => {
    const result = filterIncidents(incidents, {
      ...defaultFilters,
      status: "Open",
    });
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("a");
  });

  it("filters by severity", () => {
    const result = filterIncidents(incidents, {
      ...defaultFilters,
      severity: "Critical",
    });
    expect(result.map((i) => i.id)).toEqual(["b"]);
  });

  it("filters by assignee", () => {
    const result = filterIncidents(incidents, {
      ...defaultFilters,
      assigneeId: "user-2",
    });
    expect(result.map((i) => i.id)).toEqual(["b"]);
  });

  it("filters unassigned incidents", () => {
    const result = filterIncidents(incidents, {
      ...defaultFilters,
      assigneeId: "unassigned",
    });
    expect(result.map((i) => i.id)).toEqual(["c"]);
  });

  it("matches search across title and description (case-insensitive)", () => {
    expect(
      filterIncidents(incidents, { ...defaultFilters, search: "DATABASE" }).map(
        (i) => i.id,
      ),
    ).toEqual(["a"]);

    expect(
      filterIncidents(incidents, {
        ...defaultFilters,
        search: "checkout",
      }).map((i) => i.id),
    ).toEqual(["b"]);
  });

  it("combines filters with AND semantics", () => {
    const result = filterIncidents(incidents, {
      search: "broken",
      status: "Resolved",
      severity: "Medium",
      assigneeId: "unassigned",
    });
    expect(result.map((i) => i.id)).toEqual(["c"]);
  });

  it("returns empty array when nothing matches", () => {
    expect(
      filterIncidents(incidents, { ...defaultFilters, search: "zzznope" }),
    ).toEqual([]);
  });
});
