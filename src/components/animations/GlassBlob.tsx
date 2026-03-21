"use client";

import { motion } from "framer-motion";

type BlobSize = "sm" | "md" | "lg";

interface GlassBlobProps {
  className?: string;
  size?: BlobSize;
}

const sizeMap: Record<BlobSize, string> = {
  sm: "w-32 h-32",
  md: "w-64 h-64",
  lg: "w-96 h-96",
};

export default function GlassBlob({
  className = "",
  size = "md",
}: GlassBlobProps) {
  return (
    <motion.div
      className={`${sizeMap[size]} rounded-full bg-[#6C5CE7]/10 blur-3xl pointer-events-none ${className}`}
      animate={{
        x: [0, 20, -10, 0],
        y: [0, -15, 10, 0],
        scale: [1, 1.05, 0.95, 1],
      }}
      transition={{
        duration: 8,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut",
      }}
      aria-hidden="true"
    />
  );
}
