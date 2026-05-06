import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteIncident } from "../api/incidents";
import { incidentKeys } from "../api/queryKeys";
import type { Incident } from "../../../api/types";

export function useDeleteIncident() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: deleteIncident,
    onSuccess: (_data, id) => {
      queryClient.setQueryData<Incident[]>(incidentKeys.list(), (prev) =>
        prev ? prev.filter((inc) => inc.id !== id) : prev,
      );
      queryClient.removeQueries({ queryKey: incidentKeys.detail(id) });
    },
  });
}
