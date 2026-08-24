"use client";
import { useState } from "react";
import { StatusBadge } from "./table-row";
import { buildQRUrl } from "../helpers/constants";
import { Pencil, Trash2, Users, MapPin, Download, Link, Copy, Check } from "lucide-react";

export const TableCard = ({ table, index, onEditTable, onDownloadQR, onDeleteTable }) => {
    const [copied, setCopied] = useState(false);
    const qrUrl = buildQRUrl(table.qrToken);

    const handleCopy = () => {
        navigator.clipboard.writeText(qrUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="bg-white dark:bg-zinc-950/50 border border-gray-100 dark:border-zinc-800/80 rounded-md p-2 flex flex-col gap-3 shadow-sm hover:shadow-md transition-shadow">
        
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
            <Link size={14} className="text-gray-400 dark:text-zinc-500 shrink-0" />
            <span className="text-xs font-mono text-gray-500 dark:text-gray-400 truncate flex-1">
                {qrUrl}
            </span>
            <button 
                onClick={handleCopy}
                className="p-1.5 rounded-md text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-200 dark:hover:bg-zinc-800 transition-colors"
                title="Copy URL"
            >
                {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
            </button>
        </div>

        <div className="flex items-center gap-2 pt-1 mt-1 border-t border-gray-50 dark:border-zinc-900">
            <button
                onClick={() => onDownloadQR(table)}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-sm font-bold bg-orange-500 text-white hover:from-orange-600 hover:to-orange-700 shadow-md hover:shadow-lg transition-all active:scale-[0.98]"
            >
                <Download size={16} />
                Download QR
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
};
