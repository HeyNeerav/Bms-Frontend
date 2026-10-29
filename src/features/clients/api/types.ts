// export type { User } from '@/constants/mock-api-users';

export type User = {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  companyName?: string;
  gstNumber?: string;
  notes?: string;
  tags?: string[];
}

export type UserFilters = {
  page?: number;
  limit?: number;
  search?: string;
  sort?: string;
};

export type UsersResponse = {
  success: boolean;
  time: string;
  message: string;
  total_users: number;
  offset: number;
  limit: number;
  users: User[];
};

export type UserMutationPayload = {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  companyName?: string;
  gstNumber?: string;
  notes?: string;
  tags?: string[];
};
