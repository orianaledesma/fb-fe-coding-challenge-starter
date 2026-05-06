import { useQuery } from "@tanstack/react-query";

import { fetchIncident } from "../api/incidents";
import { incidentKeys } from "../api/queryKeys";

export function useIncident(id: string | undefined) {
  return useQuery({
    queryKey: id ? incidentKeys.detail(id) : incidentKeys.detail("__missing__"),
    queryFn: ({ signal }) => fetchIncident(id!, signal),
    enabled: Boolean(id),
  });
}
