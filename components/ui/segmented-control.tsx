import { cn } from "@/lib/utils";

type SegmentedControlProps<T extends string> = {
  value: T;
  options: Array<{ label: string; value: T }>;
  onChange: (value: T) => void;
};

export function SegmentedControl<T extends string>({
  value,
  options,
  onChange
}: SegmentedControlProps<T>) {
  return (
    <div className="surface-subtle inline-grid w-full grid-cols-2 gap-1 rounded-2xl p-1">
      {options.map((option) => {
        const isActive = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={cn(
              "h-11 rounded-[1.1rem] px-4 text-sm font-medium transition-colors",
              isActive ? "bg-white text-foreground shadow-soft" : "text-muted-foreground"
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

