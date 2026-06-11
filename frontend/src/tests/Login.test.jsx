import React from "react";
import { screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import Login from "../pages/Login";
import { renderWithProviders } from "./testUtils";
import api from "../api/axios";

// Mock axios
vi.mock("../api/axios", () => ({
  default: {
    post: vi.fn(),
  },
}));

describe("Login Component", () => {
  it("renders correctly with email and password fields", () => {
    renderWithProviders(<Login />);
    expect(screen.getByLabelText(/Email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Sign in/i })).toBeInTheDocument();
  });

  it("shows validation errors for empty fields on submit", async () => {
    renderWithProviders(<Login />);
    const submitBtn = screen.getByRole("button", { name: /Sign in/i });
    fireEvent.click(submitBtn);

    expect(await screen.findByText(/Email is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/Password is required/i)).toBeInTheDocument();
  });

  it("shows error for invalid email address format", async () => {
    renderWithProviders(<Login />);
    const emailInput = screen.getByLabelText(/Email address/i);
    const submitBtn = screen.getByRole("button", { name: /Sign in/i });

    fireEvent.change(emailInput, { target: { value: "invalidemail" } });
    fireEvent.click(submitBtn);

    expect(await screen.findByText(/Please enter a valid email address/i)).toBeInTheDocument();
  });

  it("submits the form successfully and dispatches login success", async () => {
    const mockUser = { id: "123", name: "John Doe", email: "john@example.com" };
    const mockToken = "fake-jwt-token";
    api.post.mockResolvedValueOnce({ data: { user: mockUser, token: mockToken } });

    const { store } = renderWithProviders(<Login />);
    
    fireEvent.change(screen.getByLabelText(/Email address/i), { target: { value: "john@example.com" } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: "password123" } });
    
    fireEvent.click(screen.getByRole("button", { name: /Sign in/i }));

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith("/auth/login", {
        email: "john@example.com",
        password: "password123",
      });
    });

    expect(store.getState().auth.user).toEqual(mockUser);
    expect(store.getState().auth.token).toBe(mockToken);
  });
});
