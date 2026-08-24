"use client";
import QRCodeLib from "qrcode";
import { useState } from "react";
import { getImageUrl } from "@/lib/utils";
import TableGrid from "./fragments/table-grid";
import TablePageHeader from "./fragments/header";
import TableFormSheet from "./fragments/table-form";
import { useRestaurant } from "@/store/hooks/useRestaurant";
import { buildQRUrl, QR_COLORS, QR_ERROR_CORRECTION } from "./helpers/constants";

const TablesManagement = () => {
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [editingTable, setEditingTable] = useState(null);

    const [filter, setFilter] = useState("all");

    const handleAddTable = () => {
        setEditingTable(null);
        setIsSheetOpen(true);
    };

    const handleEditTable = (table) => {
        setEditingTable(table);
        setIsSheetOpen(true);
    };

    const { restaurants, restaurantId } = useRestaurant();
    const activeRestaurant = restaurants?.find(r => r._id === restaurantId);

    const handleDownloadQR = async (table) => {
        try {
            const qrUrl = buildQRUrl(table.qrToken);
            const qrDataUrl = await QRCodeLib.toDataURL(qrUrl, {
                width: 600,
                margin: 1,
                color: QR_COLORS,
                errorCorrectionLevel: QR_ERROR_CORRECTION,
            });

            const canvas = document.createElement("canvas");
            canvas.width = 600;
            canvas.height = 780;
            const ctx = canvas.getContext("2d");

            ctx.fillStyle = "#ffffff";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            const grad = ctx.createLinearGradient(0, 0, canvas.width, 0);
            grad.addColorStop(0, "#ea580c");
            grad.addColorStop(1, "#f97316");
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, canvas.width, 160);

            ctx.fillStyle = "#ffffff";
            ctx.textAlign = "center";
            ctx.font = "bold 24px sans-serif";
            ctx.fillText("SCAN TO ORDER", canvas.width / 2, 60);

            ctx.font = "bold 52px sans-serif";
            ctx.fillText(`Table ${table.tableNumber}`, canvas.width / 2, 130);

            const img = new window.Image();
            img.src = qrDataUrl;
            await new Promise((resolve) => { img.onload = resolve; });
            ctx.drawImage(img, 75, 180, 450, 450);

            const logoUrl = activeRestaurant?.logo ? getImageUrl(activeRestaurant.logo, false, "original") : null;
            if (logoUrl) {
                try {
                    const res = await fetch(logoUrl);
                    const blob = await res.blob();
                    const logoDataUrl = await new Promise((resolve) => {
                        const reader = new FileReader();
                        reader.onloadend = () => resolve(reader.result);
                        reader.readAsDataURL(blob);
                    });
                    const logoImg = new window.Image();
                    logoImg.src = logoDataUrl;
                    await new Promise((resolve) => { logoImg.onload = resolve; });
                    ctx.fillStyle = "#ffffff";
                    ctx.fillRect(250, 355, 100, 100);
                    ctx.drawImage(logoImg, 260, 365, 80, 80);
                } catch (e) {
                    console.error("Failed to load logo", e);
                }
            }

            ctx.fillStyle = "#fff7ed";
            ctx.fillRect(0, 680, canvas.width, 100);

            ctx.fillStyle = "#ea580c";
            ctx.font = "bold 26px sans-serif";
            ctx.fillText("📱 Scan & Order Instantly", canvas.width / 2, 725);
            
            ctx.fillStyle = "#9a3412";
            ctx.font = "normal 16px sans-serif";
            ctx.globalAlpha = 0.8;
            ctx.fillText(`Capacity: ${table.capacity} seats`, canvas.width / 2, 755);

            const a = document.createElement("a");
            a.href = canvas.toDataURL("image/png");
            a.download = `table-${table.tableNumber}-qr.png`;
            a.click();
        } catch (err) {
            console.error("Failed to generate QR code", err);
        }
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
                    onDownloadQR={handleDownloadQR}
                />
            </div>

            <TableFormSheet
                isOpen={isSheetOpen}
                onClose={() => setIsSheetOpen(false)}
                table={editingTable}
            />


        </div>
    );
};

export default TablesManagement;
