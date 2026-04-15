import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPercent(value: number) {
  return `${Math.round(value * 100)}%`;
}

export function formatShortDate(value: string) {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "short"
  }).format(new Date(value));
}

export function formatKg(value: number) {
  return `${value.toFixed(1).replace(".", ",")} kg`;
}

