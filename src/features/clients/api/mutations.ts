import { mutationOptions } from "@tanstack/react-query";
import { createUser, updateUser, deleteUser } from "./service";
import type { UserMutationPayload } from "./types";

export const createUserMutation = mutationOptions({
  mutationFn: ({businessId, data}: {businessId: string; data: UserMutationPayload}) =>
    createUser(businessId, data),
});

export const updateUserMutation = mutationOptions({
  mutationFn: ({ businessId, id, values }: { businessId: string; id: string; values: UserMutationPayload }) =>
    updateUser(businessId, id, values),
});

export const deleteUserMutation = mutationOptions({
  mutationFn: ({businessId, id}: {businessId: string; id: string}) => deleteUser(businessId, id),

});
