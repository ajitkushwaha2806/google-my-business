import dbConnect from "@/lib/db";
import { googleOAuth } from "@/lib/google";
import { withApiHandler } from "@/lib/api/handler";
import { AppException } from "@/lib/api/exceptions";
import { NextRequest, NextResponse } from "next/server";
import GoogleIntegration from "@/models/GoogleIntegration";

export const POST = withApiHandler(async (req: NextRequest, ctx, userId?: string) => {
    const body = await req.json();
    const { googleId } = body;

    if (!googleId) {
        throw new AppException("googleId is required", 400, { missing_fields: ["googleId"] });
    }

    await dbConnect();
    const integration = await GoogleIntegration.findOne({ userId, googleId });

    if (!integration) {
        throw new AppException("Integration not found", 404);
    }

    try {
        if (integration.accessToken) {
            await googleOAuth.revokeToken(integration.accessToken);
        }
    } catch (revokeErr) {
        console.error("Failed to revoke token on Google, continuing...", revokeErr);
    }

    await GoogleIntegration.deleteOne({ _id: integration._id });
    return NextResponse.json({ success: true, message: "Successfully disconnected Google account." });
});
