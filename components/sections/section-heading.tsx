import { cn } from "@/lib/utils";

export function SectionHeading({
  title,
  description,
  className
}: {
  title: string;
  description?: string;
  className?: string;
}) {
  return (
    <div className={cn("space-y-1", className)}>
      <h2 className="font-display text-xl font-semibold tracking-[-0.04em] text-foreground">
        {title}
      </h2>
      {description ? <p className="text-sm leading-6 text-muted-foreground">{description}</p> : null}
    </div>
  );
}

