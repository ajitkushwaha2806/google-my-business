import { getAuthUser } from "@/lib/api/helpers/auth";
import { JsonResponse } from "@/lib/api/responseHandler";
import { AuthService } from "@/services/backend/auth.service";
import { deleteCache } from "@/services/backend/redis/cache.service";

export const PUT = async (req, { params }) => {
    try {
        const { slug } = await params;
        
        const authUser = getAuthUser(req);
        if (!authUser) {
            return JsonResponse.error("Not authenticated", 401);
        }
        
        const body = await req.json();
        const updatedUser = await AuthService.updateProfile(slug, authUser.token, body);
        await deleteCache(`user:profile:${authUser.userId}`);
        return JsonResponse.success(updatedUser, "Profile updated successfully", 200);
    } catch (error) {
        console.error("Update profile error:", error);
        return JsonResponse.error(error.message || "Failed to update profile", 500);
    }
};
