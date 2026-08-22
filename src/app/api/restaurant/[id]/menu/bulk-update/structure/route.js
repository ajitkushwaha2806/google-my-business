import dbConnect from "@/lib/db";
import MenuItem from "@/models/Item";
import Category from "@/models/Category";
import Restaurant from "@/models/Restaurant";
import { getUser } from "@/lib/api/hooks/getUser";
import { JsonResponse } from "@/lib/api/responseHandler";
import { invalidateItemCache, invalidateCategoryCache } from "@/lib/api/helpers/cacheKeys";

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
        const { action, payload } = data;

        if (!action || !payload) {
            return JsonResponse.error("Action and payload are required.", 400);
        }

        let resultData = null;

        if (action === "move_items") {
            const { itemIds, targetCategoryId, targetSubCategoryId } = payload;
            if (!Array.isArray(itemIds) || !targetCategoryId) {
                return JsonResponse.error("itemIds and targetCategoryId are required for moving items.", 400);
            }

            const updateResult = await MenuItem.updateMany(
                { _id: { $in: itemIds }, restaurant: restaurantId },
                { 
                    $set: { 
                        category: targetCategoryId,
                        subCategory: targetSubCategoryId || null
                    } 
                }
            );
            resultData = { matched: updateResult.matchedCount, modified: updateResult.modifiedCount };
        } 
        else if (action === "move_subcategories") {
            const { subCategoryIds, targetCategoryId } = payload;
            if (!Array.isArray(subCategoryIds)) {
                return JsonResponse.error("subCategoryIds is required.", 400);
            }

            await Category.updateMany(
                { _id: { $in: subCategoryIds }, restaurant: restaurantId },
                { $set: { parentCategory: targetCategoryId || null } }
            );

            if (targetCategoryId) {
                await MenuItem.updateMany(
                    { subCategory: { $in: subCategoryIds }, restaurant: restaurantId },
                    { $set: { category: targetCategoryId } }
                );
            } else {
                for (const subId of subCategoryIds) {
                    const promotedCategory = await Category.findOne({ _id: subId, restaurant: restaurantId });
                    if (!promotedCategory) continue;

                    const newSubCategory = await Category.create({
                        restaurant: restaurantId,
                        name: promotedCategory.name,
                        image: promotedCategory.image,
                        displayOrder: 0,
                        parentCategory: subId
                    });

                    await MenuItem.updateMany(
                        { subCategory: subId, restaurant: restaurantId },
                        { $set: { category: subId, subCategory: newSubCategory._id } }
                    );
                }
            }
            resultData = { success: true };
        }
        else if (action === "merge") {
            const { sourceIds, targetId, type } = payload; 
            if (!Array.isArray(sourceIds) || !targetId || !type) {
                return JsonResponse.error("sourceIds, targetId, and type are required for merging.", 400);
            }

            if (type === "category") {
                await Category.updateMany(
                    { parentCategory: { $in: sourceIds }, restaurant: restaurantId },
                    { $set: { parentCategory: targetId } }
                );
                
                await MenuItem.updateMany(
                    { category: { $in: sourceIds }, restaurant: restaurantId },
                    { $set: { category: targetId } }
                );
                await Category.deleteMany({ _id: { $in: sourceIds }, restaurant: restaurantId });
            } else if (type === "subcategory") {
                const targetSub = await Category.findOne({ _id: targetId, restaurant: restaurantId });
                if (!targetSub) return JsonResponse.error("Target subcategory not found", 404);
                await MenuItem.updateMany(
                    { subCategory: { $in: sourceIds }, restaurant: restaurantId },
                    { $set: { 
                        subCategory: targetId,
                        category: targetSub.parentCategory
                    }}
                );
                await Category.deleteMany({ _id: { $in: sourceIds }, restaurant: restaurantId });
            }
            resultData = { success: true };
        }
        else {
            return JsonResponse.error("Invalid action.", 400);
        }

        await invalidateItemCache(restaurantId);
        await invalidateCategoryCache(restaurantId);
        return JsonResponse.success(resultData, "Structure updated successfully", 200);
    } catch (err) {
        console.error("Bulk Structure Update Error:", err);
        return JsonResponse.error(err?.message || "Internal Server Error!", 500);
    }
};
