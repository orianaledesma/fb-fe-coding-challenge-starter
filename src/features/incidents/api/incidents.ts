import { http } from "../../../lib/http";
import type {
  CreateIncidentInput,
  Incident,
  UpdateIncidentInput,
} from "../../../api/types";

export function fetchIncidents(signal?: AbortSignal): Promise<Incident[]> {
  return http<Incident[]>("/api/incidents", { signal });
}

export function fetchIncident(
  id: string,
  signal?: AbortSignal,
): Promise<Incident> {
  return http<Incident>(`/api/incidents/${id}`, { signal });
}

export function createIncident(input: CreateIncidentInput): Promise<Incident> {
  return http<Incident>("/api/incidents", {
    method: "POST",
    body: input,
  });
}

export function updateIncident(
  id: string,
  input: UpdateIncidentInput,
): Promise<Incident> {
  return http<Incident>(`/api/incidents/${id}`, {
    method: "PATCH",
    body: input,
  });
}

export function deleteIncident(id: string): Promise<void> {
  return http<void>(`/api/incidents/${id}`, { method: "DELETE" });
}
