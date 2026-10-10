import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "bg-blue-100 text-blue-800 border border-blue-200",
        secondary:
          "bg-slate-100 text-slate-700 border border-slate-200",
        success:
          "bg-emerald-50 text-emerald-700 border border-emerald-200",
        warning:
          "bg-amber-50 text-amber-700 border border-amber-200",
        destructive:
          "bg-rose-50 text-rose-700 border border-rose-200",
        outline:
          "text-slate-700 border border-slate-300 bg-white",
        department:
          "bg-indigo-50 text-indigo-700 border border-indigo-200",
        purple:
          "bg-purple-50 text-purple-700 border border-purple-200",
        cyan:
          "bg-cyan-50 text-cyan-800 border border-cyan-200",
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
