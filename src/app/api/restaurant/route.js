import dbConnect from "@/lib/db";
import ImageAsset from "@/models/Image";
import Restaurant from "@/models/Restaurant";
import { getUser } from "@/lib/api/hooks/getUser";
import { clerkClient } from "@clerk/nextjs/server";
import { JsonResponse } from "@/lib/api/responseHandler";
import { validateRequiredFields } from "@/lib/api/helpers/validator";
import { getCache, setCache, deleteCache } from "@/services/backend/redis/cache.service";


const RESTAURANT_POST_REQUIRED_FIELDS = ["name", "phone", "email", "slug"];

export const POST = async (req) => {
    try {
        const data = await req.json();
        const { isValid, message } = validateRequiredFields(data, RESTAURANT_POST_REQUIRED_FIELDS);
        
        if (!isValid) {
            return JsonResponse.error(message, 400);
        }

        await dbConnect();    
        const user = await getUser()
        if(!user || !user.id){
            return JsonResponse.error("Please login first to continue !", 400);
        }

        const { name, phone, email, slug } = data;
        const existingRestaurant = await Restaurant.findOne({ slug });
        if (existingRestaurant) {
            return JsonResponse.error("Restaurant slug already in use.", 400);
        }

        const defaultOpeningHours = {
            currentlyOpen: false,
            days: ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"].map(day => ({
                day,
                isOpen: false,
                openTime: null,
                closeTime: null
            }))
        };

        const newRestaurant = new Restaurant({
            name,
            phone,
            email,
            slug,
            createdBy: user?.id,
            openingHours: defaultOpeningHours
        });

        await newRestaurant.save();
        await deleteCache(`restaurants:user:${user.id}`);
        const client = await clerkClient();
        return JsonResponse.success({ restaurantId: newRestaurant._id }, "Restaurant created successfully", 200);
    } catch (err) {
        return JsonResponse.error(
            err?.message || "Internal Server Error !",
            500
        );
    }
};

export const GET = async () => {
    try {
        await dbConnect();
        const user = await getUser();

        if (!user?.id) {
            return JsonResponse.error(
                "Please log in first to continue!",
                401
            );
        }

        const cacheKey = `restaurants:user:${user.id}`;
        const cachedRestaurants = await getCache(cacheKey);

        if (cachedRestaurants) {
            return JsonResponse.success(
                { restaurants: cachedRestaurants },
                cachedRestaurants.length
                    ? "Restaurants fetched successfully (cached)"
                    : "No restaurants found (cached)",
                200
            );
        }

        const restaurants = await Restaurant.find({
            createdBy: user.id,
        }).populate("logo").lean();

        await setCache(cacheKey, restaurants, 3600);

        return JsonResponse.success(
            { restaurants },
            restaurants.length
                ? "Restaurants fetched successfully"
                : "No restaurants found",
            200
        );
    } catch (err) {
        console.error("Get restaurants error:", err);

        return JsonResponse.error(
            err?.message || "Internal Server Error!",
            500
        );
    }
};