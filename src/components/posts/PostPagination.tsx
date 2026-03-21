import Button from "@/components/ui/Button";

interface PostPaginationProps {
  currentPage: number;
  totalPages: number;
  basePath: string;
}

export default function PostPagination({
  currentPage,
  totalPages,
  basePath,
}: PostPaginationProps) {
  if (totalPages <= 1) return null;

  const prevPage = currentPage > 1 ? currentPage - 1 : null;
  const nextPage = currentPage < totalPages ? currentPage + 1 : null;

  function pageUrl(page: number) {
    return page === 1 ? basePath : `${basePath}/page/${page}`;
  }

  return (
    <nav
      className="flex items-center justify-center gap-4 mt-12"
      aria-label="Pagination"
    >
      {prevPage ? (
        <Button variant="secondary" size="sm" href={pageUrl(prevPage)}>
          &larr; Vorherige
        </Button>
      ) : (
        <span className="px-4 py-1.5 text-sm text-[#ccc]">&larr; Vorherige</span>
      )}

      <span
        className="text-sm text-[#666]"
        style={{ fontFamily: "Inter, sans-serif" }}
      >
        {currentPage} / {totalPages}
      </span>

      {nextPage ? (
        <Button variant="secondary" size="sm" href={pageUrl(nextPage)}>
          N&auml;chste &rarr;
        </Button>
      ) : (
        <span className="px-4 py-1.5 text-sm text-[#ccc]">N&auml;chste &rarr;</span>
      )}
    </nav>
  );
}
