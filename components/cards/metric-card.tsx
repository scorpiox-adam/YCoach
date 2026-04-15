import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

export function MetricCard({
  label,
  value,
  delta
}: {
  label: string;
  value: string;
  delta?: string;
}) {
  return (
    <Card className="space-y-3">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </p>
      <div className="flex items-end justify-between gap-3">
        <p className="font-display text-3xl font-semibold tracking-[-0.06em] text-foreground">
          {value}
        </p>
        {delta ? <Badge tone="accent">{delta}</Badge> : null}
      </div>
    </Card>
  );
}

