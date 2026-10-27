import { Bell, BriefcaseBusiness, ChevronDown } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ThemeModeToggle } from "@/components/themes/theme-mode-toggle";
import { ThemeSelector } from "@/components/themes/theme-selector";

export default function BusinessesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="h-16 shrink-0 border-b border-border bg-background/90">
        <div className="mx-auto flex h-full max-w-[1440px] items-center justify-between px-6 lg:px-20">
          <div className="flex items-center gap-3">
            <div className="grid size-8 place-items-center text-primary">
              <BriefcaseBusiness className="size-7" strokeWidth={2.4} />
            </div>
            <span className="text-lg font-semibold tracking-tight">BMS</span>
          </div>
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
                  src="https://i.pravatar.cc/80?img=47"
                  alt="Sarah Johnson"
                />
                <AvatarFallback>SJ</AvatarFallback>
              </Avatar>
              <span className="hidden sm:inline">Sarah Johnson</span>
              <ChevronDown className="size-4 text-muted-foreground" />
            </div>
          </div>
        </div>
      </header>
      {children}
    </main>
  );
}
