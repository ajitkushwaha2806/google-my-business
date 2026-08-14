import { JsonResponse } from "@/lib/api/responseHandler";
import { UserService } from "@/services/backend/user.service";

export const GET = async (req, { params }) => {
    try {
        const { id: restaurantId } = await params;
        const allUsers = await UserService.getAll(restaurantId);
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
        return JsonResponse.success(newUser, "User added successfully", 201);
    } catch (error) {
        console.error("Failed to create user:", error);
        return JsonResponse.error(error.message || "Failed to create user", 500);
    }
};