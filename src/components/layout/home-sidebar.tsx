"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Icons } from "@/components/icons";
import { useQuery } from "@tanstack/react-query";
import { userMeQueryOptions } from "@/features/user/api/queries";
import { UserAvatarProfile } from "../user-avatar-profile";

export default function HomeSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const generalNavGroups = [
    {
      label: "GENERAL",
      items: [
        {
          title: "Businesses",
          url: "/businesses",
          icon: "briefcase",
        },
      ],
    },
    {
      label: "ACCOUNT",
      items: [
        {
          title: "My Profile",
          url: "/profile",
          icon: "user",
        },
      ],
    },
  ];

  const { data } = useQuery(userMeQueryOptions());
  const user = data?.data;

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader />
      <SidebarContent className="overflow-x-hidden">
        {generalNavGroups.map((group) => (
          <SidebarGroup key={group.label || "ungrouped"} className="py-0">
            {group.label && (
              <SidebarGroupLabel className="text-xs font-medium tracking-wide text-muted-foreground pt-4 mb-1 h-auto border-t border-sidebar-border mt-4 rounded-none px-2">
                {group.label}
              </SidebarGroupLabel>
            )}
            <SidebarMenu>
              {group.items.map((item) => {
                const Icon = item.icon
                  ? Icons[item.icon as keyof typeof Icons]
                  : Icons.logo;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      render={
                        <Link href={`${item.url}`} aria-label={item.title} />
                      }
                      tooltip={item.title}
                      isActive={pathname === `${item.url}`}
                    >
                      {/* <Icon /> */}
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <SidebarMenuButton
                    size="lg"
                    className="data-popup-open:bg-sidebar-accent data-popup-open:text-sidebar-accent-foreground"
                  />
                }
              >
                {user && (
                  <UserAvatarProfile
                    className="h-8 w-8 rounded-lg"
                    showInfo
                    user={user}
                  />
                )}
                <Icons.chevronsDown className="ml-auto size-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-(--anchor-width) min-w-56 rounded-lg"
                side="bottom"
                align="end"
                sideOffset={4}
              >
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="p-0 font-normal">
                    <div className="px-1 py-1.5">
                      {user && (
                        <UserAvatarProfile
                          className="h-8 w-8 rounded-lg"
                          showInfo
                          user={user}
                        />
                      )}
                    </div>
                  </DropdownMenuLabel>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />

                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={() => router.push("/profile")}>
                    <Icons.account className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    onClick={() => router.push("/api/auth/logout")}
                  >
                    <Icons.logout aria-hidden className="mr-2 h-4 w-4" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
