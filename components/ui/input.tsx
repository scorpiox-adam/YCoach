import { cn } from "@/lib/utils";

export function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "h-12 w-full rounded-2xl border border-border bg-white/75 px-4 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-accent focus:ring-2 focus:ring-[color:color-mix(in_oklab,oklch(var(--accent))_20%,white)]",
        className
      )}
      {...props}
    />
  );
}

