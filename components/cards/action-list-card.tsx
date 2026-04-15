import { ArrowRight } from "lucide-react";

import { Card } from "@/components/ui/card";

export function ActionListCard({
  title,
  items
}: {
  title: string;
  items: string[];
}) {
  return (
    <Card className="space-y-4">
      <h3 className="font-display text-lg font-semibold tracking-[-0.03em] text-foreground">
        {title}
      </h3>
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item} className="flex items-start gap-3 rounded-2xl bg-white/60 px-4 py-3">
            <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-accent-strong" />
            <p className="text-sm leading-6 text-foreground">{item}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}
