"use client";

import Link from "next/link";
import React from "react";
import { ThemeModeToggle } from "../themes/theme-mode-toggle";
import { ThemeSelector } from "../themes/theme-selector";
import { Bell, ChevronDown } from "lucide-react";
import { Button } from "../ui/button";
import { userMeQueryOptions } from "@/features/user/api/queries";
import { useQuery } from "@tanstack/react-query";

export default function HomeHeader() {
  const { data } = useQuery(userMeQueryOptions());
  const user = data?.data;

  return (
    <header className="h-16 shrink-0 border-b border-border bg-background/90">
      <div className="mx-auto flex h-full max-w-[1440px] items-center justify-between px-6 lg:px-20">
        <Link href="/businesses" className="flex items-center gap-3">
          <div className="grid size-8 place-items-center text-primary">
            <img src="/logo.webp" alt="BMS Logo" className="size-7" />
          </div>
          <span className="text-lg font-semibold tracking-tight">BMS</span>
        </Link>
        <div className="flex items-center gap-5">
          <ThemeModeToggle />
          <div className="hidden sm:block">
            <ThemeSelector />
          </div>
        </div>
      </div>
    </header>
  );
}
