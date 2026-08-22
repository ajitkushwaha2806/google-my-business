import dbConnect from "@/lib/db";
import MenuItem from "@/models/Item";
import Restaurant from "@/models/Restaurant";
import { getUser } from "@/lib/api/hooks/getUser";
import { JsonResponse } from "@/lib/api/responseHandler";
import { invalidateItemCache } from "@/lib/api/helpers/cacheKeys";

export const PUT = async (req, { params }) => {
    try {
        const { id: restaurantId } = await params;
        if (!restaurantId) return JsonResponse.error("Restaurant ID is required!", 400);

        await dbConnect();
        const user = await getUser();

        if (!user?.id) return JsonResponse.error("Please log in first to continue!", 401);

        const restaurant = await Restaurant.findOne({ _id: restaurantId, createdBy: user.id });
        if (!restaurant) return JsonResponse.error("Restaurant not found or unauthorized", 404);

        const data = await req.json();
        const { itemIds, addonGroupIds, action } = data;

        if (!Array.isArray(itemIds) || !Array.isArray(addonGroupIds)) {
            return JsonResponse.error("itemIds and addonGroupIds must be arrays.", 400);
        }

        let resultData = null;

        if (action === "add") {
            const updateResult = await MenuItem.updateMany(
                { _id: { $in: itemIds }, restaurant: restaurantId },
                { $addToSet: { addonGroups: { $each: addonGroupIds } } }
            );
            resultData = { matched: updateResult.matchedCount, modified: updateResult.modifiedCount };
        } 
        else if (action === "remove") {
            const updateResult = await MenuItem.updateMany(
                { _id: { $in: itemIds }, restaurant: restaurantId },
                { $pullAll: { addonGroups: addonGroupIds } }
            );
            resultData = { matched: updateResult.matchedCount, modified: updateResult.modifiedCount };
        }
        else if (action === "set") {
            const updateResult = await MenuItem.updateMany(
                { _id: { $in: itemIds }, restaurant: restaurantId },
                { $set: { addonGroups: addonGroupIds } }
            );
            resultData = { matched: updateResult.matchedCount, modified: updateResult.modifiedCount };
        }
        else {
            return JsonResponse.error("Invalid action. Must be add, remove, or set.", 400);
        }

        await invalidateItemCache(restaurantId);

        return JsonResponse.success(resultData, "Addons updated successfully", 200);

    } catch (err) {
        console.error("Bulk Addons Update Error:", err);
        return JsonResponse.error(err?.message || "Internal Server Error!", 500);
    }
};
