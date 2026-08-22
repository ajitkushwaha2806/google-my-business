import { Search, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useRestaurant } from "@/store/hooks/useRestaurant";
import useNotification from "@/store/hooks/useNotification";
import { useQueryClient } from "@tanstack/react-query";
import { MenuService } from "@/services/frontend/menu";

export function ZomatoImport() {
    const { restaurantId } = useRestaurant();
    const notification = useNotification();
    const queryClient = useQueryClient();

    const [url, setUrl] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleImport = async (e) => {
        e.preventDefault();
        if (!url.includes("zomato.com")) {
            notification.error("Please enter a valid Zomato URL.");
            return;
        }
        
        setIsLoading(true);
        try {
            const data = await MenuService.importZomato(restaurantId, url);
            if (data.success) {
                notification.success(`Successfully imported ${data.total_items || data.stats?.itemsImported || 0} items!`);
                setUrl("");
                queryClient.invalidateQueries({ queryKey: ["items", restaurantId] });
                queryClient.invalidateQueries({ queryKey: ["categories", restaurantId] });
            } else {
                notification.error(data.message || "Failed to import Zomato menu");
            }
        } catch (e) {
            notification.error(e.response?.data?.message || e.message || "Failed to import Zomato menu");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full bg-white rounded-md shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-2 flex-1 flex flex-col items-center justify-center max-w-xl mx-auto w-full text-center">
                <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mb-6">
                    <Search className="w-8 h-8" />
                </div>
                <h4 className="text-[18px] font-bold text-slate-800 mb-2">Find your restaurant</h4>
                <p className="text-[14px] text-slate-500 mb-8 leading-relaxed">
                    Go to Zomato, find your restaurant page, and copy the URL from your browser's address bar. It should look like <code className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-700">zomato.com/ncr/your-restaurant-name</code>.
                </p>

                <form onSubmit={handleImport} className="w-full flex flex-col gap-4">
                    <Input 
                        placeholder="https://www.zomato.com/ncr/barbeque-nation-6-connaught-place-new-delhi/order" 
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        className="h-12 bg-slate-50 border-gray-200 text-center text-[14px]"
                        required
                    />
                    <Button 
                        type="submit"
                        disabled={!url || isLoading}
                        className="h-12 bg-red-500 hover:bg-red-600 text-white font-bold text-[14px] w-full shadow-md shadow-red-500/20 transition-all"
                    >
                        {isLoading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
                        {isLoading ? "Importing Menu..." : "Fetch Menu Data"}
                    </Button>
                </form>
            </div>
        </div>
    );
}
