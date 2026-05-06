import { useQuery } from "@tanstack/react-query";

import { fetchIncidents } from "../api/incidents";
import { incidentKeys } from "../api/queryKeys";

export function useIncidents() {
  return useQuery({
    queryKey: incidentKeys.list(),
    queryFn: ({ signal }) => fetchIncidents(signal),
  });
}
