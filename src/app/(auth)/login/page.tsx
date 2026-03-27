import Image from "next/image"
import Link from "next/link"

import { LoginForm } from "@/components/features/auth/login-form"

type LoginPageProps = {
  searchParams?: Promise<{
    redirect?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = (await searchParams) ?? {};
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Link href="/" className="flex items-center gap-2 self-center font-medium">
          <Image src="/logo.png" width={60} height={24} alt='TheOneEye' />
          <span className="text-xl font-bold">TheOneEye</span>
        </Link>
        <LoginForm redirect={params.redirect} />
      </div>
    </div>
  )
}
