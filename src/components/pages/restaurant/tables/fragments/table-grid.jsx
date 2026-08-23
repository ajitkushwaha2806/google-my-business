"use client";
import { useState } from "react";
import Loader from "@/components/global/loader";
import { useTable } from "@/store/hooks/useTable";
import { TABLE_STATUS_CONFIG } from "../helpers/constants";
import { useRestaurant } from "@/store/hooks/useRestaurant"
import { ConfirmDeleteAlert } from "@/components/ui/confirm-delete-alert";
import { QrCode, Pencil, Trash2, Users, Hash, TableProperties, MapPin } from "lucide-react";

const StatusBadge = ({ status }) => {
    const cfg = TABLE_STATUS_CONFIG[status] || TABLE_STATUS_CONFIG.unavailable;
    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${cfg.badge}`}>
            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${cfg.dot}`} />
            {cfg.label}
        </span>
    );
};

const TableRow = ({ table, index, onEditTable, onViewQR, onDeleteTable }) => (
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

const EmptyState = ({ filter }) => (
    <tr>
        <td colSpan={7}>
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-14 h-14 rounded-2xl bg-orange-50 dark:bg-orange-950 flex items-center justify-center mb-3 border border-orange-100 dark:border-orange-900">
                    <TableProperties size={24} className="text-orange-500" />
                </div>
                <p className="text-gray-700 dark:text-gray-300 font-semibold">No tables found</p>
                <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">
                    {filter === "all"
                        ? "Add your first table to get started."
                        : `No tables with status "${filter}".`}
                </p>
            </div>
        </td>
    </tr>
);

const COLUMNS = [
    { label: "#",        width: "w-10" },
    { label: "Table",    width: "" },
    { label: "Zone",     width: "w-28" },
    { label: "Capacity", width: "w-28" },
    { label: "Status",   width: "w-36" },
    { label: "Active",   width: "w-24" },
    { label: "QR Token", width: "w-40" },
    { label: "Actions",  width: "w-36" },
];

const TableGrid = ({ filter, onEditTable, onViewQR }) => {
    const { restaurantId } = useRestaurant();
    const { tables, isLoading, deleteTable, isDeleting } = useTable(restaurantId);
    
    const [tableToDelete, setTableToDelete] = useState(null);

    const filtered = filter === "all" ? tables : tables.filter((t) => t.status === filter);

    const handleDeleteClick = (tableId) => {
        setTableToDelete(tableId);
    };

    const handleConfirmDelete = () => {
        if (!tableToDelete) return;
        deleteTable(tableToDelete, {
            onSuccess: () => setTableToDelete(null),
            onError: () => setTableToDelete(null) 
        });
    };

    if (isLoading) return <Loader />;

    return (
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100 dark:border-zinc-800 bg-gray-50/70 dark:bg-zinc-800/50">
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    {filtered.length} {filtered.length === 1 ? "Table" : "Tables"}
                    {filter !== "all" && <span className="ml-1 text-orange-500">· {filter}</span>}
                </p>
                <div className="flex items-center gap-4 text-[11px] text-gray-400 dark:text-zinc-500">
                    {Object.entries(TABLE_STATUS_CONFIG).map(([key, cfg]) => {
                        const count = tables.filter((t) => t.status === key).length;
                        if (!count) return null;
                        return (
                            <span key={key} className="flex items-center gap-1">
                                <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                                {count} {cfg.label}
                            </span>
                        );
                    })}
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-gray-100 dark:border-zinc-800">
                            {COLUMNS.map((col) => (
                                <th
                                    key={col.label}
                                    className={`px-4 py-3 text-[11px] font-semibold text-gray-400 dark:text-zinc-500 uppercase tracking-wider ${col.width}`}
                                >
                                    {col.label}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {!filtered.length ? (
                            <EmptyState filter={filter} />
                        ) : (
                            filtered.map((table, i) => (
                                <TableRow
                                    key={table._id}
                                    index={i}
                                    table={table}
                                    onEditTable={onEditTable}
                                    onViewQR={onViewQR}
                                    onDeleteTable={handleDeleteClick}
                                />
                            ))
                        )}
                    </tbody>
                </table>
            </div>
            
            {filtered.length > 0 && (
                <div className="px-5 py-3 border-t border-gray-100 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-800/30">
                    <p className="text-[11px] text-gray-400 dark:text-zinc-500">
                        Showing <span className="font-semibold text-gray-600 dark:text-gray-300">{filtered.length}</span> of{" "}
                        <span className="font-semibold text-gray-600 dark:text-gray-300">{tables.length}</span> tables
                    </p>
                </div>
            )}
            
            <ConfirmDeleteAlert
                isOpen={!!tableToDelete}
                onClose={() => setTableToDelete(null)}
                onConfirm={handleConfirmDelete}
                isDeleting={isDeleting}
                title="Delete Table?"
                description="Are you sure you want to delete this table? This action cannot be undone."
            />
        </div>
    );
};

export default TableGrid;
