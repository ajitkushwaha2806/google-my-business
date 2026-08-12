import { auth, currentUser } from '@clerk/nextjs/server';

export async function getUser() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error('Please log in to continue!');
  }

  const clerkUser = await currentUser();
  if (!clerkUser) {
    throw new Error('User details could not be found.');
  }

  return {
    id: userId,
    email: clerkUser.emailAddresses[0]?.emailAddress ?? '',
    name: [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(' '),
  };
}