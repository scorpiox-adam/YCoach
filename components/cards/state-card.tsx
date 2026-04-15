import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";

export function StateCard({
  title,
  description,
  badge,
  cta
}: {
  title: string;
  description: string;
  badge?: {
    label: string;
    tone: "default" | "accent" | "success" | "warning" | "danger";
  };
  cta?: {
    label: string;
  };
}) {
  return (
    <Card className="space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-2">
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
        {badge ? <Badge tone={badge.tone}>{badge.label}</Badge> : null}
      </div>
      {cta ? <Button variant="secondary">{cta.label}</Button> : null}
    </Card>
  );
}

