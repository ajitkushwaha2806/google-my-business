import dbConnect from "@/lib/db";
import { MenuService } from "@/services/backend/menu";
import { JsonResponse } from "@/lib/api/responseHandler";
import { getRestaurantFromSlug } from "@/lib/api/hooks/getRestaurant";
import { getCache, setCache } from "@/services/backend/redis/cache.service";

export const GET = async (req, { params }) => {
  try {
    const { slug, categoryId } = await params;

    if (!slug || !categoryId) {
      return JsonResponse.error(
        "Restaurant slug and Category ID are required!",
        400
      );
    }

    const cacheKey = `restaurant:category-items:${slug}:${categoryId}`;
    const cachedItems = await getCache(cacheKey);
    if (cachedItems) {
      return JsonResponse.success(
        cachedItems,
        "Items fetched successfully (cached)",
        200
      );
    }

    await dbConnect(); 

    const { restaurant, error } = await getRestaurantFromSlug(slug);

    if (error || !restaurant) {
      return JsonResponse.error(
        error || "Restaurant not found!",
        404
      );
    }

    const { items } =
      await MenuService.getAllItemsByCategory(restaurant._id.toString(), categoryId);

    await setCache(cacheKey, { items }, 300);
    return JsonResponse.success(
      { items },
      "Items fetched successfully",
      200
    );
  } catch (err) {
    console.error("GET items error:", err);

    return JsonResponse.error(
      err instanceof Error
        ? err.message
        : "Internal Server Error!",
      500
    );
  }
};
