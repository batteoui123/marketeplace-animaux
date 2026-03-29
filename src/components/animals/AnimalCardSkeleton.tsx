export default function AnimalCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 animate-pulse">
      {/* Image placeholder */}
      <div className="aspect-[4/3] bg-slate-200" />
      <div className="p-3 space-y-2.5">
        {/* Title */}
        <div className="h-4 bg-slate-200 rounded-lg w-3/4" />
        {/* Breed */}
        <div className="h-3 bg-slate-100 rounded-lg w-1/2" />
        {/* Price row */}
        <div className="flex items-center justify-between">
          <div className="h-5 bg-green-100 rounded-lg w-24" />
          <div className="h-4 bg-slate-100 rounded-full w-10" />
        </div>
        {/* Location row */}
        <div className="flex items-center justify-between">
          <div className="h-3 bg-slate-100 rounded-lg w-20" />
          <div className="h-3 bg-slate-100 rounded-lg w-12" />
        </div>
      </div>
    </div>
  );
}

export function AnimalGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <AnimalCardSkeleton key={i} />
      ))}
    </div>
  );
}
