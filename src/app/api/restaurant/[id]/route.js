import dbConnect from "@/lib/db";
import Restaurant from "@/models/Restaurant";
import { JsonResponse } from "@/lib/api/responseHandler";
import { getRestaurant } from "@/lib/api/hooks/getRestaurant";

const ALLOWED_UPDATE_FIELDS = [
    "name", "slug", "logo", "address", "phone", "domain",
    "email", "gstNumber", "currency", "status", 
    "openingHours"
];

export const PUT = async (req, { params }) => {
    try {
        const { id } = await params;
        const data = await req.json();

        await dbConnect();    
        const { user, restaurant } = await getRestaurant();
        
        if (!user || !restaurant) {
            return JsonResponse.error("Please login first to continue!", 401);
        }
    
        const updateData = {};
        
        ALLOWED_UPDATE_FIELDS.forEach(field => {
            if (data[field] !== undefined) {
                updateData[field] = data[field];
            }
        });

        if (updateData.slug) {
            const existingRestaurant = await Restaurant.findOne({ slug: updateData.slug });
            if (existingRestaurant && existingRestaurant._id.toString() !== id) {
                return JsonResponse.error("Restaurant slug already in use by another restaurant.", 400);
            }
        }

        const updatedRestaurant = await Restaurant.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true, runValidators: true }
        );

        if (!updatedRestaurant) {
            return JsonResponse.error("Restaurant not found.", 404);
        }

        return JsonResponse.success(
            { restaurant: updatedRestaurant }, 
            "Restaurant updated successfully", 
            200
        );
    } catch (err) {
        return JsonResponse.error(
            err?.message || "Internal Server Error !",
            500
        );
    }
};

export const GET = async (req, { params }) => {
    console.log("HIT /api/restaurant/[id] with params:", params);
    try {
        const { id } = await params;
        await dbConnect();    
        const { user, restaurant } = await getRestaurant();

        
        if (!user || !restaurant) {
            return JsonResponse.error("Please login first to continue!", 401);
        }

        const restaurantDetails = await Restaurant.findById(id);
        console.log("restaurantDetails" , restaurantDetails)

        if (!restaurantDetails) {
            return JsonResponse.error("Restaurant not found.", 404);
        }

        return JsonResponse.success(
            restaurantDetails, 
            "Restaurant details fetched successfully", 
            200
        );
    } catch (err) {
        return JsonResponse.error(
            err?.message || "Internal Server Error !",
            500
        );
    }
}