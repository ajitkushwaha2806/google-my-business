"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { renderTabContent, TABS } from "./helpers";
import { CustomTabs } from "@/components/ui/custom-tabs";
import { useRestaurant } from "@/store/hooks/useRestaurant";
import { RestaurantService } from "@/services/frontend/restaurant";

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState("general");
  const { restaurantId } = useRestaurant()

  const { data } = useQuery({
    queryKey: ["restaurant-details", restaurantId],
    queryFn: () => RestaurantService.getRestaurantById(restaurantId),
  });

  return (
    <div className="flex-1 w-full max-w-[1400px] mx-auto bg-gray-50/50 dark:bg-zinc-950 min-h-screen">
      <div className="p-3 md:p-4 space-y-8">
        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-border/40 shadow-sm overflow-hidden">
          <CustomTabs tabs={TABS} activeTab={activeTab} setActiveTab={setActiveTab} />
          
          <div className="p-4 md:p-5 bg-gray-50/30 dark:bg-zinc-950/50">
            <div key={activeTab} className="animate-in fade-in-50 duration-500">
              {renderTabContent(activeTab , data)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
