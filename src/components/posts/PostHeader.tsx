import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import type { GhostPost } from "@/lib/ghost/types";
import Badge from "@/components/ui/Badge";

interface PostHeaderProps {
  post: GhostPost;
  backLink?: string;
  backLabel?: string;
}

export default function PostHeader({ post, backLink, backLabel }: PostHeaderProps) {
  return (
    <header className="mb-10">
      {/* Back link */}
      {backLink && (
        <div className="mb-6">
          <Link
            href={backLink}
            className="text-sm text-[#6C5CE7] hover:text-[#5A4BD1] transition-colors"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            &larr; {backLabel ?? "Zurück"}
          </Link>
        </div>
      )}

      {/* Category */}
      {post.primary_tag && (
        <div className="mb-4">
          <Badge href={`/themen/${post.primary_tag.slug}`}>
            {post.primary_tag.name}
          </Badge>
        </div>
      )}

      {/* Title */}
      <h1
        className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#1a1a1a] leading-tight mb-6"
        style={{ fontFamily: "'Playfair Display', serif" }}
      >
        {post.title}
      </h1>

      {/* Meta */}
      <div
        className="flex flex-wrap items-center gap-4 text-sm text-[#666]"
        style={{ fontFamily: "Inter, sans-serif" }}
      >
        {post.primary_author && (
          <div className="flex items-center gap-2">
            {post.primary_author.profile_image && (
              <Image
                src={post.primary_author.profile_image}
                alt={post.primary_author.name}
                width={32}
                height={32}
                className="rounded-full"
              />
            )}
            <span className="font-medium text-[#1a1a1a]">
              {post.primary_author.name}
            </span>
          </div>
        )}
        <time dateTime={post.published_at}>
          {format(new Date(post.published_at), "d. MMMM yyyy", { locale: de })}
        </time>
        {post.reading_time > 0 && (
          <span>{post.reading_time} Min. Lesezeit</span>
        )}
      </div>

      {/* Feature image */}
      {post.feature_image && (
        <div className="mt-8 relative aspect-video rounded-2xl overflow-hidden">
          <Image
            src={post.feature_image}
            alt={post.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 768px"
            priority
          />
        </div>
      )}
    </header>
  );
}
