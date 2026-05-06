import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { renderWithProviders } from "../../../test/utils";
import { initMockApi, teardownMockApi } from "../../../api/mockApi";
import { resetData } from "../../../api/storage";
import { IncidentListPage } from "./IncidentListPage";

beforeEach(() => {
  initMockApi();
  resetData();
});

afterEach(() => {
  teardownMockApi();
});

describe("IncidentListPage", () => {
  it("shows a loading state then renders incidents from the API", async () => {
    renderWithProviders(<IncidentListPage />);

    expect(screen.getByRole("status")).toHaveTextContent(/loading/i);

    expect(
      await screen.findByRole("link", { name: /database connection timeout/i }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("link", { name: /payment gateway error/i }),
    ).toBeInTheDocument();
  });

  it("filters incidents by status", async () => {
    const user = userEvent.setup();

    renderWithProviders(<IncidentListPage />);

    await screen.findByRole("link", { name: /database connection timeout/i });

    // Open Status filter and pick "Resolved"
    await user.click(screen.getByRole("combobox", { name: /^status$/i }));
    await user.click(await screen.findByRole("option", { name: "Resolved" }));

    await waitFor(() => {
      expect(
        screen.queryByRole("link", { name: /database connection timeout/i }),
      ).not.toBeInTheDocument();
    });
    expect(
      screen.getByRole("link", { name: /login page css broken on mobile/i }),
    ).toBeInTheDocument();
  });

  it("filters incidents by free-text search", async () => {
    const user = userEvent.setup();

    renderWithProviders(<IncidentListPage />);

    await screen.findByRole("link", { name: /database connection timeout/i });

    await user.type(
      screen.getByRole("searchbox", { name: /search/i }),
      "payment",
    );

    await waitFor(() => {
      expect(
        screen.queryByRole("link", { name: /database connection timeout/i }),
      ).not.toBeInTheDocument();
    });
    expect(
      screen.getByRole("link", { name: /payment gateway error/i }),
    ).toBeInTheDocument();
  });
});
