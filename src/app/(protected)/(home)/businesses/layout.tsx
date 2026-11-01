"use client";

import Link from "next/link";
import { Bell, ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ThemeSelector } from "@/components/themes/theme-selector";
import { ThemeModeToggle } from "@/components/themes/theme-mode-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useQuery } from "@tanstack/react-query";
import { userMeQueryOptions } from "@/features/profile/api/queries";

export default function BusinessesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data } = useQuery(userMeQueryOptions());

  const user = data?.data;

  const avatarFallbackText = () => {
    if (!user?.name) return "U";
    const parts = user.name.trim().split(/\s+/);
    if (parts.length > 1) {
      return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase();
    }
    return parts[0].charAt(0).toUpperCase();
  }

  return (
    <main className="flex flex-col min-h-screen bg-background text-foreground">
     
      {children}
    </main>
  );
}
