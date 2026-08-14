import dbConnect from "@/lib/db";
import Restaurant from "@/models/Restaurant";
import { JsonResponse } from "@/lib/api/responseHandler";

export const GET = async (req, { params }) => {
    try {
        await dbConnect();
        const { slug } = await params;

        const restaurant = await Restaurant.findOne({ slug })
            .select("name slug domain phone email logo address status openingHours")
            .lean();
        if (!restaurant) {
            return JsonResponse.error("Restaurant not found", 404);
        }

        return JsonResponse.success(restaurant, "Restaurant details fetched successfully");
    } catch (error) {
        console.error("GET restaurant error:", error);
        return JsonResponse.error(error.message || "Failed to fetch restaurant details", 500);
    }
};
