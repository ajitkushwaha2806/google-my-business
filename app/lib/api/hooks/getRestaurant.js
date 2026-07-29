import { auth, currentUser } from '@clerk/nextjs/server';

export async function getRestaurantContext() {
  try {
    const { user } = await auth();

    if (!userId) {
      return { user: null, restaurant: null, error: 'Unauthorized' };
    }

    const clerkUser = await currentUser();
    const userDetails = {
      id: userId,
      email: clerkUser?.emailAddresses[0]?.emailAddress || '',
      name: `${clerkUser?.firstName || ''} ${clerkUser?.lastName || ''}`.trim(),
    };

    const mockRestaurant = { id: 'rest_999', name: 'Bento Express', slug: 'bento-express' };

    if (!mockRestaurant) {
      return { user: userDetails, restaurant: null, error: 'No restaurant linked to this account' };
    }

    return {
      user: userDetails,
      restaurant: mockRestaurant,
      error: null,
    };
  } catch (err) {
    return {
      user: null,
      restaurant: null,
      error: err.message || 'Failed to fetch restaurant context',
    };
  }
}
