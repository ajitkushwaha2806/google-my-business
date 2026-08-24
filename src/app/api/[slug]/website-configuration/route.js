import "@/models/Image";
import dbConnect from "@/lib/db";
import Restaurant from "@/models/Restaurant";
import WebsiteConfig from "@/models/WebsiteConfig";
import { JsonResponse } from "@/lib/api/responseHandler";
import { getCache, setCache } from "@/services/backend/redis/cache.service";

export const GET = async (req, { params }) => {
    try {
        const { slug } = await params;
        const cacheKey = `restaurant:website-config:slug:${slug}`;

        const cachedConfig = await getCache(cacheKey);
        if (cachedConfig) {
            return JsonResponse.success(cachedConfig, "Website configuration fetched successfully (cached)");
        }

        await dbConnect();
        
        const restaurant = await Restaurant.findOne({ slug }).select("_id").lean();
        
        if (!restaurant) {
            return JsonResponse.error("Restaurant not found", 404);
        }

        let config = await WebsiteConfig.findOne({ restaurant: restaurant._id })
            .populate("homepage.banners.items.image")
            .lean();

        if (!config) {
            return JsonResponse.success(null, "No website configuration found", 200);
        }

        await setCache(cacheKey, config, 600);
        return JsonResponse.success(config, "Website configuration fetched successfully");
    } catch (error) {
        console.error("GET website configuration error:", error);
        return JsonResponse.error(error.message || "Failed to fetch website configuration", 500);
    }
};
