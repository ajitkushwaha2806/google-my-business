import dbConnect from "@/lib/db";
import MenuItem from "@/models/Item";
import AddonGroup from "@/models/AddonGroup";
import Restaurant from "@/models/Restaurant";
import { getUser } from "@/lib/api/hooks/getUser";
import { JsonResponse } from "@/lib/api/responseHandler";
import { getCache, setCache } from "@/services/backend/redis/cache.service";
import { getAddonGroupsCacheKey, invalidateAddonGroupCache, invalidateItemCache } from "@/lib/api/helpers/cacheKeys";

export const GET = async (req, { params }) => {
    try {
        const { id: restaurantId } = await params;
        if (!restaurantId) return JsonResponse.error("Restaurant ID is required!", 400);

        await dbConnect();

        const cacheKey = getAddonGroupsCacheKey(restaurantId);
        let groups = await getCache(cacheKey);

        if (!groups) {
            groups = await AddonGroup.find({ restaurant: restaurantId }).populate('items.item').sort({ createdAt: -1 });
            await setCache(cacheKey, groups, 3600);
        }

        return JsonResponse.success(groups, "Addon groups fetched successfully", 200);
    } catch (err) {
        console.error("Fetch Addon Groups Error:", err);
        return JsonResponse.error(err?.message || "Internal Server Error!", 500);
    }
};

export const POST = async (req, { params }) => {
    try {
        const { id: restaurantId } = await params;
        if (!restaurantId) return JsonResponse.error("Restaurant ID is required!", 400);

        await dbConnect();
        const user = await getUser();

        if (!user?.id) return JsonResponse.error("Please log in first to continue!", 401);

        const restaurant = await Restaurant.findOne({ _id: restaurantId, createdBy: user.id });
        if (!restaurant) return JsonResponse.error("Restaurant not found or unauthorized", 404);

        const data = await req.json();

        const newGroup = await AddonGroup.create({
            restaurant: restaurantId,
            name: data.name,
            selectionType: data.selectionType || 'multiple',
            minSelection: data.minSelection || 0,
            maxSelection: data.maxSelection || null,
            items: data.items || []
        });

        const populatedGroup = await newGroup.populate('items.item');

        await invalidateAddonGroupCache(restaurantId);

        return JsonResponse.success(populatedGroup, "Addon group created successfully", 201);
    } catch (err) {
        console.error("Create Addon Group Error:", err);
        return JsonResponse.error(err?.message || "Internal Server Error!", 500);
    }
};

export const PUT = async (req, { params }) => {
    try {
        const { id: restaurantId } = await params;
        const url = new URL(req.url);
        const groupId = url.searchParams.get("groupId");

        if (!restaurantId || !groupId) return JsonResponse.error("Restaurant ID and Group ID are required!", 400);

        await dbConnect();
        const user = await getUser();

        if (!user?.id) return JsonResponse.error("Please log in first to continue!", 401);

        const restaurant = await Restaurant.findOne({ _id: restaurantId, createdBy: user.id });
        if (!restaurant) return JsonResponse.error("Restaurant not found or unauthorized", 404);

        const data = await req.json();

        const updatedGroup = await AddonGroup.findOneAndUpdate(
            { _id: groupId, restaurant: restaurantId },
            { $set: data },
            { new: true }
        ).populate('items.item');

        if (!updatedGroup) return JsonResponse.error("Addon group not found", 404);

        await invalidateAddonGroupCache(restaurantId);
        await invalidateItemCache(restaurantId); 

        return JsonResponse.success(updatedGroup, "Addon group updated successfully", 200);
    } catch (err) {
        console.error("Update Addon Group Error:", err);
        return JsonResponse.error(err?.message || "Internal Server Error!", 500);
    }
};

export const DELETE = async (req, { params }) => {
    try {
        const { id: restaurantId } = await params;
        const url = new URL(req.url);
        const groupId = url.searchParams.get("groupId");

        if (!restaurantId || !groupId) return JsonResponse.error("Restaurant ID and Group ID are required!", 400);

        await dbConnect();
        const user = await getUser();

        if (!user?.id) return JsonResponse.error("Please log in first to continue!", 401);

        const restaurant = await Restaurant.findOne({ _id: restaurantId, createdBy: user.id });
        if (!restaurant) return JsonResponse.error("Restaurant not found or unauthorized", 404);

        const deleted = await AddonGroup.findOneAndDelete({ _id: groupId, restaurant: restaurantId });

        if (!deleted) return JsonResponse.error("Addon group not found", 404);
        await MenuItem.updateMany(
            { restaurant: restaurantId, addonGroups: groupId },
            { $pull: { addonGroups: groupId } }
        );

        await invalidateAddonGroupCache(restaurantId);
        await invalidateItemCache(restaurantId);

        return JsonResponse.success({ success: true }, "Addon group deleted successfully", 200);
    } catch (err) {
        console.error("Delete Addon Group Error:", err);
        return JsonResponse.error(err?.message || "Internal Server Error!", 500);
    }
};
