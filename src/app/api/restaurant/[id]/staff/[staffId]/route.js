import dbConnect from "@/lib/db";
import { Role } from "@/models/Role";
import { Staff } from "@/models/Staff";
import ImageAsset from "@/models/Image";
import { JsonResponse } from "@/lib/api/responseHandler";
import { deleteCache } from "@/services/backend/redis/cache.service";

export const PUT = async (req, { params }) => {
    try {
        await dbConnect();
        const { id: restaurantId, staffId } = await params;
        const body = await req.json();
        
        const { name, role, status, image } = body;
        
        const staff = await Staff.findOne({ _id: staffId, restaurant: restaurantId });
        if (!staff) {
            return JsonResponse.error("Staff member not found", 404);
        }
        
        if (role && role !== staff.role.toString()) {
            const roleExists = await Role.findById(role);
            if (!roleExists) {
                return JsonResponse.error("Invalid role assigned", 400);
            }
            staff.role = role;
        }
        
        if (name) staff.name = name;
        if (status) staff.status = status;
        if (image !== undefined) staff.image = image;
        
        await staff.save();
        
        await deleteCache(`restaurant:staff:${restaurantId}`);
        
        const updatedStaff = await Staff.findById(staffId).populate("image").populate("role", "name description isSystemRole").select("-passwordHash");
        return JsonResponse.success(updatedStaff, "Staff member updated successfully");
    } catch (error) {
        return JsonResponse.error(error.message || "Failed to update staff member");
    }
};

export const DELETE = async (req, { params }) => {
    try {
        await dbConnect();
        const { id: restaurantId, staffId } = await params;
        const staff = await Staff.findOneAndDelete({ _id: staffId, restaurant: restaurantId });
        
        if (!staff) {
            return JsonResponse.error("Staff member not found", 404);
        }
        await deleteCache(`restaurant:staff:${restaurantId}`);
        return JsonResponse.success(null, "Staff member deleted successfully");
    } catch (error) {
        return JsonResponse.error(error.message || "Failed to delete staff member");
    }
};
