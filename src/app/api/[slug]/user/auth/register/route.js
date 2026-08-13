import { JsonResponse } from "@/lib/api/responseHandler";
import { AuthService } from "@/services/backend/auth.service"; 
import { validateRequiredFields } from "@/lib/api/helpers/validator";

const POST_REGISTER_REQUIRED_FIELDS = ["name", "phone", "password"];

export const POST = async (req, { params }) => {
    try {
        const body = await req.json();
        const { name, phone, password } = body;
        
        const { isValid, message } = validateRequiredFields(body, POST_REGISTER_REQUIRED_FIELDS);
        if (!isValid) {
            return JsonResponse.error(message, 400);
        }
        
        const { slug } = await params;
        const userResponse = await AuthService.register(slug, { name, phone, password });
        return JsonResponse.success(userResponse, "User registered successfully", 201);
    } catch (error) {
        console.error("Register API error:", error);
        return JsonResponse.error(error.message || "Internal server error", error.message.includes("not found") ? 404 : 400);
    }
};