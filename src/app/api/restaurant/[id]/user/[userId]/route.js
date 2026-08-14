import dbConnect from "@/lib/db";
import * as argon2 from "argon2";
import { User } from "@/models/User";
import Restaurant from "@/models/Restaurant";
import { JsonResponse } from "@/lib/api/responseHandler";

export const PUT = async (req, { params }) => {
    try {
        await dbConnect();
        const { id: restaurantId, userId } = await params;
        const body = await req.json();
        const { status, name, phone, password, image } = body;

        const user = await User.findOne({ _id: userId, restaurant: restaurantId });
        if (!user) {
            return JsonResponse.error("User not found", 404);
        }

        if (status) user.status = status;
        if (name) user.name = name;
        if (phone) user.phone = phone;

        if (image !== undefined) {
            let finalImage = image;
            if (!finalImage) {
                const restaurant = await Restaurant.findById(restaurantId);
                if (restaurant && restaurant.logo) {
                    finalImage = restaurant.logo;
                }
            }
            user.image = finalImage;
        }

        if (password) {
            user.passwordHash = await argon2.hash(password, {
                type: argon2.argon2id,
                memoryCost: 2 ** 14,
                timeCost: 2,
                parallelism: 1
            });
        }

        await user.save();

        const updatedUser = await User.findById(userId).select("-passwordHash");
        return JsonResponse.success(updatedUser, "User updated successfully");
    } catch (error) {
        console.error("Failed to update user:", error);
        return JsonResponse.error(error.message || "Failed to update user", 500);
    }
};

export const DELETE = async (req, { params }) => {
    try {
        await dbConnect();
        const { id: restaurantId, userId } = await params;

        const user = await User.findOneAndDelete({ _id: userId, restaurant: restaurantId });
        if (!user) {
            return JsonResponse.error("User not found", 404);
        }

        return JsonResponse.success(null, "User deleted successfully");
    } catch (error) {
        console.error("Failed to delete user:", error);
        return JsonResponse.error(error.message || "Failed to delete user", 500);
    }
};
