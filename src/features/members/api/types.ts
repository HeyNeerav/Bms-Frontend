// export type { Member } from '@/constants/mock-api-users';

export const MemberRole = "OWNER" | "ADMIN" | "EMPLOYEE";

export type Member = {
  _id: string;
  user: {
    _id: string;
    name: string;
    email: string;
  };
  role: MemberRole;
  joinedAt: string;
}

export type MemberFilters = {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
};

export type MembersResponse = {
  success: boolean;
  time: string;
  message: string;
  total_members: number;
  offset: number;
  limit: number;
  members: Member[];
};

export type MemberMutationPayload = {
  email: string;
  role: MemberRole;
};
