import { createBrowserRouter } from "react-router-dom";

import App from "./App";
import { IncidentListPage } from "./features/incidents/pages/IncidentListPage";
import { IncidentDetailPage } from "./features/incidents/pages/IncidentDetailPage";
import { NewIncidentPage } from "./features/incidents/pages/NewIncidentPage";
import { NotFoundPage } from "./features/incidents/pages/NotFoundPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <IncidentListPage /> },
      { path: "incidents/new", element: <NewIncidentPage /> },
      { path: "incidents/:id", element: <IncidentDetailPage /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);
