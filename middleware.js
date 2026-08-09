import { NextResponse } from "next/server";
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/:slug(.*)",      
  // Allow all root-level dynamic slugs (like /[tenant]) except dashboard routes
  "/((?!restaurant|api|sign-in|sign-up|_next).*)"
]);

export default clerkMiddleware(async (auth, req) => {
  if (isPublicRoute(req)) return;
  await auth.protect();

  const { sessionClaims } = await auth();
  const restaurants = sessionClaims?.publicMetadata?.restaurants || [];

  const isOnboardingPage = req.nextUrl.pathname.startsWith("/restaurant/onboarding");
  const isApiRoute = req.nextUrl.pathname.startsWith("/api");

  if (restaurants.length === 0 && !isOnboardingPage && !isApiRoute) {
    return NextResponse.redirect(new URL("/restaurant/onboarding", req.url));
  } 
});

export const config = {
  matcher: ["/((?!_next|.*\\..*).*)", "/", "/(api|trpc)(.*)"],
};