import { redirect } from "next/navigation";

interface DomainThrottlePageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: DomainThrottlePageProps) {
  const { id } = await params;
  redirect(`/browser-pools`);
}
