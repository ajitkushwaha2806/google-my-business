"use client";
import { Loader2 } from "lucide-react";
import OrderCard from "./fragments/order-card";
import Loader from "@/components/global/loader";
import { OrderService } from "@/services/frontend/order";
import { CustomTabs } from "@/components/ui/custom-tabs";
import { useRestaurant } from "@/store/hooks/useRestaurant";
import { useState, useRef, useMemo, useCallback } from "react";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

export default function Dashboard() {
  const { restaurantId } = useRestaurant();
  const [activeTab, setActiveTab] = useState("new");

  const getStatusQuery = (tab) => {
    switch(tab) {
      case "new": return "PENDING_PAYMENT,PLACED,ACCEPTED";
      case "preparing": return "PREPARING";
      case "ready": return "READY_FOR_PICKUP";
      case "dispatched": return "OUT_FOR_DELIVERY";
      case "pickedup": return "PICKED_UP";
      default: return "";
    }
  };

  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refetch: refetchOrders
  } = useInfiniteQuery({
    queryKey: ["live-orders", restaurantId, activeTab],
    queryFn: async ({ pageParam = 1 }) => {
      if (!restaurantId) return { orders: [] };
      const res = await OrderService.getAll(restaurantId, { 
        limit: 15,
        page: pageParam,
        status: getStatusQuery(activeTab) 
      });
      return res.data;
    },
    getNextPageParam: (lastPage) => {
      if (!lastPage || !lastPage.orders) return undefined;
      return lastPage.orders.length === 15 ? lastPage.page + 1 : undefined;
    },
    enabled: !!restaurantId,
  });

  const orders = useMemo(() => data?.pages.flatMap(page => page.orders) || [], [data]);

  const { data: summaryData, refetch: refetchSummary } = useQuery({
    queryKey: ["live-orders-summary", restaurantId],
    queryFn: async () => {
      if (!restaurantId) return {};
      const res = await OrderService.getAll(restaurantId, { summary: true });
      return res.data || {};
    },
    enabled: !!restaurantId,
  });

  const getCount = (...statuses) => {
    if (!summaryData) return 0;
    return statuses.reduce((acc, status) => acc + (summaryData[status] || 0), 0);
  };

  const TABS = [
    {
      id: "new",
      label: "New Orders",
      badge: getCount("PENDING_PAYMENT", "PLACED", "ACCEPTED") || null,
      activeColor: "border-primary text-primary",
      badgeClasses: "bg-primary/10 text-primary dark:bg-primary/20",
    },
    {
      id: "preparing",
      label: "Preparing",
      badge: getCount("PREPARING") || null,
      activeColor: "border-primary text-primary",
      badgeClasses: "bg-primary/10 text-primary dark:bg-primary/20",
    },
    {
      id: "ready",
      label: "Ready",
      badge: getCount("READY_FOR_PICKUP") || null,
      activeColor: "border-primary text-primary",
      badgeClasses: "bg-primary/10 text-primary dark:bg-primary/20",
    },
    {
      id: "dispatched",
      label: "Dispatched",
      badge: getCount("OUT_FOR_DELIVERY") || null,
      activeColor: "border-primary text-primary",
      badgeClasses: "bg-primary/10 text-primary dark:bg-primary/20",
    },
    {
      id: "pickedup",
      label: "Picked Up",
      badge: getCount("PICKED_UP") || null,
      activeColor: "border-primary text-primary",
      badgeClasses: "bg-primary/10 text-primary dark:bg-primary/20",
    },
  ];

  const observer = useRef();
  const lastOrderElementRef = useCallback(node => {
    if (isLoading || isFetchingNextPage) return;
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasNextPage) {
        fetchNextPage();
      }
    });
    
    if (node) observer.current.observe(node);
  }, [isLoading, isFetchingNextPage, hasNextPage, fetchNextPage]);

  const handleRefetch = () => {
    refetchOrders();
    refetchSummary();
  };

  const renderActiveTabContent = () => {
    if (!restaurantId || (isLoading && orders.length === 0)) {
      return (
        <div className="flex items-center justify-center min-h-[300px]">
          <Loader />
        </div>
      );
    }

    if (orders.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[400px] text-muted-foreground border-2 border-dashed border-border/50 rounded-xl m-6 bg-white/50 dark:bg-zinc-900/50">
          <p className="text-xl font-semibold mb-2">No orders in this queue</p>
          <p className="text-sm">When orders move to this status, they will appear here.</p>
        </div>
      );
    }

    return (
      <div className="flex flex-col gap-6 p-4 mx-auto w-full">
        {orders.map((order, index) => {
          if (orders.length === index + 1) {
            return (
              <div ref={lastOrderElementRef} key={order._id}>
                <OrderCard order={order} statusType={activeTab} refetchOrders={handleRefetch} />
              </div>
            );
          } else {
            return <OrderCard key={order._id} order={order} statusType={activeTab} refetchOrders={handleRefetch} />;
          }
        })}
        
        {isFetchingNextPage && (
          <div className="flex justify-center items-center py-4 text-primary">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col bg-white m-4 rounded-sm min-h-screen">
      <div className="p-4 md:p-6 pb-2">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Live Dashboard</h1>
        <p className="text-muted-foreground mt-1">Manage and track your active orders seamlessly.</p>
      </div>

      <div className="flex-1 mx-4 md:mx-6 mb-6 bg-gray-100 dark:bg-zinc-900 rounded-md border border-border/40 shadow-sm overflow-hidden flex flex-col">
        <CustomTabs tabs={TABS} activeTab={activeTab} setActiveTab={setActiveTab} />
        
        <div className="flex-1 overflow-y-auto bg-gray-50/30 dark:bg-zinc-950/30">
          {renderActiveTabContent()}
        </div>
      </div>
    </div>
  );
}
