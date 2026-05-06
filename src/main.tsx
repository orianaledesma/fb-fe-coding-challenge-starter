import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "react-router-dom";
import * as Toast from "@radix-ui/react-toast";

import "./index.css";
import { initMockApi } from "./api";
import { createQueryClient } from "./lib/queryClient";
import { router } from "./routes";
import { ToastProvider } from "./components/ui/Toast/ToastProvider";

initMockApi();

const queryClient = createQueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <Toast.Provider swipeDirection="right" duration={4000}>
        <ToastProvider>
          <RouterProvider router={router} />
        </ToastProvider>
      </Toast.Provider>
    </QueryClientProvider>
  </StrictMode>,
);
