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
            <Button
              aria-label="Notifications"
              variant="ghost"
              size="icon"
              className="relative text-muted-foreground"
            >
              <Bell />
              <span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-destructive ring-2 ring-background" />
            </Button>
            <div className="flex items-center gap-3 text-sm font-medium">
              <Avatar className="size-8">
                <AvatarImage
                  src={user?.avatar?.url || ""}
                  alt={user?.name || "User Avatar"}
                />
                <AvatarFallback>
                  {avatarFallbackText()}
                </AvatarFallback>
              </Avatar>
              <span className="hidden sm:inline">{user?.name}</span>
              <ChevronDown className="size-4 text-muted-foreground" />
            </div>
          </div>
        </div>
      </header>
      {children}
    </main>
  );
}
