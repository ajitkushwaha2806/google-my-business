"use client";

export function CategoryCardSkeleton() {
  return (
    <div className="flex flex-col items-center gap-3 animate-pulse flex-shrink-0">
      <div className="w-20 h-20 rounded-2xl bg-gray-200 dark:bg-zinc-700" />
      <div className="h-3 w-16 rounded-full bg-gray-200 dark:bg-zinc-700" />
    </div>
  );
}

export function CategoryCard({ category, index, isActive, onSelect }) {
  return (
    <button
      key={index}
      onClick={() => onSelect(category)}
      aria-label={`Select ${category.name} category`}
      className={`
        group flex flex-col items-center gap-2.5 flex-shrink-0 cursor-pointer
        transition-all duration-200 outline-none focus-visible:ring-2
        focus-visible:ring-orange-500 focus-visible:ring-offset-2 rounded-2xl
      `}
    >
      <div
        className={`
          relative w-20 h-20 rounded-2xl overflow-hidden shadow-md
          transition-all duration-300
          ${isActive
            ? "ring-[3px] ring-orange-500 ring-offset-2 scale-105 shadow-orange-200 shadow-lg"
            : "ring-1 ring-transparent hover:ring-gray-200 hover:scale-105 hover:shadow-lg"
          }
        `}
      >
          <img
            src={category.image || "https://b.zmtcdn.com/data/o2_assets/30fa0a844f3ba82073e5f78c65c18b371616149662.png"}
            alt={category.name}
            className="w-full h-full object-cover"
          />

        {isActive && (
          <span className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-orange-500 shadow" />
        )}
      </div>

      <span
        className={`
          text-[12px] font-semibold text-center leading-tight max-w-[76px]
          line-clamp-2 transition-colors duration-200
          ${isActive ? "text-orange-600" : "text-gray-600 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-gray-100"}
        `}
      >
        {category.name}
      </span>
    </button>
  );
}
