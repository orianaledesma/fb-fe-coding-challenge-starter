export const incidentKeys = {
  all: ["incidents"] as const,
  list: () => [...incidentKeys.all, "list"] as const,
  detail: (id: string) => [...incidentKeys.all, "detail", id] as const,
};

export const userKeys = {
  all: ["users"] as const,
  list: () => [...userKeys.all, "list"] as const,
};
