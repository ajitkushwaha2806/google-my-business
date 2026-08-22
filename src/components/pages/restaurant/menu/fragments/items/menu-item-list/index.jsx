"use client";
import React from "react";
import MenuItemRow from "../menu-item-card";
import { useItem } from "@/store/hooks/useItem";
import Loader from "@/components/global/loader";
import { Button } from "@/components/ui/button";
import { UtensilsCrossed, Plus } from "lucide-react";
import { useRestaurant } from "@/store/hooks/useRestaurant";

export default function MenuItemList({
    activeCategoryId,
    activeSubCategoryId,
}) {
    const { restaurantId } = useRestaurant();
    const { items, isLoading, addItem, updateItem, deleteItem } = useItem(restaurantId, activeSubCategoryId ? { subCategoryId: activeSubCategoryId } : {});
    const [tempItems, setTempItems] = React.useState([]);

    React.useEffect(() => {
        setTempItems([]);
    }, [activeSubCategoryId]);
    
    const handleAddItem = () => {
        if (!activeSubCategoryId || !activeCategoryId) return;

        setTempItems(prev => [
            {
                id: `temp-${crypto.randomUUID()}`,
                subCategory: activeSubCategoryId,
                category: activeCategoryId, 
                name: "New Item",
                base_price: 0,
                description: "",
                dietaryType: "veg",
                isAvailable: true,
                variants: [],
                isTemp: true,
            },
            ...prev
        ]);
    };

    return (
        <div className="flex h-full flex-1 flex-col border-x bg-white dark:bg-zinc-950 relative">
            <div className="flex items-center justify-between px-5 py-4 border-b bg-white dark:bg-zinc-950">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <UtensilsCrossed className="h-5 w-5" />
                    </div>
                    <div>
                        <h2 className="text-sm font-bold text-foreground">Menu Items</h2>
                        <p className="text-[11px] text-muted-foreground">{items.length} items found</p>
                    </div>
                </div>
                
                <div className="flex items-center gap-2">
                    <Button
                        onClick={handleAddItem}
                        className="h-9 rounded-lg px-4 bg-primary hover:bg-primary/90 text-primary-foreground gap-2 shadow-sm"
                    >
                        <Plus className="h-4 w-4" />
                        <span className="text-xs font-semibold">Add Item</span>
                    </Button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 bg-white dark:bg-zinc-950">
                {isLoading ? (
                    <div className="flex h-full items-center justify-center w-full">
                        <Loader />
                    </div>
                ) : items.length === 0 && tempItems.length === 0 ? (
                    <div className="flex h-full flex-col items-center justify-center text-muted-foreground gap-4">
                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
                            <UtensilsCrossed className="h-8 w-8 text-muted-foreground/50" />
                        </div>
                        <p className="text-sm font-medium">No items found in this subcategory.</p>
                        <Button variant="outline" onClick={handleAddItem} className="gap-2">
                            <Plus className="h-4 w-4" /> Add your first item
                        </Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4 pb-20">
                        {tempItems.map((item) => (
                            <MenuItemRow
                                key={item.id}
                                item={item}
                                onChange={(updatedItem) => {
                                    const { id, isTemp, ...dataToSave } = updatedItem;
                                    return addItem(dataToSave, {
                                        onSuccess: () => {
                                            setTempItems((prev) => prev.filter((i) => i.id !== item.id));
                                        }
                                    });
                                }}
                                onDelete={() =>
                                    setTempItems((prev) => prev.filter((i) => i.id !== item.id))
                                }
                            />
                        ))}
                        {items.map((item) => (
                            <MenuItemRow
                                key={item.id}
                                item={item}
                                onChange={(updatedItem) =>
                                    updateItem({ itemId: item.id, data: updatedItem })
                                }
                                onDelete={() =>
                                    deleteItem(item.id)
                                }
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}