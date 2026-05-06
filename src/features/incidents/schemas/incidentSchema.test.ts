import { describe, expect, it } from "vitest";

import { createIncidentSchema } from "./incidentSchema";

describe("createIncidentSchema", () => {
  it("accepts a fully valid input", () => {
    const result = createIncidentSchema.safeParse({
      title: "Pipeline failing",
      description: "Nightly build broken since Tuesday",
      severity: "High",
      assigneeId: "user-1",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.title).toBe("Pipeline failing");
    }
  });

  it("trims whitespace from the title before validating", () => {
    const result = createIncidentSchema.safeParse({
      title: "   Spacing   ",
      severity: "Low",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.title).toBe("Spacing");
    }
  });

  it("rejects titles shorter than 3 chars", () => {
    const result = createIncidentSchema.safeParse({
      title: "ab",
      severity: "Low",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const issue = result.error.issues.find((i) => i.path[0] === "title");
      expect(issue?.message).toMatch(/at least 3/i);
    }
  });

  it("rejects titles over 100 chars", () => {
    const result = createIncidentSchema.safeParse({
      title: "x".repeat(101),
      severity: "Medium",
    });
    expect(result.success).toBe(false);
  });

  it("requires a valid severity", () => {
    const missing = createIncidentSchema.safeParse({ title: "Valid title" });
    expect(missing.success).toBe(false);

    const invalid = createIncidentSchema.safeParse({
      title: "Valid title",
      severity: "Catastrophic",
    });
    expect(invalid.success).toBe(false);
  });

  it("defaults description and assigneeId when not provided", () => {
    const result = createIncidentSchema.safeParse({
      title: "Just a title",
      severity: "Low",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.description).toBe("");
      expect(result.data.assigneeId).toBeNull();
    }
  });
});
