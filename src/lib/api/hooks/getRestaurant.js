import { getUser } from './getUser';
import Restaurant from '@/models/Restaurant';

export async function getRestaurant() {
  try {
    const user = await getUser();
    if (!user || !user.id) {
      throw new Error('Please login to continue.');
    }

    const restaurantDetails = await Restaurant.findOne({
      createdBy: user.id,
    }).lean();

    if (!restaurantDetails) {
      throw new Error('No restaurant linked with this user.');
    }

    console.log("restaurantDetails" , restaurantDetails)

    return {
      user: user,
      restaurant: restaurantDetails,
      error: null,
    };

  } catch (err) {
    return {
      user: null,
      restaurant: null,
      error:
        err instanceof Error
          ? err.message
          : 'Failed to fetch Restaurant Details',
    };
  }
}

export async function getRestaurantFromSlug(slug) {
  try {
    const restaurant = await Restaurant.findOne({ slug }).lean();

    if (!restaurant) {
      throw new Error("No restaurant found with this slug.");
    }

    return {
      restaurant,
      error: null,
    };
  } catch (err) {
    return {
      restaurant: null,
      error:
        err instanceof Error
          ? err.message
          : "Failed to fetch restaurant details.",
    };
  }
}
