"use client";

import { useTransition } from "react";
import { useQueryState, parseAsStringLiteral } from "nuqs";
import { Loader2 } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Icons } from "@/components/icons";

const periods = ["7d", "30d", "90d", "12m", "year", "lifetime"] as const;

const periodLabels = {
  "7d": "Last 7 days",
  "30d": "Last 30 days",
  "90d": "Last 90 days",
  "12m": "Last 12 months",
  year: "This year",
  lifetime: "Lifetime",
};

export function AnalyticsPeriodFilter() {
  const [isPending, startTransition] = useTransition();

  const [period, setPeriod] = useQueryState(
    "period",
    parseAsStringLiteral(periods).withDefault("30d").withOptions({
      shallow: false,
      scroll: false,
      startTransition,
    }),
  );

  return (
    <Select
      items={periodLabels}
      value={period}
      disabled={isPending}
      onValueChange={(value) => {
        if (value) {
          setPeriod(value as (typeof periods)[number]);
        }
      }}
    >
      <SelectTrigger className="w-[160px]">
        {isPending ? (
          <Loader2 className="size-4 animate-spin text-muted-foreground" />
        ) : (
          <Icons.calendar className="size-4 text-muted-foreground" />
        )}

        <SelectValue placeholder="Select period" />
      </SelectTrigger>

      <SelectContent>
        {periods.map((value) => (
          <SelectItem key={value} value={value}>
            {periodLabels[value]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
