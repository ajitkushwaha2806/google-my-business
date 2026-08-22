import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useItem } from "@/store/hooks/useItem";
import { ImageSidebar } from "./fragments/ImageSidebar";
import { useCategory } from "@/store/hooks/useCategory";
import { useRestaurant } from "@/store/hooks/useRestaurant";
import { ImageUploadCard } from "./fragments/ImageUploadCard";

export function ImageEditor() {
    const { restaurantId } = useRestaurant();
    const { rawCategories: categories = [], isLoading: isLoadingCats } = useCategory(restaurantId);
    const { items = [], updateItem, isLoading: isLoadingItems } = useItem(restaurantId, { fetchAll: true });
    
    const [selectedItemForSidebar, setSelectedItemForSidebar] = useState(null);

    const categoryNameMap = categories.reduce((acc, cat) => {
        acc[cat._id] = cat.name;
        return acc;
    }, {});

    const getCategoryPath = (item) => {
        const catName = categoryNameMap[item.category];
        const subName = categoryNameMap[item.subCategory];
        
        if (catName && subName) return `${catName} > ${subName}`;
        if (catName) return catName;
        return "Uncategorized";
    };

    const handleUploadComplete = async (itemId, imageId) => {
        await updateItem({ itemId, data: { image: imageId } });
    };

    if (isLoadingCats || isLoadingItems) {
        return (
            <div className="flex-1 flex items-center justify-center bg-gray-50 text-gray-500 font-medium font-sans">
                <Loader2 className="w-5 h-5 animate-spin mr-2" /> Loading Items...
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col bg-gray-50 overflow-hidden font-poppins">
            <div className="flex-1 overflow-y-auto p-3">
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-6 gap-4 max-w-[1600px] mx-auto">
                    {items.map(item => (
                        <ImageUploadCard 
                            key={item._id}
                            item={item}
                            updateItem={updateItem}
                            restaurantId={restaurantId}
                            onCardClick={() => setSelectedItemForSidebar(item)}
                        />
                    ))}
                    {items.length === 0 && (
                        <div className="col-span-full py-20 text-center text-slate-400 font-medium">
                            No items found in your menu.
                        </div>
                    )}
                </div>
            </div>

            <ImageSidebar 
                item={selectedItemForSidebar}
                isOpen={!!selectedItemForSidebar}
                onClose={() => setSelectedItemForSidebar(null)}
                restaurantId={restaurantId}
                onUploadComplete={(imageId) => handleUploadComplete(selectedItemForSidebar._id, imageId)}
            />
        </div>
    );
}
