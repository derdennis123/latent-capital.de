import { ReactNode } from "react";
import Link from "next/link";

interface BadgeProps {
  children: ReactNode;
  active?: boolean;
  href?: string;
  className?: string;
}

export default function Badge({
  children,
  active = false,
  href,
  className = "",
}: BadgeProps) {
  const classes = `
    inline-flex items-center rounded-full px-4 py-1.5 text-sm font-medium
    transition-all duration-200
    ${
      active
        ? "bg-[#6C5CE7] text-white"
        : "bg-white/60 backdrop-blur-sm border border-black/5 text-[#666] hover:bg-white/80"
    }
    ${className}
  `;

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return <span className={classes}>{children}</span>;
}
