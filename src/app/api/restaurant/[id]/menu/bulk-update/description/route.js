import dbConnect from "@/lib/db";
import MenuItem from "@/models/Item";
import Restaurant from "@/models/Restaurant";
import { getUser } from "@/lib/api/hooks/getUser";
import { JsonResponse } from "@/lib/api/responseHandler";
import { invalidateItemCache } from "@/lib/api/helpers/cacheKeys";

export const PUT = async (req, { params }) => {
    try {
        const { id: restaurantId } = await params;
        if (!restaurantId) {
            return JsonResponse.error("Restaurant ID is required!", 400);
        }

        await dbConnect();
        const user = await getUser();

        if (!user?.id) {
            return JsonResponse.error("Please log in first to continue!", 401);
        }

        const restaurant = await Restaurant.findOne({ _id: restaurantId, createdBy: user.id });
        if (!restaurant) {
            return JsonResponse.error("Restaurant not found or unauthorized", 404);
        }

        const data = await req.json();
        const { items } = data;

        if (!Array.isArray(items) || items.length === 0) {
            return JsonResponse.error("An array of items with updated descriptions is required.", 400);
        }

        const bulkOps = items.map(item => {
            const updateFields = {};
            if (item.description !== undefined) {
                updateFields.description = String(item.description);
            }

            return {
                updateOne: {
                    filter: { _id: item.id, restaurant: restaurantId },
                    update: { $set: updateFields }
                }
            };
        });

        if (bulkOps.length === 0) {
            return JsonResponse.error("No valid description updates provided.", 400);
        }

        const result = await MenuItem.bulkWrite(bulkOps);
        await invalidateItemCache(restaurantId);
        return JsonResponse.success(
            { 
                matchedCount: result.matchedCount, 
                modifiedCount: result.modifiedCount 
            }, 
            "Successfully updated descriptions in bulk", 
            200
        );

    } catch (err) {
        console.error("Bulk Description Update Error:", err);
        return JsonResponse.error(err?.message || "Internal Server Error!", 500);
    }
};
