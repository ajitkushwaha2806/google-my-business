"use client";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TABLE_STATUS_FILTERS } from "../helpers/constants";

const TablePageHeader = ({ onAddTable, filter, setFilter }) => {
    return (
        <div className="space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2">
                <Button
                    onClick={onAddTable}
                    className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white h-12 md:h-11 px-6 gap-2.5 shadow-md hover:shadow-lg font-bold text-[15px] rounded-xl w-full md:w-auto transition-all active:scale-[0.98]"
                >
                    <Plus size={18} strokeWidth={3} />
                    Add Table
                </Button>
            </div>

            <div className="flex items-center gap-1 border-b border-gray-200 dark:border-zinc-800 w-full overflow-x-auto no-scrollbar pt-2">
                {TABLE_STATUS_FILTERS.map((f) => (
                    <button
                        key={f.key}
                        onClick={() => setFilter(f.key)}
                        className={`relative px-4 py-2.5 text-[13px] font-semibold whitespace-nowrap transition-colors duration-200
                            ${filter === f.key
                                ? "text-orange-600 dark:text-orange-500"
                                : "text-gray-500 dark:text-zinc-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-50/50 dark:hover:bg-zinc-800/30 rounded-t-lg"
                            }`}
                    >
                        {f.label}
                        {filter === f.key && (
                            <div className="absolute bottom-[-1px] left-0 w-full h-[2px] bg-orange-600 dark:bg-orange-500 rounded-t-full" />
                        )}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default TablePageHeader;

