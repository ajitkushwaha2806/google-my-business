"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function ItemCardSkeleton() {
  return (
    <div className="flex gap-4 p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 shadow-sm animate-pulse">
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <Skeleton className="w-4 h-4 rounded-sm mb-2" />
          <Skeleton className="w-3/4 h-5 rounded-md" />
          <Skeleton className="w-16 h-4 rounded-md mt-2" />
  
          <div className="space-y-1.5 mt-3">
            <Skeleton className="w-full h-3 rounded-md" />
            <Skeleton className="w-5/6 h-3 rounded-md" />
          </div>
        </div>

        <Skeleton className="w-24 h-3 rounded-md mt-4" />
      </div>
       
      <div className="relative w-[110px] shrink-0 flex flex-col items-center">
        <Skeleton className="w-full aspect-square rounded-xl" />
        <Skeleton className="absolute -bottom-3 w-[80%] h-8 rounded-lg" />
      </div>
    </div>
  );
}

export function ItemsSectionLoader() {
  return (
    <div className="mt-8 space-y-6">
      <div className="flex items-center gap-3 py-2">
        <Skeleton className="w-32 h-6 rounded-md" />
        <Skeleton className="flex-1 h-px" />
      </div>
        
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <ItemCardSkeleton />
        <ItemCardSkeleton />
        <ItemCardSkeleton />
      </div>
    </div>
  );
}
