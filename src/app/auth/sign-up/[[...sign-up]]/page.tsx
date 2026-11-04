import { Metadata } from 'next';
import SignUpViewPage from '@/features/auth/components/sign-up-view';

export const metadata: Metadata = {
  title: 'Authentication | Sign Up',
  description: 'Sign Up page for authentication.'
};

type PageProps = {
  params: Promise<{
    'sign-up'?: string[];
  }>
}

export default function Page(props: PageProps) {
  return <SignUpViewPage params={props.params} />;
}
