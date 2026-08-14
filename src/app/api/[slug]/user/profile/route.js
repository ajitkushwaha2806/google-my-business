import { JsonResponse } from "@/lib/api/responseHandler";
import { AuthService } from "@/services/backend/auth.service";

export const PUT = async (req, { params }) => {
    try {
        const { slug } = await params;
        
        const authHeader = req.headers.get("authorization") || "";
        const token = authHeader.startsWith("Bearer ") ? authHeader.substring(7) : authHeader;
        
        if (!token) {
            return JsonResponse.error("Not authenticated", 401);
        }

        const body = await req.json();
        const updatedUser = await AuthService.updateProfile(slug, token, body);
        
        return JsonResponse.success(updatedUser, "Profile updated successfully", 200);
    } catch (error) {
        console.error("Update profile error:", error);
        return JsonResponse.error(error.message || "Failed to update profile", 500);
    }
};
