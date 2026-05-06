import { describe, expect, it, vi } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { renderWithProviders } from "../../../../test/utils";
import { IncidentForm } from "./IncidentForm";
import type { User } from "../../../../api/types";

const users: User[] = [
  { id: "user-1", name: "Alice", email: "alice@example.com" },
  { id: "user-2", name: "Bob", email: "bob@example.com" },
];

describe("IncidentForm", () => {
  it("blocks submission and shows errors when title and severity are missing", async () => {
    const onSubmit = vi.fn();
    const user = userEvent.setup();

    renderWithProviders(<IncidentForm users={users} onSubmit={onSubmit} />);

    await user.click(screen.getByRole("button", { name: /create incident/i }));

    expect(onSubmit).not.toHaveBeenCalled();
    expect(
      await screen.findByText(/title must be at least 3/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/select a severity/i)).toBeInTheDocument();
  });

  it("submits trimmed values when input is valid", async () => {
    const onSubmit = vi.fn();
    const user = userEvent.setup();

    renderWithProviders(<IncidentForm users={users} onSubmit={onSubmit} />);

    await user.type(
      screen.getByLabelText(/title/i),
      "  Sample incident title  ",
    );
    await user.type(
      screen.getByLabelText(/description/i),
      "Some details here",
    );

    // Open severity Select and choose High
    await user.click(screen.getByRole("combobox", { name: /severity/i }));
    await user.click(await screen.findByRole("option", { name: "High" }));

    await user.click(screen.getByRole("button", { name: /create incident/i }));

    await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1));
    expect(onSubmit).toHaveBeenCalledWith({
      title: "Sample incident title",
      description: "Some details here",
      severity: "High",
      assigneeId: null,
    });
  });

  it("shows server error when provided", () => {
    renderWithProviders(
      <IncidentForm
        users={users}
        onSubmit={vi.fn()}
        serverError="Network unreachable"
      />,
    );
    expect(screen.getByRole("alert")).toHaveTextContent(/network unreachable/i);
  });

  it("disables submit button while submitting", () => {
    renderWithProviders(
      <IncidentForm users={users} onSubmit={vi.fn()} submitting />,
    );
    expect(
      screen.getByRole("button", { name: /creating/i }),
    ).toBeDisabled();
  });
});
