import { userMeQueryOptions } from '@/features/user/api/queries';
import { ApiError } from '@/lib/api';
import { getQueryClient } from '@/lib/query-client';
import { Metadata } from 'next';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false
  }
};


export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;
  const hasSession = accessToken || refreshToken;

  const queryClient = getQueryClient();
  
  if (!hasSession) { 
    return children;
  }
  
  try {
    await queryClient.query(userMeQueryOptions());
  } catch (error) {

    if (error instanceof ApiError && error.status === 401) {
      redirect("/api/auth/clear-session");
    }

    throw error;
  }

  redirect("/businesses");
}
