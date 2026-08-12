"use client";
import { UtensilsCrossed } from "lucide-react";

export function EmptyCategories() {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
      <div className="w-16 h-16 rounded-2xl bg-orange-50 flex items-center justify-center">
        <UtensilsCrossed className="w-8 h-8 text-orange-400" />
      </div>
      <div>
        <p className="text-base font-semibold text-gray-700 dark:text-gray-200">
          No categories yet
        </p>
        <p className="text-sm text-gray-400 mt-1">
          This restaurant hasn't added any menu categories.
        </p>
      </div>
    </div>
  );
}

export function ErrorState({ message }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
      <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center">
        <span className="text-2xl">⚠️</span>
      </div>
      <p className="text-sm font-medium text-gray-500 dark:text-gray-400 max-w-xs">
        {message || "Something went wrong. Please try again later."}
      </p>
    </div>
  );
}
