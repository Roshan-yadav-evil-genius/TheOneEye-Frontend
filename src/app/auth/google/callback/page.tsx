import { GoogleOAuthCallbackClient } from "@/components/features/auth/google-oauth-callback-client";

type GoogleCallbackPageProps = {
  searchParams?: Promise<{
    code?: string;
    state?: string;
    error?: string;
  }>;
};

export default async function GoogleOAuthCallbackPage({
  searchParams,
}: GoogleCallbackPageProps) {
  const params = (await searchParams) ?? {};
  return (
    <GoogleOAuthCallbackClient
      code={params.code}
      state={params.state}
      error={params.error}
    />
  );
}

