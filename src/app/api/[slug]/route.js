import "@/models/Image";
import dbConnect from "@/lib/db";
import Restaurant from "@/models/Restaurant";
import { JsonResponse } from "@/lib/api/responseHandler";
import { getCache, setCache } from "@/services/backend/redis/cache.service";

export const GET = async (req, { params }) => {
    try {
        const { slug } = await params;
        const cacheKey = `restaurant:slug:${slug}`;

        const cachedRestaurant = await getCache(cacheKey);
        if (cachedRestaurant) {
            return JsonResponse.success(cachedRestaurant, "Restaurant details fetched successfully (cached)");
        }

        await dbConnect();
        const restaurant = await Restaurant.findOne({ slug })
            .populate("logo")
            .select("name slug domain phone email logo address status openingHours")
            .lean();
        if (!restaurant) {
            return JsonResponse.error("Restaurant not found", 404);
        }

        await setCache(cacheKey, restaurant, 600);
        return JsonResponse.success(restaurant, "Restaurant details fetched successfully");
    } catch (error) {
        console.error("GET restaurant error:", error);
        return JsonResponse.error(error.message || "Failed to fetch restaurant details", 500);
    }
};
