import { getAuthUser } from "@/lib/api/helpers/auth";
import { JsonResponse } from "@/lib/api/responseHandler";
import { AuthService } from "@/services/backend/auth.service";
import { getCache, setCache } from "@/services/backend/redis/cache.service";

export const GET = async (req, { params }) => {
    try {
        const { slug } = await params;
        
        const authUser = getAuthUser(req);
        if (!authUser) {
            return JsonResponse.error("Not authenticated", 401);
        }

        const cacheKey = `user:profile:${authUser.userId}`;
        const cachedUser = await getCache(cacheKey);
        if (cachedUser) {
            return JsonResponse.success(cachedUser, "User fetched successfully (cached)", 200);
        }

        const user = await AuthService.me(slug, authUser.token);
        await setCache(cacheKey, user, 900);
        return JsonResponse.success(user, "User fetched successfully", 200);
    } catch (error) {
        console.error("Auth me error:", error);
        return JsonResponse.error(error.message || "Not authenticated", 401);
    }
};
