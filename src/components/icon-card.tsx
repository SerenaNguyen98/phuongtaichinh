import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface IconCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  className?: string;
}

export function IconCard({ icon: Icon, title, description, className }: IconCardProps) {
  return (
    <div
      className={cn(
        "bg-bg-card rounded-xl p-6",
        "border border-border",
        "hover:-translate-y-1 hover:border-primary",
        "transition-all duration-300",
        className
      )}
    >
      <div className="w-12 h-12 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
        <Icon className="w-6 h-6 text-primary" />
      </div>
      <h3 className="font-heading font-semibold text-base mb-2">{title}</h3>
      <p className="text-text-sub text-sm leading-relaxed">{description}</p>
    </div>
  );
}
