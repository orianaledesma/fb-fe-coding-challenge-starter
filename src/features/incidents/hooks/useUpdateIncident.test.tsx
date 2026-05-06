import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { act, renderHook, waitFor } from "@testing-library/react";
import { QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";

import { initMockApi, teardownMockApi } from "../../../api/mockApi";
import { resetData } from "../../../api/storage";
import { incidentKeys } from "../api/queryKeys";
import { useUpdateIncident } from "./useUpdateIncident";
import { createTestQueryClient } from "../../../test/utils";
import type { Incident } from "../../../api/types";

const seedIncident = (id = "inc-1"): Incident => ({
  id,
  title: "Database connection timeout",
  description: "x",
  status: "Open",
  severity: "High",
  assigneeId: "user-1",
  createdAt: "2026-01-08T10:30:00Z",
  updatedAt: "2026-01-08T10:30:00Z",
  statusHistory: [
    {
      status: "Open",
      changedAt: "2026-01-08T10:30:00Z",
      changedBy: "user-2",
    },
  ],
});

beforeEach(() => {
  initMockApi();
  resetData();
});

afterEach(() => {
  teardownMockApi();
});

function makeWrapper() {
  const client = createTestQueryClient();
  // Pre-seed both list and detail caches so we can assert optimistic updates
  client.setQueryData<Incident[]>(incidentKeys.list(), [seedIncident()]);
  client.setQueryData<Incident>(incidentKeys.detail("inc-1"), seedIncident());

  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );

  return { client, wrapper };
}

describe("useUpdateIncident", () => {
  it("applies optimistic update to list and detail caches before the request resolves", async () => {
    const { client, wrapper } = makeWrapper();
    const { result } = renderHook(() => useUpdateIncident(), { wrapper });

    act(() => {
      result.current.mutate({
        id: "inc-1",
        input: { status: "In Progress" },
      });
    });

    // Optimistic update should be visible immediately
    await waitFor(() => {
      const list = client.getQueryData<Incident[]>(incidentKeys.list());
      expect(list?.[0].status).toBe("In Progress");
    });

    const detail = client.getQueryData<Incident>(incidentKeys.detail("inc-1"));
    expect(detail?.status).toBe("In Progress");
    expect(detail?.statusHistory).toHaveLength(2);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });

  it("rolls back the cache when the mutation fails", async () => {
    const { client, wrapper } = makeWrapper();
    const { result } = renderHook(() => useUpdateIncident(), { wrapper });

    act(() => {
      // The mock API returns 404 for unknown ids → mutation fails
      result.current.mutate({
        id: "does-not-exist",
        input: { status: "Resolved" },
      });
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    // The cache for inc-1 should be untouched (rollback would still preserve it
    // because it was never optimistically modified for the bad id)
    const list = client.getQueryData<Incident[]>(incidentKeys.list());
    expect(list?.[0].status).toBe("Open");
  });
});
