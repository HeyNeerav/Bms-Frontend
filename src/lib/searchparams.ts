import {
  createSearchParamsCache,
  createSerializer,
  parseAsInteger,
  parseAsString,
  parseAsStringLiteral,
} from "nuqs/server";

import { periods } from "@/features/overview/schemas/analytics";

export const searchParams = {
  page: parseAsInteger.withDefault(1),
  limit: parseAsInteger.withDefault(10),
  sortBy: parseAsString,
  sortOrder: parseAsStringLiteral(["asc", "desc"] as const).withDefault("asc"),
  search: parseAsString,
  name: parseAsString,
  gender: parseAsString,
  category: parseAsString,
  role: parseAsString,
  period: parseAsStringLiteral(periods).withDefault("30d"),
};

export const searchParamsCache = createSearchParamsCache(searchParams);
export const serialize = createSerializer(searchParams);
