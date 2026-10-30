export type ProductType = "PRODUCT" | "SERVICE";

export type Product = {
  _id: string;
  name: string;
  description?: string;
  type: ProductType;
  price: number;
  stockQuantity: number;
  sku?: string;
  category?: string;
  image?: {
    url?: string;
    publicId?: string;
  };
  isArchived: boolean;
  createdBy: string;
  metadata?: Record<string, unknown>;
}

export type ProductFilters = {
  page?: number;
  limit?: number;
  categories?: string;
  search?: string;
  sort?: string;
};

export type ProductsResponse = {
  success: boolean;
  time: string;
  message: string;
  total_products: number;
  offset: number;
  limit: number;
  products: Product[];
};

export type ProductByIdResponse = {
  success: boolean;
  time: string;
  message: string;
  product: Product;
};

export type ProductMutationPayload = {
  name?: string;
  price?: number;
  type?: ProductType;
  stockQuantity?: number;
  sku?: string | undefined;
  imageUrl?: File | null;
  category?: string;
  description?: string;
};
