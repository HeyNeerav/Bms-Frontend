import { mutationOptions } from "@tanstack/react-query";
import { createMember, updateMemberRole, deleteMember } from "./service";
import type { MemberMutationPayload } from "./types";

export const createMemberMutation = mutationOptions({
  mutationFn: ({
    businessId,
    data,
  }: {
    businessId: string;
    data: MemberMutationPayload;
  }) => createMember(businessId, data),
});

export const updateMemberRoleMutation = mutationOptions({
  mutationFn: ({
    businessId,
    id,
    values,
  }: {
    businessId: string;
    id: string;
    values: Pick<MemberMutationPayload, "role">;
  }) => updateMemberRole(businessId, id, values),
});

export const deleteMemberMutation = mutationOptions({
  mutationFn: ({ businessId, userId }: { businessId: string; userId: string }) =>
    deleteMember(businessId, userId),
});
