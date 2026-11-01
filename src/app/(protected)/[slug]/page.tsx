import { redirect } from "next/navigation";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function Dashboard({ params }: PageProps) {
  const { slug } = await params;
  redirect(`/${slug}/overview`);
}
