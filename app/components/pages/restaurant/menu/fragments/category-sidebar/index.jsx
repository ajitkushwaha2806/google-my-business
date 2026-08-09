"use client";
import { useState } from "react";
import { renderViewContent } from "./helper";
import { useCategory } from "@/store/hooks/useCategory";
import { useRestaurant } from "@/store/hooks/useRestaurant";
import { CategoryFormPopover } from "./category-form-popover";
import { Plus, Layers, Settings2, ChevronLeft, ChevronRight } from "lucide-react";

export default function CategorySidebar({
    activeCategory,
    setActiveCategory,
    activeSubCategory,
    setActiveSubCategory
}) {
    const { restaurantId } = useRestaurant();
    const { addCategory } = useCategory(restaurantId);

    const [isCollapsed, setIsCollapsed] = useState(false);
    const [activeView, setActiveView] = useState("MENU");
    const [activeBulkMode, setActiveBulkMode] = useState(null);
    return (
        <div className={`relative flex h-full transition-all duration-300 ${isCollapsed ? 'w-0' : 'w-[300px]'} shrink-0 z-20`}>
            <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="absolute -right-3 top-1/2 -translate-y-1/2 z-100 flex h-6 w-6 items-center justify-center rounded-md border bg-white shadow-md hover:bg-gray-50 text-gray-500 transition-colors"
                title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
                {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
            </button>

            <aside className={`flex h-full w-[300px] flex-col border-r bg-white/60 backdrop-blur-xl shadow-[4px_0_24px_-12px_rgba(0,0,0,0.1)] overflow-hidden transition-transform duration-300 ${isCollapsed ? '-translate-x-full' : 'translate-x-0'}`}>
                {setActiveView && (
                    <div className="px-5 py-3 border-b border-border/50 bg-slate-50/30 shrink-0">
                        <div className="flex items-center justify-between gap-2">
                            <div className="grid grid-cols-2 gap-1 p-1 bg-gray-100 rounded-lg flex-1">
                                <button
                                    onClick={() => setActiveView("MENU")}
                                    className={`flex items-center justify-center gap-2 py-1.5 text-xs font-semibold rounded-md transition-all ${activeView === "MENU"
                                        ? "bg-white text-gray-900 shadow-sm"
                                        : "text-gray-500 hover:text-gray-950"
                                        }`}
                                >
                                    <Layers className="w-3.5 h-3.5" />
                                    Menu
                                </button>
                                <button
                                    onClick={() => setActiveView("BULK")}
                                    className={`flex items-center justify-center gap-2 py-1.5 text-xs font-semibold rounded-md transition-all ${activeView === "BULK"
                                        ? "bg-white text-gray-900 shadow-sm"
                                        : "text-gray-500 hover:text-gray-950"
                                        }`}
                                >
                                    <Settings2 className="w-3.5 h-3.5" />
                                    Bulk Edit
                                </button>
                            </div>
                            {activeView === "MENU" && (
                                <div className="flex items-center gap-1 shrink-0">
                                    <CategoryFormPopover onSubmit={addCategory} />
                                </div>
                            )}
                        </div>
                    </div>
                )}

                <div className="flex-1 overflow-y-auto w-full">
                    {renderViewContent({
                        activeView,
                        activeBulkMode,
                        setActiveBulkMode,
                        activeCategory,
                        setActiveCategory,
                        activeSubCategory,
                        setActiveSubCategory
                    })}
                </div>
            </aside>
        </div>
    );
}