import dbConnect from "@/lib/db";
import Restaurant from "@/models/Restaurant";
import { getUser } from "@/lib/api/hooks/getUser";
import Order, { OrderStatus } from "@/models/Order";
import { JsonResponse } from "@/lib/api/responseHandler";

export const GET = async (req, { params }) => {
    try {
        const { id, orderId } = await params;
        if (!id || !orderId) {
            return JsonResponse.error("Restaurant ID and Order ID are required!", 400);
        }

        await dbConnect();
        const user = await getUser();

        if (!user?.id) {
            return JsonResponse.error("Please log in first to continue!", 401);
        }

        const restaurant = await Restaurant.findOne({ _id: id, createdBy: user.id });
        if (!restaurant) {
            return JsonResponse.error("Restaurant not found or unauthorized", 404);
        }

        const order = await Order.findOne({ _id: orderId, restaurant: id })
            .populate("items.menuItem", "name base_price image")
            .populate("table", "tableNumber label zone")
            .populate("customer", "name phone email")
            .populate("statusHistory.updatedBy", "name email");

        if (!order) {
            return JsonResponse.error("Order not found", 404);
        }

        return JsonResponse.success(order, "Order fetched successfully", 200);
    } catch (err) {
        return JsonResponse.error(err?.message || "Internal Server Error!", 500);
    }
};

export const PATCH = async (req, { params }) => {
    try {
        const { id, orderId } = await params;
        if (!id || !orderId) {
            return JsonResponse.error("Restaurant ID and Order ID are required!", 400);
        }

        await dbConnect();
        const user = await getUser();

        if (!user?.id) {
            return JsonResponse.error("Please log in first to continue!", 401);
        }

        const restaurant = await Restaurant.findOne({ _id: id, createdBy: user.id });
        if (!restaurant) {
            return JsonResponse.error("Restaurant not found or unauthorized", 404);
        }

        const order = await Order.findOne({ _id: orderId, restaurant: id });
        if (!order) {
            return JsonResponse.error("Order not found", 404);
        }

        const data = await req.json();
        if (data.status) {
            if (!Object.values(OrderStatus).includes(data.status)) {
                return JsonResponse.error("Invalid order status", 400);
            }
            order.status = data.status;
            order.statusHistory.push({
                status: data.status,
                updatedBy: user.id
            });
        }

        if (data.paymentStatus) {
            order.paymentStatus = data.paymentStatus;
        }
        
        if (data.paymentMethod) {
            order.paymentMethod = data.paymentMethod;
        }

        await order.save();

        return JsonResponse.success(order, "Order updated successfully", 200);
    } catch (err) {
        return JsonResponse.error(err?.message || "Internal Server Error!", 500);
    }
};

export const DELETE = async (req, { params }) => {
    try {
        const { id, orderId } = await params;
        if (!id || !orderId) {
            return JsonResponse.error("Restaurant ID and Order ID are required!", 400);
        }

        await dbConnect();
        const user = await getUser();

        if (!user?.id) {
            return JsonResponse.error("Please log in first to continue!", 401);
        }

        const restaurant = await Restaurant.findOne({ _id: id, createdBy: user.id });
        if (!restaurant) {
            return JsonResponse.error("Restaurant not found or unauthorized", 404);
        }

        const order = await Order.findOne({ _id: orderId, restaurant: id });
        if (!order) {
            return JsonResponse.error("Order not found", 404);
        }

        await Order.deleteOne({ _id: orderId });
        return JsonResponse.success(null, "Order deleted successfully", 200);
    } catch (err) {
        return JsonResponse.error(err?.message || "Internal Server Error!", 500);
    }
};
