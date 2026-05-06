import { http } from "../../../lib/http";
import type { User } from "../../../api/types";

export function fetchUsers(signal?: AbortSignal): Promise<User[]> {
  return http<User[]>("/api/users", { signal });
}
