import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createIncident } from "../api/incidents";
import { incidentKeys } from "../api/queryKeys";
import type { CreateIncidentInput, Incident } from "../../../api/types";

export function useCreateIncident() {
  const queryClient = useQueryClient();

  return useMutation<Incident, Error, CreateIncidentInput>({
    mutationFn: createIncident,
    onSuccess: (created) => {
      queryClient.setQueryData<Incident[]>(incidentKeys.list(), (prev) =>
        prev ? [created, ...prev] : [created],
      );
      queryClient.setQueryData(incidentKeys.detail(created.id), created);
    },
  });
}
