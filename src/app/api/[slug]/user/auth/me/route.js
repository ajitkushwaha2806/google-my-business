import { JsonResponse } from "@/lib/api/responseHandler";
import { AuthService } from "@/services/backend/auth.service";

export const GET = async (req, { params }) => {
    try {
        const { slug } = await params;
        
        const authHeader = req.headers.get("authorization") || "";
        const token = authHeader.startsWith("Bearer ") ? authHeader.substring(7) : authHeader;
        
        if (!token) {
            return JsonResponse.error("Not authenticated", 401);
        }

        const user = await AuthService.me(slug, token);
        return JsonResponse.success(user, "User fetched successfully", 200);
    } catch (error) {
        console.error("Auth me error:", error);
        return JsonResponse.error(error.message || "Not authenticated", 401);
    }
};
