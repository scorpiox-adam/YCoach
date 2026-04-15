import { cn } from "@/lib/utils";

type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  tone?: "default" | "accent" | "success" | "warning" | "danger";
};

const toneClasses: Record<NonNullable<BadgeProps["tone"]>, string> = {
  default: "bg-surface-2 text-muted-foreground",
  accent: "bg-[color:color-mix(in_oklab,oklch(var(--accent))_14%,white)] text-accent-strong",
  success: "bg-[color:color-mix(in_oklab,oklch(var(--success))_15%,white)] text-[color:oklch(var(--success))]",
  warning: "bg-[color:color-mix(in_oklab,oklch(var(--warning))_18%,white)] text-[color:oklch(50%_0.12_80)]",
  danger: "bg-[color:color-mix(in_oklab,oklch(var(--danger))_14%,white)] text-danger"
};

export function Badge({ className, tone = "default", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold tracking-[0.02em]",
        toneClasses[tone],
        className
      )}
      {...props}
    />
  );
}

