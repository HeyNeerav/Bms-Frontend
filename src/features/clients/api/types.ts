export type Client = {
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

export type ClientFilters = {
  page?: number;
  limit?: number;
  search?: string;
  sort?: string;
};

export type ClientsResponse = {
  success: boolean;
  time: string;
  message: string;
  total_clients: number;
  offset: number;
  limit: number;
  clients: Client[];
};

export type ClientMutationPayload = {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  companyName?: string;
  gstNumber?: string;
  notes?: string;
  tags?: string[];
};
