import { getUser } from './getUser';
import Restaurant from '@/models/Restaurant';

export async function getRestaurant() {
  try {
    const user = await getUser();
    console.log("user" , user)

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