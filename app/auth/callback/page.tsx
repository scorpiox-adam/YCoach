import { AuthCallbackCard } from "@/components/cards/auth-callback-card";

type AuthCallbackPageProps = {
  searchParams?: Record<string, string | string[] | undefined>;
};

function readSearchParam(
  value: string | string[] | undefined
) {
  return typeof value === "string" ? value : value?.[0] ?? null;
}

export default function AuthCallbackPage({ searchParams }: AuthCallbackPageProps) {
  return (
    <main className="safe-shell mx-auto flex min-h-screen w-full max-w-md flex-col justify-center gap-8">
      <AuthCallbackCard
        code={readSearchParam(searchParams?.code)}
        type={readSearchParam(searchParams?.type)}
        errorDescription={readSearchParam(searchParams?.error_description)}
        nextPath={readSearchParam(searchParams?.next)}
      />
    </main>
  );
}
