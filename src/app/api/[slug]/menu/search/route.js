import dbConnect from "@/lib/db";
import MenuItem from "@/models/Item";
import { JsonResponse } from "@/lib/api/responseHandler";
import { getRestaurantFromSlug } from "@/lib/api/hooks/getRestaurant";

export const GET = async (req, { params }) => {
    try {
        await dbConnect();
        const { slug } = await params;
        
        const { restaurant, error } = await getRestaurantFromSlug(slug);
        if (error || !restaurant) {
            return JsonResponse.error(error || "Restaurant not found", 404);
        }

        const { searchParams } = new URL(req.url);
        const query = searchParams.get("q") || "";
        const page = parseInt(searchParams.get("page")) || 1;
        const limit = parseInt(searchParams.get("limit")) || 10;
        
        const dietaryType = searchParams.get("dietaryType"); 
        const isVeg = searchParams.get("veg") === "true";
        const isNonVeg = searchParams.get("nonVeg") === "true";

        const filter = {
            restaurant: restaurant._id,
            isAvailable: true
        };

        const dietaryTypes = [];
        if (dietaryType) {
            dietaryTypes.push(...dietaryType.split(","));
        } else if (isVeg && isNonVeg) {
            dietaryTypes.push("veg", "vegan", "non-veg");
        } else if (isVeg) {
            dietaryTypes.push("veg", "vegan");
        } else if (isNonVeg) {
            dietaryTypes.push("non-veg");
        }

        if (dietaryTypes.length > 0) {
            filter.dietaryType = { $in: dietaryTypes };
        }

        let items = [];
        let totalResults = 0;

        if (query) {
            const searchStage = {
                $search: {
                    index: "default",
                    count: {
                        type: "total"
                    },
                    compound: {
                        filter: [
                            {
                                equals: {
                                    value: restaurant._id,
                                    path: "restaurant"
                                }
                            },
                            {
                                equals: {
                                    value: true,
                                    path: "isAvailable"
                                }
                            }
                        ],
                        must: [
                            {
                                text: {
                                    query: query,
                                    path: ["name", "description"],
                                    fuzzy: {
                                        maxEdits: 2,
                                        prefixLength: 1
                                    }
                                }
                            }
                        ]
                    }
                }
            };

            if (dietaryTypes.length > 0) {
                searchStage.$search.compound.filter.push({
                    text: {
                        query: dietaryTypes,
                        path: "dietaryType"
                    }
                });
            }

            const pipeline = [
                searchStage,
                {
                    $facet: {
                        results: [
                            { $skip: (page - 1) * limit },
                            { $limit: limit },
                            {
                                $lookup: {
                                    from: "categories",
                                    localField: "category",
                                    foreignField: "_id",
                                    as: "category"
                                }
                            },
                            { $unwind: { path: "$category", preserveNullAndEmptyArrays: true } },
                            {
                                $lookup: {
                                    from: "categories",
                                    localField: "subCategory",
                                    foreignField: "_id",
                                    as: "subCategory"
                                }
                            },
                            { $unwind: { path: "$subCategory", preserveNullAndEmptyArrays: true } }
                        ],
                        meta: [
                            {
                                $replaceWith: "$$SEARCH_META"
                            },
                            {
                                $limit: 1
                            }
                        ]
                    }
                }
            ];

            const aggregationResults = await MenuItem.aggregate(pipeline);
            const facetResult = aggregationResults[0];

            items = facetResult?.results || [];
            totalResults = facetResult?.meta?.[0]?.count?.total || 0;
        } else {
            totalResults = await MenuItem.countDocuments(filter);
            items = await MenuItem.find(filter)
                .populate("category", "name")
                .populate("subCategory", "name")
                .sort({ displayOrder: 1 })
                .skip((page - 1) * limit)
                .limit(limit)
                .lean();
        }

        const totalPages = Math.ceil(totalResults / limit);

        return JsonResponse.success({
            items,
            pagination: {
                page,
                limit,
                totalPages,
                totalResults
            }
        }, "Menu items fetched successfully");
    } catch (err) {
        console.error("GET menu search error:", err);
        return JsonResponse.error(
            err instanceof Error ? err.message : "Internal Server Error!",
            500
        );
    }
};