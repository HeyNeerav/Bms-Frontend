import type { Metadata } from "next";
import { cookies } from "next/headers";

import HomeSidebar from "@/components/layout/home-sidebar";
import HomeHeader from "@/components/layout/home-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export const metadata: Metadata = {
  title: "BMS Dashboard - Home",
  description: "BMS Homepage consisting of your businesses and other relevant information",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <a
        href="#main-content"
        className="bg-background ring-ring sr-only rounded-md px-3 py-2 text-sm font-medium shadow focus:not-sr-only focus:absolute focus:top-2 focus:start-2 focus:z-50 focus:ring-2"
      >
        Skip to content
      </a>
      <HomeSidebar />
      <SidebarInset id="main-content" tabIndex={-1} className="scroll-mt-16">
        <HomeHeader />
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
