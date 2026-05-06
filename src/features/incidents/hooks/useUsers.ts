import { useQuery } from "@tanstack/react-query";

import { fetchUsers } from "../api/users";
import { userKeys } from "../api/queryKeys";

export function useUsers() {
  return useQuery({
    queryKey: userKeys.list(),
    queryFn: ({ signal }) => fetchUsers(signal),
    staleTime: 5 * 60_000,
  });
}
