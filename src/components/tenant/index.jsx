"use client";
import { useState, useEffect } from "react";
import { UtensilsCrossed } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { MenuService } from "@/services/tenant/frontend/menu";
import { CategoryStrip } from "./fragments/CategoryStrip";
import { RestaurantHero } from "./fragments/RestaurantHero";
import { CategorySection } from "./fragments/CategorySection";

export default function TenantHome({ slug, restaurant }) {
  const [activeCategoryId, setActiveCategoryId] = useState(null);
  const [loadedCount, setLoadedCount] = useState(2); // Initially load first 2 categories
  const [scrollToTarget, setScrollToTarget] = useState(null); // Track if we need to scroll after render

  // Fetch all categories
  const { data: categories = [], isLoading, error } = useQuery({
    queryKey: ["tenant-categories", slug],
    queryFn: async () => {
      const json = await MenuService.category.getAll(slug);
      return json.data?.categories ?? [];
    },
    enabled: !!slug,
  });

  // Set initial active category
  useEffect(() => {
    if (categories.length > 0 && !activeCategoryId) {
      setActiveCategoryId(categories[0]._id);
    }
  }, [categories, activeCategoryId]);

  // Handle scrolling after render if a user clicked a category
  useEffect(() => {
    if (scrollToTarget) {
      // Small timeout to allow DOM to render the newly loaded section
      const timer = setTimeout(() => {
        const el = document.getElementById(`category-${scrollToTarget}`);
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
        }
        setScrollToTarget(null);
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [scrollToTarget, loadedCount]);

  const handleSelectCategory = (category, index) => {
    setActiveCategoryId(category._id);
    
    // Ensure the clicked category is loaded
    if (index >= loadedCount) {
      setLoadedCount(index + 2); // Load the target plus one more for smooth scrolling
    }
    
    setScrollToTarget(category._id);
  };

  const handleVisible = (categoryId) => {
    // Only update if we aren't currently auto-scrolling to a target
    if (!scrollToTarget) {
      setActiveCategoryId(categoryId);
    }
  };

  const handleLoadNext = (nextIndex) => {
    if (nextIndex >= loadedCount && nextIndex < categories.length) {
      setLoadedCount(prev => Math.min(prev + 1, categories.length));
    }
  };

  const renderedCategories = categories.slice(0, loadedCount);

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-zinc-950 font-sans pb-24">
      <RestaurantHero restaurant={restaurant} />
      
      <div className="sticky top-0 z-40 bg-gray-50/90 dark:bg-zinc-950/90 backdrop-blur-md pt-4 pb-2 shadow-sm">
        <CategoryStrip
          categories={categories}
          isLoading={isLoading}
          error={error}
          activeCategoryId={activeCategoryId}
          onSelect={(cat) => {
            const index = categories.findIndex(c => c._id === cat._id);
            handleSelectCategory(cat, index);
          }}
        />
      </div>

      <div className="mx-auto px-4 mt-2 max-w-7xl relative">
        {isLoading && (
          <div className="animate-in fade-in duration-300 py-8 flex justify-center">
            <div className="w-8 h-8 rounded-full border-2 border-orange-500 border-t-transparent animate-spin" />
          </div>
        )}

        {!isLoading && categories.length === 0 && (
          <div className="mt-16 flex flex-col items-center justify-center text-center px-4 animate-in fade-in zoom-in-95 duration-300">
            <div className="w-20 h-20 bg-orange-100 dark:bg-orange-500/10 rounded-full flex items-center justify-center mb-4">
              <UtensilsCrossed className="w-10 h-10 text-orange-400 dark:text-orange-500/50" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">No categories found</h3>
            <p className="text-sm text-gray-500 mt-2 max-w-[250px]">
              This restaurant hasn't added any menu categories yet.
            </p>
          </div>
        )}

        {!isLoading && renderedCategories.length > 0 && (
          <div className="space-y-6 pb-20">
            {renderedCategories.map((cat, index) => (
              <CategorySection
                key={cat._id}
                slug={slug}
                category={cat}
                index={index}
                onVisible={handleVisible}
                onLoadNext={handleLoadNext}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
