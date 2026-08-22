import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useItem } from "@/store/hooks/useItem";
import Loader from "@/components/global/loader";
import { MenuService } from "@/services/frontend/menu";
import { useQueryClient } from "@tanstack/react-query";
import { useCategory } from "@/store/hooks/useCategory";
import { ManageGroups } from "./fragments/ManageGroups";
import { AssignAddons } from "./fragments/AssignAddons";
import { useRestaurant } from "@/store/hooks/useRestaurant";
import useNotification from "@/store/hooks/useNotification";
import { useAddonGroup } from "@/store/hooks/useAddonGroup";

export function AddonsEditor() {
    const { restaurantId } = useRestaurant();
    const { rawCategories: categories = [], isLoading: isLoadingCats } = useCategory(restaurantId);
    const { items = [], isLoading: isLoadingItems } = useItem(restaurantId, { fetchAll: true });
    const { addonGroups, addGroup, updateGroup, deleteGroup, isLoading: isLoadingAddons } = useAddonGroup(restaurantId);
    
    const [selectedGroups, setSelectedGroups] = useState([]);
    const [targetItems, setTargetItems] = useState([]);
    const [isSaving, setIsSaving] = useState(false);
    
    const notification = useNotification();
    const queryClient = useQueryClient();

    const handleClearSelection = () => {
        setSelectedGroups([]);
        setTargetItems([]);
    };

    const handleConfirmAssign = async (action) => {
        if (!restaurantId) return;
        
        if (selectedGroups.length === 0) {
            return notification.error("Please select at least one addon group to map.");
        }
        if (targetItems.length === 0) {
            return notification.error("Please select at least one target item.");
        }

        setIsSaving(true);
        try {
            await MenuService.bulkUpdateAddons(restaurantId, {
                action,
                itemIds: targetItems,
                addonGroupIds: selectedGroups
            });

            notification.success(`Addons ${action === 'remove' ? 'removed from' : 'mapped to'} items successfully!`);
            queryClient.invalidateQueries({ queryKey: ["items", restaurantId] });
            handleClearSelection();
            
        } catch (error) {
            console.error("Addons update error:", error);
            notification.error(error?.response?.data?.message || "Failed to update addons.");
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoadingCats || isLoadingItems || isLoadingAddons) {
        return (
            <div className="flex-1 flex items-center justify-center bg-gray-50">
                <Loader />
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col bg-gray-50 overflow-hidden font-poppins">
            <div className="flex flex-1 overflow-hidden">
                <ManageGroups 
                    addonGroups={addonGroups}
                    items={items}
                    selectedGroups={selectedGroups}
                    setSelectedGroups={setSelectedGroups}
                    addGroup={addGroup}
                    updateGroup={updateGroup}
                    deleteGroup={deleteGroup}
                />
                
                <div className="w-[1px] bg-gray-200 z-10"></div>
                
                <AssignAddons 
                    categories={categories}
                    items={items}
                    targetItems={targetItems}
                    setTargetItems={setTargetItems}
                />
            </div>

            <div className="bg-white border-t border-gray-200 p-4 shrink-0 flex items-center justify-between px-8 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-20">
                <div className="text-[14px] text-slate-700 font-medium">
                    Ready to map <span className="font-bold text-slate-900">{selectedGroups.length} addon groups</span> to <span className="font-bold text-slate-900">{targetItems.length} items</span>.
                </div>
                
                <div className="flex items-center gap-3">
                    <Button 
                        variant="outline" 
                        onClick={handleClearSelection}
                        disabled={isSaving || (selectedGroups.length === 0 && targetItems.length === 0)}
                        className="font-semibold font-sans px-5 rounded-md border border-gray-300 text-slate-700 hover:bg-gray-100 transition-all shadow-none h-10"
                    >
                        Clear Selection
                    </Button>
                    <Button 
                        variant="destructive"
                        onClick={() => handleConfirmAssign('remove')}
                        disabled={isSaving || selectedGroups.length === 0 || targetItems.length === 0}
                        className="font-semibold font-sans px-6 rounded-md shadow-md h-10 flex items-center gap-2 transition-all"
                    >
                        Remove from Items
                    </Button>
                    <Button 
                        onClick={() => handleConfirmAssign('add')}
                        disabled={isSaving || selectedGroups.length === 0 || targetItems.length === 0}
                        className="bg-primary hover:bg-primary/90 text-white font-semibold font-sans px-6 rounded-md shadow-md h-10 flex items-center gap-2 transition-all"
                    >
                        {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                        Map to Items
                    </Button>
                </div>
            </div>
        </div>
    );
}
