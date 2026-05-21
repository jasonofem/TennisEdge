import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-12 w-full rounded-lg border-2 border-cyan-500/30 bg-black/50 px-4 py-2 text-sm font-mono text-white placeholder:text-cyan-500/50 transition-all duration-200",
          "focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:shadow-[0_0_20px_rgba(0,240,255,0.2)]",
          "disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };