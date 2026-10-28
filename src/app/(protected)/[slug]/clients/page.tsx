import PageContainer from '@/components/layout/page-container';
import UserListingPage from '@/features/clients/components/user-listing';
import { searchParamsCache } from '@/lib/searchparams';
import type { SearchParams } from 'nuqs/server';
import { usersInfoContent } from '@/features/clients/info-content';
import { UserFormSheetTrigger } from '@/features/clients/components/user-form-sheet';

export const metadata = {
  title: 'Dashboard: Clients'
};

type PageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function UsersPage(props: PageProps) {

  const searchParams = await props.searchParams;
  searchParamsCache.parse(searchParams);

  return (
    <PageContainer
      pageTitle='Clients'
      pageDescription='Manage clients (React Query + nuqs table pattern.)'
      infoContent={usersInfoContent}
      pageHeaderAction={<UserFormSheetTrigger />}
    >
      <UserListingPage />
    </PageContainer>
  );
}
