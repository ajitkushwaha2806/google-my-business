import { JsonResponse } from "@/lib/api/responseHandler";
import { MenuSearchService } from "@/services/backend/menu/search.service";
import { getCache, setCache } from "@/services/backend/redis/cache.service";

export const GET = async (req, { params }) => {
    try {
        const { slug } = await params;
        const { searchParams } = new URL(req.url);
        
        const query = searchParams.get("q") || "";
        const isVeg = searchParams.get("is_veg") === "true";
        const page = parseInt(searchParams.get("page")) || 1;
        const limit = parseInt(searchParams.get("limit")) || 10;
        const categoryId = searchParams.get("categoryId") || "";

        const cacheKey = `restaurant:search:${slug}:${query}:${isVeg}:${page}:${limit}:${categoryId}`;

        const cachedData = await getCache(cacheKey);
        if (cachedData) {
            return JsonResponse.collection(
                cachedData.items,
                cachedData.totalResults,
                {
                    page,
                    limit,
                    search: query,
                    extraFilters: { is_veg: isVeg }
                },
                "Menu items fetched successfully (cached)",
                { addonGroups: cachedData.addonGroups }
            );
        }

        const { items, totalResults, addonGroups } = await MenuSearchService.search(slug, {
            query,
            isVeg,
            page,
            limit,
            categoryId
        });

        console.log("addonGroups" , addonGroups)
        await setCache(cacheKey, { items, totalResults, addonGroups }, 180);
        return JsonResponse.collection(
            items,
            totalResults,
            {
                page,
                limit,
                search: query,
                extraFilters: { is_veg: isVeg, ...(categoryId && { categoryId }) }
            },
            "Menu items fetched successfully",
            { addonGroups }
        );
    } catch (err) {
        console.error("GET menu search error:", err);
        return JsonResponse.error(
            err instanceof Error ? err.message : "Internal Server Error!",
            500
        );
    }
};