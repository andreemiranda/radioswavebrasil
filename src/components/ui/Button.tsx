import React from "react";
import { cn } from "../../lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg" | "icon";
  active?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  className,
  variant = "primary",
  size = "md",
  active,
  ...props
}) => {
  const baseStyles = "inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brasil-yellow/50 disabled:opacity-50 disabled:pointer-events-none active:scale-95 hover:scale-[1.02]";
  
  const variants = {
    primary: "bg-brasil-yellow text-brasil-green hover:brightness-95 shadow-[0_2px_8px_rgba(255,223,0,0.4)] hover:shadow-[0_4px_20px_rgba(255,223,0,0.5)]",
    secondary: "bg-brasil-blue text-brasil-white hover:opacity-90 shadow-[0_2px_8px_rgba(0,39,118,0.3)] hover:shadow-[0_4px_20px_rgba(0,39,118,0.4)]",
    outline: "border-2 border-brasil-green text-brasil-green hover:bg-brasil-green/5 hover:shadow-[0_2px_12px_rgba(0,156,59,0.2)]",
    ghost: "bg-transparent text-slate-600 hover:bg-slate-100 hover:shadow-sm",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-5 py-2.5 text-sm",
    lg: "px-8 py-3.5 text-base",
    icon: "p-2.5",
  };

  return (
    <button
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        active && "ring-2 ring-brasil-yellow",
        className
      )}
      {...props}
    />
  );
};
