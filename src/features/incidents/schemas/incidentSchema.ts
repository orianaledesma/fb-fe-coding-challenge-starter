import { z } from "zod";

export const SEVERITY_OPTIONS = ["Low", "Medium", "High", "Critical"] as const;
export const STATUS_OPTIONS = ["Open", "In Progress", "Resolved"] as const;

export const createIncidentSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title must be 100 characters or fewer"),
  description: z
    .string()
    .trim()
    .max(2000, "Description must be 2000 characters or fewer")
    .optional()
    .default(""),
  severity: z.enum(SEVERITY_OPTIONS, {
    message: "Select a severity",
  }),
  assigneeId: z.string().nullable().default(null),
});

export type CreateIncidentValues = z.infer<typeof createIncidentSchema>;
