import dbConnect from "@/lib/db";
import * as argon2 from "argon2";
import { User } from "@/models/User";
import Restaurant from "@/models/Restaurant";
import { JsonResponse } from "@/lib/api/responseHandler";

export const GET = async (req, { params }) => {
    try {
        await dbConnect();
        const { id: restaurantId } = await params;
        
        const allUsers = await User.find({ restaurant: restaurantId })
            .select("-passwordHash")
            .sort({ createdAt: -1 })
            .lean();
            
        return JsonResponse.success(allUsers, "Users fetched successfully");
    } catch (error) {
        console.error("Failed to fetch user list:", error);
        return JsonResponse.error(error.message || "Failed to fetch user list", 500);
    }
};

export const POST = async (req, { params }) => {
    try {
        await dbConnect();
        const { id: restaurantId } = await params;
        const body = await req.json();
        const { name, phone, password, status, image } = body;

        if (!name || !phone || !password) {
            return JsonResponse.error("Name, phone, and password are required", 400);
        }

        const existingUser = await User.findOne({ phone, restaurant: restaurantId });
        if (existingUser) {
            return JsonResponse.error("A user with this phone number already exists for this restaurant", 400);
        }

        const passwordHash = await argon2.hash(password, {
            type: argon2.argon2id,
            memoryCost: 2 ** 14,
            timeCost: 2,
            parallelism: 1
        });

        let finalImage = image;
        if (!finalImage) {
            const restaurant = await Restaurant.findById(restaurantId);
            if (restaurant && restaurant.logo) {
                finalImage = restaurant.logo;
            }
        }

        const newUser = await User.create({
            name,
            phone,
            passwordHash,
            image: finalImage,
            restaurant: restaurantId,
            status: status || "ACTIVE"
        });

        const userResponse = await User.findById(newUser._id).select("-passwordHash");
        return JsonResponse.success(userResponse, "User added successfully", 201);
    } catch (error) {
        console.error("Failed to create user:", error);
        return JsonResponse.error(error.message || "Failed to create user", 500);
    }
};