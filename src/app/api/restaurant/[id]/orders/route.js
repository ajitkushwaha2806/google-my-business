import dbConnect from "@/lib/db";
import Order from "@/models/Order";
import Restaurant from "@/models/Restaurant";
import { getUser } from "@/lib/api/hooks/getUser";
import { JsonResponse } from "@/lib/api/responseHandler";
import { validateRequiredFields } from "@/lib/api/helpers/validator";
import crypto from "crypto";

const ORDER_POST_REQUIRED_FIELDS = ["orderType", "items", "subtotal", "totalAmount"];

export const GET = async (req, { params }) => {
    try {
        const { id } = await params;
        if (!id) {
            return JsonResponse.error("Restaurant ID is required!", 400);
        }

        const url = new URL(req.url);
        const status = url.searchParams.get("status");
        const orderType = url.searchParams.get("orderType");
        const page = parseInt(url.searchParams.get("page") || "1");
        const limit = parseInt(url.searchParams.get("limit") || "50");

        await dbConnect();
        const user = await getUser();

        if (!user?.id) {
            return JsonResponse.error("Please log in first to continue!", 401);
        }

        const restaurant = await Restaurant.findOne({ _id: id, createdBy: user.id });
        if (!restaurant) {
            return JsonResponse.error("Restaurant not found or unauthorized", 404);
        }

        const query = { restaurant: id };
        if (status) query.status = status;
        if (orderType) query.orderType = orderType;

        const skip = (page - 1) * limit;

        const orders = await Order.find(query)
            .populate("table", "tableNumber label zone")
            .populate("customer", "name phone email")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const totalOrders = await Order.countDocuments(query);

        return JsonResponse.success(
            { orders, total: totalOrders, page, limit },
            "Orders fetched successfully",
            200
        );
    } catch (err) {
        return JsonResponse.error(err?.message || "Internal Server Error!", 500);
    }
};

export const POST = async (req, { params }) => {
    try {
        const { id } = await params;
        if (!id) {
            return JsonResponse.error("Restaurant ID is required!", 400);
        }

        await dbConnect();
        const restaurant = await Restaurant.findById(id);
        if (!restaurant) {
            return JsonResponse.error("Restaurant not found", 404);
        }

        const data = await req.json();
        const { isValid, message } = validateRequiredFields(data, ORDER_POST_REQUIRED_FIELDS);
        
        if (!isValid) {
            return JsonResponse.error(message, 400);
        }

        const { orderType, table, items, subtotal, tax, discount, totalAmount, paymentMethod, specialInstructions } = data;

        if (orderType === "dine-in" && !table) {
            return JsonResponse.error("Table is required for dine-in orders", 400);
        }

        if (!Array.isArray(items) || items.length === 0) {
            return JsonResponse.error("Order must contain at least one item", 400);
        }

        const user = await getUser();
        const customer = user?.id || null;

        const orderNumber = "ORD-" + crypto.randomBytes(4).toString("hex").toUpperCase();

        const newOrder = await Order.create({
            restaurant: id,
            orderNumber,
            orderType,
            table: orderType === "dine-in" ? table : undefined,
            customer,
            items,
            subtotal,
            tax: tax || 0,
            discount: discount || 0,
            totalAmount,
            paymentMethod: paymentMethod || "cash",
            specialInstructions: specialInstructions || "",
            status: "PENDING_PAYMENT",
            statusHistory: [{ status: "PENDING_PAYMENT", updatedBy: user?.id || null }]
        });

        return JsonResponse.success(newOrder, "Order created successfully", 201);
    } catch (err) {
        return JsonResponse.error(err?.message || "Internal Server Error!", 500);
    }
};
