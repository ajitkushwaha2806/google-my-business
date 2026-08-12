import { MenuService } from "@/services/backend/menu";
import { getRestaurantFromSlug } from "@/lib/api/hooks/getRestaurant";
import dbConnect from "@/lib/db";
import { JsonResponse } from "@/lib/api/responseHandler";

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