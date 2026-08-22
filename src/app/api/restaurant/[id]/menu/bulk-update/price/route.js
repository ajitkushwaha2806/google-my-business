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
            return JsonResponse.error("An array of items with updated prices is required.", 400);
        }

        const bulkOps = items.map(item => {
            const updateFields = {};
            if (item.base_price !== undefined) {
                updateFields.base_price = Number(item.base_price);
            }
            
            if (item.variants !== undefined) {
                updateFields.variants = item.variants;
                if (Array.isArray(item.variants) && item.variants.length > 0) {
                    let minPrice = Infinity;
                    item.variants.forEach(variant => {
                        if (Array.isArray(variant.options)) {
                            variant.options.forEach(opt => {
                                const price = Number(opt.price);
                                if (!isNaN(price) && price < minPrice) {
                                    minPrice = price;
                                }
                            });
                        }
                    });
                    
                    if (minPrice !== Infinity) {
                        updateFields.base_price = minPrice;
                    }
                }
            }

            return {
                updateOne: {
                    filter: { _id: item.id, restaurant: restaurantId },
                    update: { $set: updateFields }
                }
            };
        });

        if (bulkOps.length === 0) {
            return JsonResponse.error("No valid update operations provided.", 400);
        }

        const result = await MenuItem.bulkWrite(bulkOps);
        await invalidateItemCache(restaurantId);
        return JsonResponse.success(
            { 
                matchedCount: result.matchedCount, 
                modifiedCount: result.modifiedCount 
            }, 
            "Successfully updated prices and variants in bulk", 
            200
        );

    } catch (err) {
        console.error("Bulk Price Update Error:", err);
        return JsonResponse.error(err?.message || "Internal Server Error!", 500);
    }
};
