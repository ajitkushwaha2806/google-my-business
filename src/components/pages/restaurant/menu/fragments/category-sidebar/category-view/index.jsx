import { useState, useEffect } from "react";
import CategoryCard from "../category-card";
import Loader from "@/components/global/loader";
import { useCategory } from "@/store/hooks/useCategory";
import { useRestaurant } from "@/store/hooks/useRestaurant";

const CategoryView = ({ activeCategory, setActiveCategory, activeSubCategory, setActiveSubCategory }) => {
    const { restaurantId } = useRestaurant();
    const { categories, isLoading, addCategory, updateCategory, deleteCategory } = useCategory(restaurantId);
    const [expandedCategoryId, setExpandedCategoryId] = useState(null);
 
    useEffect(() => {
        if (categories?.length > 0 && !activeCategory) {
            const firstCategory = categories[0];
            Promise.resolve().then(() => {
                setExpandedCategoryId(firstCategory.id);
                setActiveCategory(firstCategory.id);
                if (firstCategory.subcategories?.length > 0 && !activeSubCategory) {
                    setActiveSubCategory(firstCategory.subcategories[0].id);
                }
            });
        }
    }, [categories, activeCategory, activeSubCategory, setActiveCategory, setActiveSubCategory]);

    const addSubCategory = addCategory;
    const updateSubCategory = updateCategory;
    const deleteSubCategory = deleteCategory;

    if (isLoading || !restaurantId) {
        return (
            <div className="flex items-center justify-center min-h-[200px] w-full">
                <Loader />
            </div>
        );
    }

    return (
        <div className="space-y-2">
            {categories?.map((category, index) => (
                <CategoryCard 
                    key={category.id || index} 
                    category={category} 
                    index={index}
                    isExpanded={expandedCategoryId === category.id}
                    onToggleExpand={() =>
                        setExpandedCategoryId(expandedCategoryId === category.id ? null : category.id)
                    }
                    activeCategory={activeCategory}
                    setActiveCategory={setActiveCategory}
                    activeSubCategory={activeSubCategory}
                    setActiveSubCategory={setActiveSubCategory}
                    updateCategory={updateCategory}
                    deleteCategory={deleteCategory}
                    addSubCategory={addSubCategory}
                    updateSubCategory={updateSubCategory}
                    deleteSubCategory={deleteSubCategory}
                />
            ))}
        </div>
    )
}

export default CategoryView;