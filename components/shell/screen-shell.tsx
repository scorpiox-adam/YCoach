import { AppHeader } from "@/components/shell/app-header";

export function ScreenShell({
  title,
  eyebrow,
  action,
  children
}: {
  title: string;
  eyebrow?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <main className="safe-shell mx-auto flex min-h-screen w-full max-w-md flex-col gap-6 pb-28">
      <AppHeader title={title} eyebrow={eyebrow} action={action} />
      {children}
    </main>
  );
}

