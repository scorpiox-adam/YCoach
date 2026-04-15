import { forwardRef } from "react";

import { cn } from "@/lib/utils";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
};

const variantClasses: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary:
    "bg-accent text-white shadow-soft hover:bg-accent-strong focus-visible:ring-accent",
  secondary:
    "surface-panel text-foreground hover:bg-surface-2 focus-visible:ring-ring",
  ghost:
    "bg-transparent text-foreground hover:bg-surface-2 focus-visible:ring-ring",
  danger: "bg-danger text-white hover:opacity-95 focus-visible:ring-danger"
};

const sizeClasses: Record<NonNullable<ButtonProps["size"]>, string> = {
  sm: "h-11 px-4 text-sm",
  md: "h-12 px-5 text-sm",
  lg: "h-14 px-6 text-base"
};

export function buttonVariants({
  variant = "primary",
  size = "md",
  className
}: Pick<ButtonProps, "variant" | "size" | "className">) {
  return cn(
    "inline-flex min-w-[44px] items-center justify-center rounded-2xl font-semibold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50",
    variantClasses[variant],
    sizeClasses[size],
    className
  );
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", type = "button", ...props }, ref) => {
    return (
      <button
        ref={ref}
        type={type}
        className={buttonVariants({ variant, size, className })}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
