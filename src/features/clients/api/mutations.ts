import { mutationOptions } from "@tanstack/react-query";
import { createClient, updateClient, deleteClient } from "./service";
import type { ClientMutationPayload } from "./types";

export const createClientMutation = mutationOptions({
  mutationFn: ({businessId, data}: {businessId: string; data: ClientMutationPayload}) =>
    createClient(businessId, data),
});

export const updateClientMutation = mutationOptions({
  mutationFn: ({ businessId, id, values }: { businessId: string; id: string; values: ClientMutationPayload }) =>
    updateClient(businessId, id, values),
});

export const deleteClientMutation = mutationOptions({
  mutationFn: ({businessId, id}: {businessId: string; id: string}) => deleteClient(businessId, id),

});
