import { cn } from "@/lib/utils";

export function Textarea({
  className,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "min-h-[124px] w-full rounded-2xl border border-border bg-white/75 px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-accent focus:ring-2 focus:ring-[color:color-mix(in_oklab,oklch(var(--accent))_20%,white)]",
        className
      )}
      {...props}
    />
  );
}

