import type { GhostPost, GhostPagination } from "@/lib/ghost/types";
import PostCard from "@/components/posts/PostCard";
import PostCardFeatured from "@/components/posts/PostCardFeatured";
import PostPagination from "@/components/posts/PostPagination";

interface PostGridProps {
  posts: GhostPost[];
  featured?: boolean;
  pagination?: GhostPagination;
  basePath?: string;
}

export default function PostGrid({
  posts,
  featured = false,
  pagination,
  basePath,
}: PostGridProps) {
  if (posts.length === 0) return null;

  if (featured) {
    const [firstPost, ...rest] = posts;
    return (
      <div className="space-y-8">
        <PostCardFeatured post={firstPost} />
        {rest.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rest.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
        {pagination && basePath && (
          <PostPagination
            currentPage={pagination.page}
            totalPages={pagination.pages}
            basePath={basePath}
          />
        )}
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
      {pagination && basePath && (
        <PostPagination
          currentPage={pagination.page}
          totalPages={pagination.pages}
          basePath={basePath}
        />
      )}
    </div>
  );
}
