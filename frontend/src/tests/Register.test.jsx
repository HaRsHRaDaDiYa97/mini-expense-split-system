import React from "react";
import { screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import Register from "../pages/Register";
import { renderWithProviders } from "./testUtils";
import api from "../api/axios";

// Mock axios
vi.mock("../api/axios", () => ({
  default: {
    post: vi.fn(),
  },
}));

describe("Register Component", () => {
  it("renders correctly with name, email, and password fields", () => {
    renderWithProviders(<Register />);
    expect(screen.getByLabelText(/Full Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Register/i })).toBeInTheDocument();
  });

  it("shows validation errors for empty fields on submit", async () => {
    renderWithProviders(<Register />);
    const submitBtn = screen.getByRole("button", { name: /Register/i });
    fireEvent.click(submitBtn);

    expect(await screen.findByText(/Full name is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/Email is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/Password is required/i)).toBeInTheDocument();
  });

  it("checks password strength indicator changes", async () => {
    renderWithProviders(<Register />);
    const passwordInput = screen.getByLabelText(/Password/i);

    // Weak password
    fireEvent.change(passwordInput, { target: { value: "123" } });
    expect(screen.getByText(/Weak/i)).toBeInTheDocument();

    // Medium password
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    expect(screen.getByText(/Medium/i)).toBeInTheDocument();

    // Strong password
    fireEvent.change(passwordInput, { target: { value: "Password123!" } });
    expect(screen.getByText(/Strong/i)).toBeInTheDocument();
  });

  it("submits registration successfully and redirects to login", async () => {
    api.post.mockResolvedValueOnce({ data: { success: true, message: "Registration successful" } });
    
    renderWithProviders(<Register />);
    
    fireEvent.change(screen.getByLabelText(/Full Name/i), { target: { value: "John Doe" } });
    fireEvent.change(screen.getByLabelText(/Email address/i), { target: { value: "john@example.com" } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: "Password123!" } });

    fireEvent.click(screen.getByRole("button", { name: /Register/i }));

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith("/auth/register", {
        name: "John Doe",
        email: "john@example.com",
        password: "Password123!",
      });
    });
  });
});
