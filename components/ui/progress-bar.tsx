import { cn } from "@/lib/utils";

export function ProgressBar({
  value,
  className
}: {
  value: number;
  className?: string;
}) {
  return (
    <div className={cn("h-2 rounded-full bg-surface-2", className)}>
      <div
        className="h-full rounded-full bg-accent transition-[width] duration-300"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}

