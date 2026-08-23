"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import OrderPageHeader from "./fragments/header";
import OrderTable from "./fragments/order-table";
import { ORDER_TAB_FILTERS } from "./helpers/constants";
import { OrderService } from "@/services/frontend/order";
import { useRestaurant } from "@/store/hooks/useRestaurant";
import OrderDetailsDrawer from "./fragments/order-details-drawer";

const OrdersManagement = () => {
    const { restaurantId } = useRestaurant();
    const [filter, setFilter] = useState("all");
    const [page, setPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const [appliedSearch, setAppliedSearch] = useState("");
    const [selectedOrder, setSelectedOrder] = useState(null);
    const limit = 10;

    const handleSearch = (overrideQuery) => {
        setAppliedSearch(typeof overrideQuery === 'string' ? overrideQuery : searchQuery);
        setPage(1);
    };

    const { data, isLoading, refetch } = useQuery({
        queryKey: ["orders", restaurantId, filter, page, appliedSearch],
        queryFn: async () => {
            if (!restaurantId) return { orders: [], total: 0 };
            const params = { page, limit };
            const activeTab = ORDER_TAB_FILTERS.find(t => t.key === filter);
            if (activeTab && activeTab.statuses.length > 0) {
                params.status = activeTab.statuses.join(",");
            }
            if (appliedSearch) {
                params.search = appliedSearch;
            }

            return OrderService.getAll(restaurantId, params);
        },
        enabled: !!restaurantId,
    });

    const handleViewOrder = (order) => {
        setSelectedOrder(order);
    };

    return (
        <div className="flex flex-col bg-white m-4 rounded-md dark:bg-zinc-950 overflow-y-auto">
            <div className="mx-auto w-full p-4 md:p-6 space-y-6">
                <OrderPageHeader
                    filter={filter}
                    setFilter={(f) => {
                        setFilter(f);
                        setPage(1);
                    }}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    onSearch={handleSearch}
                />
                
                <OrderTable
                    orders={data?.data?.orders || []}
                    total={data?.data?.total || 0}
                    page={page}
                    limit={limit}
                    onPageChange={setPage}
                    isLoading={isLoading}
                    onViewOrder={handleViewOrder}
                />
            </div>

            <OrderDetailsDrawer
                isOpen={!!selectedOrder}
                onClose={() => setSelectedOrder(null)}
                order={selectedOrder}
                onUpdate={() => refetch()}
            />
        </div>
    );
};

export default OrdersManagement;
