"use client";
import QRCodeLib from "qrcode";
import { getImageUrl } from "@/lib/utils";
import * as htmlToImage from "html-to-image";
import { useEffect, useRef, useState } from "react";
import { useRestaurant } from "@/store/hooks/useRestaurant";
import { X, Printer, Download, QrCode, Users, Hash } from "lucide-react";
import { buildQRUrl, QR_PREVIEW_SIZE, QR_DOWNLOAD_SIZE, QR_ERROR_CORRECTION, QR_COLORS } from "../helpers/constants";

export default function QRPrintModal({ table, onClose }) {
    const canvasRef = useRef(null);
    const cardRef = useRef(null);
    const [qrDataUrl, setQrDataUrl] = useState("");
    const [isDownloading, setIsDownloading] = useState(false);
    const qrUrl = buildQRUrl(table.qrToken);

    const { restaurants, restaurantId } = useRestaurant();
    const activeRestaurant = restaurants.find(r => r._id === restaurantId);
    
    const logoUrl = getImageUrl(activeRestaurant?.logo, false, "original");
    const [logoDataUrl, setLogoDataUrl] = useState(null);

    useEffect(() => {
        if (!logoUrl) return;
        fetch(logoUrl)
            .then(r => r.blob())
            .then(blob => {
                const reader = new FileReader();
                reader.onloadend = () => setLogoDataUrl(reader.result);
                reader.readAsDataURL(blob);
            })
            .catch(err => console.error("Failed to load logo", err));
    }, [logoUrl]);

    useEffect(() => {
        if (!qrUrl) return;
        QRCodeLib.toCanvas(canvasRef.current, qrUrl, {
            width: QR_PREVIEW_SIZE,
            margin: 2,
            color: QR_COLORS,
            errorCorrectionLevel: QR_ERROR_CORRECTION,
        }).catch(console.error);

        QRCodeLib.toDataURL(qrUrl, {
            width: QR_DOWNLOAD_SIZE,
            margin: 2,
            color: QR_COLORS,
            errorCorrectionLevel: QR_ERROR_CORRECTION,
        }).then(setQrDataUrl);
    }, [qrUrl]);

    const handleDownload = async () => {
        if (!cardRef.current) return;
        try {
            setIsDownloading(true);
            const dataUrl = await htmlToImage.toPng(cardRef.current, {
                quality: 1,
                pixelRatio: 3,
            });
            const a = document.createElement("a");
            a.href = dataUrl;
            a.download = `table-${table.tableNumber}-qr.png`;
            a.click();
        } catch (error) {
            console.error("Failed to generate image", error);
        } finally {
            setIsDownloading(false);
        }
    };

    const displayLabel = table.zone && table.zone !== "General" ? table.zone : table.label;

    const handlePrint = () => {
        const printWindow = window.open("", "_blank");
        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Table ${table.tableNumber} QR Code</title>
                <style>
                    * { margin: 0; padding: 0; box-sizing: border-box; }
                    body {
                        font-family: 'Segoe UI', Arial, sans-serif;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        min-height: 100vh;
                        background: #fff;
                    }
                    .card {
                        width: 320px;
                        border: 2px solid #f97316;
                        border-radius: 20px;
                        overflow: hidden;
                        box-shadow: 0 4px 24px rgba(249,115,22,0.15);
                        text-align: center;
                    }
                    .card-header {
                        background: linear-gradient(135deg, #ea580c, #f97316);
                        padding: 20px 24px 16px;
                        color: white;
                    }
                    .restaurant-name {
                        font-size: 11px;
                        font-weight: 600;
                        letter-spacing: 2px;
                        text-transform: uppercase;
                        opacity: 0.85;
                        margin-bottom: 4px;
                    }
                    .table-number {
                        font-size: 36px;
                        font-weight: 800;
                        letter-spacing: -1px;
                    }
                    .table-label {
                        font-size: 13px;
                        opacity: 0.85;
                        margin-top: 2px;
                    }
                    .qr-wrapper {
                        background: white;
                        padding: 24px;
                        display: flex;
                        justify-content: center;
                        position: relative;
                    }
                    .qr-wrapper img.qr-image {
                        width: 200px;
                        height: 200px;
                        border-radius: 8px;
                    }
                    .qr-logo {
                        position: absolute;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%);
                        width: 48px;
                        height: 48px;
                        background: white;
                        border-radius: 10px;
                        padding: 4px;
                        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                        border: 1px solid #f3f4f6;
                    }
                    .qr-logo img {
                        width: 100%;
                        height: 100%;
                        object-fit: contain;
                    }
                    .card-footer {
                        padding: 12px 24px 20px;
                        background: #fff7ed;
                        border-top: 1px solid #fed7aa;
                    }
                    .scan-text {
                        font-size: 13px;
                        font-weight: 600;
                        color: #ea580c;
                        margin-bottom: 2px;
                    }
                    .subtitle {
                        font-size: 11px;
                        color: #9a3412;
                        opacity: 0.8;
                    }
                    .seats {
                        margin-top: 8px;
                        font-size: 11px;
                        color: #9a3412;
                        opacity: 0.65;
                    }
                    @media print {
                        body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
                    }
                </style>
            </head>
            <body>
                <div class="card">
                    <div class="card-header">
                        <div class="restaurant-name">Scan to Order</div>
                        <div class="table-number">Table ${table.tableNumber}</div>
                        ${table.label ? `<div class="table-label">${table.label}</div>` : ""}
                    </div>
                    <div class="qr-wrapper">
                        <img class="qr-image" src="${qrDataUrl}" alt="QR Code" />
                        ${logoDataUrl ? `
                        <div class="qr-logo">
                            <img src="${logoDataUrl}" alt="Logo" />
                        </div>
                        ` : ""}
                    </div>
                    <div class="card-footer">
                        <div class="scan-text">📱 Scan & Order Instantly</div>
                        <div class="subtitle">Point your camera at the QR code</div>
                        <div class="seats">Capacity: ${table.capacity} seats</div>
                    </div>
                </div>
                <script>window.onload = () => window.print();<\/script>
            </body>
            </html>
        `);
        printWindow.document.close();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-zinc-700 w-full max-w-sm overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-zinc-800">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-950 flex items-center justify-center">
                            <QrCode size={16} className="text-orange-600" />
                        </div>
                        <div>
                            <p className="font-bold text-gray-900 dark:text-gray-100 text-sm">QR Code</p>
                            <p className="text-xs text-gray-500">Table {table.tableNumber}</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
                    >
                        <X size={16} />
                    </button>
                </div>

                <div className="p-6 flex flex-col items-center gap-4">
                    <div ref={cardRef} className="w-72 rounded-2xl overflow-hidden border-2 border-orange-200 shadow-lg bg-white">
                        <div className="bg-gradient-to-br from-orange-500 to-orange-600 px-5 py-4 text-center text-white">
                            <p className="text-[10px] font-bold uppercase tracking-widest opacity-80">Scan to Order</p>
                            <p className="text-3xl font-extrabold mt-0.5">Table {table.tableNumber}</p>
                            {displayLabel && <p className="text-sm font-semibold tracking-wide uppercase opacity-90 mt-0.5">{displayLabel}</p>}
                        </div>
                        <div className="bg-white p-5 flex justify-center relative">
                            <canvas ref={canvasRef} className="rounded-lg" />
                            {logoDataUrl && (
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center p-1.5 z-10 pointer-events-none">
                                    <img src={logoDataUrl} alt="Logo" className="w-full h-full object-contain" />
                                </div>
                            )}
                        </div>
                        <div className="bg-orange-50 px-4 py-3 text-center border-t border-orange-100">
                            <p className="text-xs font-bold text-orange-700">📱 Scan &amp; Order Instantly</p>
                            <div className="flex items-center justify-center gap-3 mt-1 text-[11px] text-orange-500">
                                <span className="flex items-center gap-1"><Users size={10} /> {table.capacity} seats</span>
                                <span className="opacity-40">|</span>
                                <span className="flex items-center gap-1 font-mono"><Hash size={10} /> {table.qrToken?.slice(0, 6)}…</span>
                            </div>
                        </div>
                    </div>

                    <div className="w-full px-3 py-2 bg-gray-50 dark:bg-zinc-800 rounded-lg border border-gray-200 dark:border-zinc-700">
                        <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide mb-0.5">QR URL</p>
                        <p className="text-xs text-gray-600 dark:text-gray-300 font-mono break-all leading-relaxed">{qrUrl}</p>
                    </div>
                </div>

                <div className="px-5 pb-5 flex gap-3">
                    <button
                        onClick={handleDownload}
                        disabled={isDownloading || !qrDataUrl}
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors disabled:opacity-50"
                    >
                        {isDownloading ? <span className="w-4 h-4 border-2 border-gray-300 border-t-gray-700 rounded-full animate-spin" /> : <Download size={15} />}
                        {isDownloading ? "Downloading..." : "Download"}
                    </button>
                    <button
                        onClick={handlePrint}
                        disabled={!qrDataUrl}
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-sm font-semibold shadow-sm transition-colors disabled:opacity-50"
                    >
                        <Printer size={15} />
                        Print
                    </button>
                </div>
            </div>
        </div>
    );
}
