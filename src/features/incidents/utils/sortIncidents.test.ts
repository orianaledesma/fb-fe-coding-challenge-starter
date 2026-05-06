import { describe, expect, it } from "vitest";

import { sortIncidents } from "./sortIncidents";
import type { Incident } from "../../../api/types";

function makeIncident(over: Partial<Incident> & { id: string }): Incident {
  return {
    description: "",
    status: "Open",
    severity: "Medium",
    assigneeId: null,
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: "2026-01-01T00:00:00Z",
    statusHistory: [],
    title: over.id,
    ...over,
  } as Incident;
}

describe("sortIncidents", () => {
  it("sorts by createdAt descending (most recent first)", () => {
    const incidents: Incident[] = [
      makeIncident({ id: "old", createdAt: "2026-01-01T00:00:00Z" }),
      makeIncident({ id: "new", createdAt: "2026-01-10T00:00:00Z" }),
      makeIncident({ id: "mid", createdAt: "2026-01-05T00:00:00Z" }),
    ];
    expect(
      sortIncidents(incidents, { field: "createdAt", direction: "desc" }).map(
        (i) => i.id,
      ),
    ).toEqual(["new", "mid", "old"]);
  });

  it("sorts by severity ascending (Low → Critical)", () => {
    const incidents: Incident[] = [
      makeIncident({ id: "h", severity: "High" }),
      makeIncident({ id: "l", severity: "Low" }),
      makeIncident({ id: "c", severity: "Critical" }),
      makeIncident({ id: "m", severity: "Medium" }),
    ];
    expect(
      sortIncidents(incidents, { field: "severity", direction: "asc" }).map(
        (i) => i.id,
      ),
    ).toEqual(["l", "m", "h", "c"]);
  });

  it("sorts by severity descending puts Critical first", () => {
    const incidents: Incident[] = [
      makeIncident({ id: "h", severity: "High" }),
      makeIncident({ id: "l", severity: "Low" }),
      makeIncident({ id: "c", severity: "Critical" }),
    ];
    expect(
      sortIncidents(incidents, { field: "severity", direction: "desc" })[0].id,
    ).toBe("c");
  });

  it("sorts by title alphabetically", () => {
    const incidents: Incident[] = [
      makeIncident({ id: "z", title: "Zeta issue" }),
      makeIncident({ id: "a", title: "Alpha issue" }),
      makeIncident({ id: "m", title: "Mu issue" }),
    ];
    expect(
      sortIncidents(incidents, { field: "title", direction: "asc" }).map(
        (i) => i.id,
      ),
    ).toEqual(["a", "m", "z"]);
  });

  it("does not mutate the input array", () => {
    const incidents: Incident[] = [
      makeIncident({ id: "b", createdAt: "2026-01-02T00:00:00Z" }),
      makeIncident({ id: "a", createdAt: "2026-01-01T00:00:00Z" }),
    ];
    const original = [...incidents];
    sortIncidents(incidents, { field: "createdAt", direction: "asc" });
    expect(incidents).toEqual(original);
  });
});
