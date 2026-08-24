"use client";
import { useState } from "react";
import { TableRow } from "./table-row";
import { TableCard } from "./table-card";
import { TableProperties } from "lucide-react";
import Loader from "@/components/global/loader";
import { useTable } from "@/store/hooks/useTable";
import { TABLE_STATUS_CONFIG } from "../helpers/constants";
import { useRestaurant } from "@/store/hooks/useRestaurant"
import { ConfirmDeleteAlert } from "@/components/ui/confirm-delete-alert";

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

const TableGrid = ({ filter, onEditTable, onDownloadQR }) => {
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
        <div className="flex flex-col gap-4 md:gap-0 md:bg-white md:dark:bg-zinc-900 md:rounded-2xl md:border md:border-gray-200 md:dark:border-zinc-800 md:shadow-sm md:overflow-hidden">
            <div className="flex items-center justify-between px-1 md:px-5 py-3.5 md:border-b md:border-gray-100 md:dark:border-zinc-800 md:bg-gray-50/70 md:dark:bg-zinc-800/50">
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

            <div className="hidden md:block overflow-x-auto">
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
                                    onDownloadQR={onDownloadQR}
                                    onDeleteTable={handleDeleteClick}
                                />
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <div className="flex flex-col gap-4 md:hidden">
                {!filtered.length ? (
                    <div className="flex flex-col items-center justify-center py-10 text-center">
                        <div className="w-12 h-12 rounded-2xl bg-orange-50 dark:bg-orange-950 flex items-center justify-center mb-3 border border-orange-100 dark:border-orange-900">
                            <TableProperties size={20} className="text-orange-500" />
                        </div>
                        <p className="text-gray-700 dark:text-gray-300 font-semibold text-sm">No tables found</p>
                    </div>
                ) : (
                    filtered.map((table, i) => (
                        <TableCard
                            key={table._id}
                            index={i}
                            table={table}
                            onEditTable={onEditTable}
                            onDownloadQR={onDownloadQR}
                            onDeleteTable={handleDeleteClick}
                        />
                    ))
                )}
            </div>
            
            {filtered.length > 0 && (
                <div className="px-1 md:px-5 py-3 md:border-t md:border-gray-100 md:dark:border-zinc-800 md:bg-gray-50/50 md:dark:bg-zinc-800/30">
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
