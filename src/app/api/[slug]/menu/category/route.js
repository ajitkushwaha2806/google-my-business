import dbConnect from "@/lib/db";
import { MenuService } from "@/services/backend/menu";
import { JsonResponse } from "@/lib/api/responseHandler";
import { getRestaurantFromSlug } from "@/lib/api/hooks/getRestaurant";
import { getCache, setCache } from "@/services/backend/redis/cache.service";

export const GET = async (req, { params }) => {
  try {
    const { slug } = await params;
    console.log("slug", slug);

    if (!slug) {
      return JsonResponse.error(
        "Restaurant slug is required!",
        400
      );
    }

    const cacheKey = `restaurant:categories:${slug}`;
    const cachedCategories = await getCache(cacheKey);
    if (cachedCategories) {
      return JsonResponse.success(
        cachedCategories,
        "Categories fetched successfully (cached)",
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

    console.log("restaurant:", restaurant);

    const { categories } =
      await MenuService.getAllCategories(restaurant._id.toString());

    await setCache(cacheKey, { categories }, 300);
    return JsonResponse.success(
      { categories },
      "Categories fetched successfully",
      200
    );
  } catch (err) {
    console.error("GET categories error:", err);

    return JsonResponse.error(
      err instanceof Error
        ? err.message
        : "Internal Server Error!",
      500
    );
  }
};