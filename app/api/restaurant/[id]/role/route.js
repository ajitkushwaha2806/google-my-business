import dbConnect from "@/lib/db";
import { Role } from "@/models/Role";
import { Permission } from "@/models/Permission";
import { JsonResponse } from "@/lib/api/responseHandler";

export const GET = async (req) => {
    try {
        await dbConnect();
        const roles = await Role.find({})
            .populate("permissions", "code description")
            .lean();
            
        return JsonResponse.success(roles);
    } catch (error) {
        console.error("Role API Error:", error);
        return JsonResponse.error(error.message || "Failed to fetch roles");
    }
};
