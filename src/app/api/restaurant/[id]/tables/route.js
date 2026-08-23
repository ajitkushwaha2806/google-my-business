import dbConnect from "@/lib/db";
import Table from "@/models/Table";
import Restaurant from "@/models/Restaurant";
import { getUser } from "@/lib/api/hooks/getUser";
import { JsonResponse } from "@/lib/api/responseHandler";
import { validateRequiredFields } from "@/lib/api/helpers/validator";
import { getCache, setCache } from "@/services/backend/redis/cache.service";
import { getTablesCacheKey, invalidateTableCache } from "@/lib/api/helpers/cacheKeys";

const TABLE_POST_REQUIRED_FIELDS = ["tableNumber", "capacity"];

export const GET = async (req, { params }) => {
    try {
        const { id } = await params;
        if (!id) return JsonResponse.error("Restaurant ID is required!", 400);

        await dbConnect();
        const user = await getUser();

        if (!user?.id) return JsonResponse.error("Please log in first to continue!", 401);

        const restaurant = await Restaurant.findOne({ _id: id, createdBy: user.id });
        if (!restaurant) return JsonResponse.error("Restaurant not found or unauthorized", 404);

        const url = new URL(req.url);
        const status = url.searchParams.get("status");
        const isActive = url.searchParams.get("isActive");

        const hasFilters = status || isActive !== null;
        if (!hasFilters) {
            const cacheKey = getTablesCacheKey(id);
            const cached = await getCache(cacheKey);
            if (cached) return JsonResponse.success(cached, "Tables fetched successfully (cached)", 200);
        }

        const query = { restaurant: id };
        if (status) query.status = status;
        if (isActive !== null && isActive !== undefined) query.isActive = isActive === "true";

        const tables = await Table.find(query).sort({ tableNumber: 1 });

        if (!hasFilters) {
            await setCache(getTablesCacheKey(id), tables, 3600);
        }

        return JsonResponse.success(tables, "Tables fetched successfully", 200);
    } catch (err) {
        return JsonResponse.error(err?.message || "Internal Server Error!", 500);
    }
};

export const POST = async (req, { params }) => {
    try {
        const { id } = await params;
        if (!id) return JsonResponse.error("Restaurant ID is required!", 400);

        await dbConnect();
        const user = await getUser();

        if (!user?.id) return JsonResponse.error("Please log in first to continue!", 401);

        const restaurant = await Restaurant.findOne({ _id: id, createdBy: user.id });
        if (!restaurant) return JsonResponse.error("Restaurant not found or unauthorized", 404);

        const data = await req.json();
        const { isValid, message } = validateRequiredFields(data, TABLE_POST_REQUIRED_FIELDS);
        if (!isValid) return JsonResponse.error(message, 400);

        const { tableNumber, label, capacity, zone } = data;
        const resolvedZone = zone?.trim() || "General";

        const existing = await Table.findOne({ restaurant: id, zone: resolvedZone, tableNumber });
        if (existing) return JsonResponse.error(`Table #${tableNumber} already exists in zone "${resolvedZone}"`, 409);

        const newTable = await Table.create({
            restaurant: id,
            zone: resolvedZone,
            tableNumber,
            label: label || null,
            capacity,
        });

        await invalidateTableCache(id);
        return JsonResponse.success(newTable, "Table created successfully", 201);
    } catch (err) {
        return JsonResponse.error(err?.message || "Internal Server Error!", 500);
    }
};
