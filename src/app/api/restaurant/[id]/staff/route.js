import dbConnect from "@/lib/db";
import * as argon2 from "argon2";
import { Staff } from "@/models/Staff";
import ImageAsset from "@/models/Image";
import Restaurant from "@/models/Restaurant";
import { JsonResponse } from "@/lib/api/responseHandler";
import { validateRequiredFields } from "@/lib/api/helpers/validator";
import { getCache, setCache, deleteCache } from "@/services/backend/redis/cache.service";


const STAFF_POST_REQUIRED_FIELDS = ["name", "email", "role", "password"];

export const GET = async (req, { params }) => {
    try {
        await dbConnect();
        const { id: restaurantId } = await params;
        const cacheKey = `restaurant:staff:${restaurantId}`;
        const cachedStaffList = await getCache(cacheKey);
        if (cachedStaffList) {
            return JsonResponse.success(cachedStaffList, "Staff list fetched successfully (cached)");
        }
        
        const staffList = await Staff.find({ restaurant: restaurantId })
            .populate("image")
            .populate({
                path: "role",
                select: "name description permissions isSystemRole",
                populate: {
                    path: "permissions",
                    select: "code description",
                }
            })
            .select("-passwordHash")
            .sort({ createdAt: -1 })
            .lean();
            
        await setCache(cacheKey, staffList, 3600);
            
        return JsonResponse.success(staffList);
    } catch (error) {
        return JsonResponse.error(error.message || "Failed to fetch staff list");
    }
};

export const POST = async (req, { params }) => {
    try {
        await dbConnect();
        const { id: restaurantId } = await params;
        const body = await req.json();
        
        const { name, email, role, status, password, image } = body;
        
        const { isValid, message } = validateRequiredFields(body, STAFF_POST_REQUIRED_FIELDS);
        if (!isValid) {
            return JsonResponse.error(message, 400);
        }
        
        const existingStaff = await Staff.findOne({ email });
        if (existingStaff) {
            return JsonResponse.error("A user with this email already exists", 400);
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
        
        const newStaff = await Staff.create({
            name,
            email,
            role,
            passwordHash,
            image: finalImage,
            restaurant: restaurantId,
            status: status || "ACTIVE"
        });
        
        await deleteCache(`restaurant:staff:${restaurantId}`);
        
        const populatedStaff = await Staff.findById(newStaff._id).populate("image").populate("role", "name description isSystemRole").select("-passwordHash");
        return JsonResponse.success(populatedStaff, "Staff member added successfully", 201);
    } catch (error) {
        return JsonResponse.error(error.message || "Failed to create staff member");
    }
};
