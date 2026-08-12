"use client";

import { useEffect, useRef } from "react";
import { useTenantItems } from "@/store/hooks/useTenantItems";
import { ItemCard } from "./ItemCard";
import { ItemsSectionLoader } from "./ItemLoaders";

export function CategorySection({ slug, category, index, onVisible, onLoadNext }) {
  const sectionRef = useRef(null);
  const { items: groupedItems, isLoading } = useTenantItems(slug, category._id);
  const subcategoryNames = Object.keys(groupedItems || {});

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const activeObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            onVisible(category._id);
          }
        });
      },
      { rootMargin: "-10% 0px -80% 0px" } 
    );

    const loadNextObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            onLoadNext(index + 1);
          }
        });
      },
      { rootMargin: "0px 0px 600px 0px" } 
    );

    activeObserver.observe(el);
    loadNextObserver.observe(el);

    return () => {
      activeObserver.unobserve(el);
      loadNextObserver.unobserve(el);
    };
  }, [category._id, index, onVisible, onLoadNext]);

  return (
    <div 
      id={`category-${category._id}`} 
      ref={sectionRef} 
      className="scroll-mt-32 pt-8 first:pt-4"
    >
      <div className="flex items-center gap-4 mb-6">
        <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white capitalize tracking-tight">
          {category.name}
        </h2>
        <div className="h-px flex-1 bg-gradient-to-r from-gray-200 to-transparent dark:from-zinc-800" />
      </div>

      {isLoading ? (
        <ItemsSectionLoader />
      ) : subcategoryNames.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-sm text-gray-500">No items available in this category.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {subcategoryNames.map((subCategory) => (
            <div key={subCategory} className="space-y-4">
              {subCategory !== "Others" && (
                 <h3 className="text-lg font-bold text-gray-700 dark:text-gray-300">
                   {subCategory}
                 </h3>
              )}
              <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                {groupedItems[subCategory].map((item) => (
                  <ItemCard key={item._id || item.id} item={item} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
