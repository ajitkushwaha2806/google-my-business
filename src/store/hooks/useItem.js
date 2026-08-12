import { MenuService } from "@/services/frontend/menu";
import useNotification from "./useNotification";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useItem = (resId, filters = {}) => {
    const queryClient = useQueryClient();
    const notification = useNotification();

    const { data: itemData, isLoading, error } = useQuery({
        queryKey: ["items", resId, filters],
        queryFn: () => MenuService.item.getAll(resId, filters),
        enabled: !!resId,
    });

    const createMutation = useMutation({
        mutationFn: (data) => MenuService.item.create(resId, data),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["items", resId] });
            notification.success(data?.message || "Item created successfully");
        },
        onError: (err) => {
            notification.error(err.response?.data?.message || err.message || "Failed to create item");
        },
    });

    const updateMutation = useMutation({
        mutationFn: ({ itemId, data }) => MenuService.item.update(resId, itemId, data),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["items", resId] });
            notification.success(data?.message || "Item updated successfully");
        },
        onError: (err) => {
            notification.error(err.response?.data?.message || err.message || "Failed to update item");
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (itemId) => MenuService.item.delete(resId, itemId),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["items", resId] });
            notification.success(data?.message || "Item deleted successfully");
        },
        onError: (err) => {
            notification.error(err.response?.data?.message || err.message || "Failed to delete item");
        },
    });

    return {
        items: itemData?.data || [],
        isLoading,
        error,
        addItem: createMutation.mutate,
        isAdding: createMutation.isPending,
        updateItem: updateMutation.mutate,
        isUpdating: updateMutation.isPending,
        deleteItem: deleteMutation.mutate,
        isDeleting: deleteMutation.isPending,
    };
};
