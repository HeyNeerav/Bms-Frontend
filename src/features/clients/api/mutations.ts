import { mutationOptions } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/query-client";
import { createUser, updateUser, deleteUser } from "./service";
import { userKeys } from "./queries";
import type { UserMutationPayload } from "./types";

export const createUserMutation = mutationOptions({
  mutationFn: ({businessId, data}: {businessId: string; data: UserMutationPayload}) =>
    createUser(businessId, data),
  onSuccess: (_data, variables) => {
    getQueryClient().invalidateQueries({ queryKey: [...userKeys.all, variables.businessId] });
  },
});

export const updateUserMutation = mutationOptions({
  mutationFn: ({ businessId, id, values }: { businessId: string; id: string; values: UserMutationPayload }) =>
    updateUser(businessId, id, values),
  onSuccess: () => {
    getQueryClient().invalidateQueries({ queryKey: userKeys.all });
  },
});

export const deleteUserMutation = mutationOptions({
  mutationFn: ({businessId, id}: {businessId: string; id: string}) => deleteUser(businessId, id),
  onSuccess: () => {
    getQueryClient().invalidateQueries({ queryKey: userKeys.all });
  },
});
