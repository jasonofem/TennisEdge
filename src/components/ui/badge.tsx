import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-3 py-1 text-xs font-mono font-semibold transition-all duration-200",
  {
    variants: {
      variant: {
        default: "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30",
        high: "bg-green-500/20 text-green-400 border border-green-500/30 shadow-[0_0_15px_rgba(0,255,136,0.3)]",
        medium: "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 shadow-[0_0_15px_rgba(0,240,255,0.3)]",
        low: "bg-purple-500/20 text-purple-400 border border-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.3)]",
        success: "bg-green-500/20 text-green-400 border border-green-500/30",
        danger: "bg-red-500/20 text-red-400 border border-red-500/30",
        warning: "bg-orange-500/20 text-orange-400 border border-orange-500/30",
        live: "bg-red-500/20 text-red-400 border border-red-500/30 animate-pulse shadow-[0_0_15px_rgba(255,51,102,0.5)]",
        pending: "bg-gray-500/20 text-gray-400 border border-gray-500/30",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };