"use client";
import { QrCode, Pencil, Trash2, Users, Hash, MapPin } from "lucide-react";
import { TABLE_STATUS_CONFIG } from "../helpers/constants";

export const StatusBadge = ({ status }) => {
    const cfg = TABLE_STATUS_CONFIG[status] || TABLE_STATUS_CONFIG.unavailable;
    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${cfg.badge}`}>
            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${cfg.dot}`} />
            {cfg.label}
        </span>
    );
};

export const TableRow = ({ table, index, onEditTable, onViewQR, onDeleteTable }) => (
    <tr className="group border-b border-gray-100 dark:border-zinc-800 hover:bg-orange-50/40 dark:hover:bg-zinc-800/60 transition-colors duration-100">
        <td className="px-4 py-3.5 text-xs text-gray-400 dark:text-zinc-500 font-mono w-10">
            {String(index + 1).padStart(2, "0")}
        </td>

        <td className="px-4 py-3.5">
            <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-orange-50 dark:bg-orange-950 border border-orange-100 dark:border-orange-900 flex items-center justify-center shrink-0">
                    <span className="text-orange-600 font-bold text-sm">{table.tableNumber}</span>
                </div>
                <span className="font-semibold text-gray-900 dark:text-gray-100 text-sm">
                    {table.label || `Table ${table.tableNumber}`}
                </span>
            </div>
        </td>

        <td className="px-4 py-3.5">
            <div className="flex items-center gap-1.5">
                <MapPin size={11} className="text-gray-300 dark:text-zinc-600 shrink-0" />
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400">{table.zone || "General"}</span>
            </div>
        </td>

        <td className="px-4 py-3.5">
            <div className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400">
                <Users size={13} className="text-gray-400" />
                <span>{table.capacity} seats</span>
            </div>
        </td>

        <td className="px-4 py-3.5">
            <StatusBadge status={table.status} />
        </td>

        <td className="px-4 py-3.5">
            <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full
                ${table.isActive
                    ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400"
                    : "bg-gray-100 text-gray-500 dark:bg-zinc-800 dark:text-zinc-500"
                }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${table.isActive ? "bg-emerald-500" : "bg-gray-400"}`} />
                {table.isActive ? "Active" : "Inactive"}
            </span>
        </td>

        <td className="px-4 py-3.5">
            <div className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-zinc-500 font-mono">
                <Hash size={11} />
                <span>{table.qrToken?.slice(0, 10)}…</span>
            </div>
        </td>

        <td className="px-4 py-3.5">
            <div className="flex items-center gap-1">
                <button
                    onClick={() => onViewQR(table)}
                    title="View QR Code"
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-orange-50 dark:bg-orange-950 text-orange-700 dark:text-orange-400 hover:bg-orange-100 dark:hover:bg-orange-900 border border-orange-200 dark:border-orange-800 transition-colors"
                >
                    <QrCode size={13} />
                    QR
                </button>
                <button
                    onClick={() => onEditTable(table)}
                    title="Edit table"
                    className="p-1.5 rounded-lg text-gray-500 dark:text-gray-400 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-zinc-700 border border-transparent hover:border-gray-200 dark:hover:border-zinc-600 transition-colors"
                >
                    <Pencil size={13} />
                </button>
                <button
                    onClick={() => onDeleteTable(table._id)}
                    title="Delete table"
                    className="p-1.5 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950 border border-transparent hover:border-red-200 dark:hover:border-red-800 transition-colors"
                >
                    <Trash2 size={13} />
                </button>
            </div>
        </td>
    </tr>
);
