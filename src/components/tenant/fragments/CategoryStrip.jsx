"use client";
import { useRef, useEffect } from "react";
import { EmptyCategories, ErrorState } from "./States";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { CategoryCard, CategoryCardSkeleton } from "./CategoryCard";

export function CategoryStrip({ categories = [], isLoading, error, activeCategoryId, onSelect }) {
  const scrollRef = useRef(null);
  useEffect(() => {
    if (!activeCategoryId || !scrollRef.current) return;
    
    const activeEl = document.getElementById(`pill-${activeCategoryId}`);
    if (activeEl) {
      const container = scrollRef.current;
      const containerRect = container.getBoundingClientRect();
      const elRect = activeEl.getBoundingClientRect();
      
      const relativeLeft = elRect.left - containerRect.left;
      const scrollTarget = container.scrollLeft + relativeLeft - (containerRect.width / 2) + (elRect.width / 2);
      
      container.scrollTo({
        left: scrollTarget,
        behavior: "smooth"
      });
    }
  }, [activeCategoryId]);

  const scroll = (direction) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: direction === "left" ? -200 : 200, behavior: "smooth" });
  };

  const activeCategory = categories.find(c => c._id === activeCategoryId);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4 px-2 sm:px-0">
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 tracking-tight">
            Menu Categories
          </h2>
          {!isLoading && !error && (
            <p className="text-xs text-gray-400 mt-0.5">
              {categories.length} {categories.length === 1 ? "category" : "categories"} available
            </p>
          )}
        </div>

        {activeCategory && (
          <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-orange-50 text-orange-600 border border-orange-100 dark:bg-orange-500/10 dark:text-orange-400 dark:border-orange-500/20">
            {activeCategory.name}
          </span>
        )}
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm overflow-hidden relative">
        {error ? (
          <ErrorState message={error?.message || (typeof error === 'string' ? error : "An error occurred while loading categories.")} />
        ) : !isLoading && categories.length === 0 ? (
          <EmptyCategories />
        ) : (
          <>
            <button
              onClick={() => scroll("left")}
              aria-label="Scroll left"
              className="
                hidden sm:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 z-10
                w-8 h-8 items-center justify-center rounded-full
                bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700
                shadow-md text-gray-500 hover:text-orange-500 hover:border-orange-300
                transition-all duration-150
              "
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div
              ref={scrollRef}
              className="
                flex gap-5 overflow-x-auto scroll-smooth
                px-4 py-3
                scrollbar-hide
                [mask-image:linear-gradient(to_right,transparent_0,black_40px,black_calc(100%-40px),transparent_100%)]
              "
              style={{ scrollbarWidth: "none" }}
            >
              {isLoading
                ? Array.from({ length: 7 }).map((_, i) => (
                    <CategoryCardSkeleton key={i} />
                  ))
                : categories.map((cat, i) => (
                    <div id={`pill-${cat._id}`} key={cat._id} className="shrink-0">
                      <CategoryCard
                        category={cat}
                        index={i}
                        isActive={activeCategoryId === cat._id}
                        onSelect={onSelect}
                      />
                    </div>
                  ))}
            </div>

            <button
              onClick={() => scroll("right")}
              aria-label="Scroll right"
              className="
                hidden sm:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 z-10
                w-8 h-8 items-center justify-center rounded-full
                bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700
                shadow-md text-gray-500 hover:text-orange-500 hover:border-orange-300
                transition-all duration-150
              "
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </>
        )}
      </div>
    </div>
  );
}
