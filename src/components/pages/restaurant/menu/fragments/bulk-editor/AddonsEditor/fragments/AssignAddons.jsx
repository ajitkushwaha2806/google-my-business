import { useState } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronRight, CornerDownRight, Check, Search } from "lucide-react";

export function AssignAddons({ categories, items, targetItems, setTargetItems }) {
    const [expandedNodes, setExpandedNodes] = useState(new Set());
    const [searchQuery, setSearchQuery] = useState("");

    const toggleExpand = (id, e) => {
        if (e) e.stopPropagation();
        setExpandedNodes(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    const toggleItem = (id, e) => {
        if (e) e.stopPropagation();
        setTargetItems(prev => {
            const isSelected = prev.includes(id);
            return isSelected ? prev.filter(x => x !== id) : [...prev, id];
        });
    };

    const rootCategories = categories.filter(c => !c.parentCategory).sort((a,b) => a.displayOrder - b.displayOrder);
    
    const itemsByNode = items.reduce((acc, item) => {
        const key = item.subCategory || item.category;
        if (!acc[key]) acc[key] = [];
        acc[key].push(item);
        return acc;
    }, {});
    
    const subCategoriesByParent = categories.reduce((acc, cat) => {
        if (cat.parentCategory) {
            if (!acc[cat.parentCategory]) acc[cat.parentCategory] = [];
            acc[cat.parentCategory].push(cat);
        }
        return acc;
    }, {});

    const getItemsForSubcategory = (subId) => {
        return (itemsByNode[subId] || []).map(i => i._id || i.id);
    };

    const getItemsForCategory = (catId) => {
        const directItems = (itemsByNode[catId] || []).map(i => i._id || i.id);
        const subCats = subCategoriesByParent[catId] || [];
        const subItems = subCats.flatMap(sub => getItemsForSubcategory(sub._id));
        return [...directItems, ...subItems];
    };

    const toggleSubCategory = (subId, e) => {
        if (e) e.stopPropagation();
        const itemIds = getItemsForSubcategory(subId);
        if (itemIds.length === 0) return;

        const allSelected = itemIds.every(id => targetItems.includes(id));
        setTargetItems(prev => {
            const next = new Set(prev);
            if (allSelected) itemIds.forEach(id => next.delete(id));
            else itemIds.forEach(id => next.add(id));
            return Array.from(next);
        });
    };

    const toggleCategory = (catId, e) => {
        if (e) e.stopPropagation();
        const itemIds = getItemsForCategory(catId);
        if (itemIds.length === 0) return;

        const allSelected = itemIds.every(id => targetItems.includes(id));
        setTargetItems(prev => {
            const next = new Set(prev);
            if (allSelected) itemIds.forEach(id => next.delete(id));
            else itemIds.forEach(id => next.add(id));
            return Array.from(next);
        });
    };

    const renderItemNode = (item, level = 1) => {
        if (searchQuery && !item.name.toLowerCase().includes(searchQuery.toLowerCase())) return null;

        const isSelected = targetItems.includes(item._id || item.id);
        const pl = level === 1 ? "pl-[3.25rem]" : "pl-[4.5rem]";

        return (
            <div key={item._id} className={cn("flex items-center group cursor-pointer py-2 pr-4 transition-colors mx-2 mb-1 rounded-md", isSelected ? "bg-slate-200/70" : "hover:bg-slate-50", pl)} onClick={(e) => toggleItem(item._id || item.id, e)}>
                <div className={cn(
                    "w-[15px] h-[15px] rounded-[3px] border flex items-center justify-center mr-3 shrink-0 transition-colors",
                    isSelected ? "bg-slate-800 border-slate-800 text-white" : "border-slate-300 bg-white"
                )}>
                    {isSelected && <Check className="w-3 h-3" strokeWidth={3} />}
                </div>
                <div className={cn("flex-1 text-[13px]", isSelected ? "text-slate-900 font-semibold" : "text-slate-600 font-medium")}>{item.name}</div>
                {item.addonGroups?.length > 0 && (
                    <div className="text-[10px] font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded-sm">
                        {item.addonGroups.length} Addons
                    </div>
                )}
            </div>
        );
    };

    const renderSubCategoryNode = (sub) => {
        const isExpanded = expandedNodes.has(sub._id);
        const nodeItems = itemsByNode[sub._id] || [];
        if (nodeItems.length === 0 && !searchQuery) return null; // hide empty

        const renderedItems = nodeItems.map(i => renderItemNode(i, 2)).filter(Boolean);
        if (searchQuery && renderedItems.length === 0) return null;
        
        const allSubItems = getItemsForSubcategory(sub._id);
        const isSelected = allSubItems.length > 0 && allSubItems.every(id => targetItems.includes(id));

        return (
            <div key={sub._id} className="flex flex-col border-b border-gray-100 last:border-0 pb-1">
                <div className="flex items-center group py-2.5 px-4 cursor-pointer hover:bg-slate-50 transition-colors" onClick={(e) => toggleExpand(sub._id, e)}>
                    <div className="flex items-center pl-6">
                        <div 
                            onClick={(e) => toggleSubCategory(sub._id, e)}
                            className={cn(
                                "w-[15px] h-[15px] rounded-[3px] border flex items-center justify-center mr-3 shrink-0 transition-colors cursor-pointer",
                                isSelected ? "bg-slate-800 border-slate-800 text-white" : "border-slate-300 bg-white"
                            )}
                        >
                            {isSelected && <Check className="w-3 h-3" strokeWidth={3} />}
                        </div>
                    </div>
                    <button className="w-5 h-5 flex items-center justify-center text-slate-400 hover:text-slate-600 mr-2">
                        {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    </button>
                    <CornerDownRight className="w-4 h-4 mr-2 text-slate-400" />
                    <div className="flex-1 font-semibold text-[13px] text-slate-600 truncate">{sub.name}</div>
                </div>

                {isExpanded && renderedItems.length > 0 && (
                    <div className="flex flex-col gap-0.5 mt-1 mb-2">
                        {renderedItems}
                    </div>
                )}
            </div>
        );
    };

    const renderCategoryNode = (cat) => {
        const isExpanded = expandedNodes.has(cat._id);
        const subs = subCategoriesByParent[cat._id] || [];
        const nodeItems = itemsByNode[cat._id] || [];
        
        const renderedSubs = subs.map(renderSubCategoryNode).filter(Boolean);
        const renderedItems = nodeItems.map(i => renderItemNode(i, 1)).filter(Boolean);

        if (searchQuery && renderedSubs.length === 0 && renderedItems.length === 0) return null;
        
        const allCatItems = getItemsForCategory(cat._id);
        const isSelected = allCatItems.length > 0 && allCatItems.every(id => targetItems.includes(id));

        return (
            <div key={cat._id} className="flex flex-col border border-gray-200 rounded-lg mb-3 bg-white overflow-hidden shadow-sm">
                <div className="flex items-center group py-3 px-4 cursor-pointer hover:bg-slate-50 transition-colors" onClick={(e) => toggleExpand(cat._id, e)}>
                    <div 
                        onClick={(e) => toggleCategory(cat._id, e)}
                        className={cn(
                            "w-[15px] h-[15px] rounded-[3px] border flex items-center justify-center mr-3 shrink-0 transition-colors cursor-pointer",
                            isSelected ? "bg-slate-800 border-slate-800 text-white" : "border-slate-300 bg-white"
                        )}
                    >
                        {isSelected && <Check className="w-3 h-3" strokeWidth={3} />}
                    </div>
                    <button className="w-5 h-5 flex items-center justify-center text-slate-400 hover:text-slate-600 mr-2">
                        {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    </button>
                    <div className="flex-1 font-bold text-[14px] text-slate-800 truncate">{cat.name}</div>
                </div>

                {isExpanded && (
                    <div className="flex flex-col border-t border-gray-100 pt-1 pb-2">
                        {renderedSubs}
                        {renderedItems.length > 0 && (
                            <div className="flex flex-col border-b border-gray-100 last:border-0 pb-1">
                                <div className="flex items-center group py-2.5 px-4">
                                    <div className="flex items-center pl-6">
                                        <div className="w-[15px] h-[15px] mr-3 shrink-0" />
                                    </div>
                                    <div className="w-5 h-5 flex items-center justify-center text-slate-400 mr-2">
                                        <ChevronDown className="w-4 h-4" />
                                    </div>
                                    <div className="flex-1 font-semibold text-[13px] text-slate-400 italic truncate">Direct Items</div>
                                </div>
                                <div className="flex flex-col gap-0.5 mt-1 mb-2">
                                    {renderedItems}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="w-1/2 h-full flex flex-col bg-slate-50 border-l border-gray-200 shadow-[-4px_0_15px_-3px_rgba(0,0,0,0.02)]">
            <div className="flex flex-col border-b border-gray-200 bg-white">
                <div className="flex items-center justify-between px-6 py-4">
                    <h3 className="font-bold text-[16px] text-slate-900">2. Select Target Items</h3>
                    <div className="bg-slate-100 text-slate-700 text-[12px] font-bold px-3 py-1.5 rounded-md">
                        {targetItems.length} Selected
                    </div>
                </div>
                <div className="px-6 pb-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input 
                            type="text" 
                            placeholder="Search items..." 
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                if (e.target.value) {
                                    // Expand all on search
                                    categories.forEach(c => setExpandedNodes(prev => new Set(prev).add(c._id)));
                                } else {
                                    setExpandedNodes(new Set());
                                }
                            }}
                            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-md text-[13px] outline-none focus:ring-1 focus:ring-primary/20 focus:border-primary/50 transition-all"
                        />
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 select-none">
                {rootCategories.map(renderCategoryNode)}
                {rootCategories.length === 0 && (
                    <div className="text-center py-10 text-slate-400 text-[14px]">No menu items found.</div>
                )}
            </div>
        </div>
    );
}
