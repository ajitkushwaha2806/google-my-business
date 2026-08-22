import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ConfirmDeleteAlert } from "@/components/ui/confirm-delete-alert";
import { CategoryFormPopover } from "../../../category-sidebar/category-form-popover";
import { Check, ChevronDown, ChevronRight, Edit2, Layers, Plus, Trash2 } from "lucide-react";

export function SelectSources({ categories, items, selectedSources, setSelectedSources, addCategory, updateCategory, deleteCategory, deleteItem }) {
    const [expandedNodes, setExpandedNodes] = useState(new Set());
    const [deleteAlert, setDeleteAlert] = useState({ isOpen: false, type: null, id: null, name: null });
    const [isDeleting, setIsDeleting] = useState(false);

    const toggleExpand = (id, e) => {
        e.stopPropagation();
        setExpandedNodes(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    const toggleSelection = (id, type, e) => {
        e.stopPropagation();
        setSelectedSources(prev => {
            const arr = prev[type];
            const isSelected = arr.includes(id);
            
            return {
                ...prev,
                [type]: isSelected ? arr.filter(x => x !== id) : [...arr, id]
            };
        });
    };

    const confirmDelete = async () => {
        setIsDeleting(true);
        try {
            if (deleteAlert.type === 'items') {
                await deleteItem(deleteAlert.id);
            } else {
                await deleteCategory(deleteAlert.id);
            }
            setDeleteAlert({ isOpen: false, type: null, id: null, name: null });
        } catch (error) {
            console.error("Delete failed", error);
        } finally {
            setIsDeleting(false);
        }
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

    const renderItemNode = (item, level = 1) => {
        const isSelected = selectedSources.items.includes(item._id || item.id);
        const id = item._id || item.id;
        
        // padding left based on level. If under subcat, level=2. If under category, level=1.
        const pl = level === 1 ? "pl-[3.25rem]" : "pl-[4.5rem]";

        return (
            <div key={id} className={cn("flex items-center group cursor-pointer py-2 pr-2 transition-colors mx-2 mb-1 rounded-md", isSelected ? "bg-slate-200/70" : "hover:bg-slate-50", pl)} onClick={(e) => toggleSelection(id, 'items', e)}>
                <div className={cn(
                    "w-[15px] h-[15px] rounded-[3px] border flex items-center justify-center mr-3 shrink-0 transition-colors",
                    isSelected ? "bg-slate-800 border-slate-800 text-white" : "border-slate-300 bg-white"
                )}>
                    {isSelected && <Check className="w-3 h-3" strokeWidth={3} />}
                </div>
                <div className={cn("flex-1 text-[14px]", isSelected ? "text-slate-900 font-semibold" : "text-slate-600 font-medium")}>{item.name}</div>
                
                <div className="opacity-0 group-hover:opacity-100 flex items-center transition-opacity">
                    <button 
                        onClick={(e) => {
                            e.stopPropagation();
                            setDeleteAlert({ isOpen: true, type: 'items', id, name: item.name });
                        }}
                        className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-red-500 rounded-md hover:bg-red-50 transition-colors"
                        title="Delete Item"
                    >
                        <Trash2 className="w-3.5 h-3.5" />
                    </button>
                </div>
            </div>
        );
    };

    const renderSubCategoryNode = (sub) => {
        const isSelected = selectedSources.subcategories.includes(sub._id);
        const isExpanded = expandedNodes.has(sub._id);
        const nodeItems = itemsByNode[sub._id] || [];
        const hasChildren = nodeItems.length > 0;

        return (
            <div key={sub._id} className="flex flex-col border-b border-gray-100 last:border-0 pb-1">
                <div className={cn("flex items-center group py-2.5 px-4 transition-colors", isSelected && "bg-slate-50")}>
                    
                    <div className="flex items-center cursor-pointer pl-6" onClick={(e) => toggleSelection(sub._id, 'subcategories', e)}>
                        <div className={cn(
                            "w-[15px] h-[15px] rounded-[3px] border flex items-center justify-center mr-3 shrink-0 transition-colors",
                            isSelected ? "bg-slate-800 border-slate-800 text-white" : "border-slate-300 bg-white"
                        )}>
                            {isSelected && <Check className="w-3 h-3" strokeWidth={3} />}
                        </div>
                    </div>

                    <button onClick={(e) => hasChildren ? toggleExpand(sub._id, e) : null} className="w-5 h-5 flex items-center justify-center text-slate-400 hover:text-slate-600 mr-2">
                        {hasChildren ? (isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />) : <span className="w-4 h-4" />}
                    </button>
                    
                    <div className="flex-1 font-semibold text-[14px] text-slate-700 truncate">{sub.name}</div>
                    
                    <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity pr-2">
                        <CategoryFormPopover 
                            initialData={{ name: sub.name, image: sub.image }} 
                            onSubmit={(data) => updateCategory({ categoryId: sub._id, data })}
                        >
                            <button className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-slate-800 rounded-md hover:bg-slate-100 transition-colors">
                                <Edit2 className="w-3 h-3" />
                            </button>
                        </CategoryFormPopover>
                        <button 
                            onClick={(e) => {
                                e.stopPropagation();
                                setDeleteAlert({ isOpen: true, type: 'subcategories', id: sub._id, name: sub.name });
                            }}
                            className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-red-500 rounded-md hover:bg-red-50 transition-colors"
                            title="Delete Subcategory"
                        >
                            <Trash2 className="w-3.5 h-3.5" />
                        </button>
                    </div>
                </div>

                {isExpanded && nodeItems.length > 0 && (
                    <div className="flex flex-col gap-0.5 mt-1 mb-2">
                        {nodeItems.map(item => renderItemNode(item, 2))}
                    </div>
                )}
            </div>
        );
    };

    const renderCategoryNode = (cat) => {
        const isSelected = selectedSources.categories.includes(cat._id);
        const isExpanded = expandedNodes.has(cat._id);
        const subs = subCategoriesByParent[cat._id] || [];
        const nodeItems = itemsByNode[cat._id] || [];
        const hasChildren = subs.length > 0 || nodeItems.length > 0;

        return (
            <div key={cat._id} className="flex flex-col border border-gray-200 rounded-lg mb-3 bg-white overflow-hidden shadow-sm">
                {/* Category Header */}
                <div className={cn("flex items-center group py-3 px-4 transition-colors", isSelected && "bg-slate-50")}>
                    
                    <div className="flex items-center cursor-pointer" onClick={(e) => toggleSelection(cat._id, 'categories', e)}>
                        <div className={cn(
                            "w-[15px] h-[15px] rounded-[3px] border flex items-center justify-center mr-3 shrink-0 transition-colors",
                            isSelected ? "bg-slate-800 border-slate-800 text-white" : "border-slate-300 bg-white"
                        )}>
                            {isSelected && <Check className="w-3 h-3" strokeWidth={3} />}
                        </div>
                    </div>

                    <button onClick={(e) => hasChildren ? toggleExpand(cat._id, e) : null} className="w-5 h-5 flex items-center justify-center text-slate-400 hover:text-slate-600 mr-2">
                        {hasChildren ? (isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />) : <span className="w-4 h-4" />}
                    </button>
                    
                    <Layers className="w-4 h-4 text-slate-700 mr-2 shrink-0" strokeWidth={2.5} />
                    <div className="flex-1 font-bold text-[15px] text-slate-900 truncate">{cat.name}</div>

                    <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity">
                        <CategoryFormPopover onSubmit={(data) => addCategory({ ...data, parentCategory: cat._id })}>
                            <button className="w-7 h-7 flex items-center justify-center text-slate-400 hover:text-slate-800 rounded-md hover:bg-slate-100 transition-colors">
                                <Plus className="w-4 h-4" />
                            </button>
                        </CategoryFormPopover>
                        
                        <CategoryFormPopover 
                            initialData={{ name: cat.name, image: cat.image }} 
                            onSubmit={(data) => updateCategory({ categoryId: cat._id, data })}
                        >
                            <button className="w-7 h-7 flex items-center justify-center text-slate-400 hover:text-slate-800 rounded-md hover:bg-slate-100 transition-colors">
                                <Edit2 className="w-3.5 h-3.5" />
                            </button>
                        </CategoryFormPopover>
                        
                        <button 
                            onClick={(e) => {
                                e.stopPropagation();
                                setDeleteAlert({ isOpen: true, type: 'categories', id: cat._id, name: cat.name });
                            }}
                            className="w-7 h-7 flex items-center justify-center text-slate-400 hover:text-red-500 rounded-md hover:bg-red-50 transition-colors"
                            title="Delete Category"
                        >
                            <Trash2 className="w-3.5 h-3.5" />
                        </button>
                    </div>
                </div>

                {isExpanded && hasChildren && (
                    <div className="flex flex-col border-t border-gray-100 pt-1 pb-2">
                        {subs.map(renderSubCategoryNode)}
                        {nodeItems.length > 0 && (
                            <div className="flex flex-col border-b border-gray-100 last:border-0 pb-1">
                                <div className="flex items-center group py-2.5 px-4 transition-colors">
                                    <div className="flex items-center pl-6">
                                        <div className="w-[15px] h-[15px] mr-3 shrink-0" />
                                    </div>
                                    <div className="w-5 h-5 flex items-center justify-center text-slate-400 mr-2">
                                        <ChevronDown className="w-4 h-4" />
                                    </div>
                                    <div className="flex-1 font-semibold text-[14px] text-slate-500 italic truncate">Other Items</div>
                                </div>
                                <div className="flex flex-col gap-0.5 mt-1 mb-2">
                                    {nodeItems.map(item => renderItemNode(item, 2))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    };

    const totalSelectedCount = selectedSources.categories.length + selectedSources.subcategories.length + selectedSources.items.length;

    const getAlertTitle = () => {
        if (!deleteAlert.name) return "";
        return `Delete ${deleteAlert.name}?`;
    };

    const getAlertDescription = () => {
        if (deleteAlert.type === 'categories') {
            return `This will permanently delete the category "${deleteAlert.name}" and all of its subcategories and items. This action cannot be undone.`;
        }
        if (deleteAlert.type === 'subcategories') {
            return `This will permanently delete the subcategory "${deleteAlert.name}" and all items inside it. This action cannot be undone.`;
        }
        return `This will permanently delete the item "${deleteAlert.name}". This action cannot be undone.`;
    };

    return (
        <div className="w-1/2 h-full flex flex-col bg-white">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                <h3 className="font-bold text-[16px] text-slate-900">1. Select Sources</h3>
                <div className="flex items-center gap-3">
                    <CategoryFormPopover onSubmit={addCategory}>
                        <Button variant="outline" size="sm" className="h-8 px-3 rounded-md text-[13px] font-semibold text-slate-700 border-gray-200">
                            <Plus className="w-3.5 h-3.5 mr-1.5" /> Add Category
                        </Button>
                    </CategoryFormPopover>
                    <div className="bg-slate-100 text-slate-700 text-[12px] font-bold px-3 py-1.5 rounded-md">
                        {totalSelectedCount} Selected
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 select-none">
                {rootCategories.map(renderCategoryNode)}
                {rootCategories.length === 0 && (
                    <div className="text-center py-10 text-slate-400 text-[14px]">No categories found.</div>
                )}
            </div>

            <ConfirmDeleteAlert 
                isOpen={deleteAlert.isOpen}
                onClose={() => !isDeleting && setDeleteAlert({ isOpen: false, type: null, id: null, name: null })}
                onConfirm={confirmDelete}
                title={getAlertTitle()}
                description={getAlertDescription()}
                isDeleting={isDeleting}
            />
        </div>
    );
}
