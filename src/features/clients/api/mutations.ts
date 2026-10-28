import { mutationOptions } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/query-client";
import { createUser, updateUser, deleteUser } from "./service";
import { userKeys } from "./queries";
import type { UserMutationPayload } from "./types";

export const createUserMutation = mutationOptions({
  mutationFn: ({id, data}: {id: string; data: UserMutationPayload}) =>
    createUser(id, data),
  onSuccess: (_data, variables) => {
    getQueryClient().invalidateQueries({ queryKey: [...userKeys.all, variables.id] });
  },
});

export const updateUserMutation = mutationOptions({
  mutationFn: ({ id, values }: { id: string; values: UserMutationPayload }) =>
    updateUser(id, values),
  onSuccess: () => {
    getQueryClient().invalidateQueries({ queryKey: userKeys.all });
  },
});

export const deleteUserMutation = mutationOptions({
  mutationFn: (id: number) => deleteUser(id),
  onSuccess: () => {
    getQueryClient().invalidateQueries({ queryKey: userKeys.all });
  },
});
