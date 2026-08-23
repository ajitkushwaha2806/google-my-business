import dbConnect from "@/lib/db";
import Table from "@/models/Table";
import Restaurant from "@/models/Restaurant";
import { getUser } from "@/lib/api/hooks/getUser";
import { JsonResponse } from "@/lib/api/responseHandler";
import { invalidateTableCache } from "@/lib/api/helpers/cacheKeys";

export const GET = async (req, { params }) => {
    try {
        const { id, tableId } = await params;
        if (!id || !tableId) return JsonResponse.error("Restaurant ID and Table ID are required!", 400);

        await dbConnect();
        const user = await getUser();

        if (!user?.id) return JsonResponse.error("Please log in first to continue!", 401);

        const restaurant = await Restaurant.findOne({ _id: id, createdBy: user.id });
        if (!restaurant) return JsonResponse.error("Restaurant not found or unauthorized", 404);

        const table = await Table.findOne({ _id: tableId, restaurant: id });
        if (!table) return JsonResponse.error("Table not found", 404);

        return JsonResponse.success(table, "Table fetched successfully", 200);
    } catch (err) {
        return JsonResponse.error(err?.message || "Internal Server Error!", 500);
    }
};

export const PATCH = async (req, { params }) => {
    try {
        const { id, tableId } = await params;
        if (!id || !tableId) return JsonResponse.error("Restaurant ID and Table ID are required!", 400);

        await dbConnect();
        const user = await getUser();

        if (!user?.id) return JsonResponse.error("Please log in first to continue!", 401);

        const restaurant = await Restaurant.findOne({ _id: id, createdBy: user.id });
        if (!restaurant) return JsonResponse.error("Restaurant not found or unauthorized", 404);

        const table = await Table.findOne({ _id: tableId, restaurant: id });
        if (!table) return JsonResponse.error("Table not found", 404);

        const data = await req.json();
        const ALLOWED_FIELDS = ["label", "capacity", "status", "isActive"];

        ALLOWED_FIELDS.forEach((field) => {
            if (data[field] !== undefined) {
                table[field] = data[field];
            }
        });

        // Validate status value is a known enum value
        const VALID_STATUSES = ["available", "occupied", "reserved", "unavailable"];
        if (data.status && !VALID_STATUSES.includes(data.status)) {
            return JsonResponse.error(`Invalid table status: "${data.status}"`, 400);
        }

        await table.save();
        await invalidateTableCache(id);

        return JsonResponse.success(table, "Table updated successfully", 200);
    } catch (err) {
        return JsonResponse.error(err?.message || "Internal Server Error!", 500);
    }
};

export const DELETE = async (req, { params }) => {
    try {
        const { id, tableId } = await params;
        if (!id || !tableId) return JsonResponse.error("Restaurant ID and Table ID are required!", 400);

        await dbConnect();
        const user = await getUser();

        if (!user?.id) return JsonResponse.error("Please log in first to continue!", 401);

        const restaurant = await Restaurant.findOne({ _id: id, createdBy: user.id });
        if (!restaurant) return JsonResponse.error("Restaurant not found or unauthorized", 404);

        const table = await Table.findOne({ _id: tableId, restaurant: id });
        if (!table) return JsonResponse.error("Table not found", 404);

        await Table.deleteOne({ _id: tableId });
        await invalidateTableCache(id);

        return JsonResponse.success(null, "Table deleted successfully", 200);
    } catch (err) {
        return JsonResponse.error(err?.message || "Internal Server Error!", 500);
    }
};
