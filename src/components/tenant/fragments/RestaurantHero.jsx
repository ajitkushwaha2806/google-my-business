"use client";
import { getImageUrl } from "@/lib/utils";
import { MapPin, Phone } from "lucide-react";

export function RestaurantHero({ restaurant }) {
  if (!restaurant) return null;

  const isOpen = restaurant.openingHours?.currentlyOpen ?? true;

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-orange-500/20 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-orange-400/10 blur-3xl" />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-5 py-10 flex flex-col items-center gap-5 text-center">
        {restaurant.logo ? (
          <img
            src={getImageUrl(restaurant.logo, true, "thumbnail")}
            alt={restaurant.name}
            className="w-20 h-20 rounded-2xl object-cover border-2 border-white/20 shadow-xl"
          />
        ) : (
          <div className="w-20 h-20 rounded-2xl bg-orange-500 flex items-center justify-center shadow-xl border-2 border-white/10">
            <span className="text-white text-3xl font-bold">
              {restaurant.name?.[0]?.toUpperCase()}
            </span>
          </div>
        )}

        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            {restaurant.name}
          </h1>
          {restaurant.address?.city && (
            <p className="text-gray-400 text-sm mt-1 flex items-center justify-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              {[restaurant.address.city, restaurant.address.state]
                .filter(Boolean)
                .join(", ")}
            </p>
          )}
        </div>

        <div className="flex flex-wrap justify-center gap-2">
          <span
            className={`
              inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full
              ${isOpen
                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                : "bg-red-500/20 text-red-400 border border-red-500/30"
              }
            `}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${isOpen ? "bg-emerald-400 animate-pulse" : "bg-red-400"}`} />
            {isOpen ? "Open Now" : "Currently Closed"}
          </span>

          {restaurant.phone && (
            <span className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-white/10 text-gray-300 border border-white/10">
              <Phone className="w-3 h-3" />
              {restaurant.phone}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
