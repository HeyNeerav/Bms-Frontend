import {
  createSearchParamsCache,
  createSerializer,
  parseAsInteger,
  parseAsString,
  parseAsStringLiteral,
} from "nuqs/server";

import { getSortingStateParser } from "@/lib/data-table-parsers";
import { periods } from "@/features/overview/schemas/analytics";

export const searchParams = {
  page: parseAsInteger.withDefault(1),
  limit: parseAsInteger.withDefault(10),
  search: parseAsString,
  name: parseAsString,
  gender: parseAsString,
  category: parseAsString,
  role: parseAsString,
  sort: getSortingStateParser().withDefault([]),
  period: parseAsStringLiteral(periods).withDefault("30d"),
};

export const searchParamsCache = createSearchParamsCache(searchParams);
export const serialize = createSerializer(searchParams);
