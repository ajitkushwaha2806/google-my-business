import dbConnect from "@/lib/db";
import Restaurant from "@/models/Restaurant";
import WebsiteConfig from "@/models/WebsiteConfig";
import { JsonResponse } from "@/lib/api/responseHandler";
import { getRestaurant } from "@/lib/api/hooks/getRestaurant";
import { getCache, setCache, deleteCache } from "@/services/backend/redis/cache.service";

export const GET = async (req, { params }) => {
    try {
        const { id } = await params;
        await dbConnect();
        
        const { user, restaurant } = await getRestaurant();

        if (!user || !restaurant) {
            return JsonResponse.error("Please login first to continue!", 401);
        }


        const cacheKey = `restaurant:website-config:${id}`;
        const cachedConfig = await getCache(cacheKey);

        if (cachedConfig) {
            return JsonResponse.success(
                cachedConfig,
                "Website configuration fetched successfully (cached)",
                200
            );
        }

        let config = await WebsiteConfig.findOne({ restaurant: id })
            .populate("homepage.banners.items.image")
            .lean();

        if (!config) {
            return JsonResponse.success(
                null,
                "No website configuration found for this restaurant.",
                200
            );
        }

        await setCache(cacheKey, config, 3600);

        return JsonResponse.success(
            config,
            "Website configuration fetched successfully",
            200
        );
    } catch (err) {
        return JsonResponse.error(
            err?.message || "Internal Server Error",
            500
        );
    }
};

export const PUT = async (req, { params }) => {
    try {
        const { id } = await params;
        const data = await req.json();

        await dbConnect();
        const { user, restaurant } = await getRestaurant();

        if (!user || !restaurant) {
            return JsonResponse.error("Please login first to continue!", 401);
        }

        const updatedConfig = await WebsiteConfig.findOneAndUpdate(
            { restaurant: id },
            { $set: data },
            { new: true, upsert: true, runValidators: true }
        ).populate("homepage.banners.items.image");

        const cacheKey = `restaurant:website-config:${id}`;
        await deleteCache(cacheKey);
        
        const actualRestaurant = await Restaurant.findById(id).select("slug").lean();
        if (actualRestaurant?.slug) {
            await deleteCache(`restaurant:website-config:slug:${actualRestaurant.slug}`);
        }

        return JsonResponse.success(
            updatedConfig,
            "Website configuration saved successfully",
            200
        );
    } catch (err) {
        return JsonResponse.error(
            err?.message || "Internal Server Error",
            500
        );
    }
};
