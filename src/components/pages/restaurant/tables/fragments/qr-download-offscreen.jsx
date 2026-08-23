"use client";
import QRCodeLib from "qrcode";
import { getImageUrl } from "@/lib/utils";
import { Users, Hash } from "lucide-react";
import * as htmlToImage from "html-to-image";
import { useEffect, useRef, useState } from "react";
import { useRestaurant } from "@/store/hooks/useRestaurant";
import { buildQRUrl, QR_COLORS } from "../helpers/constants";

export default function QRDownloadOffscreen({ table, onComplete }) {
    const canvasRef = useRef(null);
    const cardRef = useRef(null);
    const [isReady, setIsReady] = useState(false);
    const [logoDataUrl, setLogoDataUrl] = useState(null);

    const { restaurants, restaurantId } = useRestaurant();
    const activeRestaurant = restaurants.find(r => r._id === restaurantId);
    const logoUrl = getImageUrl(activeRestaurant?.logo, false, "original");

    const qrUrl = table ? buildQRUrl(table.qrToken) : "";
    const displayLabel = table && table.zone && table.zone !== "General" ? table.zone : table?.label;

    useEffect(() => {
        if (!logoUrl) {
            setIsReady(true);
            return;
        }
        setIsReady(false);
        fetch(logoUrl)
            .then(r => r.blob())
            .then(blob => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setLogoDataUrl(reader.result);
                    setIsReady(true);
                };
                reader.readAsDataURL(blob);
            })
            .catch(err => {
                console.error("Failed to load logo", err);
                setIsReady(true);
            });
    }, [logoUrl]);

    useEffect(() => {
        if (!table || !isReady || !canvasRef.current) return;

        QRCodeLib.toCanvas(canvasRef.current, qrUrl, {
            width: 200,
            margin: 2,
            color: QR_COLORS,
            errorCorrectionLevel: "H",
        }).then(() => {
            setTimeout(() => {
                captureAndDownload();
            }, 100);
        }).catch(console.error);

    }, [table, isReady]);

    const captureAndDownload = async () => {
        if (!cardRef.current) return;
        try {
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
            if (onComplete) onComplete();
        }
    };

    if (!table) return null;

    return (
        <div className="fixed top-[-9999px] left-0 pointer-events-none opacity-0">
            <div ref={cardRef} className="w-72 rounded-2xl overflow-hidden border-2 border-orange-200 shadow-lg bg-white">
                <div className="bg-gradient-to-br from-orange-500 to-orange-600 px-5 py-4 text-center text-white">
                    <p className="text-[10px] font-bold uppercase tracking-widest opacity-80">Scan to Order</p>
                    <p className="text-3xl font-extrabold mt-0.5">Table {table.tableNumber}</p>
                    {displayLabel && <p className="text-sm font-semibold tracking-wide uppercase opacity-90 mt-0.5">{displayLabel}</p>}
                </div>
                <div className="bg-white p-5 flex justify-center relative">
                    <canvas ref={canvasRef} className="rounded-lg" />
                    {logoDataUrl && (
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center p-1.5 z-10">
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
        </div>
    );
}
