import { useState, useEffect } from "react";
import { useUser as useClerkUser } from "@clerk/nextjs";

export const useRestaurant = () => {
  const { user } = useClerkUser();
  const [restaurantId, setRestaurantId] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedId = localStorage.getItem("activeRestaurantId");
      
      if (storedId) {
        setRestaurantId(storedId);
      } else if (user?.publicMetadata?.restaurantId) {
        setRestaurantId(user.publicMetadata.restaurantId);
        localStorage.setItem("activeRestaurantId", user.publicMetadata.restaurantId);
      }
    }
  }, [user?.publicMetadata?.restaurantId]);

  const setActiveRestaurant = (id) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("activeRestaurantId", id);
      setRestaurantId(id);
      window.location.reload();
    }
  };

  return {
    restaurantId,
    setActiveRestaurant
  };
};
