import crypto from "crypto";
import { cookies } from "next/headers";
import { withApiHandler } from "@/lib/api/handler";
import { NextResponse, NextRequest } from "next/server";
import { googleOAuth, GOOGLE_SCOPES } from "@/lib/google";

export const GET = withApiHandler(async (req: NextRequest) => {
    const state = crypto.randomBytes(32).toString("hex");

    (await cookies()).set("google_oauth_state", state, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 10,
    });

    const authUrl = googleOAuth.generateAuthUrl({
        access_type: "offline",
        prompt: "consent",
        include_granted_scopes: true,
        scope: GOOGLE_SCOPES,
        state,
    });

    console.log("authUrl", authUrl)

    return NextResponse.redirect(authUrl);
});