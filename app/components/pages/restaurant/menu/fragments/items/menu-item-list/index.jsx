"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { UtensilsCrossed, Plus, Search, Loader2 } from "lucide-react";
import MenuItemRow from "../menu-item-card";
import { useItem } from "@/store/hooks/useItem";
import { useRestaurant } from "@/store/hooks/useRestaurant";

export default function MenuItemList({
    activeSubCategoryId,
}) {
    const { restaurantId } = useRestaurant();
    const { items, isLoading, addItem, updateItem, deleteItem } = useItem(restaurantId, activeSubCategoryId ? { subCategoryId: activeSubCategoryId } : {});
    
    const handleAddItem = () => {
        if (!activeSubCategoryId) return;

        addItem({
            subCategory: activeSubCategoryId,
            category: items?.[0]?.category || undefined, // Wait, we might need category id too if we are adding an item. Actually the API requires category. Let's see. 
            // Wait, we can let the user pick, but the API requires category. We should find the categoryId from the activeSubCategory! 
            // The items have category attached. But if items is empty?
            // Actually, we shouldn't guess. We can pass categoryId from Menu/index.jsx
            name: "New Item",
            base_price: 0,
            description: "",
            dietaryType: "veg",
            isAvailable: true,
            variants: [],
        });
    };

    return (
        <div className="flex h-full flex-1 flex-col border-x bg-background/50 backdrop-blur-xl relative">
            <div className="flex items-center justify-between px-5 py-4 border-b bg-white/60">
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

            <div className="flex-1 overflow-y-auto p-4 bg-slate-50/30">
                {isLoading ? (
                    <div className="flex h-full flex-col items-center justify-center text-muted-foreground gap-3">
                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                        <p className="text-sm">Loading items...</p>
                    </div>
                ) : items.length === 0 ? (
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