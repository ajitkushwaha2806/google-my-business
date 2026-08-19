"use client";
import { useState, useEffect } from "react";
import { useUser as useClerkUser } from "@clerk/nextjs";
import { RestaurantService } from "@/services/frontend/restaurant";
import { useRouter, usePathname } from "next/navigation";

export const useRestaurant = () => {
  const { user, isLoaded } = useClerkUser();
  const [restaurantId, setRestaurantId] = useState(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoaded || !user) return;

    const checkAndSelectRestaurant = async () => {
      const storedId = localStorage.getItem("activeRestaurantId");
      if (storedId) {
        setRestaurantId(storedId);
        return;
      }

      try {
        const response = await RestaurantService.getAllRestaurants();
        const entities = response?.data?.restaurants || response?.restaurants || [];

        if (entities.length > 0) {
          const firstId = entities[0]._id;
          setRestaurantId(firstId);
          localStorage.setItem("activeRestaurantId", firstId);
        } else if (!pathname.startsWith("/restaurant/onboarding")) {
          router.push("/restaurant/onboarding");
        }
      } catch (error) {
        console.error("Failed to fetch restaurants in useRestaurant hook:", error);
      }
    };

    checkAndSelectRestaurant();
  }, [user, isLoaded, pathname, router]);

  const setActiveRestaurant = (id) => {
    localStorage.setItem("activeRestaurantId", id);
    setRestaurantId(id);
    window.location.reload();
  };

  return {
    restaurantId,
    setActiveRestaurant
  };
};
