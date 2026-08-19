import dbConnect from "@/lib/db";
import { Role } from "@/models/Role";
import { Permission } from "@/models/Permission";
import { JsonResponse } from "@/lib/api/responseHandler";
import { getCache, setCache } from "@/services/backend/redis/cache.service";

export const GET = async (req) => {
    try {
        await dbConnect();
        
        const cacheKey = "roles:all";
        const cachedRoles = await getCache(cacheKey);
        
        if (cachedRoles) {
            return JsonResponse.success(cachedRoles, "Roles fetched successfully (cached)");
        }
        
        const roles = await Role.find({})
            .populate("permissions", "code description")
            .lean();
            
        await setCache(cacheKey, roles, 3600); // cache for 1 hour
            
        return JsonResponse.success(roles);
    } catch (error) {
        console.error("Role API Error:", error);
        return JsonResponse.error(error.message || "Failed to fetch roles");
    }
};
