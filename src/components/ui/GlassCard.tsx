import { ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export default function GlassCard({
  children,
  className = "",
  hover = false,
}: GlassCardProps) {
  return (
    <div
      className={`
        bg-white/60 backdrop-blur-xl rounded-2xl border border-black/5 shadow-sm
        ${hover ? "hover:shadow-md hover:bg-white/80 transition-all duration-300" : ""}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
