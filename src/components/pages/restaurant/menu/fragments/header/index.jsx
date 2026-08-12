"use client";
import { useState } from "react";
import { MenuService } from "@/services/frontend/menu";
import { useItem } from "@/store/hooks/useItem";
import { Button } from "@/components/ui/button";
import { DownloadCloud, Loader2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import useNotification from "@/store/hooks/useNotification";
import { useRestaurant } from "@/store/hooks/useRestaurant";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export default function MenuHeader() {
    const { restaurantId } = useRestaurant();
    const { items, isLoading: itemsLoading } = useItem(restaurantId, {});
    
    const notification = useNotification();
    const queryClient = useQueryClient();

    const [isImporting, setIsImporting] = useState(false);
    const [popoverOpen, setPopoverOpen] = useState(false);
    const [zomatoUrl, setZomatoUrl] = useState("");

    const handleZomatoImport = async () => {
        if (!zomatoUrl.trim()) {
            notification.error("Please enter a Zomato menu URL");
            return;
        }

        setIsImporting(true);
        try {
            const data = await MenuService.importZomato(restaurantId, zomatoUrl);
            if (data.success) {
                notification.success(`Successfully imported ${data.total_items || data.stats?.itemsImported || 0} items!`);
                setPopoverOpen(false);
                setZomatoUrl("");
                queryClient.invalidateQueries({ queryKey: ["items", restaurantId] });
                queryClient.invalidateQueries({ queryKey: ["categories", restaurantId] });
            } else {
                notification.error(data.message || "Failed to import Zomato menu");
            }
        } catch (e) {
            notification.error(e.response?.data?.message || e.message || "Failed to import Zomato menu");
        } finally {
            setIsImporting(false);
        }
    };

    const total = items?.length || 0;
    const media = items?.filter(item => item?.image || (item?.media && item?.media.length > 0))?.length || 0;
    const noMedia = total - media;

    return (
        <div className="flex items-center justify-between px-6 py-4 border-b bg-white z-30">
            <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 bg-gray-50/80 border border-gray-100 px-3 py-1.5 rounded-md text-[13px] font-semibold text-gray-700 shadow-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                    Total: {itemsLoading ? <Loader2 className="h-3 w-3 animate-spin inline ml-1" /> : total}
                </div>
                <div className="flex items-center gap-1.5 bg-emerald-50/50 border border-emerald-100/50 px-3 py-1.5 rounded-md text-[13px] font-semibold text-emerald-700 shadow-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                    Media: {itemsLoading ? <Loader2 className="h-3 w-3 animate-spin inline ml-1" /> : media}
                </div>
                <div className="flex items-center gap-1.5 bg-orange-50/50 border border-orange-100/50 px-3 py-1.5 rounded-md text-[13px] font-semibold text-orange-700 shadow-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-orange-500"></div>
                    No Media: {itemsLoading ? <Loader2 className="h-3 w-3 animate-spin inline ml-1" /> : noMedia}
                </div>
            </div>

            <div className="flex items-center gap-3">
                <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                    <PopoverTrigger 
                        render={
                            <Button 
                                className="bg-[#00a844] hover:bg-[#00923b] text-white font-semibold gap-2 shadow-sm rounded-md px-5 h-9"
                            >
                                <DownloadCloud className="h-4 w-4" />
                                Import from Zomato
                            </Button>
                        }
                    />
                    <PopoverContent align="end" className="w-80 p-4 rounded-xl shadow-xl border-gray-100">
                        <div className="space-y-3">
                            <div>
                                <h4 className="font-bold text-sm text-gray-800">Import Zomato Menu</h4>
                                <p className="text-xs text-gray-500 mt-0.5">Enter the complete Zomato restaurant order URL.</p>
                            </div>
                            <div className="space-y-2">
                                <input
                                    type="text"
                                    placeholder="https://www.zomato.com/.../order"
                                    value={zomatoUrl}
                                    onChange={(e) => setZomatoUrl(e.target.value)}
                                    className="w-full text-sm px-3 py-2 border rounded-md outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-gray-400"
                                    autoFocus
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") handleZomatoImport();
                                    }}
                                />
                                <Button
                                    onClick={handleZomatoImport}
                                    disabled={isImporting || !zomatoUrl.trim()}
                                    className="w-full bg-[#00a844] hover:bg-[#00923b] text-white font-semibold h-9"
                                >
                                    {isImporting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                                    {isImporting ? "Importing..." : "Start Import"}
                                </Button>
                            </div>
                        </div>
                    </PopoverContent>
                </Popover>
            </div>
        </div>
    );
}
