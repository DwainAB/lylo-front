import { ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "outline" | "ghost";
type ButtonSize = "default" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-primary text-stone-50 shadow-lg shadow-primary/20 hover:brightness-110",
  outline:
    "border border-primary/20 text-primary hover:bg-primary/5",
  ghost:
    "bg-white/10 backdrop-blur-md border border-white/30 text-white hover:bg-white/20",
};

const sizeStyles: Record<ButtonSize, string> = {
  default: "h-10 px-5 text-sm min-w-[100px]",
  lg: "h-14 px-6 text-lg min-w-[180px]",
};

export default function Button({
  variant = "primary",
  size = "default",
  className = "",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-lg font-bold transition-all cursor-pointer ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
