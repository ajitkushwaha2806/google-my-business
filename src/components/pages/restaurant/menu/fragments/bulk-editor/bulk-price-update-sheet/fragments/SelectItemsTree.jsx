import { useState } from "react";
import { cn } from "@/lib/utils";
import { ChevronRight, ChevronDown } from "lucide-react";
import { TreeCheckbox } from "./TreeCheckbox";
import { groupItemsByCategory, getCategoryName } from "../../helper/utils";

export function SelectItemsTree({ 
  items = [], 
  categories = [],
  selectedCats,
  setSelectedCats,
  selectedItems,
  setSelectedItems
}) {
  const [expandedCats, setExpandedCats] = useState({});

  const toggleCategory = (catId) => {
    setExpandedCats(prev => ({ ...prev, [catId]: !prev[catId] }));
  };

  const itemsByCategory = groupItemsByCategory(items);

  const toggleCatSelect = (catId) => {
    const isSelected = !selectedCats[catId];
    setSelectedCats(prev => ({ ...prev, [catId]: isSelected }));
    
    const catItems = itemsByCategory[catId] || [];
    setSelectedItems(prev => {
      const updated = { ...prev };
      catItems.forEach(item => {
        updated[item.id] = isSelected;
      });
      return updated;
    });
  };

  const toggleItemSelect = (itemId) => setSelectedItems(prev => ({ ...prev, [itemId]: !prev[itemId] }));

  return (
    <div className="flex flex-col gap-2 mt-1 animate-in fade-in slide-in-from-top-2 duration-300">
      <label className="text-[13px] font-bold text-slate-700">Select Items</label>
      <div className="border border-slate-200 rounded-xl bg-white shadow-sm overflow-hidden p-2 py-3">
        {Object.entries(itemsByCategory).map(([catId, catItems]) => {
          const isExpanded = expandedCats[catId];
          const isCatSelected = selectedCats[catId];
          return (
            <div key={catId} className="flex flex-col">
              <div 
                className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer select-none" 
                onClick={() => toggleCategory(catId)}
              >
                <button className="flex items-center justify-center text-slate-400 hover:text-slate-600 shrink-0 w-5 h-5">
                  {isExpanded ? <ChevronDown className="w-4 h-4" strokeWidth={2.5} /> : <ChevronRight className="w-4 h-4" strokeWidth={2.5} />}
                </button>
                <TreeCheckbox checked={isCatSelected} onChange={() => toggleCatSelect(catId)} />
                <span className="font-bold text-[15px] text-[#1e293b] tracking-wide">{getCategoryName(catId, categories)}</span>
              </div>
              
              {isExpanded && (
                <div className="ml-5 border-l-2 border-slate-100 pl-4 py-1.5 flex flex-col gap-1">
                  {catItems.map((item) => {
                    const isItemSelected = isCatSelected || selectedItems[item.id];
                    return (
                      <div key={item.id} className="flex flex-col">
                        <div 
                          className={cn(
                            "flex items-center gap-3 p-2 rounded-lg transition-colors cursor-pointer select-none",
                            isItemSelected ? "bg-slate-50" : "hover:bg-slate-50"
                          )}
                          onClick={() => toggleItemSelect(item.id)}
                        >
                          <TreeCheckbox checked={isItemSelected} onChange={() => toggleItemSelect(item.id)} />
                          <span className="font-semibold text-[14.5px] text-[#334155]">{item.name}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
