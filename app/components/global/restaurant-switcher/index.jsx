"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import RestaurantImage from "./fragments/image-card";
import { useSidebar } from "@/components/ui/sidebar";
import EmptyState from "./fragments/states/empty-state";
import ErrorState from "./fragments/states/error-state";
import { RestaurantService } from "@/services/restaurant";
import LoadingState from "./fragments/states/loading-state";
import { useRestaurant } from "@/store/hooks/useRestaurant";
import { Check, ChevronsUpDown, Search, Settings, Building2 } from "lucide-react";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const RestaurantSwitcher = () => {
  const { isMobile } = useSidebar();
  const { restaurantId, setActiveRestaurant } = useRestaurant();
  const [searchQuery, setSearchQuery] = useState("");

  const { data, isPending, isError, error, refetch, isFetching } = useQuery({
    queryKey: ["all-restaurants"],
    queryFn: RestaurantService.getAllRestaurants,
    retry: false, 
  });

  if (isPending) return <LoadingState />;
  if (isError) return <ErrorState error={error} refetch={refetch} isFetching={isFetching} />;

  const entities = data?.data?.restaurants || data?.restaurants || [];

  if (entities.length === 0) return <EmptyState />;
  const selected = entities.find((r) => r._id === restaurantId) || entities[0];

  const filteredEntities = entities.filter((r) =>
    r.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu
          onOpenChange={(open) => {
            if (!open) setSearchQuery("");
          }}
        >
          <DropdownMenuTrigger
            render={
              <SidebarMenuButton
                size="lg"
                className="group h-14 w-full overflow-hidden rounded-xl border border-transparent hover:border-border/50 bg-transparent hover:bg-muted/50 shadow-none transition-all duration-200 data-[state=open]:border-border/50 data-[state=open]:bg-muted/50"
              />
            }
          >
            <RestaurantImage restaurant={selected} />

            <div className="grid min-w-0 flex-1 text-left ml-0.5">
              <span className="truncate text-[13px] font-semibold tracking-tight text-foreground flex items-center gap-1.5">
                {selected?.name || "Select Restaurant"}
              </span>
              <div className="flex items-center gap-1.5 mt-[1px]">
                <span className="truncate text-[11px] font-medium text-muted-foreground/80">
                  {selected?.address?.city || "No location set"}
                </span>
              </div>
            </div>

            <ChevronsUpDown className="size-4 shrink-0 opacity-40 transition-transform duration-200 group-data-[state=open]:rotate-180" />
          </DropdownMenuTrigger>

          <DropdownMenuContent
            side={isMobile ? "bottom" : "right"}
            align={isMobile ? "end" : "start"}
            sideOffset={12}
            className="w-[280px] rounded-xl p-1 shadow-xl border-border/50 bg-white backdrop-blur-md"
          >
            <DropdownMenuGroup>
              <DropdownMenuLabel className="px-3 py-2.5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70">
                      Your Outlets
                    </p>
                  </div>
                </div>
              </DropdownMenuLabel>
            </DropdownMenuGroup>

            <div className="max-h-[340px] overflow-y-auto space-y-0.5">
              {filteredEntities.length > 0 ? (
                filteredEntities.map((restaurant) => {
                  const active = restaurant._id === selected._id;

                  return (
                    <DropdownMenuItem
                      key={restaurant._id}
                      onClick={() => setActiveRestaurant(restaurant._id)}
                      className={`
                        flex items-center gap-3 cursor-pointer rounded-lg px-2.5 py-2 transition-all
                        ${active ? "bg-primary/10 text-primary font-medium" : "hover:bg-muted focus:bg-muted text-foreground"}
                      `}
                    >
                      <RestaurantImage restaurant={restaurant} />

                      <div className="min-w-0 flex-1">
                        <p className={`truncate text-sm font-medium ${active ? 'text-primary' : ''}`}>
                          {restaurant.name}
                        </p>
                        <p className={`truncate text-xs ${active ? 'text-primary/70' : 'text-muted-foreground/70'}`}>
                          {restaurant.address?.city || "No location set"}
                        </p>
                      </div>

                      {active && (
                        <Check className="size-4 shrink-0 text-primary" />
                      )}
                    </DropdownMenuItem>
                  );
                })
              ) : (
                <div className="px-3 py-6 flex flex-col items-center justify-center text-center gap-2 text-muted-foreground">
                  <Building2 className="size-6 text-muted-foreground/40" />
                  <p className="text-xs">No outlets found matching "{searchQuery}"</p>
                </div>
              )}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};

export default RestaurantSwitcher;