import Link from "next/link";
import type { GhostTag } from "@/lib/ghost/types";
import GlassCard from "@/components/ui/GlassCard";

interface TopicCardProps {
  tag: GhostTag;
  postCount?: number;
}

export default function TopicCard({ tag, postCount }: TopicCardProps) {
  const count = postCount ?? tag.count?.posts;

  return (
    <Link href={`/themen/${tag.slug}`} className="block">
      <GlassCard hover className="p-6">
        <h3
          className="text-lg font-semibold text-[#1a1a1a] mb-2"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          {tag.name}
        </h3>
        {tag.description && (
          <p
            className="text-sm text-[#666] leading-relaxed mb-4 line-clamp-2"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            {tag.description}
          </p>
        )}
        {count != null && count > 0 && (
          <span
            className="text-xs text-[#999]"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            {count} {count === 1 ? "Beitrag" : "Beiträge"}
          </span>
        )}
      </GlassCard>
    </Link>
  );
}
