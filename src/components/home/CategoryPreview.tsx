import Link from "next/link";
import type { GhostPost } from "@/lib/ghost/types";
import PostCard from "@/components/posts/PostCard";

interface CategoryPreviewProps {
  title: string;
  description?: string;
  posts: GhostPost[];
  href: string;
  className?: string;
}

export default function CategoryPreview({
  title,
  description,
  posts,
  href,
  className = "",
}: CategoryPreviewProps) {
  if (posts.length === 0) return null;

  return (
    <section className={className}>
      <div className="flex items-end justify-between mb-8">
        <div>
          <h2
            className="text-2xl sm:text-3xl font-bold text-[#1a1a1a]"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {title}
          </h2>
          {description && (
            <p
              className="text-[#666] text-base mt-2 max-w-xl"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              {description}
            </p>
          )}
        </div>
        <Link
          href={href}
          className="text-sm font-medium text-[#6C5CE7] hover:text-[#5A4BD1] transition-colors whitespace-nowrap"
          style={{ fontFamily: "Inter, sans-serif" }}
        >
          Alle anzeigen &rarr;
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.slice(0, 3).map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </section>
  );
}
