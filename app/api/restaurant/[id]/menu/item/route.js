import dbConnect from "@/lib/db";
import MenuItem from "@/models/Item";
import Category from "@/models/Category";
import Restaurant from "@/models/Restaurant";
import { getUser } from "@/lib/api/hooks/getUser";
import { JsonResponse } from "@/lib/api/responseHandler";
import { validateRequiredFields } from "@/lib/api/helpers";

const MENU_ITEM_POST_REQUIRED_FIELDS = ["category", "name", "base_price", "dietaryType"];

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

        const { searchParams } = new URL(req.url);
        const categoryId = searchParams.get('categoryId');
        const subCategoryId = searchParams.get('subCategoryId');

        const query = { restaurant: id };
        if (categoryId) query.category = categoryId;
        if (subCategoryId) query.subCategory = subCategoryId;

        const items = await MenuItem.find(query).sort({ displayOrder: 1, createdAt: -1 });
        return JsonResponse.success(items, "Items fetched successfully", 200);
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
        const { isValid, message } = validateRequiredFields(data, MENU_ITEM_POST_REQUIRED_FIELDS);
        
        if (!isValid) {
            return JsonResponse.error(message, 400);
        }

        const category = await Category.findOne({ _id: data.category, restaurant: id });
        if (!category) {
            return JsonResponse.error("Invalid category", 400);
        }

        if (data.subCategory) {
            const subCategory = await Category.findOne({ _id: data.subCategory, restaurant: id, parentCategory: data.category });
            if (!subCategory) {
                return JsonResponse.error("Invalid subCategory", 400);
            }
        }

        const highestOrder = await MenuItem.findOne({ restaurant: id, category: data.category, subCategory: data.subCategory || null })
            .sort("-displayOrder")
            .select("displayOrder")
            .lean();

        const newItemData = {
            restaurant: id,
            category: data.category,
            subCategory: data.subCategory || null,
            name: data.name,
            description: data.description || "",
            image: data.image || null,
            base_price: data.base_price,
            variants: data.variants || [],
            dietaryType: data.dietaryType,
            isAvailable: data.isAvailable ?? true,
            preparationTime: data.preparationTime ?? 15,
            displayOrder: highestOrder ? highestOrder.displayOrder + 1 : 1,
        };

        const newItem = await MenuItem.create(newItemData);
        return JsonResponse.success(newItem, "Item created successfully", 201);
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

        const { searchParams } = new URL(req.url);
        const itemId = searchParams.get('itemId');

        if (!itemId) {
            return JsonResponse.error("Item ID is required for update", 400);
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

        if (data.category && data.category !== undefined) {
            const category = await Category.findOne({ _id: data.category, restaurant: id });
            if (!category) {
                return JsonResponse.error("Invalid category", 400);
            }
        }

        if (data.subCategory && data.subCategory !== undefined) {
            const subCategory = await Category.findOne({ _id: data.subCategory, restaurant: id });
            if (!subCategory) {
                return JsonResponse.error("Invalid subCategory", 400);
            }
        }

        const updatedItem = await MenuItem.findOneAndUpdate(
            { _id: itemId, restaurant: id },
            { $set: data },
            { new: true, runValidators: true }
        );

        if (!updatedItem) {
            return JsonResponse.error("Item not found", 404);
        }

        return JsonResponse.success(updatedItem, "Item updated successfully", 200);
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

        const { searchParams } = new URL(req.url);
        const itemId = searchParams.get('itemId');

        if (!itemId) {
            return JsonResponse.error("Item ID is required for deletion", 400);
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

        const deletedItem = await MenuItem.findOneAndDelete({ _id: itemId, restaurant: id });
        if (!deletedItem) {
            return JsonResponse.error("Item not found", 404);
        }

        return JsonResponse.success(deletedItem, "Item deleted successfully", 200);
    } catch (err) {
        return JsonResponse.error(err?.message || "Internal Server Error!", 500);
    }
};
