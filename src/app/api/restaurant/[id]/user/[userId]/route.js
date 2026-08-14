import { JsonResponse } from "@/lib/api/responseHandler";
import { UserService } from "@/services/backend/user.service";

export const PUT = async (req, { params }) => {
    try {
        const { id: restaurantId, userId } = await params;
        const body = await req.json();
        const updatedUser = await UserService.update(restaurantId, userId, body);
        return JsonResponse.success(updatedUser, "User updated successfully");
    } catch (error) {
        console.error("Failed to update user:", error);
        return JsonResponse.error(error.message || "Failed to update user", 500);
    }
};

export const DELETE = async (req, { params }) => {
    try {
        const { id: restaurantId, userId } = await params;
        await UserService.delete(restaurantId, userId);
        return JsonResponse.success(null, "User deleted successfully");
    } catch (error) {
        console.error("Failed to delete user:", error);
        return JsonResponse.error(error.message || "Failed to delete user", 500);
    }
};
