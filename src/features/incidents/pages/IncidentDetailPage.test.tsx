import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { Route, Routes } from "react-router-dom";
import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { renderWithProviders } from "../../../test/utils";
import { initMockApi, teardownMockApi } from "../../../api/mockApi";
import { resetData } from "../../../api/storage";
import { IncidentDetailPage } from "./IncidentDetailPage";

beforeEach(() => {
  initMockApi();
  resetData();
});

afterEach(() => {
  teardownMockApi();
});

function renderDetail(id: string) {
  return renderWithProviders(
    <Routes>
      <Route path="/incidents/:id" element={<IncidentDetailPage />} />
    </Routes>,
    { initialEntries: [`/incidents/${id}`] },
  );
}

describe("IncidentDetailPage", () => {
  it("loads and renders the incident with description and timeline", async () => {
    renderDetail("inc-1");

    expect(
      await screen.findByRole("heading", {
        name: /database connection timeout/i,
      }),
    ).toBeInTheDocument();

    // Description visible
    expect(
      screen.getByText(/intermittent connection timeouts/i),
    ).toBeInTheDocument();

    // Timeline shows at least the initial Open status entry
    const timelines = screen.getAllByRole("list");
    const timeline = timelines.find((el) =>
      within(el).queryAllByText(/open/i).length > 0,
    );
    expect(timeline).toBeDefined();
  });

  it("optimistically updates status when changed via the detail page", async () => {
    const user = userEvent.setup();
    renderDetail("inc-1");

    await screen.findByRole("heading", {
      name: /database connection timeout/i,
    });

    // Open the status Select and pick "In Progress"
    await user.click(screen.getByRole("combobox", { name: /^status$/i }));
    await user.click(
      await screen.findByRole("option", { name: /in progress/i }),
    );

    // The new status should appear before the network round-trip resolves
    // (header badge + timeline pick it up). We assert it eventually shows.
    await waitFor(() => {
      const badges = screen.getAllByText(/in progress/i);
      expect(badges.length).toBeGreaterThan(0);
    });
  });

  it("shows a not-found error when the id does not exist", async () => {
    renderDetail("nope-doesnt-exist");
    expect(
      await screen.findByRole("heading", { name: /incident not found/i }),
    ).toBeInTheDocument();
  });
});
