import dbConnect from "@/lib/db";
import { google } from "googleapis";
import { cookies } from "next/headers";
import { googleOAuth } from "@/lib/google";
import { withApiHandler } from "@/lib/api/handler";
import { NextRequest, NextResponse } from "next/server";
import { RedirectException } from "@/lib/api/exceptions";
import GoogleIntegration from "@/models/GoogleIntegration";

export const GET = withApiHandler(async (req: NextRequest, ctx, userId?: string) => {
    const code = req.nextUrl.searchParams.get("code");
    const state = req.nextUrl.searchParams.get("state");

    if (!code) {
        throw new RedirectException("/settings?error=missing_code");
    }

    const cookieStore = await cookies();
    const savedState = cookieStore.get("google_oauth_state")?.value;

    if (!savedState || savedState !== state) {
        throw new RedirectException("/settings?error=invalid_state");
    }

    let tokens;
    try {
        const tokenResult = await googleOAuth.getToken(code);
        tokens = tokenResult.tokens;
    } catch (err) {
        console.error("Token retrieval failed", err);
        throw new RedirectException("/settings/integrations?error=oauth_failed");
    }

    if (!tokens.access_token) {
        throw new RedirectException("/settings/integrations?error=oauth_failed");
    }

    googleOAuth.setCredentials(tokens);

    const oauth2 = google.oauth2({
        auth: googleOAuth,
        version: "v2",
    });

    let userInfo;
    try {
        const { data } = await oauth2.userinfo.get();
        userInfo = data;
    } catch (err) {
        console.error("UserInfo retrieval failed", err);
        throw new RedirectException("/settings/integrations?error=oauth_failed");
    }

    if (!userInfo.id || !userInfo.email) {
        throw new RedirectException("/settings/integrations?error=oauth_failed");
    }

    await dbConnect();

    await GoogleIntegration.findOneAndUpdate(
        { googleId: userInfo.id },
        {
            userId,
            googleId: userInfo.id,
            email: userInfo.email,
            name: userInfo.name || "Google User",
            avatar: userInfo.picture || "",
            accessToken: tokens.access_token,
            ...(tokens.refresh_token && { refreshToken: tokens.refresh_token }),
            expiryDate: tokens.expiry_date || (Date.now() + 3599 * 1000), // Default to 1 hour
        },
        { upsert: true, new: true }
    );

    cookieStore.delete("google_oauth_state");
    return NextResponse.redirect(new URL("/settings/integrations?success=google_connected", req.url));
});