import dbConnect from "@/lib/db";
import * as argon2 from "argon2";
import { Staff } from "@/models/Staff";
import Restaurant from "@/models/Restaurant";
import { JsonResponse } from "@/lib/api/responseHandler";
import { validateRequiredFields } from "@/lib/api/helpers";

const STAFF_POST_REQUIRED_FIELDS = ["name", "email", "role", "password"];

export const GET = async (req, { params }) => {
    try {
        await dbConnect();
        const { id: restaurantId } = await params;
        
        const staffList = await Staff.find({ restaurant: restaurantId })
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
        
        const passwordHash = await argon2.hash(password);
        
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
        
        const populatedStaff = await Staff.findById(newStaff._id).populate("role", "name description isSystemRole").select("-passwordHash");
        
        return JsonResponse.success(populatedStaff, "Staff member added successfully", 201);
    } catch (error) {
        return JsonResponse.error(error.message || "Failed to create staff member");
    }
};
