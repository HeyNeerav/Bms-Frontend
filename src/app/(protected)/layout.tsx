import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { api, ApiError } from "@/lib/api";

export default async function BusinessesLayout({
  children,
}: {
  children: React.ReactNode;
  }) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  if (!accessToken) {
    redirect("/login");
  }

  try {
    await api.get("/auth/me", {token: accessToken});
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      redirect("/api/auth/clear-session");
    }
  }
  
  return (
    <>
      {children}
    </>
  );
}
