interface SkeletonTextProps {
  lines?: number;
  className?: string;
}

export function SkeletonText({ lines = 3, className = "" }: SkeletonTextProps) {
  return (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={`h-4 rounded-md bg-black/5 animate-pulse ${
            i === lines - 1 ? "w-2/3" : "w-full"
          }`}
        />
      ))}
    </div>
  );
}

interface SkeletonCardProps {
  className?: string;
}

export function SkeletonCard({ className = "" }: SkeletonCardProps) {
  return (
    <div
      className={`bg-white/60 backdrop-blur-xl rounded-2xl border border-black/5 shadow-sm overflow-hidden ${className}`}
    >
      <div className="aspect-video bg-black/5 animate-pulse" />
      <div className="p-6 space-y-4">
        <div className="h-3 w-20 rounded-full bg-black/5 animate-pulse" />
        <div className="space-y-2">
          <div className="h-5 w-full rounded-md bg-black/5 animate-pulse" />
          <div className="h-5 w-3/4 rounded-md bg-black/5 animate-pulse" />
        </div>
        <SkeletonText lines={2} />
        <div className="h-3 w-24 rounded-md bg-black/5 animate-pulse" />
      </div>
    </div>
  );
}
