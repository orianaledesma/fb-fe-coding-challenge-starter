import type { ReactElement, ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router-dom";
import { render, type RenderOptions } from "@testing-library/react";
import * as Toast from "@radix-ui/react-toast";

import { ToastProvider } from "../components/ui/Toast/ToastProvider";

interface ProviderProps {
  children: ReactNode;
  initialEntries?: string[];
  queryClient?: QueryClient;
}

export function createTestQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false, staleTime: 0 },
      mutations: { retry: false },
    },
  });
}

export function AllProviders({
  children,
  initialEntries = ["/"],
  queryClient = createTestQueryClient(),
}: ProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <Toast.Provider>
        <ToastProvider>
          <MemoryRouter initialEntries={initialEntries}>{children}</MemoryRouter>
        </ToastProvider>
      </Toast.Provider>
    </QueryClientProvider>
  );
}

interface RenderWithProvidersOptions extends Omit<RenderOptions, "wrapper"> {
  initialEntries?: string[];
  queryClient?: QueryClient;
}

export function renderWithProviders(
  ui: ReactElement,
  { initialEntries, queryClient, ...options }: RenderWithProvidersOptions = {},
) {
  const client = queryClient ?? createTestQueryClient();
  return {
    queryClient: client,
    ...render(ui, {
      wrapper: ({ children }) => (
        <AllProviders queryClient={client} initialEntries={initialEntries}>
          {children}
        </AllProviders>
      ),
      ...options,
    }),
  };
}
