"use client";
import { QrCode, Pencil, Trash2, Users, MapPin, Hash } from "lucide-react";
import { StatusBadge } from "./table-row";

export const TableCard = ({ table, index, onEditTable, onViewQR, onDeleteTable }) => (
    <div className="bg-white dark:bg-zinc-950/50 border border-gray-100 dark:border-zinc-800/80 rounded-xl p-4 flex flex-col gap-3 shadow-sm hover:shadow-md transition-shadow">
        
        <div className="flex items-center justify-between border-b border-gray-50 dark:border-zinc-900 pb-3">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-950 border border-orange-100 dark:border-orange-900 flex items-center justify-center shrink-0">
                    <span className="text-orange-600 font-bold">{table.tableNumber}</span>
                </div>
                <div>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                        {table.label || `Table ${table.tableNumber}`}
                    </h3>
                    <div className="flex items-center gap-1.5 mt-0.5">
                        <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded-full
                            ${table.isActive
                                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400"
                                : "bg-gray-100 text-gray-500 dark:bg-zinc-800 dark:text-zinc-500"
                            }`}>
                            <span className={`w-1 h-1 rounded-full ${table.isActive ? "bg-emerald-500" : "bg-gray-400"}`} />
                            {table.isActive ? "Active" : "Inactive"}
                        </span>
                    </div>
                </div>
            </div>
            <StatusBadge status={table.status} />
        </div>

        <div className="grid grid-cols-2 gap-3 py-1">
            <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-gray-50 dark:bg-zinc-900 flex items-center justify-center shrink-0">
                    <MapPin size={14} className="text-gray-400 dark:text-zinc-500" />
                </div>
                <div className="flex flex-col">
                    <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">Zone</span>
                    <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">{table.zone || "General"}</span>
                </div>
            </div>

            <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-gray-50 dark:bg-zinc-900 flex items-center justify-center shrink-0">
                    <Users size={14} className="text-gray-400 dark:text-zinc-500" />
                </div>
                <div className="flex flex-col">
                    <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">Capacity</span>
                    <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">{table.capacity} seats</span>
                </div>
            </div>
        </div>

        <div className="flex items-center gap-2 bg-gray-50 dark:bg-zinc-900/50 rounded-lg px-3 py-2">
            <Hash size={14} className="text-gray-400 dark:text-zinc-500 shrink-0" />
            <span className="text-xs font-mono text-gray-500 dark:text-gray-400 truncate">
                Token: {table.qrToken?.slice(0, 15)}…
            </span>
        </div>

        <div className="flex items-center gap-2 pt-1 mt-1 border-t border-gray-50 dark:border-zinc-900">
            <button
                onClick={() => onViewQR(table)}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium bg-orange-50 dark:bg-orange-950 text-orange-700 dark:text-orange-400 hover:bg-orange-100 dark:hover:bg-orange-900 transition-colors"
            >
                <QrCode size={16} />
                View QR
            </button>
            <button
                onClick={() => onEditTable(table)}
                className="p-2 rounded-lg bg-gray-50 dark:bg-zinc-900 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
            >
                <Pencil size={18} />
            </button>
            <button
                onClick={() => onDeleteTable(table._id)}
                className="p-2 rounded-lg bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors"
            >
                <Trash2 size={18} />
            </button>
        </div>

    </div>
);
