import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateIncident } from "../api/incidents";
import { incidentKeys } from "../api/queryKeys";
import type { Incident, UpdateIncidentInput } from "../../../api/types";

interface UpdateVariables {
  id: string;
  input: UpdateIncidentInput;
}

interface UpdateContext {
  previousList?: Incident[];
  previousDetail?: Incident;
}

export function useUpdateIncident() {
  const queryClient = useQueryClient();

  return useMutation<Incident, Error, UpdateVariables, UpdateContext>({
    mutationFn: ({ id, input }) => updateIncident(id, input),

    onMutate: async ({ id, input }) => {
      await queryClient.cancelQueries({ queryKey: incidentKeys.list() });
      await queryClient.cancelQueries({ queryKey: incidentKeys.detail(id) });

      const previousList = queryClient.getQueryData<Incident[]>(
        incidentKeys.list(),
      );
      const previousDetail = queryClient.getQueryData<Incident>(
        incidentKeys.detail(id),
      );

      const now = new Date().toISOString();

      const applyOptimistic = (incident: Incident): Incident => {
        const statusChanged =
          input.status !== undefined && input.status !== incident.status;
        return {
          ...incident,
          ...input,
          updatedAt: now,
          statusHistory: statusChanged
            ? [
                ...incident.statusHistory,
                {
                  status: input.status!,
                  changedAt: now,
                  changedBy: "current-user",
                },
              ]
            : incident.statusHistory,
        };
      };

      if (previousList) {
        queryClient.setQueryData<Incident[]>(
          incidentKeys.list(),
          previousList.map((inc) =>
            inc.id === id ? applyOptimistic(inc) : inc,
          ),
        );
      }

      if (previousDetail) {
        queryClient.setQueryData<Incident>(
          incidentKeys.detail(id),
          applyOptimistic(previousDetail),
        );
      }

      return { previousList, previousDetail };
    },

    onError: (_error, { id }, context) => {
      if (context?.previousList) {
        queryClient.setQueryData(incidentKeys.list(), context.previousList);
      }
      if (context?.previousDetail) {
        queryClient.setQueryData(
          incidentKeys.detail(id),
          context.previousDetail,
        );
      }
    },

    onSettled: (_data, _error, { id }) => {
      queryClient.invalidateQueries({ queryKey: incidentKeys.list() });
      queryClient.invalidateQueries({ queryKey: incidentKeys.detail(id) });
    },
  });
}
