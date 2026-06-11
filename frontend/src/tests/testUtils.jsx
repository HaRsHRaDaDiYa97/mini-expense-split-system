import React from "react";
import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { MemoryRouter } from "react-router-dom";
import authReducer from "../features/auth/authSlice";

export function renderWithProviders(
  ui,
  {
    preloadedState = {},
    store = configureStore({
      reducer: { auth: authReducer },
      preloadedState,
    }),
    route = "/",
    ...renderOptions
  } = {}
) {
  function Wrapper({ children }) {
    return (
      <Provider store={store}>
        <MemoryRouter initialEntries={[route]}>
          {children}
        </MemoryRouter>
      </Provider>
    );
  }
  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}
