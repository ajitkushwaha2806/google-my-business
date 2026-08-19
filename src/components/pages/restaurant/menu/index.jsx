"use client";
import { useState } from "react";
import MenuHeader from "./fragments/header";
import CategorySidebar from "./fragments/category-sidebar";
import MenuItemList from "./fragments/items/menu-item-list";

const Menu = () => {
    const [activeCategory, setActiveCategory] = useState(null);
    const [activeSubCategory, setActiveSubCategory] = useState(null);

    return (
        <div className="flex flex-col h-[calc(100vh-60px)] w-full overflow-hidden">
            <MenuHeader />
            <div className="flex flex-1 overflow-hidden">
                <CategorySidebar 
                    activeCategory={activeCategory} 
                    setActiveCategory={setActiveCategory}
                    activeSubCategory={activeSubCategory}
                    setActiveSubCategory={setActiveSubCategory}
                />
                
                {activeSubCategory ? (
                    <MenuItemList 
                        activeSubCategoryId={activeSubCategory}
                    />
                ) : (
                    <div className="flex-1 flex items-center justify-center bg-white dark:bg-zinc-950 text-gray-400">
                        <p>Select a subcategory to view items</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Menu;