import dbConnect from "@/lib/db";
import Category from "@/models/Category";
import Restaurant from "@/models/Restaurant"
import { getUser } from "@/lib/api/hooks/getUser";
import { JsonResponse } from "@/lib/api/responseHandler";
import { validateRequiredFields } from "@/lib/api/helpers";

const MENU_CATEGORY_POST_REQUIRED_FIELDS = ["name"];

export const GET = async (req, { params }) => {
    try {
        const { id } = await params;
        if (!id) {
            return JsonResponse.error("Restaurant ID is required!", 400);
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

        const categories = await Category.find({ restaurant: id }).sort({ displayOrder: 1, createdAt: -1  });
        return JsonResponse.success(categories, "Categories fetched successfully", 200);
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
        const user = await getUser();

        if (!user?.id) {
            return JsonResponse.error("Please log in first to continue!", 401);
        }

        const restaurant = await Restaurant.findOne({ _id: id, createdBy: user.id });
        if (!restaurant) {
            return JsonResponse.error("Restaurant not found or unauthorized", 404);
        }

        const data = await req.json();
        const { isValid, message } = validateRequiredFields(data, MENU_CATEGORY_POST_REQUIRED_FIELDS);
        
        if (!isValid) {
            return JsonResponse.error(message, 400);
        }

        const { name, displayOrder, image, parentCategory } = data;

        const newCategory = await Category.create({
            restaurant: id,
            name,
            displayOrder: displayOrder || 0,
            image: image || null,
            parentCategory: parentCategory || null,
        });
        return JsonResponse.success(newCategory, "Category created successfully", 201);
    } catch (err) {
        return JsonResponse.error(err?.message || "Internal Server Error!", 500);
    }
};

export const PUT = async (req, { params }) => {
    try {
        const { id } = await params;
        if (!id) {
            return JsonResponse.error("Restaurant ID is required!", 400);
        }

        const url = new URL(req.url);
        const categoryId = url.searchParams.get("categoryId");

        if (!categoryId) {
            return JsonResponse.error("Category ID is required in search params!", 400);
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

        const data = await req.json();
        
        const category = await Category.findOne({ _id: categoryId, restaurant: id });
        if (!category) {
            return JsonResponse.error("Category not found!", 404);
        }

        if (data.name !== undefined) category.name = data.name;
        if (data.displayOrder !== undefined) category.displayOrder = data.displayOrder;
        if (data.image !== undefined) category.image = data.image;
        if (data.parentCategory !== undefined) category.parentCategory = data.parentCategory;

        await category.save();

        return JsonResponse.success(category, "Category updated successfully", 200);
    } catch (err) {
        return JsonResponse.error(err?.message || "Internal Server Error!", 500);
    }
};

export const DELETE = async (req, { params }) => {
    try {
        const { id } = await params;
        if (!id) {
            return JsonResponse.error("Restaurant ID is required!", 400);
        }

        const url = new URL(req.url);
        const categoryId = url.searchParams.get("categoryId");

        if (!categoryId) {
            return JsonResponse.error("Category ID is required in search params!", 400);
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

        const category = await Category.findOne({ _id: categoryId, restaurant: id });
        if (!category) {
            return JsonResponse.error("Category not found!", 404);
        }

        await Category.deleteOne({ _id: categoryId });

        return JsonResponse.success(null, "Category deleted successfully", 200);
    } catch (err) {
        return JsonResponse.error(err?.message || "Internal Server Error!", 500);
    }
};