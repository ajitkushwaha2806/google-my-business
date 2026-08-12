"use client";
import { Info, Sparkles } from "lucide-react";

export function ItemCard({ item }) {
  const getDietaryColor = (type) => {
    switch (type?.toLowerCase()) {
      case "veg":
        return "border-green-500 bg-green-50 text-green-700";
      case "non-veg":
        return "border-red-500 bg-red-50 text-red-700";
      case "egg":
        return "border-yellow-500 bg-yellow-50 text-yellow-700";
      case "vegan":
        return "border-emerald-600 bg-emerald-50 text-emerald-700";
      default:
        return "border-gray-300 bg-gray-50 text-gray-500";
    }
  };

  const getDietaryIcon = (type) => {
    const isVeg = type?.toLowerCase() === "veg" || type?.toLowerCase() === "vegan";
    const color = isVeg ? "bg-green-500" : type?.toLowerCase() === "egg" ? "bg-yellow-500" : "bg-red-500";
    
    return (
      <div className={`w-3.5 h-3.5 border-2 flex items-center justify-center p-[3px] ${getDietaryColor(type).split(' ')[0]}`}>
        <div className={`w-full h-full rounded-full ${color}`} />
      </div>
    );
  };

  const hasVariants = item.variants && item.variants.length > 0;
  
  return (
    <div className="group relative flex flex-col sm:flex-row gap-2 sm:gap-4 sm:p-4 sm:rounded-2xl sm:bg-white sm:dark:bg-zinc-900 sm:border sm:border-gray-100 sm:shadow-sm sm:hover:shadow-md transition-all duration-300 sm:overflow-hidden sm:active:scale-[0.98]">
      <div className="hidden sm:block absolute inset-0 bg-gradient-to-r from-orange-50/50 to-rose-50/50 dark:from-orange-500/5 dark:to-rose-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
  
      {/* Image Container - Top on mobile, Right on desktop */}
      <div className="order-1 sm:order-2 relative w-full sm:w-[110px] aspect-square shrink-0 flex flex-col items-center justify-center z-10">
        <div className="w-full h-full rounded-2xl sm:rounded-xl overflow-hidden bg-gray-100 dark:bg-zinc-800 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.1)] sm:shadow-sm relative">
          
          {/* Dietary Tag top right of image */}
          <div className="absolute top-1.5 right-1.5 z-20 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm rounded-sm shadow-sm">
            {getDietaryIcon(item.dietaryType)}
          </div>

          {item.image ? (
            <img 
              src={item.image} 
              alt={item.name} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-zinc-800 dark:to-zinc-900 flex items-center justify-center">
               <span className="text-gray-400 font-bold text-3xl sm:text-2xl">{item.name?.[0]?.toUpperCase()}</span>
            </div>
          )}
          
          {!item.isAvailable && (
            <div className="absolute inset-0 bg-white/70 dark:bg-black/70 backdrop-blur-[2px] flex items-center justify-center">
              <span className="text-xs font-bold text-gray-700 dark:text-gray-200 bg-white/90 dark:bg-black/90 px-2 py-1 rounded">
                Out of Stock
              </span>
            </div>
          )}
        </div>
        
        {/* 'ADD' button overlapping image ON DESKTOP ONLY */}
        <button 
          className="hidden sm:flex absolute -bottom-3 left-1/2 -translate-x-1/2 w-[80%] h-8 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-lg text-orange-600 dark:text-orange-500 text-sm font-bold shadow-sm hover:shadow-md hover:bg-orange-50 dark:hover:bg-orange-950 transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none items-center justify-center"
          disabled={!item.isAvailable}
        >
          ADD
          {hasVariants && (
             <span className="absolute -top-1 -right-1 text-[10px] w-3 h-3 bg-white dark:bg-zinc-900 text-gray-400 leading-none flex items-center justify-center font-normal">
               +
             </span>
          )}
        </button>
      </div>

      <div className="order-2 sm:order-1 flex-1 min-w-0 flex flex-col z-10 mt-1 sm:mt-0 sm:justify-between">
        
        <h3 className="text-[13px] sm:text-base font-bold text-gray-800 dark:text-gray-100 leading-snug line-clamp-2 sm:truncate">
          {item.name}
        </h3>
        
        {item.description && (
          <p 
            className="hidden sm:block text-xs text-gray-500 dark:text-gray-400 mt-2 leading-relaxed"
            style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
          >
            {item.description}
          </p>
        )}

        {item.preparationTime && (
          <div className="hidden sm:flex items-center gap-1.5 mt-2 text-[11px] font-medium text-gray-400">
            <Info className="w-3.5 h-3.5" />
            <span>Prep: {item.preparationTime} mins</span>
          </div>
        )}

        {/* Mobile: Price & ADD Button Row | Desktop: Just Price Row */}
        <div className="flex items-center justify-between mt-auto pt-2 sm:pt-0 sm:mt-1.5">
          {/* Price */}
          <div className="flex items-baseline gap-1">
            <span className="text-[13px] sm:text-sm font-bold text-gray-900 dark:text-gray-100">
              ₹{item.base_price}
            </span>
            {hasVariants && (
              <span className="hidden sm:inline text-xs text-gray-500 dark:text-gray-400 font-medium">
                onwards
              </span>
            )}
          </div>

          {/* 'ADD' button - Mobile Only */}
          <button 
            className="sm:hidden relative h-8 px-6 bg-green-50/80 dark:bg-green-900/20 border border-green-600 dark:border-green-500 rounded-lg text-green-600 dark:text-green-500 text-[13px] font-extrabold shadow-sm active:scale-95 disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center uppercase tracking-wide"
            disabled={!item.isAvailable}
          >
            ADD
            {hasVariants && (
              <span className="absolute -top-1.5 -right-1.5 text-[10px] w-3.5 h-3.5 bg-white dark:bg-zinc-900 text-gray-400 border border-gray-200 dark:border-zinc-700 rounded-sm leading-none flex items-center justify-center font-normal">
                +
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
