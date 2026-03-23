import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import type { GhostPost } from "@/lib/ghost/types";
import { getPostUrl } from "@/lib/routing";
import GlassCard from "@/components/ui/GlassCard";
import Badge from "@/components/ui/Badge";

interface PostCardFeaturedProps {
  post: GhostPost;
}

export default function PostCardFeatured({ post }: PostCardFeaturedProps) {
  const url = getPostUrl(post);

  return (
    <GlassCard hover className="overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-2">
        {post.feature_image && (
          <Link
            href={url}
            className="block relative aspect-video md:aspect-auto md:min-h-[360px] overflow-hidden"
          >
            <Image
              src={post.feature_image}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-300 hover:scale-105"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          </Link>
        )}
        <div className="p-8 md:p-10 flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-4">
            <Badge active>Featured</Badge>
            {post.primary_tag && (
              <Badge href={`/themen/${post.primary_tag.slug}`}>
                {post.primary_tag.name}
              </Badge>
            )}
            {post.visibility === "paid" && (
              <Badge className="!bg-[#6C5CE7]/10 !text-[#6C5CE7] !border-[#6C5CE7]/20">
                Premium
              </Badge>
            )}
          </div>
          <Link href={url}>
            <h2
              className="text-2xl md:text-3xl font-bold text-[#1a1a1a] leading-tight mb-4 hover:text-[#6C5CE7] transition-colors"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {post.title}
            </h2>
          </Link>
          {(post.custom_excerpt || post.excerpt) && (
            <p
              className="text-sm text-[#666] leading-relaxed mb-6 line-clamp-3"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              {post.custom_excerpt || post.excerpt}
            </p>
          )}
          <div className="flex items-center gap-4 text-xs text-[#999]" style={{ fontFamily: "Inter, sans-serif" }}>
            {post.primary_author && (
              <span className="text-[#666] font-medium">
                {post.primary_author.name}
              </span>
            )}
            <time dateTime={post.published_at}>
              {format(new Date(post.published_at), "d. MMMM yyyy", {
                locale: de,
              })}
            </time>
            {post.reading_time > 0 && (
              <span>{post.reading_time} Min. Lesezeit</span>
            )}
          </div>
        </div>
      </div>
    </GlassCard>
  );
}
