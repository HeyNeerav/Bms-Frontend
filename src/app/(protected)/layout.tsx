import { isAxiosError } from "axios";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { apiServer } from "@/lib/api-server";
import { ApiResponse } from "@/types/ApiResponse";

export default async function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  if (!accessToken) {
    redirect("/login");
  }

  try {
    await apiServer.get<ApiResponse>("/auth/me", {
      headers: {
        Cookie: `accessToken=${accessToken}`,
      },
    });
  } catch (error) {
    if (
      isAxiosError<ApiResponse>(error) &&
      [401, 403].includes(error.response?.status ?? 0)
    ) {
      redirect("/login");
    }

    throw error;
  }
  return <>{children}</>;
}
