import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import type { GhostPost } from "@/lib/ghost/types";
import { getPostUrl } from "@/lib/routing";
import GlassCard from "@/components/ui/GlassCard";
import Badge from "@/components/ui/Badge";

interface PostCardProps {
  post: GhostPost;
}

function isPaidPost(post: GhostPost): boolean {
  return post.visibility !== "public";
}

export default function PostCard({ post }: PostCardProps) {
  const url = getPostUrl(post);
  const paid = isPaidPost(post);

  return (
    <GlassCard hover className="overflow-hidden flex flex-col">
      {post.feature_image && (
        <Link href={url} className="block relative aspect-video overflow-hidden">
          <Image
            src={post.feature_image}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-300 hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </Link>
      )}
      <div className="p-6 flex flex-col flex-1">
        {(post.primary_tag || paid) && (
          <div className="mb-3 flex items-center gap-2">
            {post.primary_tag && (
              <Badge href={`/themen/${post.primary_tag.slug}`}>
                {post.primary_tag.name}
              </Badge>
            )}
            {paid && (
              <Badge className="!bg-[#6C5CE7]/10 !text-[#6C5CE7] !border-[#6C5CE7]/20">
                Premium
              </Badge>
            )}
          </div>
        )}
        <Link href={url}>
          <h3
            className="text-lg font-semibold text-[#1a1a1a] leading-snug mb-2 hover:text-[#6C5CE7] transition-colors"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {post.title}
          </h3>
        </Link>
        {(post.custom_excerpt || post.excerpt) && (
          <p
            className="text-sm text-[#666] leading-relaxed mb-4 flex-1 line-clamp-3"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            {post.custom_excerpt || post.excerpt}
          </p>
        )}
        <div className="mt-auto">
          <time
            dateTime={post.published_at}
            className="text-xs text-[#999]"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            {format(new Date(post.published_at), "d. MMMM yyyy", {
              locale: de,
            })}
          </time>
        </div>
      </div>
    </GlassCard>
  );
}
