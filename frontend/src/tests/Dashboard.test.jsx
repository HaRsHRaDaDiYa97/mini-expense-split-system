import React from "react";
import { screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import Dashboard from "../pages/Dashboard";
import { renderWithProviders } from "./testUtils";
import api from "../api/axios";

// Mock axios
vi.mock("../api/axios", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

const mockGroups = [
  {
    _id: "group1",
    name: "Goa Trip",
    category: "trip",
    description: "Fun trip with friends",
    isArchived: false,
    members: [{ user: { _id: "u1", name: "Alice" } }, { user: { _id: "u2", name: "Bob" } }],
  },
  {
    _id: "group2",
    name: "Flatmates",
    category: "friends",
    description: "Household sharing",
    isArchived: false,
    members: [{ user: { _id: "u1", name: "Alice" } }, { user: { _id: "u3", name: "Charlie" } }],
  },
];

const mockNotifications = [];

describe("Dashboard Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    api.get.mockImplementation((url) => {
      if (url.includes("/groups")) {
        return Promise.resolve({ data: { groups: mockGroups } });
      }
      if (url.includes("/notifications")) {
        return Promise.resolve({ data: { notifications: mockNotifications } });
      }
      return Promise.resolve({ data: {} });
    });
  });

  it("renders dashboard metrics and group cards", async () => {
    renderWithProviders(<Dashboard />, {
      preloadedState: {
        auth: { user: { id: "u1", name: "Alice", email: "alice@example.com" }, token: "token" },
      },
    });

    // Verify search and category filter render
    expect(screen.getByPlaceholderText(/Search groups by name.../i)).toBeInTheDocument();
    expect(screen.getByRole("combobox")).toBeInTheDocument();

    // Verify group names are fetched and rendered
    expect(await screen.findByText("Goa Trip")).toBeInTheDocument();
    expect(screen.getByText("Flatmates")).toBeInTheDocument();
  });

  it("switches tabs between active and archived groups", async () => {
    renderWithProviders(<Dashboard />, {
      preloadedState: {
        auth: { user: { id: "u1", name: "Alice", email: "alice@example.com" }, token: "token" },
      },
    });

    const archivedTab = screen.getByRole("button", { name: /Archived Groups/i });
    fireEvent.click(archivedTab);

    await waitFor(() => {
      expect(api.get).toHaveBeenCalledWith("/groups", expect.objectContaining({
        params: expect.objectContaining({ includeArchived: true }),
      }));
    });
  });
});
