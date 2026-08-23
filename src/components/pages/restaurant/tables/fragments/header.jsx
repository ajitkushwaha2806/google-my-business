"use client";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TABLE_STATUS_FILTERS } from "../helpers/constants";

const TablePageHeader = ({ onAddTable, filter, setFilter }) => {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
                        Table Management
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                        Create tables, generate QR codes and manage dine-in seating
                    </p>
                </div>
                <Button
                    onClick={onAddTable}
                    className="bg-orange-600 hover:bg-orange-700 text-white h-10 px-4 gap-2 shadow-sm font-medium"
                >
                    <Plus size={16} />
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

