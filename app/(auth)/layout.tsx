export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="safe-shell mx-auto flex min-h-screen w-full max-w-md flex-col justify-center gap-8">
      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          YCoach
        </p>
        <h1 className="font-display text-[2.25rem] font-semibold tracking-[-0.06em] text-balance text-foreground">
          Un coach perso quotidien, clair et fiable.
        </h1>
        <p className="max-w-[36ch] text-sm leading-6 text-muted-foreground">
          L'app est pensée pour le téléphone, la régularité et le mode hors ligne sur les actions critiques.
        </p>
      </div>
      {children}
    </main>
  );
}

