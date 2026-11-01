import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/query-client";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { userMeQueryOptions } from "@/features/user/api/queries";

export default async function BusinessesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  if (!accessToken) {
    redirect("/auth/sign-in");
  }

  const queryClient = getQueryClient();

  try {
    await queryClient.query({ ...userMeQueryOptions(), staleTime: "static" });
  } catch (error) {
    redirect("/api/auth/clear-session");
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {children}
    </HydrationBoundary>
  );
}
