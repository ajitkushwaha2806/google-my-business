"use client";
import { Search, X } from "lucide-react";
import { ORDER_TAB_FILTERS } from "../helpers/constants";

const OrderPageHeader = ({ filter, setFilter, searchQuery, setSearchQuery, onSearch }) => {
    return (
        <div className="space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
                        Orders
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                        Manage dine-in, takeaway, and online orders
                    </p>
                </div>

                <div className="relative max-w-sm w-full md:w-72">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search size={16} className="text-gray-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search by ID, name, or phone..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && onSearch) {
                                onSearch();
                            }
                        }}
                        className="block w-full pl-10 pr-10 py-2 border border-gray-200 dark:border-zinc-800 rounded-lg leading-5 bg-gray-50 dark:bg-zinc-900/50 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:bg-white dark:focus:bg-zinc-900 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-sm"
                    />
                    {searchQuery && (
                        <button
                            onClick={() => {
                                setSearchQuery("");
                                if (onSearch) onSearch("");
                            }}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                        >
                            <X size={16} />
                        </button>
                    )}
                </div>
            </div>

            <div className="flex items-center gap-1 border-b border-gray-200 dark:border-zinc-800 w-full overflow-x-auto no-scrollbar pt-2">
                {ORDER_TAB_FILTERS.map((f) => (
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

export default OrderPageHeader;
