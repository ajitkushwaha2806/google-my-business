import { JsonResponse } from "@/lib/api/responseHandler";
import { validateRequiredFields } from "@/lib/api/helpers/validator";
import { AuthService } from "@/services/backend/auth.service";

const POST_LOGIN_REQUIRED_FIELDS = ["phone", "password"];

export const POST = async (req, { params }) => {
    try {
        const body = await req.json();
        const { phone, password } = body;
        
        const { isValid, message } = validateRequiredFields(body, POST_LOGIN_REQUIRED_FIELDS);
        if (!isValid) {
            return JsonResponse.error(message, 400);
        }
        
        const { slug } = await params;
        
        const userResponse = await AuthService.login(slug, { phone, password });
        return JsonResponse.success(userResponse, "User logged in successfully", 200);
    } catch (error) {
        console.error("Login API error:", error);
        return JsonResponse.error(error.message || "Internal server error", error.message.includes("not found") ? 404 : 400);
    }
};
