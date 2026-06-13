"use client";

import { cn } from "@/lib/utils";

interface StatCardProps {
  value: string;
  label: string;
  className?: string;
}

export function StatCard({ value, label, className }: StatCardProps) {
  return (
    <div
      className={cn(
        "bg-bg-card rounded-xl p-5 text-center",
        "border border-border",
        "hover:-translate-y-1 hover:border-primary",
        "transition-all duration-300",
        className
      )}
    >
      <div className="font-heading font-extrabold text-3xl text-primary">{value}</div>
      <div className="text-text-sub text-xs mt-1">{label}</div>
    </div>
  );
}
