"use client";
import { useState } from "react";
import TableGrid from "./fragments/table-grid";
import TablePageHeader from "./fragments/header";
import TableFormSheet from "./fragments/table-form";
import QRPrintModal from "./fragments/qr-print-modal";

const TablesManagement = () => {
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [editingTable, setEditingTable] = useState(null);
    const [qrTable, setQrTable] = useState(null);
    const [filter, setFilter] = useState("all");

    const handleAddTable = () => {
        setEditingTable(null);
        setIsSheetOpen(true);
    };

    const handleEditTable = (table) => {
        setEditingTable(table);
        setIsSheetOpen(true);
    };

    const handleViewQR = (table) => {
        setQrTable(table);
    };

    return (
        <div className="flex flex-col bg-white m-4 rounded-md dark:bg-zinc-950 overflow-y-auto">
            <div className="mx-auto w-full p-4 md:p-6 space-y-6">
                <TablePageHeader
                    onAddTable={handleAddTable}
                    filter={filter}
                    setFilter={setFilter}
                />
                <TableGrid
                    filter={filter}
                    onEditTable={handleEditTable}
                    onViewQR={handleViewQR}
                />
            </div>

            <TableFormSheet
                isOpen={isSheetOpen}
                onClose={() => setIsSheetOpen(false)}
                table={editingTable}
            />

            {qrTable && (
                <QRPrintModal
                    table={qrTable}
                    onClose={() => setQrTable(null)}
                />
            )}
        </div>
    );
};

export default TablesManagement;
