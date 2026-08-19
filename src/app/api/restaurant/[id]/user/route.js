import ImageAsset from "@/models/Image";
import { JsonResponse } from "@/lib/api/responseHandler";
import { UserService } from "@/services/backend/user.service";
import { getCache, setCache, deleteCache } from "@/services/backend/redis/cache.service";

export const GET = async (req, { params }) => {
    try {
        const { id: restaurantId } = await params;
        const cacheKey = `restaurant:users:${restaurantId}`;
        const cachedUsers = await getCache(cacheKey);
        
        if (cachedUsers) {
            return JsonResponse.success(cachedUsers, "Users fetched successfully (cached)");
        }
        
        const allUsers = await UserService.getAll(restaurantId);
        await setCache(cacheKey, allUsers, 3600);
        return JsonResponse.success(allUsers, "Users fetched successfully");
    } catch (error) {
        console.error("Failed to fetch user list:", error);
        return JsonResponse.error(error.message || "Failed to fetch user list", 500);
    }
};

export const POST = async (req, { params }) => {
    try {
        const { id: restaurantId } = await params;
        const body = await req.json();
        const newUser = await UserService.create(restaurantId, body);
        
        await deleteCache(`restaurant:users:${restaurantId}`);
        return JsonResponse.success(newUser, "User added successfully", 201);
    } catch (error) {
        console.error("Failed to create user:", error);
        return JsonResponse.error(error.message || "Failed to create user", 500);
    }
};