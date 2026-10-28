import type { Metadata } from "next";
import { cookies } from "next/headers";
import KBar from "@/components/kbar";

import Header from "@/components/layout/header";
import AppSidebar from "@/components/layout/app-sidebar";
import { InfoSidebar } from "@/components/layout/info-sidebar";

import { InfobarProvider } from "@/components/ui/infobar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { BusinessProvider } from "@/components/business-provider";
import { notFound, redirect } from "next/navigation";
import { api } from "@/lib/api";
import { getBusinessBySlug } from "@/lib/businesses";

export const metadata: Metadata = {
  title: "BMS Dashboard",
  description: "Business Management System Dashboard",
  robots: {
    index: false,
    follow: false,
  },
};

type BusinessRole = "OWNER" | "ADMIN" | "EMPLOYEE";

type Business = {
  _id: string;
  name: string;
  slug: string;
  logo?: {
    url?: string | undefined;
    publicId?: string | undefined;
  },
  role: BusinessRole;
};

export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";
  const token = cookieStore.get("accessToken")?.value;

  if (!token) {
    redirect("/login");
  }

  const { slug } = await params;

  let business;
  try {
    business = await getBusinessBySlug(slug);
  } catch (error) {
    console.error("Error fetching businesses:", error);
  }

  if (!business) notFound();

  return (
    <KBar slug={slug}>
      <SidebarProvider defaultOpen={defaultOpen}>
        <a
          href="#main-content"
          className="bg-background ring-ring sr-only rounded-md px-3 py-2 text-sm font-medium shadow focus:not-sr-only focus:absolute focus:top-2 focus:start-2 focus:z-50 focus:ring-2"
        >
          Skip to content
        </a>
        <AppSidebar slug={slug} />
        <SidebarInset id="main-content" tabIndex={-1} className="scroll-mt-16">
          <Header />
          <InfobarProvider defaultOpen={false}>
            <BusinessProvider business={business}>{children}</BusinessProvider>;
            <InfoSidebar side="right" />
          </InfobarProvider>
        </SidebarInset>
      </SidebarProvider>
    </KBar>
  );
}
