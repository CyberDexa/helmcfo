import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(
  cents: number,
  opts?: { compact?: boolean }
): string {
  const dollars = cents / 100;
  if (opts?.compact && Math.abs(dollars) >= 1000) {
    const suffixes = ["", "K", "M", "B"];
    const tier = (Math.log10(Math.abs(dollars)) / 3) | 0;
    const suffix = suffixes[tier] || "";
    const scale = Math.pow(10, tier * 3);
    const scaled = dollars / scale;
    return `$${scaled.toFixed(scaled % 1 === 0 ? 0 : 1)}${suffix}`;
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(dollars);
}

export function formatPercent(value: number): string {
  return `${value >= 0 ? "+" : ""}${value.toFixed(1)}%`;
}
